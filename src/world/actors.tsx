/**
 * Actors are Three.js objects that live for the whole show.
 * They let one object cross many scenes and transform between them.
 *
 * Two ways to animate actors, both on GLOBAL timeline units
 * (`at('chapter/scene', 0.5)` is the time where that scene is half played):
 *
 * - `timeline` on the actor itself, for moves that belong to that actor only.
 * - Choreographies: one per part of the talk (`defineChoreography`), each with
 *   access to the whole cast. This is how several parts move the same actors
 *   without touching each other's files. They compose in show order.
 *
 * One writer per property. In development, a warning names two choreographies
 * that write the same property in overlapping windows.
 *
 * `ambient` runs every frame with the clock. It is for life that does not
 * change the composition (noise, drift, sway), and it must only write
 * properties that no timeline writes (for art elements: `inner.position` and
 * `inner.rotation`).
 */
import { useFrame } from '@react-three/fiber'
import { createContext, useContext, useLayoutEffect, useMemo, type ReactNode } from 'react'
import type { Object3D } from 'three'
import { gsap, type Timeline } from '@/animation/gsap'
import { usePresentation } from '@/engine/context'
import { useEnvironment } from '@/engine/environment'
import { positionOf, type ShowModel } from '@/engine/show-model'
import { disposeObject } from '@/assets/dispose'

export interface ActorTime {
  /** Global position of a scene-relative point. */
  at: (sceneKey: string, local: number) => number
  /** Start and duration of a window inside one scene: tl.to(o, { x: 1, duration: s.duration }, s.start). */
  span: (sceneKey: string, from: number, to: number) => { start: number; duration: number }
}

export interface ActorDef<T extends Object3D = Object3D> {
  id: string
  create: () => T
  /** Build the actor's own timeline. Place tweens with t.at() and t.span(). */
  timeline?: (tl: Timeline, object: T, t: ActorTime) => void
  /** Ambient life, every frame. Must not write what a timeline writes. */
  ambient?: (object: T, time: number, position: number) => void
  /** Custom cleanup. Default: object.userData.dispose() if present, else dispose every geometry and material. */
  dispose?: (object: T) => void
}

export function defineActor<T extends Object3D>(def: ActorDef<T>): ActorDef {
  return def as unknown as ActorDef
}

/** Read access to every actor, for choreographies. */
export interface Cast {
  get<T extends Object3D = Object3D>(id: string): T
  /** Every actor id, in cast order. */
  ids(): string[]
}

export interface ChoreographyDef {
  /** Usually the part folder name, for example "10-agentic-workflows". */
  key: string
  build: (tl: Timeline, cast: Cast, t: ActorTime) => void
}

export function defineChoreography(key: string, build: ChoreographyDef['build']): ChoreographyDef {
  return { key, build }
}

// Global registry, so DOM code (screen anchors, debug) can find actor objects by id.
const registry = new Map<string, Object3D>()
// Development handle for inspection from the console or a test browser.
if (import.meta.env.DEV) (window as unknown as { __actors?: Map<string, Object3D> }).__actors = registry

export function getActorObject(id: string): Object3D | undefined {
  return registry.get(id)
}

const ActorContext = createContext<Map<string, Object3D>>(new Map())

export function useActor<T extends Object3D = Object3D>(id: string): T {
  const actor = useContext(ActorContext).get(id)
  if (!actor) throw new Error(`Unknown actor "${id}". Add it to src/show/actors.ts`)
  return actor as T
}

function actorTime(model: ShowModel): ActorTime {
  const at = (key: string, local: number) => positionOf(model, key, local)
  const span = (key: string, from: number, to: number) => ({ start: at(key, from), duration: at(key, to) - at(key, from) })
  return { at, span }
}

const NOT_PROPS = new Set([
  'duration', 'ease', 'delay', 'onUpdate', 'onComplete', 'onStart', 'onUpdateParams', 'immediateRender', 'overwrite',
  'stagger', 'repeat', 'yoyo', 'runBackwards', 'startAt', 'data', 'callbackScope', 'id', 'paused', 'keyframes', 'lazy',
])

/** Development check: two writers must not write the same property at the same time. */
function warnOverlaps(parts: Array<{ key: string; tweens: gsap.core.Tween[] }>): void {
  const ids = new WeakMap<object, number>()
  let next = 0
  const idOf = (o: object) => {
    let id = ids.get(o)
    if (id === undefined) ids.set(o, (id = next++))
    return id
  }
  const seen = new Map<string, Array<{ key: string; start: number; end: number }>>()
  for (const { key, tweens } of parts) {
    for (const tween of tweens) {
      const start = tween.startTime()
      // A set has no length. Give it a tiny one, so two sets at the same time count.
      const end = start + Math.max(tween.duration(), 1e-6)
      for (const target of tween.targets() as object[]) {
        if (typeof target !== 'object' || target === null) continue
        for (const prop of Object.keys(tween.vars)) {
          if (NOT_PROPS.has(prop)) continue
          const slot = `${idOf(target)}:${prop}`
          const list = seen.get(slot) ?? []
          for (const other of list) {
            if (other.key !== key && start < other.end && other.start < end) {
              console.warn(`[choreography] "${key}" and "${other.key}" both write "${prop}" on the same object between ${Math.max(start, other.start).toFixed(3)} and ${Math.min(end, other.end).toFixed(3)}.`)
            }
          }
          list.push({ key, start, end })
          seen.set(slot, list)
        }
      }
    }
  }
}

export function ActorsHost({
  actors,
  choreographies = [],
  children,
}: {
  actors: ActorDef[]
  choreographies?: ChoreographyDef[]
  children: ReactNode
}) {
  const p = usePresentation()
  const objects = useMemo(() => new Map(actors.map((a) => [a.id, a.create()])), [actors])

  useLayoutEffect(() => {
    for (const [id, o] of objects) registry.set(id, o)
    return () => {
      for (const id of objects.keys()) registry.delete(id)
    }
  }, [objects])

  useLayoutEffect(() => {
    const t = actorTime(p.model)
    const cast: Cast = {
      get<T extends Object3D>(id: string) {
        const o = objects.get(id)
        if (!o) throw new Error(`Unknown actor "${id}" in a choreography`)
        return o as T
      },
      ids: () => [...objects.keys()],
    }
    let master: Timeline | null = null
    const ctx = gsap.context(() => {
      // One flat timeline. Every tween sits directly in it, so GSAP renders them
      // in time order and start values chain correctly whatever the part order.
      master = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      const parts: Array<{ key: string; tweens: gsap.core.Tween[] }> = []
      const build = (key: string, fn: (tl: Timeline) => void) => {
        const before = new Set(master!.getChildren(false, true, true))
        fn(master!)
        const tweens = master!.getChildren(false, true, false).filter((c) => !before.has(c)) as gsap.core.Tween[]
        parts.push({ key, tweens })
      }
      for (const def of actors) {
        if (def.timeline) build(`actor:${def.id}`, (tl) => def.timeline!(tl, objects.get(def.id)!, t))
      }
      for (const c of choreographies) build(c.key, (tl) => c.build(tl, cast, t))
      if (import.meta.env.DEV) warnOverlaps(parts)
      if (master.duration() < p.model.total) master.set({}, {}, p.model.total)
      // A paused timeline at time 0 ignores time(0). One pass to the end and back
      // records every start value and applies the state at 0.
      master.progress(1, true).progress(0, true)
    })
    const apply = (position: number) => master?.time(position)
    apply(p.position)
    const off = p.onFrame(apply)
    return () => {
      off()
      ctx.revert()
    }
  }, [actors, choreographies, objects, p])

  const { reducedMotion } = useEnvironment()
  const frozen = reducedMotion
  useFrame(({ clock }) => {
    for (const def of actors) def.ambient?.(objects.get(def.id)!, frozen ? 0 : clock.elapsedTime, p.framePosition)
  })

  useLayoutEffect(
    () => () => {
      for (const def of actors) {
        const o = objects.get(def.id)!
        if (def.dispose) def.dispose(o)
        else if (typeof o.userData.dispose === 'function') o.userData.dispose()
        else disposeObject(o)
      }
    },
    [actors, objects],
  )

  return (
    <ActorContext.Provider value={objects}>
      {[...objects.entries()].map(([id, object]) => (
        <primitive key={id} object={object} />
      ))}
      {children}
    </ActorContext.Provider>
  )
}
