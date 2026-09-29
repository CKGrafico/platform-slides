/**
 * Sketch lines: every line in the talk that is not an orbit ring. Paths a ball
 * takes, the timeline arc, dashed slots, the Harness frame, the disc grid, a
 * hollow column.
 *
 * Like orbits, a line is drawn as a few precomputed variants, and the visible
 * variant changes on each boil step. `wobble` makes the variants differ, so a
 * path that does not repeat looks like it does not repeat.
 *
 * `reveal` (0..1) draws the line from its start: tween `line.reveal.value` to
 * draw a path as a ball travels it. `material.opacity` fades it.
 */
import { Color, Group, Vector3, type ColorRepresentation } from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { artUniforms, onArtFrame, onBoil } from './clock'
import { palette } from './palette'

/** A path: u from 0 to 1 gives a point. Must be pure. */
export type PathFn = (u: number, out: Vector3) => Vector3

export interface SketchLine {
  object: Group
  material: LineMaterial
  /** 0..1: how much of the line is drawn, from its start. */
  reveal: { value: number }
  /** The clean path (no hand jitter), for balls that travel it. */
  point: PathFn
  dispose(): void
}

export interface SketchOptions {
  path: PathFn
  segments?: number
  /** Share of a unit the drawn path wanders, per variant. 0 is clean. */
  wobble?: number
  color?: ColorRepresentation
  /** Width in pixels of a 1080 px tall frame. */
  width?: number
  dashed?: boolean
  dashSize?: number
  gapSize?: number
  variants?: number
  opacity?: number
  reveal?: number
}

function hash(a: number, b: number): number {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function lineMaterial(color: ColorRepresentation, width: number, dashed: boolean, dashSize: number, gapSize: number, opacity: number): LineMaterial {
  const material = new LineMaterial({
    color: new Color(color).getHex(),
    linewidth: width,
    worldUnits: false,
    dashed,
    dashSize,
    gapSize,
    transparent: true,
    opacity,
    toneMapped: false,
  })
  material.uniforms.resolution = artUniforms.uResolution
  return material
}

/** A drawn path with boil variants. */
export function createSketchLine(options: SketchOptions): SketchLine {
  const {
    path,
    segments = 120,
    wobble = 0,
    color = palette.outline,
    width = 2.5,
    dashed = false,
    dashSize = 0.16,
    gapSize = 0.12,
    variants = 3,
    opacity = 1,
    reveal: initialReveal = 1,
  } = options
  const object = new Group()
  object.name = 'sketch'
  const material = lineMaterial(color, width, dashed, dashSize, gapSize, opacity)
  const reveal = { value: initialReveal }
  const lines: Line2[] = []
  const p = new Vector3()
  const q = new Vector3()
  for (let v = 0; v < variants; v++) {
    const positions: number[] = []
    for (let i = 0; i <= segments; i++) {
      const u = i / segments
      path(u, p)
      // The wobble grows away from the ends, so a path always starts and ends where it must.
      const envelope = Math.sin(Math.PI * u)
      const w = wobble * envelope
      const jitter = 0.006
      q.set(
        Math.sin(u * 9.1 + hash(v, 1) * 6.28) * w + (hash(v * 31 + i, 3) - 0.5) * jitter,
        Math.sin(u * 7.3 + hash(v, 2) * 6.28) * w + (hash(v * 31 + i, 5) - 0.5) * jitter,
        Math.sin(u * 5.7 + hash(v, 4) * 6.28) * w * 0.6,
      )
      positions.push(p.x + q.x, p.y + q.y, p.z + q.z)
    }
    const geometry = new LineGeometry()
    geometry.setPositions(positions)
    const line = new Line2(geometry, material)
    if (dashed) line.computeLineDistances()
    line.visible = v === 0
    line.frustumCulled = false
    lines.push(line)
    object.add(line)
  }
  let lastCount = -1
  const offBoil = onBoil((step) => lines.forEach((l, i) => (l.visible = i === step % lines.length)))
  const offFrame = onArtFrame(() => {
    material.linewidth = width * (artUniforms.uResolution.value.y / 1080)
    const count = Math.round(Math.min(1, Math.max(0, reveal.value)) * segments)
    if (count === lastCount) return
    lastCount = count
    for (const l of lines) l.geometry.instanceCount = count
  })
  const line: SketchLine = {
    object,
    material,
    reveal,
    point: path,
    dispose() {
      offBoil()
      offFrame()
      lines.forEach((l) => l.geometry.dispose())
      material.dispose()
    },
  }
  object.userData.sketch = line
  object.userData.dispose = line.dispose
  return line
}

/** The sketch line behind an actor made with createSketchLine or a helper below. */
export function sketchOf(object: Group): SketchLine {
  const s = object.userData.sketch as SketchLine | undefined
  if (!s) throw new Error(`"${object.name}" is not a sketch line`)
  return s
}

// ---- path helpers (pure) --------------------------------------------------------------

type V3 = readonly [number, number, number]

/** A straight segment. */
export const straight = (a: V3, b: V3): PathFn => (u, out) => out.set(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u)

/** A smooth path through points (Catmull-Rom, centripetal enough for our use). */
export function through(points: V3[]): PathFn {
  const n = points.length - 1
  return (u, out) => {
    const f = Math.min(0.999999, Math.max(0, u)) * n
    const i = Math.floor(f)
    const t = f - i
    const p0 = points[Math.max(0, i - 1)]!
    const p1 = points[i]!
    const p2 = points[Math.min(n, i + 1)]!
    const p3 = points[Math.min(n, i + 2)]!
    const c = (a: number, b: number, cc: number, d: number) =>
      0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t * t + (-a + 3 * b - 3 * cc + d) * t * t * t)
    return out.set(c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1]), c(p0[2], p1[2], p2[2], p3[2]))
  }
}

/** A circle facing the camera plane (XY), for slots and small marks. */
export const circleXY = (center: V3, radius: number): PathFn => (u, out) =>
  out.set(center[0] + Math.cos(u * Math.PI * 2) * radius, center[1] + Math.sin(u * Math.PI * 2) * radius, center[2])

/** A circle lying flat (XZ), for circles on the ground. */
export const circleXZ = (center: V3, radius: number): PathFn => (u, out) =>
  out.set(center[0] + Math.cos(u * Math.PI * 2) * radius, center[1], center[2] + Math.sin(u * Math.PI * 2) * radius)

// ---- elements made of lines --------------------------------------------------------------

/** An empty place waiting for something: a dashed circle facing the camera. */
export function createSlot(options: { radius?: number; width?: number; color?: ColorRepresentation; opacity?: number } = {}): SketchLine {
  const { radius = 0.3, width = 2.5, color = palette.outline, opacity = 1 } = options
  return createSketchLine({ path: circleXY([0, 0, 0], radius), segments: 64, dashed: true, dashSize: radius * 0.28, gapSize: radius * 0.2, width, color, opacity })
}

/** A metric that is not collected: the dashed outline of a column, facing the camera. Base at y = 0. */
export function createHollowColumn(options: { radius?: number; height?: number; width?: number } = {}): SketchLine {
  const { radius = 0.22, height = 1, width = 2.5 } = options
  const pts: V3[] = [
    [-radius, 0, 0],
    [-radius, height, 0],
    [radius, height, 0],
    [radius, 0, 0],
    [-radius, 0, 0],
  ]
  const lengths = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]))
  const total = lengths.reduce((a, b) => a + b, 0)
  const path: PathFn = (u, out) => {
    let d = Math.min(1, Math.max(0, u)) * total
    for (let i = 0; i < lengths.length; i++) {
      const len = lengths[i]!
      if (d <= len || i === lengths.length - 1) {
        const t = len > 0 ? Math.min(1, d / len) : 0
        const a = pts[i]!, b = pts[i + 1]!
        return out.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0)
      }
      d -= len
    }
    return out.set(pts[0]![0], pts[0]![1], 0)
  }
  return createSketchLine({ path, segments: 80, dashed: true, dashSize: 0.1, gapSize: 0.07, width })
}

export interface SketchSegments {
  object: Group
  material: LineMaterial
  dispose(): void
}

function createSegments(build: (variant: number) => number[], options: { color?: ColorRepresentation; width?: number; opacity?: number; variants?: number } = {}): SketchSegments {
  const { color = palette.outline, width = 2, opacity = 1, variants = 3 } = options
  const object = new Group()
  object.name = 'segments'
  const material = lineMaterial(color, width, false, 0.1, 0.1, opacity)
  const lines: LineSegments2[] = []
  for (let v = 0; v < variants; v++) {
    const geometry = new LineSegmentsGeometry()
    geometry.setPositions(build(v))
    const l = new LineSegments2(geometry, material)
    l.visible = v === 0
    l.frustumCulled = false
    lines.push(l)
    object.add(l)
  }
  const offBoil = onBoil((step) => lines.forEach((l, i) => (l.visible = i === step % lines.length)))
  const offFrame = onArtFrame(() => {
    material.linewidth = width * (artUniforms.uResolution.value.y / 1080)
  })
  const seg: SketchSegments = {
    object,
    material,
    dispose() {
      offBoil()
      offFrame()
      lines.forEach((l) => l.geometry.dispose())
      material.dispose()
    },
  }
  object.userData.segments = seg
  object.userData.dispose = seg.dispose
  return seg
}

/** The line element behind an actor made with createFrame or createGrid. */
export function segmentsOf(object: Group): SketchSegments {
  const s = object.userData.segments as SketchSegments | undefined
  if (!s) throw new Error(`"${object.name}" is not a segments element`)
  return s
}

/**
 * The Harness: a cage of lines around the core, the edges of a geodesic
 * sphere. Scale the object to tighten it.
 */
export function createFrame(options: { radius?: number; color?: ColorRepresentation; width?: number; opacity?: number } = {}): SketchSegments {
  const { radius = 1.5, ...rest } = options
  // Icosahedron, one subdivision, pushed to the sphere.
  const t = (1 + Math.sqrt(5)) / 2
  let verts: number[][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ]
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]
  const norm = (v: number[]) => {
    const l = Math.hypot(v[0]!, v[1]!, v[2]!)
    return [v[0]! / l, v[1]! / l, v[2]! / l]
  }
  verts = verts.map(norm)
  const cache = new Map<string, number>()
  const mid = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    const hit = cache.get(key)
    if (hit !== undefined) return hit
    const va = verts[a]!, vb = verts[b]!
    verts.push(norm([(va[0]! + vb[0]!) / 2, (va[1]! + vb[1]!) / 2, (va[2]! + vb[2]!) / 2]))
    cache.set(key, verts.length - 1)
    return verts.length - 1
  }
  faces = faces.flatMap(([a, b, c]) => {
    const ab = mid(a!, b!), bc = mid(b!, c!), ca = mid(c!, a!)
    return [[a!, ab, ca], [b!, bc, ab], [c!, ca, bc], [ab, bc, ca]]
  })
  const edges = new Set<string>()
  for (const [a, b, c] of faces) {
    for (const [x, y] of [[a!, b!], [b!, c!], [c!, a!]] as const) edges.add(x < y ? `${x}-${y}` : `${y}-${x}`)
  }
  const pairs = [...edges].map((e) => e.split('-').map(Number) as [number, number])
  return createSegments((variant) => {
    const out: number[] = []
    for (const [a, b] of pairs) {
      for (const i of [a, b]) {
        const v = verts[i]!
        const j = 1 + (hash(i * 7 + variant * 131, 9) - 0.5) * 0.035
        out.push(v[0]! * radius * j, v[1]! * radius * j, v[2]! * radius * j)
      }
    }
    return out
  }, { width: 2, ...rest })
}

/** A faint square grid lying flat (XZ), clipped to a circle. For the disc. */
export function createGrid(options: { radius?: number; step?: number; color?: ColorRepresentation; width?: number; opacity?: number } = {}): SketchSegments {
  const { radius = 7, step = 0.9, ...rest } = options
  return createSegments((variant) => {
    const out: number[] = []
    const n = Math.floor(radius / step)
    for (let k = -n; k <= n; k++) {
      const c = k * step
      const half = Math.sqrt(Math.max(0, radius * radius - c * c)) * 0.97
      const j = (hash(k * 13 + variant * 71, 2) - 0.5) * 0.02
      out.push(c + j, 0, -half, c - j, 0, half)
      out.push(-half, 0, c + j, half, 0, c - j)
    }
    return out
  }, { width: 1.5, opacity: 0.22, ...rest })
}
