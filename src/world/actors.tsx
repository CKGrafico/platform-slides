/**
 * Actors are Three.js objects that live for the whole show.
 * They let one object cross many scenes and transform between them.
 *
 * An actor owns its properties. Its timeline runs on GLOBAL timeline units,
 * so `at('chapter/scene', 0.5)` is the time where that scene is half played.
 * Scenes may read an actor with useActor(), but must not animate the
 * properties that the actor timeline animates. One writer per property.
 */
import { createContext, useContext, useLayoutEffect, useMemo, type ReactNode } from 'react'
import type { Object3D } from 'three'
import { gsap, type Timeline } from '@/animation/gsap'
import { usePresentation } from '@/engine/context'
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
  /** Build the actor's timeline. Place tweens with t.at() and t.span(). */
  timeline?: (tl: Timeline, object: T, t: ActorTime) => void
  /** Custom cleanup. Default: dispose every geometry and material under the object. */
  dispose?: (object: T) => void
}

export function defineActor<T extends Object3D>(def: ActorDef<T>): ActorDef {
  return def as unknown as ActorDef
}

const ActorContext = createContext<Map<string, Object3D>>(new Map())

export function useActor<T extends Object3D = Object3D>(id: string): T {
  const actor = useContext(ActorContext).get(id)
  if (!actor) throw new Error(`Unknown actor "${id}". Add it to src/show/actors.ts`)
  return actor as T
}

function buildTimeline(model: ShowModel, def: ActorDef, object: Object3D): Timeline {
  const at = (key: string, local: number) => positionOf(model, key, local)
  const span = (key: string, from: number, to: number) => ({ start: at(key, from), duration: at(key, to) - at(key, from) })
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  def.timeline?.(tl, object, { at, span })
  if (tl.duration() < model.total) tl.set({}, {}, model.total)
  // A paused timeline at time 0 ignores time(0). One pass to the end and back
  // records every start value and applies the state at 0.
  tl.progress(1, true).progress(0, true)
  return tl
}

export function ActorsHost({ actors, children }: { actors: ActorDef[]; children: ReactNode }) {
  const p = usePresentation()
  const objects = useMemo(() => new Map(actors.map((a) => [a.id, a.create()])), [actors])

  useLayoutEffect(() => {
    const timelines: Timeline[] = []
    const ctx = gsap.context(() => {
      for (const def of actors) timelines.push(buildTimeline(p.model, def, objects.get(def.id)!))
    })
    const apply = (position: number) => {
      for (const tl of timelines) tl.time(position)
    }
    apply(p.position)
    const off = p.onFrame(apply)
    return () => {
      off()
      ctx.revert()
    }
  }, [actors, objects, p])

  useLayoutEffect(
    () => () => {
      for (const def of actors) {
        const o = objects.get(def.id)!
        if (def.dispose) def.dispose(o)
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
