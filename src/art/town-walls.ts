/**
 * The walls of the town: rings of stone around the hall, like the concentric
 * walls of a fortified city. Each ring is built as arcs, so a wall can rise
 * around the town piece by piece. An arc has merlons along its top, towers
 * with hoardings and tiled roofs where the layout asks, and gaps where a gate
 * or a tower of its own stands. An arch is the small gate of an inner ring
 * over a road.
 */
import type { BufferGeometry } from 'three'
import { addDoor, boxAt, building, hipRoofGeometry, merge, Parts, stoneTexture, town } from './town'

/** A range of angles (radians) the wall leaves open. */
export type Gap = readonly [number, number]

export interface WallArcOptions {
  radius: number
  /** The arc, from one angle to the other (radians, counter clockwise seen from above with +Z toward the camera). */
  from: number
  to: number
  height?: number
  thickness?: number
  /** The size of a merlon along the top, and how far apart they stand. */
  merlon?: number
  merlonEvery?: number
  /** Angles where a tower stands on the wall. */
  towers?: number[]
  /** Angles the wall leaves open: gates, and towers that are elements of their own. */
  gaps?: Gap[]
}

const inGap = (a: number, gaps: Gap[]) => gaps.some(([g0, g1]) => a >= g0 && a <= g1)

/** A ring wall between two angles: blocks of stone with merlons, and towers. Its center is the origin. */
export function createWallArc(options: WallArcOptions) {
  const { radius, from, to, height = 1.05, thickness = 0.5, merlon = 0.2, merlonEvery = 0.6, towers = [], gaps = [] } = options
  const stone: BufferGeometry[] = []
  const p = new Parts()
  const length = (to - from) * radius
  const blocks = Math.max(1, Math.round(length / 1.2))
  const step = (to - from) / blocks
  const chord = radius * step
  for (let i = 0; i < blocks; i++) {
    const a = from + (i + 0.5) * step
    if (inGap(a, gaps)) continue
    const x = Math.cos(a) * radius
    const z = Math.sin(a) * radius
    // A block along the tangent: turned so its length follows the ring.
    stone.push(boxAt(chord + 0.06, height, thickness, x, height / 2, z, { y: -a }))
    // Merlons along the outer edge.
    const merlons = Math.max(2, Math.round(chord / merlonEvery))
    for (let k = 0; k < merlons; k++) {
      const t = (k + 0.5) / merlons - 0.5
      const am = a + t * step
      const r = radius + thickness / 2 - merlon / 2 - 0.02
      stone.push(boxAt(merlon, merlon, merlon, Math.cos(am) * r, height + merlon / 2, Math.sin(am) * r, { y: -am }))
    }
  }
  for (const a of towers) {
    const x = Math.cos(a) * radius
    const z = Math.sin(a) * radius
    const tw = thickness + 0.5
    const th = height + 0.85
    stone.push(boxAt(tw, th, tw, x, th / 2, z, { y: -a }))
    p.timber.push(boxAt(tw + 0.24, 0.16, tw + 0.24, x, th - 0.1, z, { y: -a }))
    const roof = hipRoofGeometry(tw + 0.36, tw + 0.36, 0.5, 0)
    roof.rotateY(-a)
    roof.translate(x, th, z)
    p.tiles.push(roof)
  }
  const el = building('wall', merge(stone), town.stone, stoneTexture())
  p.attachTo(el, town.stone, town.tileDark)
  return el
}

/**
 * A low ring wall between two angles: a kerb of stone with small merlons, no
 * towers. A maturity level in part 4; the footing a ring wall rises on in
 * part 11.
 */
export function createLowWall(options: Pick<WallArcOptions, 'radius' | 'from' | 'to' | 'gaps'>) {
  return createWallArc({ ...options, height: 0.34, thickness: 0.3, merlon: 0.11, merlonEvery: 0.4 })
}

/**
 * An arch over a road that runs along X: two stone jambs, a lintel with
 * merlons and a stub of wall on each side. The small gate of an inner ring.
 * Its front faces -X.
 */
export function createArch(options: { span?: number } = {}) {
  const { span = 1.6 } = options
  const jw = 0.45
  const zj = span / 2 + jw / 2
  const stone: BufferGeometry[] = []
  for (const z of [-zj, zj]) stone.push(boxAt(0.45, 1.15, jw, 0, 0.575, z))
  stone.push(boxAt(0.45, 0.35, span + jw * 2, 0, 1.325, 0))
  const merlons = Math.round((span + jw * 2) / 0.45)
  for (let k = 0; k < merlons; k++) {
    const z = -(span + jw * 2) / 2 + ((k + 0.5) * (span + jw * 2)) / merlons
    for (const x of [-0.14, 0.14]) stone.push(boxAt(0.14, 0.14, 0.14, x, 1.57, z))
  }
  for (const s of [-1, 1]) stone.push(boxAt(0.36, 0.75, 0.9, 0, 0.375, s * (zj + jw / 2 + 0.45)))
  const el = building('arch', merge(stone), town.stone, stoneTexture())
  const p = new Parts()
  p.dark.push(boxAt(0.03, 0.2, 0.08, -0.24, 0.85, -zj), boxAt(0.03, 0.2, 0.08, -0.24, 0.85, zj))
  p.attachTo(el, town.stone)
  return el
}

/** A small corner tower on its own, for the ends of a wall. */
export function createTurret() {
  const body = boxAt(0.8, 1.6, 0.8, 0, 0.8, 0)
  const el = building('turret', body, town.stone, stoneTexture())
  const p = new Parts()
  p.timber.push(boxAt(1.1, 0.3, 1.1, 0, 1.75, 0))
  const roof = hipRoofGeometry(1.3, 1.3, 0.45, 0)
  roof.translate(0, 1.9, 0)
  p.tiles.push(roof)
  addDoor(p, 0, 0, 0.4, 0.26, 0.42)
  p.attachTo(el, town.stone, town.tileDark)
  return el
}
