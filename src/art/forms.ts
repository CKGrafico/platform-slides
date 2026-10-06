import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import { BufferAttribute, Euler, Matrix4, Mesh, Quaternion, Vector3, type Points, type ShaderMaterial } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { createAsciiDepthMaterial, createAsciiMaterial } from './ascii'
import { buildPointCloud, type PointPart } from './points'
import { palette } from './palette'

/** Machined units. Every shape has flat faces and chamfered edges. None is a sphere or a sharp cube. */
export type UnitShape = 'cell' | 'block' | 'prism' | 'slab' | 'beam' | 'tile' | 'hex' | 'cubocta'

/** A box with chamfered edges: each corner keeps one axis at full length and pulls the other two in. */
function chamfered(half: readonly [number, number, number], bevel: number) {
  const vertices: Vector3[] = []
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
    const sign = [x, y, z]
    for (let axis = 0; axis < 3; axis++) {
      vertices.push(new Vector3(...[0, 1, 2].map((k) => sign[k]! * (k === axis ? half[k]! : half[k]! - bevel)) as [number, number, number]))
    }
  }
  return new ConvexGeometry(vertices)
}

function unitGeometry(shape: UnitShape = 'cell') {
  switch (shape) {
    case 'block': return chamfered([0.86, 0.86, 0.86], 0.24)
    case 'prism': return chamfered([0.72, 1.35, 0.72], 0.24)
    case 'slab': return chamfered([1.0, 0.35, 0.85], 0.16)
    case 'beam': return chamfered([1.9, 0.42, 0.6], 0.16)
    case 'tile': return chamfered([1.0, 0.16, 1.0], 0.1)
    case 'hex': {
      const vertices: Vector3[] = []
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3
        for (const s of [-1, 1]) {
          vertices.push(new Vector3(Math.cos(a) * 0.8, s * 0.41, Math.sin(a) * 0.8))
          vertices.push(new Vector3(Math.cos(a) * 0.66, s * 0.55, Math.sin(a) * 0.66))
        }
      }
      return new ConvexGeometry(vertices)
    }
    case 'cubocta': {
      const vertices: Vector3[] = []
      for (let zero = 0; zero < 3; zero++) for (const a of [-1, 1]) for (const b of [-1, 1]) {
        const xyz = [0, 0, 0]
        xyz[(zero + 1) % 3] = a
        xyz[(zero + 2) % 3] = b
        vertices.push(new Vector3(...xyz as [number, number, number]).multiplyScalar(0.95 / Math.SQRT2))
      }
      return new ConvexGeometry(vertices)
    }
    case 'cell': {
      const vertices: Vector3[] = []
      for (let zero = 0; zero < 3; zero++) for (const swap of [false, true]) for (const a of [-1, 1]) for (const b of [-1, 1]) {
        const xyz = [0, 0, 0]
        xyz[(zero + 1) % 3] = a * (swap ? 2 : 1)
        xyz[(zero + 2) % 3] = b * (swap ? 1 : 2)
        vertices.push(new Vector3(...xyz as [number, number, number]).multiplyScalar(1 / Math.sqrt(5)))
      }
      return new ConvexGeometry(vertices)
    }
  }
}

/** Circumradius of each shape at size 1. Used to keep units apart. */
const RADIUS: Record<UnitShape, number> = { cell: 1.0, block: 1.23, prism: 1.41, slab: 1.23, beam: 1.97, tile: 1.35, hex: 0.9, cubocta: 0.95 }

/** The fixed camera looks along CAMERA. RIGHT and UP span the screen. See src/show/shots.ts. */
const CAMERA = [0.593, 0.548, 0.593] as const
export const RIGHT = [0.707, 0, -0.707] as const
export const UP = [-0.387, 0.839, -0.387] as const

export interface FormUnit {
  at: readonly [number, number, number]
  size: number
  rotation?: readonly [number, number, number]
  shape?: UnitShape
}

export interface FormOptions {
  /** The unit that holds the Issue. By default, the unit nearest the camera. */
  work?: number
  /** False skips the depth surface. Streams do not occlude. */
  depth?: boolean
  /** How far fluid units drift, in world units. */
  drift?: number
  /** Up to two other builds, each with one box per unit. The poses `morph` and `morph2` move each unit from `at` into its box. */
  morph?: MorphBox[][]
}

/** A box with half sizes `half`, centred at `at`, along the axes of `basis`. */
export interface MorphBox {
  at: readonly [number, number, number]
  half: readonly [number, number, number]
  basis: Matrix4
}

const halves = new Map<UnitShape, Vector3>()

function ownHalf(shape: UnitShape = 'cell'): Vector3 {
  let own = halves.get(shape)
  if (!own) {
    const geometry = unitGeometry(shape)
    geometry.computeBoundingBox()
    own = geometry.boundingBox!.getSize(new Vector3()).multiplyScalar(0.5)
    geometry.dispose()
    halves.set(shape, own)
  }
  return own
}

/**
 * Moves a point of a unit, in the unit's own space, onto the surface of a box.
 * Every shape becomes a clean flat-faced block, so the second build reads as plates and keys.
 * With `normal`, it also writes the outward normal of the face the point lands on.
 */
function toBox(point: Vector3, shape: UnitShape | undefined, box: MorphBox, normal?: Vector3): Vector3 {
  const own = ownHalf(shape)
  const q = [point.x / own.x, point.y / own.y, point.z / own.z]
  const reach = Math.max(Math.abs(q[0]!), Math.abs(q[1]!), Math.abs(q[2]!), 1e-6)
  const axis = q.findIndex((n) => Math.abs(n) === reach)
  if (normal) normal.set(0, 0, 0).setComponent(axis, Math.sign(q[axis]!)).transformDirection(box.basis)
  return point.set(q[0]! / reach * box.half[0], q[1]! / reach * box.half[1], q[2]! / reach * box.half[2]).applyMatrix4(box.basis).add(new Vector3(...box.at))
}

/** The unit whose center faces the camera most. */
export function frontIndex(units: FormUnit[]): number {
  let best = 0
  let score = -Infinity
  units.forEach((unit, i) => {
    const s = unit.at[0] * CAMERA[0] + unit.at[1] * CAMERA[1] + unit.at[2] * CAMERA[2]
    if (s > score + 1e-6) { score = s; best = i }
  })
  return best
}

/**
 * Units on the camera side of a body, spread apart on screen: each pick is the visible unit farthest
 * from the ones already chosen, starting from `from`. `skip` units are never picked.
 */
export function spreadUnits(units: FormUnit[], count: number, from: number, skip: number[] = []): number[] {
  const depth = (unit: FormUnit) => unit.at[0] * CAMERA[0] + unit.at[1] * CAMERA[1] + unit.at[2] * CAMERA[2]
  const screen = (unit: FormUnit) => [RIGHT, UP].map((axis) => axis[0] * unit.at[0] + axis[1] * unit.at[1] + axis[2] * unit.at[2])
  const depths = units.map(depth).sort((a, b) => a - b)
  const median = depths[Math.floor(depths.length / 2)]!
  const visible = units.map((_, i) => i).filter((i) => i !== from && !skip.includes(i) && depth(units[i]!) >= median)
  const chosen = [from]
  const gap = (i: number) => Math.min(...chosen.map((j) => {
    const [a, b] = [screen(units[i]!), screen(units[j]!)]
    return Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!)
  }))
  while (chosen.length <= count && visible.length) {
    visible.sort((a, b) => gap(b) - gap(a))
    chosen.push(visible.shift()!)
  }
  return chosen.slice(1)
}

/** Moves the units so the middle of their extent sits at the origin. Pictures place forms by their middle. */
function centered(units: FormUnit[]): FormUnit[] {
  const lo = [Infinity, Infinity, Infinity]
  const hi = [-Infinity, -Infinity, -Infinity]
  for (const unit of units) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k]!, unit.at[k]!); hi[k] = Math.max(hi[k]!, unit.at[k]!) }
  const mid = lo.map((n, k) => (n + hi[k]!) / 2)
  return units.map((unit) => ({ ...unit, at: [unit.at[0] - mid[0]!, unit.at[1] - mid[1]!, unit.at[2] - mid[2]!] as [number, number, number] }))
}

/** One draw call for an aggregate. Surface spacing is measured in world units. */
export function createForm(units: FormUnit[], seed: number, spacing = 0.34, glyphSize = 13, options: FormOptions = {}): Points {
  const parts: PointPart[] = units.map(({ at, size, rotation, shape }) => ({
    geometry: unitGeometry(shape),
    matrix: new Matrix4().compose(new Vector3(...at), new Quaternion().setFromEuler(new Euler(...(rotation ?? [0, 0, 0]))), new Vector3(size, size, size)),
    color: palette.ink,
    spacing: spacing / size,
  }))
  const material = createAsciiMaterial(glyphSize)
  const drift = options.drift ?? 0.12
  material.uniforms.uDrift!.value = drift
  const object = buildPointCloud(parts, material, seed)
  object.userData.units = units
  object.userData.formSeed = seed
  object.userData.workPart = options.work ?? frontIndex(units)
  object.userData.drift = drift
  const positions = object.geometry.getAttribute('position')
  const owners = object.geometry.getAttribute('aPart')
  const centers = new Float32Array(positions.count * 3)
  const phases = new Float32Array(positions.count)
  for (let i = 0; i < positions.count; i++) {
    const owner = owners.getX(i)
    centers.set(units[owner]!.at, i * 3)
    phases[i] = owner * 2.399 + seed * 0.17
  }
  object.geometry.setAttribute('aCenter', new BufferAttribute(centers, 3))
  object.geometry.setAttribute('aUnitPhase', new BufferAttribute(phases, 1))
  // aEdge is 0 at the middle of a face and 1 at an edge or corner of the same unit.
  // The shader assembles edges first, so a unit draws its outline before its faces.
  const radius = new Float32Array(positions.count)
  const nearest = new Map<number, number>()
  const farthest = new Map<number, number>()
  for (let i = 0; i < positions.count; i++) {
    const owner = owners.getX(i)
    const at = units[owner]!.at
    const r = Math.hypot(positions.getX(i) - at[0], positions.getY(i) - at[1], positions.getZ(i) - at[2])
    radius[i] = r
    nearest.set(owner, Math.min(nearest.get(owner) ?? Infinity, r))
    farthest.set(owner, Math.max(farthest.get(owner) ?? 0, r))
  }
  const edges = new Float32Array(positions.count)
  for (let i = 0; i < positions.count; i++) {
    const owner = owners.getX(i)
    const span = farthest.get(owner)! - nearest.get(owner)!
    edges[i] = span > 1e-6 ? (radius[i]! - nearest.get(owner)!) / span : 0
  }
  object.geometry.setAttribute('aEdge', new BufferAttribute(edges, 1))
  const builds = (options.morph ?? []).slice(0, 2)
  // Each mark keeps its place on its own unit: back to unit space, then out into the unit's box in each build.
  const inverse = parts.map((part) => part.matrix!.clone().invert())
  builds.forEach((build, b) => {
    const name = b === 0 ? 'aMorph' : 'aMorph2'
    const normal = new Vector3()
    const morphPositions = new Float32Array(positions.count * 3)
    const morphNormals = new Float32Array(positions.count * 3)
    const morphCenters = new Float32Array(positions.count * 3)
    const point = new Vector3()
    for (let i = 0; i < positions.count; i++) {
      const owner = owners.getX(i)
      toBox(point.fromBufferAttribute(positions, i).applyMatrix4(inverse[owner]!), units[owner]!.shape, build[owner]!, normal).toArray(morphPositions, i * 3)
      normal.toArray(morphNormals, i * 3)
      morphCenters.set(build[owner]!.at, i * 3)
    }
    object.geometry.setAttribute(name + 'Position', new BufferAttribute(morphPositions, 3))
    object.geometry.setAttribute(name + 'Normal', new BufferAttribute(morphNormals, 3))
    object.geometry.setAttribute(name + 'Center', new BufferAttribute(morphCenters, 3))
  })
  object.userData.morphCenters = builds.map((build) => build.map((box) => [...box.at]))
  if (options.depth === false) return object
  const faces = parts.map((part, owner) => {
    const geometry = part.geometry.clone().applyMatrix4(part.matrix!)
    const count = geometry.getAttribute('position').count
    const unitCenters = new Float32Array(count * 3)
    const unitPhases = new Float32Array(count)
    const unitOwners = new Float32Array(count).fill(owner)
    for (let i = 0; i < count; i++) {
      unitCenters.set(units[owner]!.at, i * 3)
      unitPhases[i] = owner * 2.399 + seed * 0.17
    }
    geometry.setAttribute('aCenter', new BufferAttribute(unitCenters, 3))
    geometry.setAttribute('aUnitPhase', new BufferAttribute(unitPhases, 1))
    geometry.setAttribute('aPart', new BufferAttribute(unitOwners, 1))
    builds.forEach((build, b) => {
      const name = b === 0 ? 'aMorph' : 'aMorph2'
      const source = part.geometry.getAttribute('position')
      const morphPositions = new Float32Array(count * 3)
      const morphCenters = new Float32Array(count * 3)
      const point = new Vector3()
      for (let i = 0; i < count; i++) {
        toBox(point.fromBufferAttribute(source, i), units[owner]!.shape, build[owner]!).toArray(morphPositions, i * 3)
        morphCenters.set(build[owner]!.at, i * 3)
      }
      geometry.setAttribute(name + 'Position', new BufferAttribute(morphPositions, 3))
      geometry.setAttribute(name + 'Center', new BufferAttribute(morphCenters, 3))
    })
    return geometry
  })
  const depthGeometry = mergeGeometries(faces)!
  for (const face of faces) face.dispose()
  const depthMaterial = createAsciiDepthMaterial(object.material as ShaderMaterial)
  const depthSurface = new Mesh(depthGeometry, depthMaterial)
  depthSurface.frustumCulled = false
  object.add(depthSurface)
  object.userData.depthSurface = depthSurface
  const dispose = object.userData.dispose as () => void
  object.userData.dispose = () => { dispose(); depthGeometry.dispose(); depthMaterial.dispose() }
  return object
}

const view = (c: number, r: number, u: number) => [0, 1, 2].map((k) => CAMERA[k]! * c + RIGHT[k]! * r + UP[k]! * u) as [number, number, number]
const distance = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!)

/**
 * The reasoning core: one living mass of 26 varied units.
 * Units 0, 1 and 3 fill the heart. Unit 2 holds the Issue, in the middle of the face that looks at the camera.
 * Units 4 to 7 sit on the visible rim. They are the four that leave when repeatable work separates.
 * `builds` gives the units other builds, such as `laptopLayout`. The poses `morph` and `morph2` move them there.
 */
export function cluster(seed: number, size = 1, builds?: (units: FormUnit[]) => MorphBox[][]): Points {
  const hand: FormUnit[] = [
    { at: [-1.4, 0.7, -1.3], size: 2.6, shape: 'cell', rotation: [0.2, 0.4, 0] },
    { at: [1.8, -1.2, -1.0], size: 2.3, shape: 'block', rotation: [0.15, 0.3, 0.1] },
    { at: view(4.2, 0, 0.3), size: 1.6, shape: 'cubocta', rotation: [0.1, 0.5, 0.2] },
    { at: [-1.2, -1.6, 1.7], size: 2.4, shape: 'cell', rotation: [0.3, 0.1, 0.2] },
    { at: view(1.2, 4.3, 1.7), size: 1.4, shape: 'block', rotation: [0.2, 0.3, 0] },
    { at: view(1.2, -4.0, 2.2), size: 1.1, shape: 'prism', rotation: [0.1, 0, 0.35] },
    { at: view(1.2, 3.0, -3.8), size: 1.5, shape: 'cell' },
    { at: view(1.2, -2.8, -4.0), size: 1.6, shape: 'hex', rotation: [0.3, 0.2, 0] },
  ]
  const sizes = [1.7, 1.2, 1.5, 1.0, 1.6, 1.1, 1.4, 0.9, 1.7, 1.0, 1.4, 1.3, 1.6, 1.0, 1.2, 1.8, 1.1, 1.3]
  const shapes: UnitShape[] = ['cell', 'block', 'hex', 'cubocta', 'slab', 'cell', 'block', 'prism', 'cubocta', 'hex', 'cell', 'block', 'slab', 'cubocta', 'cell', 'hex', 'block', 'cell']
  const units: FormUnit[] = []
  const clear = (c: FormUnit) => units.every((o) => distance(o.at, c.at) >= RADIUS[o.shape ?? 'cell'] * o.size + RADIUS[c.shape ?? 'cell'] * c.size * 0.82 + 0.05)
  /** Pushes a unit outward along its own direction until it clears its neighbours. */
  const settle = (c: FormUnit, max: number): FormUnit | null => {
    const len = Math.hypot(...c.at) || 1
    const dir = c.at.map((n) => n / len)
    let at = [...c.at]
    for (let step = 0; step < 200; step++) {
      const next = { ...c, at: at as unknown as [number, number, number] }
      if (clear(next)) return next
      at = at.map((n, k) => n + dir[k]! * 0.1)
      if (Math.hypot(...at) > max) return null
    }
    return null
  }
  for (const unit of hand) units.push(settle(unit, 9) ?? unit)
  const frac = (x: number) => x - Math.floor(x)
  for (let i = 1, placed = 0; i < 400 && placed < sizes.length; i++) {
    const y = 1 - 2 * frac(i * 0.7548776662 + seed * 0.1)
    const a = 2 * Math.PI * frac(i * 0.569840291)
    const ring = Math.sqrt(1 - y * y)
    const s = sizes[placed]!
    const reach = 2.4 + 0.45 * s
    const candidate: FormUnit = { at: [Math.cos(a) * ring * reach, y * reach, Math.sin(a) * ring * reach], size: s, shape: shapes[placed], rotation: [i * 0.7, i * 1.1, i * 0.4] }
    const placedUnit = settle(candidate, 6.6 - 0.3 * s)
    if (placedUnit) { units.push(placedUnit); placed++ }
  }
  const scaled = units.map((u) => ({ ...u, at: u.at.map((n) => n * size) as [number, number, number], size: u.size * size }))
  return createForm(scaled, seed, 0.3 * size, 14, { work: 2, drift: 0.25, morph: builds?.(scaled) })
}

/**
 * The same units built as an open laptop. The lid is a screen of fifteen tiles, and the Issue unit is the middle tile.
 * The base is a deck of nine wide keys, and two hinges join the two halves.
 * Larger units take the larger parts, so the marks stay close together.
 */
/** The units in the order they take the laptop slots: largest first, the Issue unit (2) aside. */
function laptopOrder(units: FormUnit[]): number[] {
  return units.map((_, i) => i).filter((i) => i !== 2).sort((a, b) => units[b]!.size - units[a]!.size)
}

/** The order in which the blue moves over the fifteen screen tiles, by tile (rows of five, top left first). It starts in the middle. */
const SCREEN_WALK = [7, 3, 11, 1, 13, 5, 9, 0, 12, 6, 2, 14, 8, 4, 10]

/**
 * The units that form the laptop screen, in the order the blue visits them.
 * The first is the Issue unit in the middle tile, so a still screen shows the Issue where it always is.
 */
export function laptopScreen(units: FormUnit[]): number[] {
  const order = laptopOrder(units)
  // Screen tiles follow the nine deck tiles in slot order. Tile 7 is the Issue unit.
  const tiles = Array.from({ length: 15 }, (_, tile) => (tile === 7 ? 2 : order[9 + (tile < 7 ? tile : tile - 1)]!))
  return SCREEN_WALK.map((tile) => tiles[tile]!)
}

export function laptopLayout(units: FormUnit[], size = 1): MorphBox[] {
  // The laptop faces the camera: r runs left to right, u runs up, f comes toward the viewer.
  const r = new Vector3(0.707, 0, -0.707)
  const u = new Vector3(0, 1, 0)
  const f = new Vector3(0.707, 0, 0.707)
  // The lid leans back a little from upright.
  const tilt = 0.34
  const lidUp = u.clone().multiplyScalar(Math.cos(tilt)).addScaledVector(f, -Math.sin(tilt))
  const lidFront = u.clone().multiplyScalar(Math.sin(tilt)).addScaledVector(f, Math.cos(tilt))
  const flat = new Matrix4().makeBasis(r, u, f)
  const lid = new Matrix4().makeBasis(r, lidUp, lidFront)
  const hinge = u.clone().multiplyScalar(0.2).addScaledVector(f, -3.95)
  // Moves the laptop so the middle of its extent sits at the origin.
  const middle = u.clone().multiplyScalar(3.4).addScaledVector(f, -0.8)
  const at = (point: Vector3) => point.clone().sub(middle).multiplyScalar(size).toArray() as [number, number, number]
  const half = (x: number, y: number, z: number) => [x * size, y * size, z * size] as [number, number, number]
  const deck: MorphBox[] = []
  for (const row of [-1, 0, 1]) for (const col of [-1, 0, 1]) {
    deck.push({ at: at(r.clone().multiplyScalar(col * 4.25).addScaledVector(f, row * 2.55)), half: half(2.08, 0.2, 1.24), basis: flat })
  }
  const screen: MorphBox[] = []
  for (const row of [1, 0, -1]) for (const col of [-2, -1, 0, 1, 2]) {
    const point = hinge.clone().addScaledVector(lidUp, 3.75 + row * 2.4).addScaledVector(r, col * 2.5).addScaledVector(lidFront, 0.3)
    screen.push({ at: at(point), half: half(1.22, 1.17, 0.3), basis: lid })
  }
  const issue = screen.splice(7, 1)[0]!
  const hinges: MorphBox[] = [-3, 3].map((x) => ({ at: at(hinge.clone().addScaledVector(r, x)), half: half(2.2, 0.26, 0.26), basis: flat }))
  const slots = [...deck, ...screen, ...hinges]
  const order = laptopOrder(units)
  const boxes: MorphBox[] = []
  boxes[2] = issue
  order.forEach((index, n) => { boxes[index] = slots[n] ?? issue })
  return boxes
}

/** A tight orthogonal bank. Index = (x * rows + z) * layers + y. */
export function lattice(seed: number, cols = 3, rows = 2, layers = 2, pitch = 2.1, size = 1, spacing = 0.22, glyph = 11): Points {
  return createForm(latticeUnits(cols, rows, layers, pitch, size), seed, spacing, glyph)
}

function latticeUnits(cols: number, rows: number, layers: number, pitch = 2.1, size = 1, lift = 0): FormUnit[] {
  const units: FormUnit[] = []
  for (let x = 0; x < cols; x++) for (let z = 0; z < rows; z++) for (let y = 0; y < layers; y++) {
    units.push({ at: [(x - (cols - 1) / 2) * pitch, (y - (layers - 1) / 2) * pitch + lift, (z - (rows - 1) / 2) * pitch], size, shape: 'block' })
  }
  return units
}

/** The perimeter of an n by n grid on the ground plane, at height y. The last unit is the front corner. */
function ring(n: number, pitch: number, size: number, shape: UnitShape = 'block', y = 0): FormUnit[] {
  const units: FormUnit[] = []
  for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) {
    if (x !== 0 && z !== 0 && x !== n - 1 && z !== n - 1) continue
    units.push({ at: [(x - (n - 1) / 2) * pitch, y, (z - (n - 1) / 2) * pitch], size, shape })
  }
  return units
}

/** A guardrail: a tall thin wall, one unit deep, with merlons on top. */
export function wall(seed: number): Points {
  const units: FormUnit[] = []
  for (let x = -3; x <= 3; x++) for (let y = 0; y < 4; y++) units.push({ at: [x * 1.9, y * 1.9, 0], size: 0.88, shape: 'block' })
  for (const x of [-3, -1, 1, 3]) units.push({ at: [x * 1.9, 4 * 1.9, 0], size: 0.88, shape: 'block' })
  return createForm(centered(units), seed, 0.22, 12, { work: 13 })
}

/** The merge gate: the wall family with one door, a lintel, and a sill where the Issue passes. */
export function gate(seed: number): Points {
  const units: FormUnit[] = []
  for (const x of [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5]) for (let y = 0; y < 4; y++) {
    if (Math.abs(x) < 1 && y <= 2) continue
    units.push({ at: [x * 1.9, y * 1.9, 0], size: 0.88, shape: 'block' })
  }
  units.push({ at: [0, 3.8, 0], size: 0.95, shape: 'beam' })
  for (const x of [-2.5, -0.5, 1.5, 3.5]) units.push({ at: [x * 1.9, 7.6, 0], size: 0.88, shape: 'block' })
  units.push({ at: [0, -1.35, 0], size: 1.1, shape: 'slab' })
  return createForm(centered(units), seed, 0.22, 12, { work: units.length - 1 })
}

/** An owner review: an upright hollow square, one unit deep. */
export function upright(seed: number): Points {
  const units: FormUnit[] = []
  for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) {
    if (x === 0 || y === 0 || x === 4 || y === 4) units.push({ at: [(x - 2) * 1.9, (y - 2) * 1.9, 0], size: 0.88, shape: 'block' })
  }
  const work = units.findIndex((u) => u.at[0] === 0 && u.at[1] === -3.8)
  return createForm(units, seed, 0.22, 12, { work })
}

/** Triage: the front door. A ring on the ground with four posts; the front post holds the Issue. */
export function triage(seed: number): Points {
  const units = ring(5, 1.8, 0.8)
  for (const [x, z] of [[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]] as const) units.push({ at: [x, 1.1, z], size: 0.7, shape: 'prism' })
  return createForm(centered(units), seed, 0.24, 11, { work: units.length - 1 })
}

/** The Harness: the environment that contains. A ring of blocks around a raised ring of hexagonal prisms. */
export function harness(seed: number): Points {
  const units = [...ring(6, 1.7, 0.75), ...ring(4, 1.7, 0.8, 'hex', 0.9)]
  return createForm(centered(units), seed, 0.22, 12, { work: units.length - 1 })
}

/** Repeated blocks form a stepped assembly with a visible side profile. */
export function steps(seed: number): Points {
  const units: FormUnit[] = []
  for (let x = 0; x < 4; x++) for (let y = 0; y <= x; y++) for (const z of [-1.05, 1.05]) {
    units.push({ at: [(x - 1.5) * 2.0, y * 1.9, z], size: 0.95, shape: 'block' })
  }
  return createForm(centered(units), seed, 0.24, 11)
}

/** Forge: a thin plate of tiles lying flat. */
export function plate(seed: number): Points {
  const units: FormUnit[] = []
  for (let x = 0; x < 4; x++) for (let z = 0; z < 3; z++) units.push({ at: [(x - 1.5) * 1.75, 0, (z - 1) * 1.75], size: 0.8, shape: 'tile' })
  return createForm(units, seed, 0.24, 11)
}

/** A ring of small units standing upright and facing the camera. */
function standingRing(center: readonly number[], radius: number, count: number, size: number, shape: UnitShape, tilt = 0): FormUnit[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    const r = Math.cos(a) * radius
    const u = Math.sin(a) * radius
    const depth = Math.cos(a) * radius * tilt
    return { at: [0, 1, 2].map((k) => center[k]! + RIGHT[k]! * r + UP[k]! * u + CAMERA[k]! * depth) as [number, number, number], size, shape, rotation: [i * 0.4, i * 0.7, 0] as [number, number, number] }
  })
}

/**
 * Steps in the evolution of AI that have no element of their own:
 * a prompt is one typed line, loops and graphs are one upright ring,
 * Agentic Workflows are two linked rings, and the future is a loose handful that never settles.
 */
export function era(seed: number, kind: 'prompt' | 'loop' | 'loops' | 'future' | 'spec' | 'plugin'): Points {
  switch (kind) {
    // OpenSpec: a short stack of pages, each one a little offset, like proposal, specs and tasks.
    case 'spec': return createForm(centered([0, 1, 2].map((i) => ({ at: [i * 0.35, i * 0.95, -i * 0.35] as [number, number, number], size: 1.25, shape: 'slab' as const }))), seed, 0.24, 11, { work: 2 })
    // A plugin: one block with two prongs, the part that plugs into the tool call.
    case 'plugin': return createForm(centered([
      { at: [0, 0, 0], size: 1.1, shape: 'block' },
      { at: [0, 1.75, 0.55], size: 0.42, shape: 'prism' },
      { at: [0, 1.75, -0.55], size: 0.42, shape: 'prism' },
    ]), seed, 0.24, 11, { work: 0 })
    case 'prompt': {
      const units: FormUnit[] = [0, 1, 2, 3].map((i) => ({ at: [0, 1, 2].map((k) => RIGHT[k]! * (i - 2) * 1.7) as [number, number, number], size: 0.62, shape: 'slab' as const }))
      units.push({ at: [0, 1, 2].map((k) => RIGHT[k]! * 2 * 1.7 + UP[k]! * 0.35) as [number, number, number], size: 0.62, shape: 'prism' })
      return createForm(centered(units), seed, 0.26, 10, { work: units.length - 1 })
    }
    case 'loop': return createForm(standingRing([0, 0, 0], 2.7, 10, 0.55, 'cubocta'), seed, 0.24, 10)
    case 'loops': return createForm(centered([...standingRing([0, 0, 0], 2.2, 8, 0.5, 'cubocta', 0.3), ...standingRing(RIGHT.map((n) => n * 3.2), 2.2, 8, 0.5, 'cubocta', -0.3)]), seed, 0.24, 10)
    default: return createForm(Array.from({ length: 7 }, (_, i) => ({ at: [Math.cos(i * 2.4) * 1.6, Math.sin(i * 1.7) * 1.2, Math.sin(i * 2.4) * 1.6] as [number, number, number], size: 0.6, shape: 'cell' as const })), seed, 0.24, 10)
  }
}

/** The five maturity assemblies, each with more structure than the one before. */
export function level(seed: number, index: number): Points {
  switch (index) {
    case 0: return createForm([{ at: [0, 0, 0], size: 2.0, shape: 'cell' }], seed, 0.3, 9)
    case 1: return createForm(centered([{ at: [-2.1, -1, 0], size: 1.2, shape: 'block' }, { at: [1.2, 1.4, 0.8], size: 1.5 }, { at: [2.7, -1.4, 0], size: 0.8, shape: 'slab' }]), seed, 0.3, 9)
    case 2: return createForm(ring(5, 1.8, 0.8), seed, 0.3, 9)
    case 3: return createForm(latticeUnits(3, 3, 2, 1.9, 0.9), seed, 0.3, 9)
    default: return createForm(centered([...ring(7, 1.7, 0.65), ...latticeUnits(3, 3, 1, 1.7, 0.5, 0.6)]), seed, 0.3, 9)
  }
}
