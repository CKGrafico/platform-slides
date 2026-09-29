/**
 * When the map of the talk (Hud.tsx) changes. Each cue is a window of local
 * progress inside one scene. The windows come from the parts, so they sit on
 * each part's beat grid.
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

const cues = {
  /** The ring appears at the edge of the frame (script 4.2). */
  appear: null as Cue | null,
  /** The ring comes to the center, large. */
  center: [] as Pulse[],
  /** Each pillar fills its slot, in order. */
  fill: [null, null, null, null] as Array<Cue | null>,
  /** A slot lights while the issue passes its pillar (part 13). */
  lit: [[], [], [], []] as Pulse[][],
}

/** Parts call these once, at module load, with windows on their own grid. */
export const hudCues = {
  appear(cue: Cue) {
    cues.appear = cue
  },
  center(pulse: Pulse) {
    cues.center.push(pulse)
  },
  fill(slot: number, cue: Cue) {
    cues.fill[slot] = cue
  },
  lit(slot: number, pulse: Pulse) {
    cues.lit[slot]!.push(pulse)
  },
}

function level(model: ShowModel, position: number, cue: Cue | null): number {
  if (!cue) return 0
  const scene = findScene(model, cue.key)
  if (!scene) return 0
  const a = scene.start + cue.from * scene.duration
  const b = scene.start + cue.to * scene.duration
  return range(position, a, b)
}

const pulse = (model: ShowModel, position: number, p: Pulse) => Math.min(level(model, position, p.rise), 1 - level(model, position, p.fall))

export interface HudState {
  shown: number
  center: number
  fill: number[]
  lit: number[]
}

export function hudState(model: ShowModel, position: number): HudState {
  const round = (v: number) => Math.round(v * 1000) / 1000
  const shown = level(model, position, cues.appear)
  // While it appears, the ring flies from the middle of the frame to its corner.
  const arriving = shown < 1 ? 1 - shown : 0
  const center = Math.max(arriving, cues.center.reduce((m, p) => Math.max(m, pulse(model, position, p)), 0))
  return {
    shown: round(shown),
    center: round(smooth(center)),
    fill: cues.fill.map((c) => round(level(model, position, c))),
    lit: cues.lit.map((list) => round(list.reduce((m, p) => Math.max(m, pulse(model, position, p)), 0))),
  }
}

function smooth(t: number) {
  return t * t * (3 - 2 * t)
}
