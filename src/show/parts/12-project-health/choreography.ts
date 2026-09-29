/**
 * Part 12 moves. The columns rise, two stay hollow, a person looks at what
 * needs a human, and the audit drops a finding back into the router: the loop.
 */
import { Vector3, type Group } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, inkIn } from '@/art/motion'
import { easeInOut, orbitPoint } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { METRIC_HEIGHTS, SIDE_ORBIT } from '../../layout'
import { routePoint, ROUTE } from '../../route'
import { B, grid } from '.'

const KEY = '12-project-health/health'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))

export const projectHealthMoves = defineChoreography('12-project-health', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // 12.2: the columns rise at the edge of the disc.
  METRIC_HEIGHTS.forEach((h, i) => {
    const m = el(`metric.${i}`)
    const a = span(B.measure + 0.5 + i * 0.3, B.measure + 1.1 + i * 0.3)
    inkIn(tl, m, a.start, a.duration)
    const rise = span(B.measure + 0.6 + i * 0.3, B.measure + 2.1 + i * 0.3)
    tl.to(m.object.scale, { y: h, duration: rise.duration, ease: 'power3.out' }, rise.start)
  })

  // 12.3: two measures stay hollow: not collected.
  for (let i = 0; i < 2; i++) {
    const hollow = sketchOf(cast.get<Group>(`metric.hollow.${i}`))
    const draw = span(B.honest + 0.5 + i * 0.4, B.honest + 1.75 + i * 0.4)
    tl.to(hollow.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
  }

  // 12.4: a person, and what still needs them.
  const person = el('person.health')
  const pIn = span(B.human + 0.5, B.human + 1.25)
  inkIn(tl, person, pIn.start, pIn.duration)

  // 12.6: the audit drops a finding back into the router, and it joins the lanes.
  const loop = sketchOf(cast.get<Group>('p12.loop'))
  const draw = span(B.loop + 0.5, B.loop + 2.25)
  tl.to(loop.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
  const flow = swarmOf(cast.get('flow'))
  const tmp = new Vector3()
  const audit = orbitPoint(SIDE_ORBIT, 0.35 * Math.PI + 0.5)
  const all = span(B.loop, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = B.loop + u * (grid.totalBeats - B.loop)
    const drop = easeInOut(win(beat, B.loop + 0.5, B.loop + 2.4))
    if (beat < B.loop + 2.4) {
      loop.point(drop, tmp)
    } else {
      // Through the router and onto the lanes, like any other issue.
      const w = easeInOut(win(beat, B.loop + 2.4, grid.totalBeats))
      routePoint(ROUTE.router + (ROUTE.refine - ROUTE.router) * w, tmp)
    }
    const shown = beat > B.loop + 0.5 ? 1 : 0
    if (!shown) tmp.copy(audit)
    flow.place(7, tmp.x, tmp.y, tmp.z, shown)
    flow.commit()
  })
})
