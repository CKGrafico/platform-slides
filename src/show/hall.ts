/**
 * The hall through the talk: its size, and the folk who leave it.
 *
 * The hall starts big and closed, with all its folk at the arcade: the
 * commune, one agent that does everything. Each time the town takes a job off
 * the hall, one of them walks out to the house that does that job now, and the
 * hall steps down a size. A third smaller by the end; one keeper stays. Every
 * part that shrinks the hall goes through hallStep, so the scale has one shape
 * everywhere and the folk still at home stand on the platform at any size.
 */
import { Vector3, type Object3D } from 'three'
import type { Timeline } from '@/animation/gsap'
import { drive } from '@/art/motion'
import { easeInOut } from '@/art/orbits'
import { polyline } from '@/art/town'
import type { Cast } from '@/world/actors'
import { FOLK_SPOTS, HALL_BIG, TURRET_TOP, type V3 } from './layout'

/** The hall's scale after each move out, in story order. */
export const HALL_SCALE = {
  start: HALL_BIG,
  triage: 1.19,
  forge: 1.12,
  tasks: [1.085, 1.05, 1.015, 0.98],
  router: 0.95,
  refine: 0.92,
  tower: 0.89,
  elder: 0.85,
} as const

/** The folk of the hall, by the job they leave for. The keeper never leaves. */
export const FOLK = {
  triage: 'folk.triage',
  smiths: ['folk.smith.0', 'folk.smith.1'],
  router: 'folk.router',
  refine: 'folk.refine',
  tower: 'repair',
  elder: 'elder',
  keeper: 'folk.keeper',
} as const

/** Everyone at the arcade at the start, with the spot each stands on (layout.ts), in the order they leave. */
export const FOLK_HOME: ReadonlyArray<{ id: string; spot: number }> = [
  { id: FOLK.triage, spot: 6 },
  { id: FOLK.smiths[0], spot: 4 },
  { id: FOLK.smiths[1], spot: 0 },
  { id: FOLK.router, spot: 7 },
  { id: FOLK.refine, spot: 1 },
  { id: FOLK.tower, spot: 5 },
  { id: FOLK.elder, spot: 3 },
  { id: FOLK.keeper, spot: 2 },
]

/** Where someone at the arcade stands, at a hall scale (world units). */
export function homePoint(spot: number, scale: number, out = new Vector3()): Vector3 {
  const p = FOLK_SPOTS[spot]!
  return out.set(p[0] * scale, p[1] * scale, p[2] * scale)
}

/** The spot of one of the folk, as a path point at a hall scale. */
export function homeAt(id: string, scale: number): V3 {
  const spot = FOLK_HOME.find((f) => f.id === id)!.spot
  const p = homePoint(spot, scale)
  return [p.x, p.y, p.z]
}

/** Who is still at the arcade once `id` has left: everyone after them in the order. */
export function homeAfter(id: string): string[] {
  const i = FOLK_HOME.findIndex((f) => f.id === id)
  return FOLK_HOME.slice(i + 1).map((f) => f.id)
}

/** Writes one hall scale to the hall, its parapet and its banner. */
export function setHallScale(hall: Object3D, parapet: Object3D, banner: Object3D, s: number): void {
  hall.scale.setScalar(s)
  parapet.scale.setScalar(s)
  banner.scale.setScalar(s)
  banner.position.set(TURRET_TOP[0] * s, TURRET_TOP[1] * s, TURRET_TOP[2] * s)
}

/**
 * One step down: the hall, its parapet and its banner go from one scale to
 * the next over the window, and the folk still at home keep their spots.
 */
export function hallStep(tl: Timeline, cast: Cast, at: number, duration: number, from: number, to: number, home: readonly string[]): void {
  const hall = cast.get('hall')
  const parapet = cast.get('harness')
  const banner = cast.get('banner')
  const folk = home.map((id) => ({ object: cast.get(id), spot: FOLK_HOME.find((f) => f.id === id)!.spot }))
  drive(tl, at, duration, (u) => {
    const s = from + (to - from) * easeInOut(u)
    setHallScale(hall, parapet, banner, s)
    for (const f of folk) homePoint(f.spot, s, f.object.position)
  })
}

const step = new Vector3()
const ahead = new Vector3()

/**
 * A villager walks a path of straight stretches, turning the way they go,
 * with a small bob at each step, and turns to `faceAtEnd` when they arrive.
 */
export function walkPath(tl: Timeline, cast: Cast, id: string, at: number, duration: number, points: V3[], faceAtEnd = 0.8): void {
  const o = cast.get(id)
  const path = polyline(points)
  drive(tl, at, duration, (u) => {
    const w = easeInOut(u)
    path(w, step)
    path(Math.min(1, w + 0.01), ahead)
    const dx = ahead.x - step.x
    const dz = ahead.z - step.z
    if (u > 0 && u < 1) step.y += 0.025 * Math.abs(Math.sin(w * Math.PI * 9))
    o.position.copy(step)
    if (u >= 1) o.rotation.y = faceAtEnd
    else if (dx * dx + dz * dz > 1e-8) o.rotation.y = Math.atan2(dx, dz)
  })
}
