/**
 * Part 12 moves. The barn and the stacks of measures, coin by coin; two ghost
 * stacks; the elder who looks at what needs a human; and the audit's report
 * that goes from the watchtower back into the gatehouse: the loop.
 */
import { Vector3, type Group } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { METRIC_OFFSET } from '../../actors'
import { drop, stackPoint, stackTilt } from '../../coins'
import { METRIC_BASES, METRIC_COIN_SCALE, METRIC_COINS, TOWER } from '../../layout'
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

  // 12.4: the elder, and what still needs them.
  const elderIn = span(B.human + 0.5, B.human + 1.25)
  inkIn(tl, el('elder'), elderIn.start, elderIn.duration)

  // 12.6: the audit's report goes down from the tower into the gatehouse, and rides the road like any cart.
  const loop = sketchOf(cast.get<Group>('p12.loop'))
  const draw = span(B.loop + 0.5, B.loop + 2.25)
  tl.to(loop.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
  const flow = swarmOf(cast.get('flow'))
  const tmp = new Vector3()
  const all = span(B.loop, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = B.loop + u * (grid.totalBeats - B.loop)
    const down = easeInOut(win(beat, B.loop + 0.5, B.loop + 2.4))
    if (beat < B.loop + 2.4) {
      loop.point(down, tmp)
    } else {
      // Through the gatehouse and on to refine, like any other issue.
      const w = easeInOut(win(beat, B.loop + 2.4, grid.totalBeats))
      routePoint(ROUTE.router! + (ROUTE.refine! - ROUTE.router!) * w, tmp)
    }
    const shown = beat > B.loop + 0.5 ? 1 : 0
    if (!shown) tmp.set(TOWER[0], 0.12, TOWER[2])
    flow.place(7, tmp.x, tmp.y, tmp.z, shown)
    flow.commit()
  })
})
