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
  LatheGeometry,
  Vector2,
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
  Euler,
  type BufferAttribute,
  type BufferGeometry,
  type ColorRepresentation,
  type Material,
  type Object3D,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { onArtFrame } from './clock'
import { createMonolithMaterial, type MonolithMaterial } from './monolith'
import { createOutlineMaterial, hullGeometry, type OutlineMaterial, type OutlineOptions } from './outline'
import { palette } from './palette'
import { createToonMaterial, inkOf } from './toon'

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

export type PlanetPattern = 'plain' | 'bands' | 'spots'

const patterns = new Map<PlanetPattern, CanvasTexture>()

/**
 * A shared, seeded surface for illustrated planets: soft bands with wavy edges,
 * or a few soft spots. White with light grey marks, so it tints any color.
 */
function planetTexture(pattern: Exclude<PlanetPattern, 'plain'>): CanvasTexture {
  const hit = patterns.get(pattern)
  if (hit) return hit
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  let seed = pattern === 'bands' ? 7 : 19
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)
  if (pattern === 'bands') {
    // Three bands of different widths, with a gentle wave on each edge.
    const bands = [
      { y: 0.3, h: 0.07, tone: 0.84 },
      { y: 0.48, h: 0.12, tone: 0.8 },
      { y: 0.68, h: 0.05, tone: 0.86 },
    ]
    for (const band of bands) {
      const v = Math.round(255 * band.tone)
      ctx.fillStyle = `rgb(${v}, ${v}, ${v})`
      const phase = rand() * Math.PI * 2
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) ctx.lineTo(x, (band.y + Math.sin(x / 60 + phase) * 0.012) * h)
      for (let x = w; x >= 0; x -= 8) ctx.lineTo(x, (band.y + band.h + Math.sin(x / 45 + phase * 1.7) * 0.012) * h)
      ctx.closePath()
      ctx.fill()
    }
  } else {
    // A few soft round spots, no rims.
    for (let i = 0; i < 7; i++) {
      const x = rand() * w
      const y = (0.25 + rand() * 0.5) * h
      const r = 14 + rand() * 30
      ctx.fillStyle = 'rgb(214, 214, 214)'
      ctx.beginPath()
      ctx.ellipse(x, y, r * 1.3, r, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  patterns.set(pattern, texture)
  return texture
}

export interface PlanetOptions {
  radius?: number
  color?: ColorRepresentation
  pattern?: PlanetPattern
  /** A thin ring around it, in this color, like an illustrated Saturn. */
  ring?: ColorRepresentation
  /** Tilt of the ring, radians. */
  ringTilt?: number
  outline?: OutlineOptions
}

/**
 * An illustrated planet: flat pastel color, two toon bands, a white highlight,
 * soft bands or spots, an outline in a deep shade of its own color, and an
 * optional ring. The ring sits inside the body, so it enters with it.
 */
function createPlanet(name: string, options: PlanetOptions, segments: [number, number]) {
  const { radius = 0.2, color = palette.surface, pattern = 'plain', ring, ringTilt = 0.42, outline } = options
  const material = createToonMaterial({ color, highlight: true })
  if (pattern !== 'plain') material.map = planetTexture(pattern)
  const el = assemble(name, new SphereGeometry(radius, segments[0], segments[1]), material, { width: 2.5, color: inkOf(color, palette.outline), ...outline })
  if (ring) {
    const geometry = new TorusGeometry(radius * 1.75, radius * 0.1, 10, 64)
    geometry.rotateX(Math.PI / 2)
    const ringMat = createToonMaterial({ color: ring })
    const ringBody = new Mesh(geometry, ringMat)
    const ringHull = new Mesh(hullGeometry(geometry), createOutlineMaterial({ width: 2, color: inkOf(ring, palette.outline) }))
    ringHull.renderOrder = -1
    const group = new Group()
    group.rotation.set(ringTilt, 0, ringTilt * 0.5)
    group.add(ringHull, ringBody)
    el.body.add(group)
    const dispose = el.dispose
    el.dispose = () => {
      dispose()
      geometry.dispose()
      ringHull.geometry.dispose()
      ringMat.dispose()
      ringHull.material.dispose()
    }
    el.object.userData.dispose = el.dispose
  }
  return el
}

/** A deterministic piece: an illustrated moon. */
export function createMoon(options: PlanetOptions = {}) {
  return createPlanet('moon', { radius: 0.2, ...options }, [32, 24])
}

/** An event or a work item. The blue ball is the issue. */
export function createBall(options: PlanetOptions = {}) {
  return createPlanet('ball', { radius: 0.12, ...options }, [24, 16])
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

// ---- people -----------------------------------------------------------------------------

export type AstronautPose = 'stand' | 'hold'

/** Scale of an astronaut: about 1 unit tall. Its parts below are drawn for size 1 (0.78 tall). */
export const ASTRONAUT_SIZE = 1.25

/** A capsule part of the astronaut, placed and turned. */
function part(radius: number, length: number, at: [number, number, number], rot: [number, number, number] = [0, 0, 0]): BufferGeometry {
  const g = new CapsuleGeometry(radius, length, 6, 14)
  g.rotateX(rot[0])
  g.rotateY(rot[1])
  g.rotateZ(rot[2])
  g.translate(...at)
  return g
}

/**
 * A person: a round chibi astronaut. A big helmet with a dark visor (it hides the
 * face, and carries the planet highlight), a white suit, a backpack, and a small
 * pastel patch on the chest, different for each person. Its feet sit at y = 0,
 * and it faces +Z. Parts that share a material are one geometry, so an
 * astronaut costs three meshes. `body` is the suit; the visor and the patch are
 * children of `body`, so they enter, leave, and scale with it.
 * `pose: 'hold'` brings the arms forward, to hold something at the chest.
 */
export function createAstronaut(options: { suit?: ColorRepresentation; patch?: ColorRepresentation; pose?: AstronautPose; size?: number } = {}) {
  const { suit = palette.surface, patch = palette.lilac, pose = 'stand', size = ASTRONAUT_SIZE } = options
  const arms =
    pose === 'hold'
      ? [part(0.058, 0.1, [-0.13, 0.33, 0.1], [-1.25, 0, 0.25]), part(0.058, 0.1, [0.13, 0.33, 0.1], [-1.25, 0, -0.25])]
      : [part(0.058, 0.11, [-0.195, 0.29, 0], [0, 0, -0.45]), part(0.058, 0.11, [0.195, 0.29, 0], [0, 0, 0.45])]
  const helmet = new SphereGeometry(0.2, 28, 20)
  helmet.translate(0, 0.58, 0)
  const backpack = new CapsuleGeometry(0.1, 0.1, 6, 14)
  backpack.scale(1, 1, 0.55)
  backpack.translate(0, 0.33, -0.13)
  const suitParts = [
    helmet,
    part(0.14, 0.1, [0, 0.31, 0]),
    part(0.066, 0.06, [-0.072, 0.1, 0], [0, 0, 0.08]),
    part(0.066, 0.06, [0.072, 0.1, 0], [0, 0, -0.08]),
    backpack,
    ...arms,
  ]
  const suitGeometry = mergeGeometries(suitParts)!
  suitParts.forEach((g) => g.dispose())
  suitGeometry.scale(size, size, size)
  const el = assemble('astronaut', suitGeometry, createToonMaterial({ color: suit }), { width: 2.5, color: inkOf(suit, palette.outline) })

  // The visor: a flattened dark glass in front of the helmet, with the highlight.
  const visorGeometry = new SphereGeometry(0.15, 28, 18)
  visorGeometry.scale(1, 0.74, 0.55)
  visorGeometry.translate(0, 0.59, 0.12)
  visorGeometry.scale(size, size, size)
  const visorMaterial = createToonMaterial({ color: palette.core, highlight: true })
  const visor = new Mesh(visorGeometry, visorMaterial)
  const visorHull = new Mesh(hullGeometry(visorGeometry), createOutlineMaterial({ width: 2, color: palette.outline }))
  visorHull.renderOrder = -1
  // The patch: a small pastel badge on the chest.
  const patchGeometry = new SphereGeometry(0.05, 16, 10)
  patchGeometry.scale(1, 1, 0.35)
  patchGeometry.translate(0.05, 0.36, 0.135)
  patchGeometry.scale(size, size, size)
  const patchMaterial = createToonMaterial({ color: patch })
  const badge = new Mesh(patchGeometry, patchMaterial)
  el.body.add(visorHull, visor, badge)

  const dispose = el.dispose
  el.dispose = () => {
    dispose()
    visorGeometry.dispose()
    visorHull.geometry.dispose()
    visorMaterial.dispose()
    visorHull.material.dispose()
    patchGeometry.dispose()
    patchMaterial.dispose()
  }
  el.object.userData.dispose = el.dispose
  return el
}

// ---- measures ------------------------------------------------------------------------

let coin: BufferGeometry | null = null

/**
 * One coin, lying flat, with a raised rim, so the toon bands draw the rim with
 * no texture. Radius 0.18, height 0.06, centered on y = 0. Shared: do not dispose.
 */
export function coinGeometry(): BufferGeometry {
  if (coin) return coin
  const profile = [
    [0, -0.03],
    [0.155, -0.03],
    [0.175, -0.022],
    [0.182, 0],
    [0.175, 0.024],
    [0.158, 0.03],
    [0.132, 0.03],
    [0.124, 0.021],
    [0, 0.021],
  ].map(([x, y]) => new Vector2(x, y))
  coin = new LatheGeometry(profile, 36)
  return coin
}

/** Height of one coin in a stack, with a hair of air between coins. */
export const COIN_STEP = 0.063

/** A single coin as an art element: for the one coin that a part adds on its own. */
export function createCoin(options: { color?: ColorRepresentation; scale?: number } = {}) {
  const { color = palette.butter, scale = 1 } = options
  const g = coinGeometry().clone()
  g.scale(scale, scale, scale)
  return assemble('coin', g, createToonMaterial({ color }), { width: 2.2, color: inkOf(color, palette.outline), boil: 0.25 })
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
  /** Puts copy i at a point, with a scale and an optional tilt (radians around X and Z). */
  place(i: number, x: number, y: number, z: number, scale?: number, rx?: number, rz?: number): void
  /** Sets the color of one copy. */
  paint(i: number, color: ColorRepresentation): void
  commit(): void
  dispose(): void
}

export function createSwarm(options: {
  count: number
  radius?: number
  color?: ColorRepresentation
  bands?: boolean
  /** Another shape for every copy (for example a small ring or a coin). Default: a sphere of `radius`. */
  geometry?: BufferGeometry
  /** The outline of every copy. Default: the indigo line, 2.5 px. */
  outline?: OutlineOptions
}): Swarm {
  const { count, radius = 0.1, color = palette.surface, bands: withBands = false } = options
  const geometry = options.geometry ?? new SphereGeometry(radius, 20, 14)
  const material = createToonMaterial({ color: '#ffffff', highlight: !options.geometry })
  if (withBands) material.map = planetTexture('bands')
  const body = new InstancedMesh(geometry, material, count)
  const hullGeo = hullGeometry(geometry)
  const hull = new InstancedMesh(hullGeo, createOutlineMaterial({ width: 2.5, ...options.outline }), count)
  hull.instanceMatrix = body.instanceMatrix
  hull.renderOrder = -1
  body.frustumCulled = false
  hull.frustumCulled = false
  const object = new Group()
  object.name = 'swarm'
  object.add(hull, body)
  const m = new Matrix4()
  const q = new Quaternion()
  const euler = new Euler()
  const p = new Vector3()
  const s = new Vector3()
  const c = new Color(color)
  let shown = false
  object.visible = false
  for (let i = 0; i < count; i++) {
    body.setMatrixAt(i, m.compose(p.set(0, 0, 0), q, s.set(0, 0, 0)))
    body.setColorAt(i, c)
  }
  const swarm: Swarm = {
    object,
    body,
    hull,
    count,
    place(i, x, y, z, scale = 1, rx = 0, rz = 0) {
      if (scale > 0) shown = true
      q.setFromEuler(euler.set(rx, 0, rz))
      body.setMatrixAt(i, m.compose(p.set(x, y, z), q, s.set(scale, scale, scale)))
    },
    paint(i, value) {
      body.setColorAt(i, c.set(value))
      if (body.instanceColor) body.instanceColor.needsUpdate = true
    },
    commit() {
      body.instanceMatrix.needsUpdate = true
      // Nothing to show: no draw calls. The next frame's place() calls decide again.
      object.visible = shown
      shown = false
    },
    dispose() {
      // A shared geometry (the coin) stays; a sphere made here goes.
      if (!options.geometry) geometry.dispose()
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
