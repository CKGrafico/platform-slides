/**
 * The path of one piece of work through the whole system, as a pure function
 * of u (0..1). Part 10 sends a work item along it; part 13 sends the blue ball.
 *
 *   0.00 to 0.10  from far away to the router ring
 *   0.10 to 0.16  through the router, onto the triage lane
 *   0.16 to 0.78  a spiral: the front half on triage, the back on refine,
 *                 the last front half on implement, near the core
 *   0.78 to 0.90  out of the implement lane, through the merge gate
 *   0.90 to 1.00  on to release
 */
import { Vector3 } from 'three'
import { INNER } from './actors'
import { EVENTS_FROM, GATE_POS, LANES, RELEASE_POS, ROUTER_POS } from './layout'

export const ROUTE = {
  router: 0.1,
  lanes: 0.16,
  refine: 0.37,
  approve: 0.57,
  implement: 0.6,
  exit: 0.78,
  gate: 0.9,
  end: 1,
}

const from = new Vector3(...EVENTS_FROM)
const router = new Vector3(...ROUTER_POS)
const gate = new Vector3(...GATE_POS)
const release = new Vector3(...RELEASE_POS)
const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (u: number, a: number, b: number) => clamp01((u - a) / (b - a))

/** Lane radius along the spiral: steps from triage to refine to implement. */
function laneRadius(s: number): number {
  const toRefine = smooth(win(s, 0.28, 0.4))
  const toImplement = smooth(win(s, 0.62, 0.74))
  return LANES.triage.radius + (LANES.refine.radius - LANES.triage.radius) * toRefine + (INNER.radius - LANES.refine.radius) * toImplement
}

function spiral(s: number, out: Vector3): Vector3 {
  // From the left (angle pi), a turn and a half, clockwise seen from above, to the right.
  const a = Math.PI - s * Math.PI * 3
  const r = laneRadius(s)
  return out.set(Math.cos(a) * r, 0, Math.sin(a) * r)
}

const tmpA = new Vector3()
const tmpB = new Vector3()

export function routePoint(u: number, out = new Vector3()): Vector3 {
  if (u <= ROUTE.router) return out.lerpVectors(from, router, smooth(u / ROUTE.router))
  if (u <= ROUTE.lanes) {
    spiral(0, tmpA)
    return out.lerpVectors(router, tmpA, smooth(win(u, ROUTE.router, ROUTE.lanes)))
  }
  if (u <= ROUTE.exit) return spiral(win(u, ROUTE.lanes, ROUTE.exit), out)
  if (u <= ROUTE.gate) {
    spiral(1, tmpB)
    return out.lerpVectors(tmpB, gate, smooth(win(u, ROUTE.exit, ROUTE.gate)))
  }
  return out.lerpVectors(gate, release, smooth(win(u, ROUTE.gate, ROUTE.end)))
}
