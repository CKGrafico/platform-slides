/**
 * The walls of the town: rings of stone around the hall, like the concentric
 * walls of a fortified city. Each ring is built as arcs, so a wall can rise
 * around the town piece by piece. An arc is one revolved band of stone with
 * merlons along its top, towers with hoardings and tiled roofs where the
 * layout asks, and gaps where a gate stands. An arch is the small gate of an
 * inner ring over a road.
 */
import { LatheGeometry, Vector2, type BufferGeometry } from 'three'
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
  /** Angles the wall leaves open: a gate stands in each. */
  gaps?: Gap[]
}

/** The stretches of an arc that are not gaps, in order: the band is revolved over each one, so a gap is open from the ground up. */
function stretches(from: number, to: number, gaps: Gap[]): Gap[] {
  const out: Gap[] = []
  let a = from
  for (const [g0, g1] of [...gaps].sort((p, q) => p[0] - q[0])) {
    if (g1 <= a || g0 >= to) continue
    if (g0 > a) out.push([a, g0])
    a = Math.max(a, g1)
  }
  if (a < to) out.push([a, to])
  return out
}

/** A band of wall between two angles, revolved round the origin: the two faces and the top, reaching 0.4 below the ground for a slope. */
function bandGeometry(radius: number, thickness: number, height: number, from: number, to: number): BufferGeometry {
  const ri = radius - thickness / 2
  const ro = radius + thickness / 2
  const profile = [new Vector2(ri, -0.4), new Vector2(ro, -0.4), new Vector2(ro, height), new Vector2(ri, height), new Vector2(ri, -0.4)]
  const segments = Math.max(2, Math.ceil(((to - from) * radius) / 0.5))
  // The lathe measures its angle from +Z toward +X; the layout measures from +X toward +Z.
  const lathe = new LatheGeometry(profile, segments, Math.PI / 2 - to, to - from)
  // Flat faces, like the boxes of the kit, so the toon bands read.
  const flat = lathe.toNonIndexed()
  lathe.dispose()
  flat.computeVertexNormals()
  return flat
}

/**
 * A ring wall between two angles: one band of stone with merlons along its
 * outer edge, closed at its ends, and square towers with hoardings and tiled
 * roofs where the layout asks. Its center is the origin.
 */
export function createWallArc(options: WallArcOptions) {
  const { radius, from, to, height = 2.2, thickness = 1.2, merlon = 0.36, merlonEvery = 1.0, towers = [], gaps = [] } = options
  const stone: BufferGeometry[] = []
  const p = new Parts()
  for (const [s0, s1] of stretches(from, to, gaps)) {
    stone.push(bandGeometry(radius, thickness, height, s0, s1))
    // The ends of the band, so a gap or an arc's end shows stone, not the hollow.
    for (const a of [s0, s1]) stone.push(boxAt(thickness, height + 0.4, 0.12, Math.cos(a) * radius, height / 2 - 0.2, Math.sin(a) * radius, { y: -a }))
    // Merlons along the outer edge.
    const merlons = Math.max(1, Math.round(((s1 - s0) * radius) / merlonEvery))
    for (let k = 0; k < merlons; k++) {
      const am = s0 + ((k + 0.5) / merlons) * (s1 - s0)
      const r = radius + thickness / 2 - merlon / 2 - 0.02
      stone.push(boxAt(merlon, merlon, merlon, Math.cos(am) * r, height + merlon / 2, Math.sin(am) * r, { y: -am }))
    }
  }
  for (const a of towers) {
    const x = Math.cos(a) * radius
    const z = Math.sin(a) * radius
    const tw = thickness + 0.8
    const th = height + 1.3
    stone.push(boxAt(tw, th + 0.4, tw, x, th / 2 - 0.2, z, { y: -a }))
    p.timber.push(boxAt(tw + 0.3, 0.22, tw + 0.3, x, th - 0.11, z, { y: -a }))
    const roof = hipRoofGeometry(tw + 0.5, tw + 0.5, 0.7, 0)
    roof.rotateY(-a)
    roof.translate(x, th, z)
    p.tiles.push(roof)
  }
  const el = building('wall', merge(stone), town.stone, stoneTexture())
  p.attachTo(el, town.stone, town.tileDark)
  return el
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
