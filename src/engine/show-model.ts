/**
 * Pure timeline math. No DOM, no GSAP, no React.
 *
 * Scene i owns the half-open interval (start, end] on the global timeline.
 * Position 0 belongs to the first scene. So a stop at local 1 shows the
 * scene that owns it, finished, and the next scene starts to play only
 * after the presenter advances.
 */
import type { ChapterDef, SceneDef, ShowDef, StopDef } from './types'

export const DEFAULT_STOP_DURATION = 1.1
export const DEFAULT_STOP_EASE = 'power2.inOut'
const EPSILON = 1e-9

export interface ResolvedStop {
  /** Absolute position on the global timeline. */
  position: number
  sceneIndex: number
  /** Index inside the scene's stops. */
  index: number
  at: number
  duration: number
  ease: string
  label?: string
}

export interface ResolvedScene {
  def: SceneDef
  key: string
  index: number
  chapterIndex: number
  chapterId: string
  start: number
  end: number
  duration: number
  stops: ResolvedStop[]
}

export interface ResolvedChapter {
  def: ChapterDef
  index: number
  start: number
  end: number
  sceneIndices: number[]
}

export interface ShowModel {
  scenes: ResolvedScene[]
  chapters: ResolvedChapter[]
  /** All stops, sorted, with the implicit start stop at position 0 first. */
  stops: ResolvedStop[]
  total: number
  mountWindow: number
}

export interface Resolution {
  sceneIndex: number
  chapterIndex: number
  /** Local progress of the owning scene, 0..1. */
  local: number
  /** Position / total, 0..1. */
  global: number
}

function normalizeStop(s: number | StopDef): StopDef {
  return typeof s === 'number' ? { at: s } : s
}

export function buildShow(show: ShowDef): ShowModel {
  const scenes: ResolvedScene[] = []
  const chapters: ResolvedChapter[] = []
  const seen = new Set<string>()
  let cursor = 0

  show.chapters.forEach((chapter, chapterIndex) => {
    const chapterStart = cursor
    const sceneIndices: number[] = []
    for (const def of chapter.scenes) {
      const key = `${chapter.id}/${def.id}`
      if (seen.has(key)) throw new Error(`Duplicate scene key "${key}"`)
      seen.add(key)
      const duration = def.duration ?? 1
      if (!(duration > 0)) throw new Error(`Scene "${key}" needs a duration above 0`)
      const index = scenes.length
      const rawStops = (def.stops ?? [1]).map(normalizeStop).sort((a, b) => a.at - b.at)
      if (rawStops.length === 0 || rawStops[rawStops.length - 1]!.at !== 1) {
        rawStops.push({ at: 1 })
      }
      const stops = rawStops.map((s, i): ResolvedStop => {
        if (!(s.at > 0 && s.at <= 1)) throw new Error(`Scene "${key}" has a stop outside (0, 1]`)
        return {
          position: cursor + s.at * duration,
          sceneIndex: index,
          index: i,
          at: s.at,
          duration: s.duration ?? DEFAULT_STOP_DURATION,
          ease: s.ease ?? DEFAULT_STOP_EASE,
          label: s.label,
        }
      })
      scenes.push({
        def,
        key,
        index,
        chapterIndex,
        chapterId: chapter.id,
        start: cursor,
        end: cursor + duration,
        duration,
        stops,
      })
      sceneIndices.push(index)
      cursor += duration
    }
    chapters.push({ def: chapter, index: chapterIndex, start: chapterStart, end: cursor, sceneIndices })
  })

  if (scenes.length === 0) throw new Error('The show needs at least one scene')

  const start: ResolvedStop = {
    position: 0,
    sceneIndex: 0,
    index: -1,
    at: 0,
    duration: DEFAULT_STOP_DURATION,
    ease: DEFAULT_STOP_EASE,
    label: 'start',
  }

  return {
    scenes,
    chapters,
    stops: [start, ...scenes.flatMap((s) => s.stops)],
    total: cursor,
    mountWindow: show.mountWindow ?? 1,
  }
}

export function clampPosition(model: ShowModel, position: number): number {
  return Math.min(model.total, Math.max(0, position))
}

export function sceneIndexAt(model: ShowModel, position: number): number {
  const p = clampPosition(model, position)
  // Binary search for the first scene whose end >= p.
  let lo = 0
  let hi = model.scenes.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (model.scenes[mid]!.end + EPSILON >= p) hi = mid
    else lo = mid + 1
  }
  return lo
}

/** Local progress of any scene at a position, clamped to 0..1. */
export function localProgress(scene: ResolvedScene, position: number): number {
  return Math.min(1, Math.max(0, (position - scene.start) / scene.duration))
}

export function resolve(model: ShowModel, position: number): Resolution {
  const p = clampPosition(model, position)
  const sceneIndex = sceneIndexAt(model, p)
  const scene = model.scenes[sceneIndex]!
  return {
    sceneIndex,
    chapterIndex: scene.chapterIndex,
    local: localProgress(scene, p),
    global: model.total === 0 ? 0 : p / model.total,
  }
}

/** Index in model.stops of the nearest stop at or before the position. */
export function stopIndexAtOrBefore(model: ShowModel, position: number): number {
  let result = 0
  for (let i = 0; i < model.stops.length; i++) {
    if (model.stops[i]!.position <= position + EPSILON) result = i
    else break
  }
  return result
}

export function nextStop(model: ShowModel, position: number): ResolvedStop {
  for (const stop of model.stops) {
    if (stop.position > position + EPSILON) return stop
  }
  return model.stops[model.stops.length - 1]!
}

export function prevStop(model: ShowModel, position: number): ResolvedStop {
  for (let i = model.stops.length - 1; i >= 0; i--) {
    const stop = model.stops[i]!
    if (stop.position < position - EPSILON) return stop
  }
  return model.stops[0]!
}

export function findScene(model: ShowModel, key: string): ResolvedScene | undefined {
  return model.scenes.find((s) => s.key === key)
}

/** Absolute position of a scene-relative point. Throws on an unknown key. */
export function positionOf(model: ShowModel, key: string, local: number): number {
  const scene = findScene(model, key)
  if (!scene) throw new Error(`Unknown scene "${key}"`)
  return scene.start + Math.min(1, Math.max(0, local)) * scene.duration
}

/** Scene indices that stay mounted around the active scene. */
export function mountedIndices(model: ShowModel, active: number): number[] {
  const out: number[] = []
  const from = Math.max(0, active - model.mountWindow)
  const to = Math.min(model.scenes.length - 1, active + model.mountWindow)
  for (let i = from; i <= to; i++) out.push(i)
  return out
}

/** Encodes a stop as "chapter/scene/stopIndex" for the URL hash. */
export function encodeStop(model: ShowModel, stop: ResolvedStop): string {
  if (stop.index < 0) return ''
  return `${model.scenes[stop.sceneIndex]!.key}/${stop.index}`
}

export function decodeStop(model: ShowModel, hash: string): ResolvedStop | undefined {
  const clean = hash.replace(/^#\/?/, '')
  if (!clean) return model.stops[0]
  const parts = clean.split('/')
  if (parts.length < 2) return undefined
  const scene = findScene(model, `${parts[0]}/${parts[1]}`)
  if (!scene) return undefined
  const index = parts[2] === undefined ? 0 : Number.parseInt(parts[2], 10)
  return scene.stops[Number.isFinite(index) ? Math.min(Math.max(index, 0), scene.stops.length - 1) : 0]
}
