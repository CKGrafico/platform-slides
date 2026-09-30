/**
 * The path of one piece of work through the whole town, as a pure function of
 * u (0..1): along the road from the far west, through the gatehouse, to the
 * door of triage and of refine, through the inner arch, round the loop to the
 * hall's door, back out through the arch, the merge gate, the market, the
 * outer gate, and on to production. Part 13 sends the blue cart along it;
 * part 12 sends the audit's finding along its first stretch.
 */
import { Vector3 } from 'three'
import { polyline } from '@/art/town'
import { ARCH_E, ARCH_W, EXIT_GATE, GATEHOUSE, LOOP, MAIN_Z, MARKET, OUTER_E, PRODUCTION, REFINE_HOUSE, REQUESTER, TRIAGE_HOUSE, type V3 } from './layout'

const Y = 0.14
const road = (x: number): V3 => [x, Y, MAIN_Z]
const door = (house: V3, dz: number): V3 => [house[0], Y, house[2] + dz]

/** The waypoints, in order, with the names of the ones the parts stop at. */
const WAYPOINTS: Array<{ at: V3; name?: string }> = [
  { at: road(-30) },
  { at: road(GATEHOUSE[0]), name: 'router' },
  { at: road(TRIAGE_HOUSE[0] - 0.9) },
  { at: door(TRIAGE_HOUSE, 1.15), name: 'triage' },
  { at: road(TRIAGE_HOUSE[0] + 0.9) },
  { at: road(REFINE_HOUSE[0] - 0.6) },
  { at: door(REFINE_HOUSE, 1.05), name: 'refine' },
  { at: road(REQUESTER[0]), name: 'requester' },
  { at: road(ARCH_W[0]) },
  { at: road(LOOP[0]![0]) },
  { at: [LOOP[0]![0], Y, LOOP[0]![2]] },
  { at: [0, Y, LOOP[0]![2]] },
  { at: [0, Y, 2.3], name: 'implement' },
  { at: [0, Y, LOOP[3]![2]] },
  { at: [LOOP[3]![0], Y, LOOP[3]![2]] },
  { at: road(LOOP[3]![0]) },
  { at: road(ARCH_E[0]), name: 'walls' },
  { at: road(EXIT_GATE[0]), name: 'gate' },
  { at: road(MARKET[0] - 1.2) },
  { at: [MARKET[0], Y, MARKET[2] + 1.05], name: 'market' },
  { at: road(MARKET[0] + 1.3) },
  { at: road(OUTER_E[0]), name: 'outer' },
  { at: [PRODUCTION[0], Y, PRODUCTION[2]], name: 'end' },
]

const points = WAYPOINTS.map((w) => w.at)
const lengths: number[] = [0]
for (let i = 1; i < points.length; i++) {
  const [ax, , az] = points[i - 1]!
  const [bx, , bz] = points[i]!
  lengths.push(lengths[i - 1]! + Math.hypot(bx - ax, bz - az))
}
const total = lengths[lengths.length - 1]!

/** Where each named waypoint is along the route, 0..1. */
export const ROUTE: Record<string, number> = {}
WAYPOINTS.forEach((w, i) => {
  if (w.name) ROUTE[w.name] = lengths[i]! / total
})

const path = polyline(points)

export function routePoint(u: number, out = new Vector3()): Vector3 {
  return path(u, out)
}
