/**
 * Part 14 moves. The core gets small at the center of the system, and the
 * timeline comes back in the sky above it, with its "?".
 */
import type { Group } from 'three'
import { artOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn } from '@/art/motion'
import { orbitOf } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { TIMELINE_IDS } from '../../actors'
import { CORE_SCALE_AFTER_P10, CORE_SCALE_BEFORE_P10, TIMELINE_LIFT } from '../../layout'
import { B, grid } from '.'

const KEY = '14-closing/closing'
const { b } = grid

const SMALL = 0.55
const TIMELINE_ART = [...TIMELINE_IDS.filter((id) => id !== 'tl.slot'), 'tl.ring', 'tl.moon.a', 'tl.moon.b', 'tl.moon.c']
const TIMELINE_LINES = ['tl.arc.a', 'tl.arc.b', 'tl.slot']
const TIMELINE_ORBITS = ['tl.orbit.a', 'tl.orbit.b', 'tl.orbit.c']

const easeInOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export const closingMoves = defineChoreography('14-closing', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // The core gets small at the center; its frame and runtime ring follow it.
  const core = cast.get('core')
  const harness = cast.get<Group>('harness')
  const opencode = cast.get('opencode')
  const shrink = span(0.5, 4.5)
  drive(tl, shrink.start, shrink.duration, (u) => {
    const s = CORE_SCALE_AFTER_P10 + (SMALL - CORE_SCALE_AFTER_P10) * easeInOut(u)
    core.scale.setScalar(s)
    harness.scale.setScalar((0.9 * s) / CORE_SCALE_BEFORE_P10)
    opencode.scale.setScalar(s / CORE_SCALE_BEFORE_P10)
  })

  // The timeline comes back, in the sky above the system.
  const lift = span(B.timeline, B.timeline)
  for (const id of [...TIMELINE_ART, ...TIMELINE_LINES, ...TIMELINE_ORBITS, 'tl.frame']) {
    const o = cast.get(id)
    tl.set(o.position, { x: `+=${TIMELINE_LIFT[0]}`, y: `+=${TIMELINE_LIFT[1]}`, z: `+=${TIMELINE_LIFT[2]}` }, lift.start)
  }
  TIMELINE_ART.forEach((id, i) => {
    const a = span(B.timeline + 0.5 + Math.min(i, 9) * 0.15, B.timeline + 1.25 + Math.min(i, 9) * 0.15)
    inkIn(tl, artOf(cast.get(id)), a.start, a.duration)
  })
  const lines = span(B.timeline + 0.25, B.timeline + 2.25)
  for (const id of TIMELINE_LINES) {
    tl.to(sketchOf(cast.get<Group>(id)).reveal, { value: 1, duration: lines.duration, ease: 'power2.inOut' }, lines.start)
  }
  for (const id of TIMELINE_ORBITS) fade(tl, orbitOf(cast.get<Group>(id)).material, 0.85, lines.start, lines.duration)
  fade(tl, segmentsOf(cast.get<Group>('tl.frame')).material, 0.9, lines.start, lines.duration)
  // The "?" grows: the next step is still unknown.
  const slot = cast.get<Group>('tl.slot')
  const grow = span(B.timeline + 2.5, B.timeline + 4)
  tl.to(slot.scale, { x: 1.7, y: 1.7, z: 1.7, duration: grow.duration, ease: 'power3.inOut' }, grow.start)
})
