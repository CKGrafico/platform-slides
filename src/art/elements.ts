/**
 * The element kit. One factory per element in docs/art/elements.md.
 *
 * Every element is three nested parts, so each property has one owner:
 * - `object`: the choreography moves, scales, and turns this one.
 * - `inner`: entrances, exits, and the settle animate this one (motion.ts).
 * - `body` and `hull`: the toon or core surface, and the boiling outline.
 * Every factory returns { object, inner, body, hull, dispose }.
 */
import {
  CanvasTexture,
  CapsuleGeometry,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  Quaternion,
  SRGBColorSpace,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  Color,
  type BufferAttribute,
  type BufferGeometry,
  type ColorRepresentation,
  type Material,
  type Object3D,
} from 'three'
import { onArtFrame } from './clock'
import { createMonolithMaterial, type MonolithMaterial } from './monolith'
import { createOutlineMaterial, hullGeometry, type OutlineMaterial, type OutlineOptions } from './outline'
import { palette } from './palette'
import { createToonMaterial } from './toon'

export interface ArtElement<M extends Material = Material> {
  object: Group
  inner: Group
  body: Mesh<BufferGeometry, M>
  hull: Mesh<BufferGeometry, OutlineMaterial>
  dispose(): void
}

function assemble<M extends Material>(name: string, geometry: BufferGeometry, material: M, outline: OutlineOptions = {}): ArtElement<M> {
  const object = new Group()
  object.name = name
  const inner = new Group()
  const body = new Mesh(geometry, material)
  const hull = new Mesh(hullGeometry(geometry), createOutlineMaterial(outline))
  hull.renderOrder = -1
  inner.add(hull, body)
  object.add(inner)
  const element: ArtElement<M> = {
    object,
    inner,
    body,
    hull,
    dispose() {
      geometry.dispose()
      hull.geometry.dispose()
      material.dispose()
      hull.material.dispose()
    },
  }
  object.userData.art = element
  object.userData.dispose = element.dispose
  return element
}

/** The art element behind an actor object created with this kit. */
export function artOf<M extends Material = Material>(object: Object3D): ArtElement<M> {
  const el = object.userData.art as ArtElement<M> | undefined
  if (!el) throw new Error(`"${object.name}" is not an art element`)
  return el
}

// ---- the core -----------------------------------------------------------------

/**
 * A place on the core's surface that bulges out. A choreography tweens
 * `amount` (share of the radius) to push a moon out from inside: the surface
 * swells, stretches with the moon, then snaps back.
 */
export interface Bump {
  /** Unit direction from the core's center. */
  dir: Vector3
  amount: number
  /** Size of the bulge: smaller is narrower. About 0.05 to 0.2. */
  width: number
}

export type CoreElement = ArtElement<MonolithMaterial> & { bumps: Bump[] }

/**
 * The model: a planet whose surface bubbles and never keeps its shape. It is the
 * only element that moves by time (ambient), and time stops under reduced
 * motion (the art clock passes 0). Body and outline deform with the same noise.
 * Four bump slots let parts pull pieces out of it (see Bump).
 */
export function createCore(options: { radius?: number; segments?: number; outline?: OutlineOptions } = {}): CoreElement {
  const { radius = 1, segments = 64, outline } = options
  const geometry = new SphereGeometry(radius, segments, Math.round(segments * 0.75))
  const base = assemble('core', geometry, createMonolithMaterial(), { width: 3.5, color: palette.text, ...outline })
  const bumps: Bump[] = [0, 1, 2, 3].map(() => ({ dir: new Vector3(0, 1, 0), amount: 0, width: 0.1 }))
  const el: CoreElement = Object.assign(base, { bumps })
  const targets = [el.body.geometry, el.hull.geometry].map((g) => {
    const pos = g.attributes.position as BufferAttribute
    return { g, pos, dirs: Float32Array.from(pos.array as ArrayLike<number>).map((v) => v / radius) }
  })
  const deform = (time: number) => {
    const t = time * 0.35
    const active = bumps.filter((b) => b.amount !== 0)
    for (const { g, pos, dirs } of targets) {
      const a = pos.array as Float32Array
      for (let i = 0; i < a.length; i += 3) {
        const x = dirs[i]!, y = dirs[i + 1]!, z = dirs[i + 2]!
        const n = Math.sin(x * 2.3 + t) * Math.sin(y * 2.9 - t * 0.8) * Math.sin(z * 2.6 + t * 1.3) + 0.5 * Math.sin(x * 4.1 - y * 3.7 + t * 1.7)
        let r = 1 + 0.075 * n
        for (const b of active) {
          const d = x * b.dir.x + y * b.dir.y + z * b.dir.z
          r += b.amount * Math.exp((d - 1) / b.width)
        }
        r *= radius
        a[i] = x * r
        a[i + 1] = y * r
        a[i + 2] = z * r
      }
      pos.needsUpdate = true
      g.computeVertexNormals()
    }
  }
  deform(0)
  const off = onArtFrame(deform)
  const dispose = el.dispose
  el.dispose = () => {
    off()
    dispose()
  }
  el.object.userData.dispose = el.dispose
  el.object.userData.core = el
  return el
}

/** The core element behind an actor made with createCore. */
export function coreOf(object: Object3D): CoreElement {
  const el = object.userData.core as CoreElement | undefined
  if (!el) throw new Error(`"${object.name}" is not a core`)
  return el
}

// ---- moons and balls ------------------------------------------------------------

let craters: CanvasTexture | null = null

/** A shared, seeded crater map: darker hollows with a light rim. Multiplies the moon color. */
function craterTexture(): CanvasTexture {
  if (craters) return craters
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size / 2
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size / 2)
  let seed = 11
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)
  for (let i = 0; i < 26; i++) {
    const x = rand() * size
    const y = (0.15 + rand() * 0.7) * (size / 2)
    const r = 6 + rand() * rand() * 34
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.9, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(120, 112, 150, 0.55)'
    ctx.fill()
    ctx.lineWidth = Math.max(1.5, r * 0.18)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.arc(x - r * 0.12, y - r * 0.12, r, Math.PI * 0.9, Math.PI * 1.9)
    ctx.stroke()
  }
  craters = new CanvasTexture(canvas)
  craters.colorSpace = SRGBColorSpace
  return craters
}

/** A deterministic piece: a small smooth moon with craters. */
export function createMoon(options: { radius?: number; color?: ColorRepresentation; outline?: OutlineOptions } = {}) {
  const { radius = 0.2, color = palette.surface, outline } = options
  const material = createToonMaterial({ color })
  material.map = craterTexture()
  return assemble('moon', new SphereGeometry(radius, 32, 24), material, { width: 2.5, ...outline })
}

/** An event or a work item. The blue ball is the issue. */
export function createBall(options: { radius?: number; color?: ColorRepresentation; outline?: OutlineOptions } = {}) {
  const { radius = 0.12, color = palette.surface, outline } = options
  return assemble('ball', new SphereGeometry(radius, 24, 16), createToonMaterial({ color }), { width: 2.5, ...outline })
}

// ---- rings, people, measures, ground ---------------------------------------------

/**
 * A ring: a gate that puts one ball on one path (the router, the compiler, the
 * merge gate, Forge), or a runtime around the core (OpenCode).
 * `facing` is the axis a ball travels along to pass through it: 'y' lies flat.
 */
export function createRing(
  options: { radius?: number; tube?: number; color?: ColorRepresentation; facing?: 'x' | 'y' | 'z'; outline?: OutlineOptions } = {},
) {
  const { radius = 0.6, tube = 0.07, color = palette.lilac, facing = 'y', outline } = options
  const geometry = new TorusGeometry(radius, tube, 14, 72)
  if (facing === 'y') geometry.rotateX(Math.PI / 2)
  if (facing === 'x') geometry.rotateY(Math.PI / 2)
  return assemble('ring', geometry, createToonMaterial({ color }), { width: 2.5, ...outline })
}

/** Kept for the style frame: a flat ring. */
export function createCaptureRing(options: { radius?: number; tube?: number; color?: ColorRepresentation; outline?: OutlineOptions } = {}) {
  return createRing({ ...options, facing: 'y' })
}

/** A person: a small upright pill with no face. Its base sits at y = 0. */
export function createCapsule(options: { height?: number; color?: ColorRepresentation } = {}) {
  const { height = 0.62, color = palette.lilac } = options
  const r = height * 0.24
  const geometry = new CapsuleGeometry(r, height - 2 * r, 8, 20)
  geometry.translate(0, height / 2, 0)
  return assemble('capsule', geometry, createToonMaterial({ color }), { width: 2.5 })
}

/**
 * A measurement. Its base sits at y = 0 and its height is 1: set object.scale.y
 * to the value. A metric that is not collected is a hollow column (lines.ts).
 */
export function createColumn(options: { radius?: number; color?: ColorRepresentation } = {}) {
  const { radius = 0.22, color = palette.sage } = options
  const geometry = new CylinderGeometry(radius, radius, 1, 32, 1)
  geometry.translate(0, 0.5, 0)
  return assemble('column', geometry, createToonMaterial({ color }), { width: 2.5, boil: 0.25 })
}

/** A guardrail: a low, thin, rounded panel standing on the disc, along X. */
export function createWall(options: { length?: number; height?: number; color?: ColorRepresentation } = {}) {
  const { length = 1.3, height = 0.34, color = palette.surface } = options
  const r = height / 2
  const geometry = new CapsuleGeometry(r, Math.max(0.01, length - height), 8, 24)
  geometry.rotateZ(Math.PI / 2)
  geometry.scale(1, 1, 0.28)
  geometry.translate(0, r, 0)
  return assemble('wall', geometry, createToonMaterial({ color }), { width: 2.5, boil: 0.25 })
}

/**
 * The ground the system stands on (Foundations): a wide, flat disc. Its top sits
 * at y = 0. The faint grid is a separate line element (lines.ts).
 */
export function createDisc(options: { radius?: number; color?: ColorRepresentation } = {}) {
  const { radius = 7, color = palette.surface } = options
  const geometry = new CylinderGeometry(radius, radius, 0.16, 128, 1)
  geometry.translate(0, -0.08, 0)
  return assemble('disc', geometry, createToonMaterial({ color }), { width: 3, boil: 0.2 })
}

/** A plate the stack stands on: the runner. A small disc. */
export function createPlate(options: { radius?: number; color?: ColorRepresentation } = {}) {
  return createDisc({ radius: options.radius ?? 1.4, color: options.color ?? palette.lilac })
}

// ---- swarms ------------------------------------------------------------------------

/**
 * Many copies of one ball or moon in two draw calls: one instanced body and one
 * instanced outline that share the instance matrices. A choreography places
 * every copy from one drive() per window, then calls commit().
 * A copy with scale 0 is hidden, outline included.
 */
export interface Swarm {
  object: Group
  body: InstancedMesh
  hull: InstancedMesh
  count: number
  place(i: number, x: number, y: number, z: number, scale?: number): void
  /** Sets the color of one copy. */
  paint(i: number, color: ColorRepresentation): void
  commit(): void
  dispose(): void
}

export function createSwarm(options: { count: number; radius?: number; color?: ColorRepresentation; craters?: boolean }): Swarm {
  const { count, radius = 0.1, color = palette.surface, craters: withCraters = false } = options
  const geometry = new SphereGeometry(radius, 20, 14)
  const material = createToonMaterial({ color: '#ffffff' })
  if (withCraters) material.map = craterTexture()
  const body = new InstancedMesh(geometry, material, count)
  const hullGeo = hullGeometry(geometry)
  const hull = new InstancedMesh(hullGeo, createOutlineMaterial({ width: 2.5 }), count)
  hull.instanceMatrix = body.instanceMatrix
  hull.renderOrder = -1
  body.frustumCulled = false
  hull.frustumCulled = false
  const object = new Group()
  object.name = 'swarm'
  object.add(hull, body)
  const m = new Matrix4()
  const q = new Quaternion()
  const p = new Vector3()
  const s = new Vector3()
  const c = new Color(color)
  for (let i = 0; i < count; i++) {
    body.setMatrixAt(i, m.compose(p.set(0, 0, 0), q, s.set(0, 0, 0)))
    body.setColorAt(i, c)
  }
  const swarm: Swarm = {
    object,
    body,
    hull,
    count,
    place(i, x, y, z, scale = 1) {
      body.setMatrixAt(i, m.compose(p.set(x, y, z), q, s.set(scale, scale, scale)))
    },
    paint(i, value) {
      body.setColorAt(i, c.set(value))
      if (body.instanceColor) body.instanceColor.needsUpdate = true
    },
    commit() {
      body.instanceMatrix.needsUpdate = true
    },
    dispose() {
      geometry.dispose()
      hullGeo.dispose()
      material.dispose()
      ;(hull.material as Material).dispose()
      body.dispose()
      hull.dispose()
    },
  }
  object.userData.swarm = swarm
  object.userData.dispose = swarm.dispose
  return swarm
}

/** The swarm behind an actor made with createSwarm. */
export function swarmOf(object: Object3D): Swarm {
  const sw = object.userData.swarm as Swarm | undefined
  if (!sw) throw new Error(`"${object.name}" is not a swarm`)
  return sw
}
