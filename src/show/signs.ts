/**
 * The district signs: one per pillar, in the four empty slots part 4 draws on
 * the ground. When a part names its pillar, the sign stands in its slot and
 * the slot's dashed circle goes. Every part that names a pillar goes through
 * raiseSign, so the four signs come the same way.
 */
import type { Group } from 'three'
import type { Timeline } from '@/animation/gsap'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { inkIn } from '@/art/motion'
import type { Cast } from '@/world/actors'
import { SIGN_IDS } from './actors'

/** Raises sign `i` (0..3) over the window, and clears the slot that waited for it. */
export function raiseSign(tl: Timeline, cast: Cast, i: number, window: { start: number; duration: number }): void {
  inkIn(tl, artOf(cast.get(SIGN_IDS[i]!)), window.start, window.duration)
  const slot = sketchOf(cast.get<Group>(`level.slot.${i + 1}`))
  tl.to(slot.reveal, { value: 0, duration: window.duration * 0.6, ease: 'power2.in' }, window.start)
}
