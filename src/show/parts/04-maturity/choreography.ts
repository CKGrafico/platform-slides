/**
 * Part 4 moves. Five ring walls rise round the land, arc by arc, one ring per
 * level, the camera pulled back to see them all; then four empty slots appear
 * on the level 5 ring. The first four step back (lower) when the slots come.
 * At the end the walls sink back into the ground: the HUD keeps the map at the
 * edge of the frame. The milestones stay on their road: the closing comes back
 * to them.
 */
import type { Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { inkIn, inkOut } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { LEVEL_ARCS } from '../../actors'
import { grid, levelBeat, MAP_BEAT, slotPoints, SLOTS_BEAT } from '.'

const KEY = '04-maturity/levels'
const { b } = grid

export const maturityMoves = defineChoreography('04-maturity', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // Stops 1 to 5: each level's wall rises round the hall, arc by arc.
  for (let i = 0; i < 5; i++) {
    for (let k = 0; k < LEVEL_ARCS; k++) {
      const w = artOf(cast.get(`level.${i + 1}.${k}`))
      const rise = span(levelBeat(i) + 0.25 + k * 0.12, levelBeat(i) + 1.0 + k * 0.12)
      inkIn(tl, w, rise.start, rise.duration)
      tl.fromTo(w.object.scale, { y: 0.001 }, { y: 1, duration: rise.duration, ease: 'power3.out', immediateRender: false }, rise.start)
      // Stop 2: the first four step back, lower.
      if (i < 4) {
        const back = span(SLOTS_BEAT, SLOTS_BEAT + 1.5)
        tl.to(w.object.scale, { y: 0.45, duration: back.duration, ease: 'power2.inOut' }, back.start)
      }
      // Stop 3: they sink back into the ground.
      const gone = span(MAP_BEAT + k * 0.06, MAP_BEAT + 1.2 + i * 0.1 + k * 0.06)
      tl.to(w.object.scale, { y: 0.001, duration: gone.duration, ease: 'power2.in' }, gone.start)
      inkOut(tl, w, gone.start + gone.duration * 0.6, gone.duration * 0.4)
    }
  }

  // Stop 2: four empty slots on the level 5 ring.
  slotPoints.forEach((p, n) => {
    const slot = cast.get<Group>(`level.slot.${n + 1}`)
    tl.set(slot.position, { x: p.x, y: p.y, z: p.z }, 0)
    const draw = span(SLOTS_BEAT + 1 + n * 0.5, SLOTS_BEAT + 2 + n * 0.5)
    const s = sketchOf(slot)
    tl.to(s.reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
    const gone = span(MAP_BEAT + 0.5, MAP_BEAT + 1.5)
    tl.to(s.reveal, { value: 0, duration: gone.duration, ease: 'power2.in' }, gone.start)
  })
})
