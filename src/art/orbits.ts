/**
 * Orbits: the path math (pure functions) and the orbit line element.
 *
 * An orbit line is drawn as a few precomputed variants, and the visible variant
 * changes on each boil step. Clean outer orbits have variants that differ only
 * by a small hand jitter, so the path looks like it repeats. Inner orbits get a
 * large `wobble`, so every step shows a different path: the drawing itself says
 * "this one does not repeat".
 */
import { Color, Group, Vector3, type ColorRepresentation } from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { artUniforms, onArtFrame, onBoil } from './clock'
import { palette } from './palette'

export type Vec3 = readonly [number, number, number]

export interface OrbitSpec {
  center?: Vec3
  radius: number
  /** Tilt around the X axis, in radians. 0 lies flat on the XZ plane. */
  tilt?: number
  /** Z scale of the ellipse. 1 is a circle. */
  squash?: number
}

/** A point on the orbit at an angle (radians). Pure. */
export function orbitPoint(spec: OrbitSpec, angle: number, out = new Vector3()): Vector3 {
  const [cx, cy, cz] = spec.center ?? [0, 0, 0]
  const tilt = spec.tilt ?? 0
  const x = Math.cos(angle) * spec.radius
  const z = Math.sin(angle) * spec.radius * (spec.squash ?? 1)
  const y = -z * Math.sin(tilt)
  return out.set(cx + x, cy + y, cz + z * Math.cos(tilt))
}

/** Quadratic arc from a to b that lifts by `height` in the middle. Pure. */
export function arcPoint(a: Vector3, b: Vector3, height: number, t: number, out = new Vector3()): Vector3 {
  const u = 1 - t
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2 + height
  const mz = (a.z + b.z) / 2
  return out.set(u * u * a.x + 2 * u * t * mx + t * t * b.x, u * u * a.y + 2 * u * t * my + t * t * b.y, u * u * a.z + 2 * u * t * mz + t * t * b.z)
}

/** Smooth in and out, 0..1 to 0..1. */
export const easeInOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/** Stable pseudo-random value for integer inputs, 0..1. */
function hash(a: number, b: number): number {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** Radius change for a wobbly orbit, deterministic per variant. Returns about -1..1. */
function wobbleAt(angle: number, variant: number): number {
  let v = 0
  for (let k = 2; k <= 5; k++) v += Math.sin(k * angle + hash(variant, k) * Math.PI * 2) / k
  return v / 1.28
}

export interface OrbitLineOptions {
  spec: OrbitSpec
  /** Share of the radius the path wanders. 0 for a clean orbit, about 0.12 near the core. */
  wobble?: number
  color?: ColorRepresentation
  /** Width in pixels of a 1080 px tall frame. */
  width?: number
  dashed?: boolean
  variants?: number
  segments?: number
  opacity?: number
}

export interface OrbitLine {
  object: Group
  /** Shared by every variant. Tween `material.opacity` to fade the orbit. */
  material: LineMaterial
  /** 0..1: how much of the ring is drawn. Tween `reveal.value` to draw it on. */
  reveal: { value: number }
  dispose(): void
}

export function createOrbitLine(options: OrbitLineOptions): OrbitLine {
  const { spec, wobble = 0, color = palette.outline, width = 2.5, dashed = false, variants = 3, segments = 160, opacity = 1 } = options
  const object = new Group()
  object.name = 'orbit'
  const material = new LineMaterial({
    color: new Color(color).getHex(),
    linewidth: width,
    worldUnits: false,
    dashed,
    dashSize: 0.18,
    gapSize: 0.12,
    transparent: true,
    opacity,
    toneMapped: false,
  })
  // Share the resolution uniform with every other art material.
  material.uniforms.resolution = artUniforms.uResolution

  const lines: Line2[] = []
  const p = new Vector3()
  for (let v = 0; v < variants; v++) {
    const positions: number[] = []
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2
      // A small hand jitter for every orbit, plus the wobble for inner ones.
      const jitter = (hash(v * 31 + i, 7) - 0.5) * 0.008
      const r = spec.radius * (1 + wobble * wobbleAt(a, v) + jitter)
      orbitPoint({ ...spec, radius: r }, a, p)
      positions.push(p.x, p.y, p.z)
    }
    const geometry = new LineGeometry()
    geometry.setPositions(positions)
    const line = new Line2(geometry, material)
    if (dashed) line.computeLineDistances()
    line.visible = v === 0
    lines.push(line)
    object.add(line)
  }

  const offBoil = onBoil((step) => {
    lines.forEach((l, i) => (l.visible = i === step % lines.length))
  })
  const reveal = { value: 1 }
  let lastCount = -1
  const offFrame = onArtFrame(() => {
    material.linewidth = width * (artUniforms.uResolution.value.y / 1080)
    const count = Math.round(Math.min(1, Math.max(0, reveal.value)) * segments)
    if (count === lastCount) return
    lastCount = count
    for (const l of lines) l.geometry.instanceCount = count
  })

  const orbit: OrbitLine = {
    object,
    material,
    reveal,
    dispose() {
      offBoil()
      offFrame()
      lines.forEach((l) => l.geometry.dispose())
      material.dispose()
    },
  }
  object.userData.orbit = orbit
  object.userData.dispose = orbit.dispose
  return orbit
}

/** The orbit line behind an actor object created with createOrbitLine. */
export function orbitOf(object: Group): OrbitLine {
  const o = object.userData.orbit as OrbitLine | undefined
  if (!o) throw new Error(`"${object.name}" is not an orbit line`)
  return o
}
