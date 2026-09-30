/**
 * Cues: windows of local progress inside one scene, for the overlays that
 * read the playhead directly (the map of the talk, the map labels). Parts
 * register cues at module load, on their own beat grids, so an overlay's
 * state is a pure function of the position, like everything else.
 */
import { range } from '@/animation/progress'
import { findScene, type ShowModel } from '@/engine/show-model'

export interface Cue {
  /** "chapter/scene" */
  key: string
  from: number
  to: number
}

/** A cue that rises over `rise` and falls over `fall`. */
export interface Pulse {
  rise: Cue
  fall: Cue
}

/** 0 before the cue, 1 after it, a ramp in between. 0 when the cue is null. */
export function level(model: ShowModel, position: number, cue: Cue | null): number {
  if (!cue) return 0
  const scene = findScene(model, cue.key)
  if (!scene) return 0
  const a = scene.start + cue.from * scene.duration
  const b = scene.start + cue.to * scene.duration
  return range(position, a, b)
}

export const pulse = (model: ShowModel, position: number, p: Pulse) => Math.min(level(model, position, p.rise), 1 - level(model, position, p.fall))
