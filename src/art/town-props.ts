/**
 * The props of the town: the things the story hands around. Milestones on the
 * road, a scroll and a crate, a banner, a forge with its kilns, the parapet
 * of the hall, cottages for the hamlet. Built with the helpers of town.ts, in
 * the same craft.
 */
import { BoxGeometry, CylinderGeometry, SphereGeometry, type BufferGeometry, type ColorRepresentation } from 'three'
import { assemble, createSwarm, type Swarm } from './elements'
import { palette } from './palette'
import { createToonMaterial, inkOf } from './toon'
import { addChimney, addDoor, addFlag, attach, boxAt, building, gableEndsGeometry, gableRoofGeometry, hipRoofGeometry, merge, Parts, stoneTexture, town } from './town'

/** A milestone on the road: a signpost with a board and a pennant. `stone` adds a stone base, for the structures of the second half. */
export function createMilestone(options: { stone?: boolean; pennant?: ColorRepresentation } = {}) {
  const { stone = false, pennant = palette.peach } = options
  const post = boxAt(0.09, 1.3, 0.09, 0, 0.65, 0)
  const el = building('milestone', post, town.timber)
  const p = new Parts()
  p.timber.push(boxAt(0.72, 0.32, 0.06, 0.1, 1.05, 0.05, { y: -0.35 }))
  p.dark.push(boxAt(0.62, 0.22, 0.02, 0.1, 1.05, 0.09, { y: -0.35 }))
  if (stone) {
    p.stone.push(boxAt(0.6, 0.26, 0.6, 0, 0.13, 0))
    p.stone.push(boxAt(0.34, 0.2, 0.34, 0, 0.36, 0))
  }
  attach(el, boxAt(0.26, 0.13, 0.02, 0.15, 1.36, 0.02), pennant, { width: 1.4 })
  p.attachTo(el, town.timber)
  return el
}

/** A rolled scroll: the workflow file. It lies along X, its middle at y = 0.1. */
export function createScroll() {
  const roll = new CylinderGeometry(0.1, 0.1, 0.46, 12)
  roll.rotateZ(Math.PI / 2)
  roll.translate(0, 0.1, 0)
  const el = building('scroll', roll, town.cloth)
  const caps: BufferGeometry[] = []
  for (const x of [-0.25, 0.25]) {
    const cap = new CylinderGeometry(0.04, 0.04, 0.06, 8)
    cap.rotateZ(Math.PI / 2)
    cap.translate(x, 0.1, 0)
    caps.push(cap)
  }
  attach(el, merge(caps), town.timber, { width: 1.3 })
  attach(el, boxAt(0.3, 0.02, 0.06, 0, 0.205, 0), palette.outline, { width: 1.0 })
  return el
}

/** A wooden crate: the compiled workflow. Its base sits at y = 0. */
export function createCrate(options: { size?: number } = {}) {
  const { size = 0.4 } = options
  const box = boxAt(size, size, size, 0, size / 2, 0)
  const el = building('crate', box, town.wood)
  const edges: BufferGeometry[] = []
  const t = size * 0.12
  for (const y of [t / 2, size - t / 2]) {
    for (const z of [-size / 2, size / 2]) edges.push(boxAt(size + t * 0.6, t, t, 0, y, z))
    for (const x of [-size / 2, size / 2]) edges.push(boxAt(t, t, size + t * 0.6, x, y, 0))
  }
  for (const x of [-size / 2, size / 2]) for (const z of [-size / 2, size / 2]) edges.push(boxAt(t, size, t, x, size / 2, z))
  attach(el, merge(edges), town.timber, { width: 1.2 })
  return el
}

/** A banner: a pole with a hanging cloth and a dark emblem. Its base sits at y = 0. */
export function createBanner(options: { color?: ColorRepresentation; height?: number } = {}) {
  const { color = palette.butter, height = 2.4 } = options
  const pole = boxAt(0.06, height, 0.06, 0, height / 2, 0)
  const el = building('banner', pole, town.timber)
  const p = new Parts()
  p.timber.push(boxAt(0.7, 0.05, 0.05, 0.28, height - 0.08, 0))
  attach(el, boxAt(0.5, 1.0, 0.03, 0.33, height - 0.62, 0), color, { width: 1.6 })
  p.dark.push(boxAt(0.22, 0.22, 0.02, 0.33, height - 0.5, 0.025))
  p.attachTo(el, town.timber)
  return el
}

/** The forge: a stone shed open at the front, a big chimney, an anvil and a fire inside. Its front faces +Z. */
export function createForge(options: { flag?: ColorRepresentation | false } = {}) {
  const { flag = false } = options
  const base = boxAt(1.7, 0.7, 1.3, 0, 0.35, -0.25)
  const el = building('forge', base, town.stone, stoneTexture())
  const p = new Parts()
  if (flag) addFlag(el, p, 0.4, 1.2, 0.05, flag)
  for (const x of [-0.75, 0.75]) p.stone.push(boxAt(0.2, 0.7, 0.2, x, 0.35, 0.65))
  const roof = hipRoofGeometry(2.1, 1.9, 0.5, 0.4)
  roof.translate(0, 0.7, 0.05)
  p.tilesDark.push(roof)
  addChimney(p, -0.5, 1.75, -0.45, 1.05)
  p.stone.push(boxAt(0.36, 0.12, 0.36, -0.5, 1.78, -0.45))
  p.timber.push(boxAt(0.22, 0.2, 0.22, 0.35, 0.1, 0.3))
  p.dark.push(boxAt(0.36, 0.1, 0.16, 0.35, 0.25, 0.3))
  attach(el, boxAt(0.5, 0.35, 0.3, -0.35, 0.18, -0.5), palette.peach, { width: 1.4 })
  p.attachTo(el, town.stone, town.tileDark)
  return el
}

/** A kiln: a stone dome with a chimney and a dark mouth. One per model, behind the forge. Its mouth faces +Z. */
export function createKiln() {
  const dome = new SphereGeometry(0.55, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2)
  dome.scale(1, 0.8, 1)
  const el = building('kiln', dome, town.stoneDark)
  const p = new Parts()
  p.stone.push(boxAt(0.18, 0.55, 0.18, 0.15, 0.55, -0.15))
  p.stone.push(boxAt(0.24, 0.05, 0.24, 0.15, 0.85, -0.15))
  p.dark.push(boxAt(0.26, 0.22, 0.06, 0, 0.13, 0.5))
  p.attachTo(el, town.stoneDark)
  return el
}

/**
 * The curtain wall of the hall: the Harness, the rules the hall keeps around
 * the agent. A crenellated wall of stone on the edge of the hall's platform,
 * in its local units, with a tower at each corner and a gate of two towers at
 * the arcade, where the front stays open. Scale it with the hall.
 */
export function createParapet(options: { halfWidth?: number; halfDepth?: number; height?: number } = {}) {
  const { halfWidth = 2.3, halfDepth = 2.0, height = 0.72 } = options
  const t = 0.22
  const y = 0.14
  const gate = 1.5
  const stone: BufferGeometry[] = [
    boxAt(halfWidth * 2, height, t, 0, y + height / 2, -halfDepth),
    boxAt(t, height, halfDepth * 2, -halfWidth, y + height / 2, 0),
    boxAt(t, height, halfDepth * 2, halfWidth, y + height / 2, 0),
    boxAt(halfWidth - gate, height, t, -(halfWidth + gate) / 2, y + height / 2, halfDepth),
    boxAt(halfWidth - gate, height, t, (halfWidth + gate) / 2, y + height / 2, halfDepth),
  ]
  // Merlons along every stretch of wall.
  const merlon = 0.12
  const along = (x0: number, z0: number, x1: number, z1: number) => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, z1 - z0) / 0.34))
    for (let k = 0; k < n; k++) {
      const u = (k + 0.5) / n
      stone.push(boxAt(merlon, merlon, merlon, x0 + (x1 - x0) * u, y + height + merlon / 2, z0 + (z1 - z0) * u))
    }
  }
  along(-halfWidth, -halfDepth, halfWidth, -halfDepth)
  along(-halfWidth, -halfDepth, -halfWidth, halfDepth)
  along(halfWidth, -halfDepth, halfWidth, halfDepth)
  along(-halfWidth, halfDepth, -gate, halfDepth)
  along(gate, halfDepth, halfWidth, halfDepth)
  // Towers: one at each corner, two smaller ones at the gate, with a hoarding and a tiled roof.
  const p = new Parts()
  const tower = (x: number, z: number, w: number, h: number) => {
    stone.push(boxAt(w, h, w, x, y + h / 2, z))
    p.timber.push(boxAt(w + 0.16, 0.1, w + 0.16, x, y + h - 0.05, z))
    const roof = hipRoofGeometry(w + 0.26, w + 0.26, 0.34, 0)
    roof.translate(x, y + h, z)
    p.tilesDark.push(roof)
  }
  for (const x of [-halfWidth, halfWidth]) for (const z of [-halfDepth, halfDepth]) tower(x, z, 0.56, height + 0.5)
  for (const x of [-gate, gate]) tower(x, halfDepth, 0.44, height + 0.34)
  const el = building('parapet', merge(stone), town.stone, stoneTexture())
  p.attachTo(el, town.stone, town.tileDark)
  return el
}

/** Cottages for the hamlet: the walls, as one swarm, and the roofs, as another that shares the positions. */
export function createCottageWalls(count: number): Swarm {
  const walls = boxAt(1.0, 0.55, 0.8, 0, 0.275, 0)
  const ends = gableEndsGeometry(1.0, 0.8, 0.36)
  ends.translate(0, 0.55, 0)
  return createSwarm({ count, geometry: merge([walls, ends]), color: town.wallWarm, outline: { width: 1.8, color: inkOf(town.wallWarm, palette.outline), boil: 0.25 } })
}

export function createCottageRoofs(count: number): Swarm {
  const roof = gableRoofGeometry(1.2, 1.1, 0.36, 0.05)
  roof.translate(0, 0.55, 0)
  const chimney = boxAt(0.14, 0.4, 0.14, -0.3, 0.75, -0.15)
  return createSwarm({ count, geometry: merge([roof, chimney]), color: town.tile, outline: { width: 1.8, color: inkOf(town.tile, palette.outline), boil: 0.25 } })
}

/** A small barn: wooden, with a wide door and a thatched roof. Its front faces +Z. */
export function createBarn(options: { flag?: ColorRepresentation | false } = {}) {
  const { flag = false } = options
  const walls = new BoxGeometry(1.8, 0.75, 1.4)
  walls.translate(0, 0.375, 0)
  const el = building('barn', walls, town.wood)
  const p = new Parts()
  if (flag) addFlag(el, p, 0.75, 1.42, 0, flag)
  const roof = gableRoofGeometry(2.0, 1.8, 0.6)
  roof.translate(0, 0.75, 0)
  p.tiles.push(roof)
  const ends = gableEndsGeometry(1.8, 1.8, 0.59)
  ends.translate(0, 0.75, 0)
  p.plaster.push(ends)
  p.timber.push(boxAt(2.06, 0.05, 0.1, 0, 1.4, 0))
  for (const x of [-0.9, 0.9]) p.timber.push(boxAt(0.08, 0.75, 0.08, x, 0.375, 0.7))
  addDoor(p, 0, 0, 0.7, 0.62, 0.55)
  p.attachTo(el, town.wood, town.thatch)
  return el
}

/** A hay stack in the open: a mound of hay on a pole. */
export function createHayStack() {
  const mound = new SphereGeometry(0.42, 12, 9)
  mound.scale(1, 1.1, 1)
  mound.translate(0, 0.42, 0)
  const el = assemble('hay', mound, createToonMaterial({ color: town.hay }), { width: 1.8, color: inkOf(town.hay, palette.outline), boil: 0.25 })
  attach(el, boxAt(0.06, 1.1, 0.06, 0, 0.55, 0), town.timber, { width: 1.2 })
  return el
}
