/**
 * When the map of the talk (Hud.tsx) changes. Each cue is a window of local
 * progress inside one scene. The windows come from the parts, so they sit on
 * each part's beat grid.
 */
import type { ShowModel } from '@/engine/show-model'
import { level, pulse, type Cue, type Pulse } from '../cues'

export type { Cue, Pulse }

const cues = {
  /** The ring appears at the edge of the frame (script 4.2). */
  appear: null as Cue | null,
  /** The ring comes to the center, large. */
  center: [] as Pulse[],
  /** Each pillar fills its slot, in order. */
  fill: [null, null, null, null] as Array<Cue | null>,
  /** A slot lights while the issue passes its pillar (part 13). */
  lit: [[], [], [], []] as Pulse[][],
  /** The ring steps out of the way while something else needs the corner. */
  hide: [] as Pulse[],
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
  hide(pulse: Pulse) {
    cues.hide.push(pulse)
  },
}


export interface HudState {
  shown: number
  center: number
  fill: number[]
  lit: number[]
}

export function hudState(model: ShowModel, position: number): HudState {
  const round = (v: number) => Math.round(v * 1000) / 1000
  const away = cues.hide.reduce((m, p) => Math.max(m, pulse(model, position, p)), 0)
  const shown = level(model, position, cues.appear) * (1 - away)
  // While it appears, the ring flies from the middle of the frame to its corner.
  const arriving = shown < 1 && away === 0 ? 1 - shown : 0
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
