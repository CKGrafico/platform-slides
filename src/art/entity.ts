/**
 * Entities: an abstract form, built as an aggregate of many small polyhedra
 * sampled into one point cloud (docs/art/elements.md).
 *
 * Units hold together by proximity, never by fusion, so an entity can split
 * apart and rejoin. The accent marks a few units. Nothing here is a perfect
 * sphere and nothing is a plain sharp cube on its own.
 */
import {
  BoxGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Euler,
  IcosahedronGeometry,
  Matrix4,
  OctahedronGeometry,
  Quaternion,
  TetrahedronGeometry,
  Vector3,
  type BufferGeometry,
  type Points,
  type ShaderMaterial,
} from 'three'
import { palette } from './palette'
import { buildPointCloud, createPointMaterial, type PointPart } from './points'

export interface EntityOptions {
  /** The same seed builds the same entity. */
  seed?: number
  /** How many units make the body. */
  units?: number
  /** How wide the body is. */
  radius?: number
  /** Base points sampled on each unit. */
  pointsPerUnit?: number
  /** How many units carry the accent. */
  accentUnits?: number
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

const UNIT_KIT: Array<() => BufferGeometry> = [
  () => new DodecahedronGeometry(1, 0),
  () => new OctahedronGeometry(1, 0),
  () => new IcosahedronGeometry(1, 0),
  () => new TetrahedronGeometry(1, 0),
  () => new BoxGeometry(1.15, 1.15, 1.15),
  () => new CylinderGeometry(0.72, 0.72, 1.5, 6, 1),
]

/**
 * A body of `units` polyhedra packed into a cluster and sampled into one point
 * cloud. Flat-faced, matte, no fusion. The accent marks a few units.
 */
export function createEntity(options: EntityOptions = {}): Entity {
  const seed = options.seed ?? 1
  const count = options.units ?? 24
  const radius = options.radius ?? 3
  const perUnit = options.pointsPerUnit ?? 460
  const accentUnits = options.accentUnits ?? 3
  const r = rng(seed)

  const order = Array.from({ length: count }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  const accent = new Set(order.slice(0, accentUnits))

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
    position.set(Math.sin(polar) * Math.cos(azimuth) * rad, Math.cos(polar) * rad * 0.82, Math.sin(polar) * Math.sin(azimuth) * rad)
    euler.set(r() * Math.PI, r() * Math.PI, r() * Math.PI)
    quat.setFromEuler(euler)
    const size = 0.5 + r() * 0.95
    scale.set(size, size, size)
    matrix.compose(position, quat, scale)
    const geometry = UNIT_KIT[Math.floor(r() * UNIT_KIT.length)]!()
    parts.push({
      geometry,
      matrix: matrix.clone(),
      color: accent.has(i) ? palette.accent : r() > 0.45 ? palette.ink : palette.dust,
      count: Math.round(perUnit * size),
    })
  }

  const material = createPointMaterial({
    pixelRatio: Math.min(2, window.devicePixelRatio || 1),
    size: options.pointSize ?? 2.6,
  })
  const object = buildPointCloud(parts, material, seed + 1)
  return { object, material }
}
