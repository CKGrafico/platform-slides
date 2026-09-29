/**
 * The beat grid. The show has no sound, so rhythm is visual: every move lands on
 * a beat of 120 BPM (one beat = 0.5 s). See docs/art/art-direction.md.
 *
 * beatStops([4, 8, 4]) makes three stops. The first move lasts 4 beats (2 s),
 * the second 8 beats (4 s), the third 4 beats (2 s). The ease of each move is
 * 'none', so during a move the timeline advances at a steady pace and a tween
 * placed with b(n) lands exactly n beats after the move starts. Put the easing
 * on each tween instead.
 */
import type { StopDef } from '@/engine/types'

export const BPM = 120
export const BEAT = 60 / BPM

export interface BeatGrid {
  /** Stops for defineScene. */
  stops: StopDef[]
  /** Local progress for n beats from the start of the scene. */
  b: (beats: number) => number
  /** Local progress where stop i starts (0 for the first). */
  stopStart: (index: number) => number
  totalBeats: number
}

export function beatStops(counts: number[]): BeatGrid {
  if (counts.length === 0 || counts.some((c) => !(c > 0))) throw new Error('beatStops needs positive beat counts')
  const totalBeats = counts.reduce((a, c) => a + c, 0)
  let acc = 0
  const starts: number[] = []
  const stops = counts.map((count) => {
    starts.push(acc / totalBeats)
    acc += count
    return { at: acc / totalBeats, duration: count * BEAT, ease: 'none' }
  })
  // Guard against float drift: the last stop must be exactly 1.
  stops[stops.length - 1]!.at = 1
  return {
    stops,
    b: (beats) => beats / totalBeats,
    stopStart: (index) => starts[index] ?? 0,
    totalBeats,
  }
}
