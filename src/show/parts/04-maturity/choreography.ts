/**
 * Part 4 moves. The main road is laid through the town, gate to gate, where
 * the road of milestones ends. Then five ring walls rise round the land, arc
 * by arc, one ring per level, each with its gates. They never leave: the town
 * is built between them. Four empty slots mark the ground of the four
 * districts; the signs of parts 9 to 12 take their place.
 */
import type { Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, inkIn, shown } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { RING_GATES } from '../../actors'
import { RING_ARCS, RINGS } from '../../layout'
import { grid, levelBeat, ROAD_BEAT, slotPoints, SLOTS_BEAT } from '.'

const KEY = '04-maturity/levels'
const { b } = grid

export const maturityMoves = defineChoreography('04-maturity', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // The road through the town, from the outer gate in the west to the outer gate in the east.
  const road = artOf(cast.get('road.main'))
  const lay = span(ROAD_BEAT, ROAD_BEAT + 2.25)
  shown(tl, road, lay.start)
  drive(tl, lay.start, lay.duration, (u) => {
    road.object.scale.x = Math.max(0.001, easeInOut(u))
  })

  // Stop 1: each level's wall rises round the town, arc by arc, and its gates with it.
  RINGS.forEach((_, i) => {
    for (let k = 0; k < RING_ARCS; k++) {
      const w = artOf(cast.get(`ring.${i}.${k}`))
      const rise = span(levelBeat(i) + 0.25 + k * 0.1, levelBeat(i) + 1.0 + k * 0.1)
      inkIn(tl, w, rise.start, rise.duration)
      tl.fromTo(w.object.scale, { y: 0.001 }, { y: 1, duration: rise.duration, ease: 'power3.out', immediateRender: false }, rise.start)
    }
    RING_GATES[i]!.forEach((id, g) => {
      const up = span(levelBeat(i) + 0.8 + g * 0.1, levelBeat(i) + 1.5 + g * 0.1)
      inkIn(tl, artOf(cast.get(id)), up.start, up.duration)
    })
  })

  // Stop 2: four empty slots, one where each district's sign will stand.
  slotPoints.forEach((p, n) => {
    const slot = cast.get<Group>(`level.slot.${n + 1}`)
    tl.set(slot.position, { x: p.x, y: p.y, z: p.z }, 0)
    const draw = span(SLOTS_BEAT + 1 + n * 0.5, SLOTS_BEAT + 2 + n * 0.5)
    tl.to(sketchOf(slot).reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
  })
})
