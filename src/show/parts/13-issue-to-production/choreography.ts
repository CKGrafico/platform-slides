/**
 * Part 13 moves. The blue ball takes the route through the whole system, one
 * stretch per step, and the path lights up behind it. The element it passes
 * turns blue for a moment: the element that is active right now.
 */
import { Color, Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, inkIn, tint } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { palette } from '@/art/palette'
import { defineChoreography } from '@/world/actors'
import { EVENTS_FROM, METRIC_COIN_SCALE, METRIC_COINS, PRODUCTION_POS, RELEASE_POS, WALL_ANGLES } from '../../layout'
import { metricBase } from '../../actors'
import { stackPoint } from '../../coins'
import { routePoint, ROUTE } from '../../route'
import { grid, stepBeat } from '.'

const KEY = '13-issue-to-production/journey'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))

/** Where the ball is on the route at the end of each step (1..7). */
const STEP_U = [0, ROUTE.router + 0.02, ROUTE.approve - 0.01, ROUTE.implement, ROUTE.exit, (ROUTE.exit + ROUTE.gate) / 2 + 0.02, ROUTE.gate + 0.02, 1]

export const issueToProductionMoves = defineChoreography('13-issue-to-production', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf<MeshToonMaterial>(cast.get(id))

  // The blue ball comes back, far away on the left.
  const issue = el('issue')
  tl.set(issue.object.position, { x: EVENTS_FROM[0], y: EVENTS_FROM[1], z: EVENTS_FROM[2] }, span(0, 0).start)
  const back = span(1.5, 2.5)
  inkIn(tl, issue, back.start, back.duration)
  tl.set(issue.object.scale, { x: 1.35, y: 1.35, z: 1.35 }, back.start)

  const path = sketchOf(cast.get<Group>('p13.path'))
  const tmp = new Vector3()
  const release = new Vector3(...RELEASE_POS)
  const production = new Vector3(...PRODUCTION_POS)
  const all = span(0, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = u * grid.totalBeats
    let r = 0
    for (let n = 1; n <= 7; n++) {
      const w = easeInOut(win(beat, stepBeat(n) + 0.25, stepBeat(n) + 3))
      if (beat >= stepBeat(n)) r = STEP_U[n - 1]! + (STEP_U[n]! - STEP_U[n - 1]!) * w
    }
    routePoint(r, tmp)
    // After release, on to production: up and away.
    const escape = easeInOut(win(beat, stepBeat(7) + 2, stepBeat(7) + 4))
    if (escape > 0) tmp.lerpVectors(release, production, escape)
    issue.object.position.copy(tmp)
    path.reveal.value = r
  })

  // The active element turns blue for a moment, then back.
  const flash = (color: Color, base: string, n: number, delay = 1) => {
    const on = span(stepBeat(n) + delay, stepBeat(n) + delay + 0.5)
    const off = span(stepBeat(n) + delay + 1.25, stepBeat(n) + delay + 2)
    tint(tl, color, palette.accent, on.start, on.duration)
    tint(tl, color, base, off.start, off.duration)
  }
  flash(el('router').body.material.color, palette.peach, 1, 1.8)
  flash(el('person.approver').body.material.color, palette.surface, 3, 1.5)
  flash(el('opencode').body.material.color, palette.butter, 4, 1.8)
  WALL_ANGLES.forEach((_, i) => {
    const wall = el(`wall.${i}`)
    flash(wall.body.material.color, [palette.sage, palette.lilac, palette.butter, palette.peach, palette.sage][i]!, 5, 1 + i * 0.2)
  })
  flash(el('gate').body.material.color, palette.sage, 6, 1.4)
  // Project Health counts it: one more coin drops onto the deployments stack.
  const coin = el('metric.new')
  const rest = stackPoint(metricBase(0), METRIC_COINS[0]!, METRIC_COIN_SCALE)
  const count = span(stepBeat(7) + 2.75, stepBeat(7) + 3.75)
  tl.set(coin.object.position, { x: rest.x, y: rest.y + 0.9, z: rest.z }, count.start)
  inkIn(tl, coin, count.start, count.duration * 0.4)
  tl.to(coin.object.position, { y: rest.y, duration: count.duration, ease: 'bounce.out' }, count.start)
})
