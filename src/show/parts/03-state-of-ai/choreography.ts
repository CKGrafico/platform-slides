/**
 * Part 3 moves. The blue cart goes into the hall, then the road into the town
 * lays itself one milestone at a time, from the far west to the "?", with
 * three walkers keeping pace with it, milestone by milestone. They stop in
 * front of the "?", and stay there for the closing.
 */
import type { Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, inkIn, inkOut, shown } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { MAIN_Z, MILESTONE_X, TIMELINE_ROAD } from '../../layout'
import { issueOrbit, TIMELINE_IDS, WALKER_OFFSETS } from '../../actors'
import { grid, stepBeat } from '.'

const KEY = '03-state-of-ai/timeline'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const easeInOut = (t: number) => {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export const stateOfAiMoves = defineChoreography('03-state-of-ai', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // Stop 1: the blue cart's round closes into the hall, and the cart goes in.
  const close = span(0, 2.5)
  tl.to(issueOrbit, { radius: 0, duration: close.duration, ease: 'power2.in' }, close.start)
  const inside = span(2.1, 2.6)
  inkOut(tl, artOf(cast.get('issue')), inside.start, inside.duration)

  // The road lays itself from the west, reaching each milestone as it comes in.
  const road = artOf(cast.get('road.timeline'))
  const x0 = TIMELINE_ROAD[0]![0]
  const length = TIMELINE_ROAD[1]![0] - x0
  shown(tl, road, span(2.5, 2.5).start)
  // Three walkers come in from the west and keep pace with the road's end.
  const walkers = WALKER_OFFSETS.map((_, i) => artOf(cast.get(`walker.${i}`)))
  walkers.forEach((w, i) => {
    const a = span(2.6 + i * 0.15, 3.3 + i * 0.15)
    inkIn(tl, w, a.start, a.duration)
  })
  const laying = span(2.5, stepBeat(9) + 1.5)
  drive(tl, laying.start, laying.duration, (u) => {
    const beat = 2.5 + u * (stepBeat(9) + 1.5 - 2.5)
    let reach = 0.6
    MILESTONE_X.forEach((x, k) => {
      const w = easeInOut(win(beat, stepBeat(k), stepBeat(k) + 0.9))
      const to = x - x0 + 0.9
      reach = Math.max(reach, Math.min(to, reach + (to - reach) * w))
    })
    road.object.scale.x = Math.max(0.001, Math.min(1, reach / length))
    // A little behind the road's end, with a step for every stretch walked.
    const walked = Math.max(0, reach - 1.6)
    walkers.forEach((w, i) => {
      const off = WALKER_OFFSETS[i]!
      w.object.position.set(x0 + walked + off[0], 0.05 + 0.03 * Math.abs(Math.sin(walked * 2.4 + i * 1.3)), MAIN_Z + off[2])
    })
  })

  // Milestones: each one inks in as the road reaches it. The "?" draws its slot.
  TIMELINE_IDS.forEach((id, k) => {
    const s = stepBeat(k)
    const enter = span(s + 0.5, s + 1.5)
    if (id === 'tl.slot') {
      tl.to(sketchOf(cast.get<Group>(id)).reveal, { value: 1, duration: enter.duration, ease: 'power2.out' }, enter.start)
    } else {
      inkIn(tl, artOf(cast.get(id)), enter.start, enter.duration)
    }
  })
})

