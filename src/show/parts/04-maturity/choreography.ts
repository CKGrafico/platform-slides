/**
 * Part 4 moves. The timeline leaves, five rings draw themselves around the
 * core, then four empty slots appear on the level 5 ring. At the end the
 * rings leave the world: the HUD keeps the map at the edge of the frame.
 */
import type { Group } from 'three'
import { artOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { fade, inkOut } from '@/art/motion'
import { orbitOf } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { TIMELINE_IDS } from '../../actors'
import { grid, levelBeat, MAP_BEAT, slotPoints, SLOTS_BEAT } from '.'

const KEY = '04-maturity/levels'
const { b } = grid

const TIMELINE_ART = [...TIMELINE_IDS.filter((id) => id !== 'tl.slot'), 'tl.ring', 'tl.moon.a', 'tl.moon.b', 'tl.moon.c']
const TIMELINE_ORBITS = ['tl.orbit.a', 'tl.orbit.b', 'tl.orbit.c']

export const maturityMoves = defineChoreography('04-maturity', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // Stop 1: the timeline leaves the screen, from its start to its end.
  TIMELINE_ART.forEach((id, i) => {
    const out = span(0.2 + Math.min(i, 9) * 0.12, 0.7 + Math.min(i, 9) * 0.12)
    inkOut(tl, artOf(cast.get(id)), out.start, out.duration)
  })
  const lines = span(0, 1.6)
  TIMELINE_ORBITS.forEach((id) => fade(tl, orbitOf(cast.get<Group>(id)).material, 0, lines.start, lines.duration))
  fade(tl, segmentsOf(cast.get<Group>('tl.frame')).material, 0, lines.start, lines.duration)
  for (const id of ['tl.arc.a', 'tl.arc.b', 'tl.slot']) {
    tl.to(sketchOf(cast.get<Group>(id)).reveal, { value: 0, duration: lines.duration, ease: 'power2.in' }, lines.start)
  }

  // The core comes back to the center of the system.
  const home = span(0.5, 3.5)
  const core = cast.get('core')
  tl.to(core.position, { x: 0, y: 0, z: 0, duration: home.duration, ease: 'power3.inOut' }, home.start)
  tl.to(core.scale, { x: 1, y: 1, z: 1, duration: home.duration, ease: 'power3.inOut' }, home.start)

  // Stops 2 to 6: each ring draws itself around the core.
  for (let i = 0; i < 5; i++) {
    const ring = orbitOf(cast.get<Group>(`level.${i + 1}`))
    const draw = span(levelBeat(i) + 0.25, levelBeat(i) + 1.75)
    tl.to(ring.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
    // Stop 7: the first four step back.
    if (i < 4) {
      const back = span(SLOTS_BEAT, SLOTS_BEAT + 1.5)
      fade(tl, ring.material, 0.22, back.start, back.duration)
    }
    // Stop 8: they leave the world.
    const gone = span(MAP_BEAT, MAP_BEAT + 1.5 + i * 0.1)
    tl.to(ring.reveal, { value: 0, duration: gone.duration, ease: 'power2.in' }, gone.start)
  }

  // Stop 7: four empty slots on the level 5 ring.
  slotPoints.forEach((p, n) => {
    const slot = cast.get<Group>(`level.slot.${n + 1}`)
    tl.set(slot.position, { x: p.x, y: p.y + 0.05, z: p.z }, 0)
    // Tilted to face the camera above.
    tl.set(slot.rotation, { x: -0.82 }, 0)
    const draw = span(SLOTS_BEAT + 1 + n * 0.5, SLOTS_BEAT + 2 + n * 0.5)
    const s = sketchOf(slot)
    tl.to(s.reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
    const gone = span(MAP_BEAT + 0.5, MAP_BEAT + 1.5)
    tl.to(s.reveal, { value: 0, duration: gone.duration, ease: 'power2.in' }, gone.start)
  })
})
