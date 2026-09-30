/**
 * Part 4 moves. Five rings draw themselves on the ground around the hall,
 * then four empty slots appear on the level 5 ring. At the end the rings
 * leave the ground: the HUD keeps the map at the edge of the frame. The
 * milestones stay on their road: the closing comes back to them.
 */
import type { Group } from 'three'
import { sketchOf } from '@/art/lines'
import { fade } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { grid, levelBeat, MAP_BEAT, slotPoints, SLOTS_BEAT } from '.'

const KEY = '04-maturity/levels'
const { b } = grid

export const maturityMoves = defineChoreography('04-maturity', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // Stops 1 to 5: each ring draws itself around the hall.
  for (let i = 0; i < 5; i++) {
    const ring = sketchOf(cast.get<Group>(`level.${i + 1}`))
    const draw = span(levelBeat(i) + 0.25, levelBeat(i) + 1.75)
    tl.to(ring.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
    // Stop 2: the first four step back.
    if (i < 4) {
      const back = span(SLOTS_BEAT, SLOTS_BEAT + 1.5)
      fade(tl, ring.material, 0.22, back.start, back.duration)
    }
    // Stop 3: they leave the ground.
    const gone = span(MAP_BEAT, MAP_BEAT + 1.5 + i * 0.1)
    tl.to(ring.reveal, { value: 0, duration: gone.duration, ease: 'power2.in' }, gone.start)
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
