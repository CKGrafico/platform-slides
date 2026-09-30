/**
 * Part 13 moves. The blue cart takes the route through the whole town, one
 * stretch per step, and the road lights up behind it. The element it passes
 * turns blue for a moment: the element that is active right now.
 */
import { Color, Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { town } from '@/art/town'
import { drive, inkIn, tint } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { palette } from '@/art/palette'
import { faceOnPath, type PathAt } from '@/art/town-units'
import { defineChoreography } from '@/world/actors'
import { METRIC_BASES, METRIC_COIN_SCALE, METRIC_COINS } from '../../layout'
import { stackPoint } from '../../coins'
import { routePoint, ROUTE } from '../../route'
import { grid, stepBeat } from '.'

const KEY = '13-issue-to-production/journey'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))

/** Where the cart is on the route at the end of each step (1..7). */
const STEP_U = [0, ROUTE.router! + 0.01, ROUTE.refine!, ROUTE.requester!, ROUTE.implement!, ROUTE.walls! + 0.01, ROUTE.gate! + 0.01, ROUTE.end!]

export const issueToProductionMoves = defineChoreography('13-issue-to-production', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf<MeshToonMaterial>(cast.get(id))

  // The blue cart comes back, far away on the road to the west.
  const issue = el('issue')
  const start = routePoint(0)
  tl.set(issue.object.position, { x: start.x, y: 0.06, z: start.z }, span(0, 0).start)
  const back = span(1.5, 2.5)
  inkIn(tl, issue, back.start, back.duration)
  tl.set(issue.object.scale, { x: 1.2, y: 1.2, z: 1.2 }, back.start)
  const routeAt: PathAt = (u, out) => routePoint(u, out)

  const path = sketchOf(cast.get<Group>('p13.path'))
  const tmp = new Vector3()
  const all = span(0, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = u * grid.totalBeats
    let r = 0
    for (let n = 1; n <= 7; n++) {
      const w = easeInOut(win(beat, stepBeat(n) + 0.25, stepBeat(n) + 3))
      if (beat >= stepBeat(n)) r = STEP_U[n - 1]! + (STEP_U[n]! - STEP_U[n - 1]!) * w
    }
    routePoint(r, tmp)
    tmp.y = 0.06
    issue.object.position.copy(tmp)
    faceOnPath(issue.object, routeAt, r)
    path.reveal.value = r
  })

  // The active element turns blue for a moment, then back.
  const flash = (color: Color, base: string, n: number, delay = 1) => {
    const on = span(stepBeat(n) + delay, stepBeat(n) + delay + 0.5)
    const off = span(stepBeat(n) + delay + 1.25, stepBeat(n) + delay + 2)
    tint(tl, color, palette.accent, on.start, on.duration)
    tint(tl, color, base, off.start, off.duration)
  }
  flash(el('gatehouse').body.material.color, town.stone, 1, 1.8)
  flash(el('triage').body.material.color, town.wall, 2, 1.2)
  flash(el('refine').body.material.color, town.wallWarm, 2, 2.0)
  flash(el('requester').body.material.color, palette.surface, 3, 1.5)
  flash(el('hall').body.material.color, town.wall, 4, 1.8)
  for (const id of ['arch.e', 'ring.0.0', 'ring.0.7']) flash(el(id).body.material.color, town.stone, 5, 1.2)
  flash(el('exit').body.material.color, town.stone, 6, 1.4)
  // Project Health counts it: one more coin drops onto the deployments stack.
  const coin = el('metric.new')
  const rest = stackPoint(METRIC_BASES[0]!, METRIC_COINS[0]!, METRIC_COIN_SCALE)
  const count = span(stepBeat(7) + 2.75, stepBeat(7) + 3.75)
  tl.set(coin.object.position, { x: rest.x, y: rest.y + 0.9, z: rest.z }, count.start)
  inkIn(tl, coin, count.start, count.duration * 0.4)
  tl.to(coin.object.position, { y: rest.y, duration: count.duration, ease: 'bounce.out' }, count.start)
})
