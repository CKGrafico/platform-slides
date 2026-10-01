/**
 * Part 12 moves. The barn and the stacks of measures, coin by coin; two ghost
 * stacks; the elder, the last of the hall's folk to move out, who walks to the
 * stacks to look at what needs a human, and the hall steps down for the last
 * time; and the audit's report that goes from the watchtower back into the
 * gatehouse: the loop.
 */
import { Vector3, type Group } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { yawAlong } from '@/art/town-units'
import { defineChoreography } from '@/world/actors'
import { METRIC_OFFSET } from '../../actors'
import { drop, stackPoint, stackTilt } from '../../coins'
import { FOLK, HALL_SCALE, hallStep, homeAfter, homeAt, walkPath } from '../../hall'
import { HEALTH_PERSON, METRIC_BASES, METRIC_COIN_SCALE, METRIC_COINS, TOWER } from '../../layout'
import { routePoint, ROUTE } from '../../route'
import { B, grid } from '.'

const KEY = '12-project-health/health'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))

export const projectHealthMoves = defineChoreography('12-project-health', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // 12.2: the barn, and the measures that stack up beside it, coin by coin.
  const barnIn = span(B.measure + 0.25, B.measure + 1)
  inkIn(tl, el('barn'), barnIn.start, barnIn.duration)
  const metrics = swarmOf(cast.get('metrics'))
  const coinAt = (i: number, k: number) => B.measure + 0.75 + i * 0.3 + k * 0.1
  const place = new Vector3()
  const stacks = span(B.measure, grid.totalBeats)
  drive(tl, stacks.start, stacks.duration, (u) => {
    const beat = B.measure + u * (grid.totalBeats - B.measure)
    METRIC_COINS.forEach((n, i) => {
      for (let k = 0; k < n; k++) {
        const d = drop(win(beat, coinAt(i, k), coinAt(i, k) + 0.4), 0.7)
        stackPoint(METRIC_BASES[i]!, k, METRIC_COIN_SCALE, place)
        const [rx, rz] = stackTilt(k + i * 13)
        metrics.place(METRIC_OFFSET[i]! + k, place.x, place.y + d.lift, place.z, d.scale, rx, rz)
      }
    })
    metrics.commit()
  })

  // 12.3: two measures are not collected: ghost stacks.
  const ghost = segmentsOf(cast.get<Group>('metrics.ghost'))
  const ghostIn = span(B.honest + 0.5, B.honest + 1.75)
  fade(tl, ghost.material, 0.85, ghostIn.start, ghostIn.duration)

  // 12.4: the elder walks out of the hall, through the west arch and the gatehouse, to the stacks, and the hall takes its last step down.
  const walk = span(B.human + 0.25, B.human + 1.75)
  walkPath(tl, cast, FOLK.elder, walk.start, walk.duration, [homeAt(FOLK.elder, HALL_SCALE.tower), [-2.8, 0, 3.4], [-5.6, 0, 5.6], [-7.6, 0, 6.6], [-21.0, 0, 6.6], [-24.8, 0, 7.4], [-25.2, 0, 12.0], [-22.6, 0, 22.0], [HEALTH_PERSON[0], 0, HEALTH_PERSON[2]]], 0.8)
  const smaller = span(B.human + 1.25, B.human + 2.25)
  hallStep(tl, cast, smaller.start, smaller.duration, HALL_SCALE.tower, HALL_SCALE.elder, homeAfter(FOLK.elder))

  // 12.6: the audit's report goes down from the tower into the gatehouse, and rides the road like any cart.
  const loop = sketchOf(cast.get<Group>('p12.loop'))
  const draw = span(B.loop + 0.5, B.loop + 2.25)
  tl.to(loop.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
  const flow = swarmOf(cast.get('flow'))
  const tmp = new Vector3()
  const prev = new Vector3()
  const at = (beat: number, out: Vector3) => {
    if (beat < B.loop + 2.4) {
      loop.point(easeInOut(win(beat, B.loop + 0.5, B.loop + 2.4)), out)
    } else {
      // Through the gatehouse and on to refine, like any other issue.
      const w = easeInOut(win(beat, B.loop + 2.4, grid.totalBeats))
      routePoint(ROUTE.router! + (ROUTE.refine! - ROUTE.router!) * w, out)
    }
    return out
  }
  const all = span(B.loop, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = B.loop + u * (grid.totalBeats - B.loop)
    at(beat, tmp)
    at(beat - 0.05, prev)
    const shown = beat > B.loop + 0.5 ? 1 : 0
    if (!shown) tmp.set(TOWER[0], 0.06, TOWER[2])
    flow.place(7, tmp.x, 0.06, tmp.z, shown, 0, 0, yawAlong(prev, tmp))
    flow.commit()
  })
})
