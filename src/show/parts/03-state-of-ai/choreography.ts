/**
 * Part 3 moves. The blue ball spirals into the core, then the timeline draws
 * itself one step at a time, then the first half dims and the second lights up.
 */
import type { Group } from 'three'
import { artOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { fade, inkIn, inkOut } from '@/art/motion'
import { orbitOf } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { CORE_BEHIND, TIMELINE_SPLIT, TIMELINE_U } from '../../layout'
import { issueOrbit, TIMELINE_IDS } from '../../actors'
import { grid, SPLIT_BEAT, stepBeat } from '.'

const KEY = '03-state-of-ai/timeline'
const { b } = grid

/** Structures that grow around the model in the second half, per step. */
const STRUCTURES: Record<number, { art?: string[]; orbits?: string[]; frame?: string }> = {
  [TIMELINE_SPLIT]: { art: ['tl.ring'] },
  [TIMELINE_SPLIT + 1]: { frame: 'tl.frame' },
  [TIMELINE_SPLIT + 2]: { orbits: ['tl.orbit.a'], art: ['tl.moon.a'] },
  [TIMELINE_SPLIT + 3]: { orbits: ['tl.orbit.b', 'tl.orbit.c'], art: ['tl.moon.b', 'tl.moon.c'] },
}

export const stateOfAiMoves = defineChoreography('03-state-of-ai', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // Stop 1: the blue ball's orbit closes into the core, and the ball goes in.
  const close = span(0, 2.5)
  tl.to(issueOrbit, { radius: 0, duration: close.duration, ease: 'power2.in' }, close.start)
  const inside = span(2.1, 2.6)
  inkOut(tl, artOf(cast.get('issue')), inside.start, inside.duration)
  const orbitOut = span(0, 1.5)
  fade(tl, orbitOf(cast.get<Group>('orbit.cover')).material, 0, orbitOut.start, orbitOut.duration)

  // The core steps back, so the timeline is the subject.
  const back = span(1.5, 4)
  const core = cast.get('core')
  tl.to(core.position, { x: CORE_BEHIND.x, y: CORE_BEHIND.y, z: CORE_BEHIND.z, duration: back.duration, ease: 'power3.inOut' }, back.start)
  tl.to(core.scale, { x: CORE_BEHIND.scale, y: CORE_BEHIND.scale, z: CORE_BEHIND.scale, duration: back.duration, ease: 'power3.inOut' }, back.start)

  // Steps: the arc draws to each step, then the step inks in.
  const splitU = (TIMELINE_U[TIMELINE_SPLIT - 1]! + TIMELINE_U[TIMELINE_SPLIT]!) / 2
  const arcA = sketchOf(cast.get<Group>('tl.arc.a'))
  const arcB = sketchOf(cast.get<Group>('tl.arc.b'))
  TIMELINE_IDS.forEach((id, k) => {
    const s = stepBeat(k)
    const u = TIMELINE_U[k]!
    // The line reaches a little past the step it brings in, and stops short of the "?".
    const reach = id === 'tl.slot' ? u - 0.02 : Math.min(1, u + 0.012)
    const draw = span(s, s + 0.9)
    tl.to(arcA.reveal, { value: Math.min(1, reach / splitU), duration: draw.duration, ease: 'power2.inOut' }, draw.start)
    if (reach > splitU) tl.to(arcB.reveal, { value: (reach - splitU) / (1 - splitU), duration: draw.duration, ease: 'power2.inOut' }, draw.start)

    const enter = span(s + 0.5, s + 1.5)
    if (id === 'tl.slot') {
      tl.to(sketchOf(cast.get<Group>(id)).reveal, { value: 1, duration: enter.duration, ease: 'power2.out' }, enter.start)
    } else {
      inkIn(tl, artOf(cast.get(id)), enter.start, enter.duration)
    }

    const st = STRUCTURES[k]
    if (!st) return
    const grow = span(s + 0.9, s + 1.9)
    st.art?.forEach((a) => inkIn(tl, artOf(cast.get(a)), grow.start, grow.duration))
    st.orbits?.forEach((o) => {
      const orbit = orbitOf(cast.get<Group>(o))
      tl.set(orbit.reveal, { value: 0 }, grow.start)
      tl.set(orbit.material, { opacity: 0.85 }, grow.start)
      tl.to(orbit.reveal, { value: 1, duration: grow.duration, ease: 'power2.inOut' }, grow.start)
    })
    if (st.frame) {
      const frame = cast.get<Group>(st.frame)
      fade(tl, segmentsOf(frame).material, 0.9, grow.start, grow.duration * 0.6)
      tl.fromTo(frame.scale, { x: 1.6, y: 1.6, z: 1.6 }, { x: 1, y: 1, z: 1, duration: grow.duration, ease: 'power3.out', immediateRender: false }, grow.start)
    }
  })

  // Stop 12: the first half dims and steps back; the second half lights up.
  const halves = span(SPLIT_BEAT, SPLIT_BEAT + 2)
  TIMELINE_IDS.forEach((id, k) => {
    const first = k < TIMELINE_SPLIT
    const s = first ? 0.72 : 1.18
    const targets = [id, ...(STRUCTURES[k]?.art ?? []), ...(STRUCTURES[k]?.orbits ?? []), ...(STRUCTURES[k]?.frame ? [STRUCTURES[k]!.frame!] : [])]
    for (const target of targets) {
      tl.to(cast.get(target).scale, { x: s, y: s, z: s, duration: halves.duration, ease: 'power3.inOut' }, halves.start + (first ? 0 : b(0.5)))
    }
  })
  fade(tl, arcA.material, 0.28, halves.start, halves.duration)
})
