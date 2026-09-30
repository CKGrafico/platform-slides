/**
 * Part 14 moves. The town runs on: the belts, the sails, the people. The
 * road of milestones is still there, west of the town; the "?" grows, the
 * next step still unknown.
 */
import type { Group } from 'three'
import { defineChoreography } from '@/world/actors'
import { B, grid } from '.'

const KEY = '14-closing/closing'
const { b } = grid

export const closingMoves = defineChoreography('14-closing', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  // The "?" grows: the next step is still unknown.
  const slot = cast.get<Group>('tl.slot')
  const grow = span(B.timeline + 2.5, B.timeline + 4)
  tl.to(slot.scale, { x: 1.7, y: 1.7, z: 1.7, duration: grow.duration, ease: 'power3.inOut' }, grow.start)
})
