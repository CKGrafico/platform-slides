/**
 * The units of the town: what moves on its roads and what the story hands
 * around (docs/art/elements.md). A cart with its load, a sack of grain, a
 * stake of a palisade, a stone, a seal. Built with the helpers of town.ts, in
 * the same craft: toon volumes in the palette, an ink outline that boils, and
 * the object > inner > body split. Every unit stands on y = 0. A cart faces
 * +X, the way it travels: point it with faceAlong.
 *
 * Nothing here is a sphere on its own. The town has no moons.
 */
import { BoxGeometry, CylinderGeometry, DodecahedronGeometry, Group, SphereGeometry, Vector3, type BufferGeometry, type ColorRepresentation, type Object3D } from 'three'
import { createSwarm, type ArtElement, type Swarm } from './elements'
import { palette } from './palette'
import { inkOf } from './toon'
import { attach, boxAt, building, merge, stakeGeometry, town } from './town'

/** What a cart carries. Barrels are the steps of the mill, crates the tasks, a tarp a piece of work, a sack a delivery. */
export type Load = 'barrel' | 'crate' | 'sack' | 'tarp'

// ---- carts -----------------------------------------------------------------------------------------

const BED_Y = 0.2
const LOAD_Y = BED_Y + 0.025

/** The bed of a cart, its rails, its back board, the axle and the two shafts. Wood, facing +X. */
function cartWood(): BufferGeometry {
  return merge([
    boxAt(0.38, 0.05, 0.26, 0, BED_Y, 0),
    boxAt(0.38, 0.09, 0.03, 0, BED_Y + 0.06, 0.13),
    boxAt(0.38, 0.09, 0.03, 0, BED_Y + 0.06, -0.13),
    boxAt(0.03, 0.09, 0.26, -0.19, BED_Y + 0.06, 0),
    boxAt(0.24, 0.03, 0.03, 0.29, BED_Y - 0.01, 0.08),
    boxAt(0.24, 0.03, 0.03, 0.29, BED_Y - 0.01, -0.08),
    boxAt(0.03, 0.03, 0.3, 0, 0.11, 0),
  ])
}

/** Two wheels on the axle. */
function cartWheels(): BufferGeometry {
  const wheels: BufferGeometry[] = []
  for (const z of [-0.16, 0.16]) {
    const wheel = new CylinderGeometry(0.11, 0.11, 0.035, 14)
    wheel.rotateX(Math.PI / 2)
    wheel.translate(0, 0.11, z)
    wheels.push(wheel)
  }
  return merge(wheels)
}

/** The load on the bed, in the color that names the cart. */
function loadGeometry(load: Load): BufferGeometry {
  switch (load) {
    case 'barrel': {
      const g = new CylinderGeometry(0.085, 0.085, 0.2, 12)
      g.translate(0, LOAD_Y + 0.1, 0)
      return g
    }
    case 'crate': {
      const g = new BoxGeometry(0.2, 0.18, 0.2)
      g.translate(0, LOAD_Y + 0.09, 0)
      return g
    }
    case 'sack': {
      const body = new SphereGeometry(0.115, 14, 10)
      body.scale(1.1, 0.85, 1)
      body.translate(0, LOAD_Y + 0.095, 0)
      const neck = new CylinderGeometry(0.03, 0.045, 0.05, 10)
      neck.translate(0, LOAD_Y + 0.2, 0)
      return merge([body, neck])
    }
    case 'tarp': {
      const g = new SphereGeometry(0.13, 14, 10)
      g.scale(1.25, 0.6, 0.95)
      g.translate(0, LOAD_Y + 0.03, 0)
      return g
    }
  }
}

/** The dark trim of a load: the hoops of a barrel, the straps of a crate, the tie of a sack. */
function loadTrim(load: Load): BufferGeometry | null {
  if (load === 'barrel') {
    const hoops: BufferGeometry[] = []
    for (const y of [LOAD_Y + 0.05, LOAD_Y + 0.15]) {
      const hoop = new CylinderGeometry(0.092, 0.092, 0.018, 12)
      hoop.translate(0, y, 0)
      hoops.push(hoop)
    }
    return merge(hoops)
  }
  if (load === 'crate') return merge([boxAt(0.21, 0.02, 0.21, 0, LOAD_Y + 0.04, 0), boxAt(0.21, 0.02, 0.21, 0, LOAD_Y + 0.14, 0)])
  if (load === 'sack') {
    const tie = new CylinderGeometry(0.04, 0.04, 0.014, 10)
    tie.translate(0, LOAD_Y + 0.185, 0)
    return tie
  }
  return null
}

/**
 * A cart: a wooden bed on two wheels with a load. The load is the body, so
 * its color names the cart and a tint or a flash reaches it.
 */
export function createCart(options: { load?: Load; color?: ColorRepresentation; wood?: ColorRepresentation } = {}): ArtElement {
  const { load = 'tarp', color = palette.butter, wood = town.wood } = options
  const el = building('cart', loadGeometry(load), color)
  attach(el, cartWood(), wood, { width: 1.6 })
  attach(el, cartWheels(), town.timber, { width: 1.8 })
  const trim = loadTrim(load)
  if (trim) attach(el, trim, palette.outline, { width: 1.0 })
  return el
}

/**
 * Many carts of one kind, instanced: three swarms that move as one (the
 * frames, the wheels, the loads). `paint` colors a load; `place` takes a yaw.
 */
export function createCartSwarm(count: number, load: Load = 'tarp', color: ColorRepresentation = palette.butter): Swarm {
  const frames = createSwarm({ count, geometry: cartWood(), color: town.wood, outline: { width: 1.6, color: inkOf(town.wood, palette.outline) } })
  const wheels = createSwarm({ count, geometry: cartWheels(), color: town.timber, outline: { width: 1.8, color: inkOf(town.timber, palette.outline) } })
  const loads = createSwarm({ count, geometry: loadGeometry(load), color, outline: { width: 2.0, color: inkOf(color, palette.outline) } })
  const object = new Group()
  object.name = 'carts'
  object.add(frames.object, wheels.object, loads.object)
  const parts = [frames, wheels, loads]
  const swarm: Swarm = {
    object,
    body: loads.body,
    hull: loads.hull,
    count,
    place(i, x, y, z, scale = 1, rx = 0, rz = 0, ry = 0) {
      for (const p of parts) p.place(i, x, y, z, scale, rx, rz, ry)
    },
    paint(i, value) {
      loads.paint(i, value)
    },
    commit() {
      for (const p of parts) p.commit()
    },
    dispose() {
      for (const p of parts) p.dispose()
    },
  }
  object.userData.swarm = swarm
  object.userData.dispose = swarm.dispose
  return swarm
}

// ---- things that do not roll ---------------------------------------------------------------------

/** A sack of grain: an event that falls into the mill. */
export function createSack(options: { color?: ColorRepresentation } = {}): ArtElement {
  const { color = town.thatch } = options
  const body = new SphereGeometry(0.13, 16, 12)
  body.scale(1.05, 0.85, 1)
  body.translate(0, 0.11, 0)
  const neck = new CylinderGeometry(0.035, 0.05, 0.06, 10)
  neck.translate(0, 0.235, 0)
  const el = building('sack', merge([body, neck]), color)
  const tie = new CylinderGeometry(0.045, 0.045, 0.016, 10)
  tie.translate(0, 0.225, 0)
  attach(el, tie, town.timber, { width: 1.0 })
  return el
}

/** A stake of a palisade: one piece of the shell the compiler builds. A band near the top names it. */
export function createStake(options: { band?: ColorRepresentation } = {}): ArtElement {
  const { band = palette.surface } = options
  const el = building('stake', stakeGeometry(0.5), town.timber)
  attach(el, boxAt(0.11, 0.09, 0.11, 0, 0.4, 0), band, { width: 1.2 })
  return el
}

/** A stone: an unsafe command, thrown at the parapet. */
export function createStone(options: { size?: number } = {}): ArtElement {
  const { size = 0.13 } = options
  const g = new DodecahedronGeometry(size, 0)
  g.scale(1.15, 0.85, 1)
  g.translate(0, size * 0.85, 0)
  return building('stone', g, town.stoneDark)
}

/** A seal: a right a worker holds (a verb). A flat disc; turn it to face the camera. */
export function createSeal(options: { radius?: number; color?: ColorRepresentation } = {}): ArtElement {
  const { radius = 0.12, color = palette.butter } = options
  const g = new CylinderGeometry(radius, radius, 0.035, 24)
  g.rotateX(Math.PI / 2)
  const el = building('seal', g, color)
  attach(el, boxAt(radius * 0.8, radius * 0.16, 0.012, 0, 0, 0.024), inkOf(color, palette.outline), { width: 0.8 })
  return el
}

// ---- pointing things the way they go -------------------------------------------------------------

const dir = new Vector3()

/** Turns a unit that faces +X toward its direction of travel, on the ground. Still when the two points are the same. */
export function faceAlong(o: Object3D, from: Vector3, to: Vector3): void {
  dir.subVectors(to, from)
  if (dir.x * dir.x + dir.z * dir.z < 1e-8) return
  o.rotation.y = Math.atan2(-dir.z, dir.x)
}

/** The yaw of a unit that faces +X going from one point to the next, for a swarm's place. 0 when still. */
export function yawAlong(from: Vector3, to: Vector3): number {
  dir.subVectors(to, from)
  if (dir.x * dir.x + dir.z * dir.z < 1e-8) return 0
  return Math.atan2(-dir.z, dir.x)
}

/** A point on a path by its fraction: a sketch line's point, a polyline, the route. */
export type PathAt = (u: number, out: Vector3) => unknown

const pa = new Vector3()
const pb = new Vector3()

/** Turns a unit that faces +X along a path at `u`, from the way the path goes there (looking back at its end). */
export function faceOnPath(o: Object3D, at: PathAt, u: number, eps = 0.005): void {
  if (u + eps <= 1) {
    at(u, pa)
    at(u + eps, pb)
  } else {
    at(u - eps, pa)
    at(u, pb)
  }
  faceAlong(o, pa, pb)
}

/** The yaw along a path at `u`, for a swarm's place. */
export function yawOnPath(at: PathAt, u: number, eps = 0.005): number {
  if (u + eps <= 1) {
    at(u, pa)
    at(u + eps, pb)
  } else {
    at(u - eps, pa)
    at(u, pb)
  }
  return yawAlong(pa, pb)
}
