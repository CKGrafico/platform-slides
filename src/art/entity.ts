/**
 * Entities: an abstract body, built as an aggregate of many rounded, faceted
 * polyhedra sampled into one beaded point cloud (docs/art/elements.md).
 *
 * Monochrome, one accent. Nothing is a cube and nothing is a smooth sphere:
 * the units are low-poly rounded forms, held together by proximity, so a body
 * can split and rejoin. A flow is the same units in a loose stream.
 */
import {
  DodecahedronGeometry,
  Euler,
  IcosahedronGeometry,
  Matrix4,
  OctahedronGeometry,
  Quaternion,
  Vector3,
  type BufferGeometry,
  type Points,
  type ShaderMaterial,
} from 'three'
import { palette } from './palette'
import { buildPointCloud, createPointMaterial, type PointPart } from './points'

type V3 = readonly [number, number, number]

export interface EntityOptions {
  /** The same seed builds the same entity. */
  seed?: number
  /** How many units make the body. */
  units?: number
  /** How wide the body is. */
  radius?: number
  /** Distance between beads, in world units. The same on every unit, so big units get more beads. */
  bead?: number
  /** How many units carry the accent. */
  accentUnits?: number
  /** Point size in device pixels. */
  pointSize?: number
  /** Smallest and largest unit size. */
  sizeRange?: readonly [number, number]
}

export interface FlowOptions {
  seed?: number
  /** How many units make the stream. */
  units?: number
  from: V3
  to: V3
  /** How far the stream bends upward in the middle. */
  bend?: number
  /** Base size of a unit in the stream. */
  size?: number
  /** Distance between beads, in world units. */
  bead?: number
  /** Point size in device pixels. */
  pointSize?: number
}

export interface Entity {
  object: Points
  material: ShaderMaterial
}

function rng(seed: number): () => number {
  let s = (seed >>> 0) || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Rounded, faceted low-poly forms. No cubes, no smooth spheres. */
const UNIT_KIT: Array<() => BufferGeometry> = [
  () => new IcosahedronGeometry(1, 1),
  () => new DodecahedronGeometry(1, 0),
  () => new IcosahedronGeometry(1, 0),
  () => new OctahedronGeometry(1, 1),
]

function shuffle(count: number, r: () => number): number[] {
  const order = Array.from({ length: count }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return order
}

/**
 * A body of `units` rounded polyhedra packed into a cluster and sampled into
 * one point cloud. The accent marks a few units.
 */
export function createEntity(options: EntityOptions = {}): Entity {
  const seed = options.seed ?? 1
  const count = options.units ?? 14
  const radius = options.radius ?? 8
  const bead = options.bead ?? 0.34
  const [sizeMin, sizeMax] = options.sizeRange ?? [2.4, 5]
  const accentUnits = options.accentUnits ?? 3
  const r = rng(seed)
  const accent = new Set(shuffle(count, r).slice(0, accentUnits))

  const parts: PointPart[] = []
  const matrix = new Matrix4()
  const position = new Vector3()
  const quat = new Quaternion()
  const scale = new Vector3()
  const euler = new Euler()
  for (let i = 0; i < count; i++) {
    const azimuth = r() * Math.PI * 2
    const polar = Math.acos(2 * r() - 1)
    const rad = radius * Math.cbrt(r())
    position.set(Math.sin(polar) * Math.cos(azimuth) * rad, Math.cos(polar) * rad * 0.85, Math.sin(polar) * Math.sin(azimuth) * rad)
    euler.set(r() * Math.PI, r() * Math.PI, r() * Math.PI)
    quat.setFromEuler(euler)
    const size = sizeMin + r() * (sizeMax - sizeMin)
    scale.set(size, size, size)
    matrix.compose(position, quat, scale)
    parts.push({
      geometry: UNIT_KIT[Math.floor(r() * UNIT_KIT.length)]!(),
      matrix: matrix.clone(),
      color: accent.has(i) ? palette.accent : r() > 0.3 ? palette.ink : palette.dust,
      spacing: bead / size,
    })
  }

  const material = createPointMaterial({ pixelRatio: Math.min(2, window.devicePixelRatio || 1), size: options.pointSize ?? 3 })
  const object = buildPointCloud(parts, material, seed + 1)
  return { object, material }
}

/**
 * A stream: the same rounded units loose along a bent path, mostly accent, so
 * work reads as a flow that forms and disperses.
 */
export function createFlow(options: FlowOptions): Entity {
  const seed = options.seed ?? 1
  const count = options.units ?? 70
  const size = options.size ?? 1.1
  const bead = options.bead ?? 0.3
  const r = rng(seed)
  const [ax, ay, az] = options.from
  const [bx, by, bz] = options.to
  const cx = (ax + bx) / 2
  const cy = (ay + by) / 2 + (options.bend ?? 5)
  const cz = (az + bz) / 2

  const parts: PointPart[] = []
  const matrix = new Matrix4()
  const position = new Vector3()
  const quat = new Quaternion()
  const scale = new Vector3()
  const euler = new Euler()
  for (let i = 0; i < count; i++) {
    const w = i / Math.max(1, count - 1)
    const m = 1 - w
    const px = m * m * ax + 2 * m * w * cx + w * w * bx
    const py = m * m * ay + 2 * m * w * cy + w * w * by
    const pz = m * m * az + 2 * m * w * cz + w * w * bz
    const spread = 2.6 * (0.4 + w)
    position.set(px + (r() * 2 - 1) * spread, py + (r() * 2 - 1) * spread, pz + (r() * 2 - 1) * spread)
    euler.set(r() * Math.PI, r() * Math.PI, r() * Math.PI)
    quat.setFromEuler(euler)
    const s = size * (0.5 + r() * 1.3) * (1 - w * 0.3)
    scale.set(s, s, s)
    matrix.compose(position, quat, scale)
    parts.push({
      geometry: UNIT_KIT[Math.floor(r() * UNIT_KIT.length)]!(),
      matrix: matrix.clone(),
      color: r() > 0.4 ? palette.accent : palette.ink,
      spacing: bead / s,
    })
  }

  const material = createPointMaterial({ pixelRatio: Math.min(2, window.devicePixelRatio || 1), size: options.pointSize ?? 2.6 })
  const object = buildPointCloud(parts, material, seed + 1)
  return { object, material }
}
