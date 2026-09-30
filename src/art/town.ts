/**
 * The town kit: land, buildings, roads, belts and villagers for the map of
 * the second half (docs/art/town-proposal.md), in the look of a strategy
 * game's medieval village: stone bases, half-timbered walls, tiled roofs with
 * a ridge cap and dormers, chimneys, shutters, a town center with an arcade
 * and a turret, gate towers with hoardings, a mill with lattice sails, market
 * stalls with striped awnings, fences and hay bales.
 *
 * Built like the rest of the kit: toon volumes in the palette, an ink outline
 * that boils, and the object > inner > body split, so one property has one
 * owner. The parts of a building are children of its body, so they enter,
 * leave and scale with it. Parts that share a color are one geometry, so a
 * house costs about ten meshes. Subtle canvas textures (stone, tiles, cobbles,
 * stripes) multiply the toon color; their UVs are in world units, so a
 * pattern keeps its size on any box or slope.
 */
import { BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, Color, ConeGeometry, CylinderGeometry, DodecahedronGeometry, Mesh, PlaneGeometry, RepeatWrapping, SphereGeometry, SRGBColorSpace, type ColorRepresentation, type Texture } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { assemble, createSwarm, part, type ArtElement, type Swarm } from './elements'
import { createSketchLine, type PathFn, type SketchLine } from './lines'
import { createOutlineMaterial, hullGeometry } from './outline'
import { palette } from './palette'
import { createToonMaterial, inkOf } from './toon'

type V3 = readonly [number, number, number]

/** Tones of the town that the palette does not name: tiles, stone, timber, leaves, hay. */
export const town = {
  tile: '#D9A88A',
  tileDark: '#C9967A',
  thatch: '#D9C58F',
  sand: '#E6D8BC',
  cobble: '#D9D3C9',
  stone: '#D3CDC2',
  stoneDark: '#C3BBAE',
  wood: '#B99A7A',
  timber: '#8A6F56',
  wall: '#EFE6D2',
  wallWarm: '#E8D9C0',
  grass: '#A9BFA9',
  grassLight: '#B9CBB5',
  grassDark: '#98AF98',
  leaf: '#8FAE95',
  leafLight: '#A5BFA5',
  leafDark: '#7E9D85',
  pine: '#7A9B8A',
  field: '#DCC98F',
  fieldDark: '#CDB97E',
  hay: '#E6D49A',
  cloth: '#F6F1E8',
} as const

// ---- textures ------------------------------------------------------------------------------------

const textures = new Map<string, CanvasTexture>()

/** A seeded random in 0..1, so a texture is the same every time. */
function seeded(seed: number): () => number {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

const grey = (v: number) => `rgb(${Math.round(v * 255)}, ${Math.round(v * 255)}, ${Math.round(v * 255)})`

/** A repeating canvas texture, white where the toon color shows as is. Built once. */
function canvasTexture(key: string, size: number, draw: (ctx: CanvasRenderingContext2D, n: number) => void): CanvasTexture {
  const hit = textures.get(key)
  if (hit) return hit
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  draw(ctx, size)
  const texture = new CanvasTexture(canvas)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.colorSpace = SRGBColorSpace
  textures.set(key, texture)
  return texture
}

/** Soft blotches: grass with lighter and darker patches. One tile is 12 units of land. */
function landTexture(): CanvasTexture {
  return canvasTexture('land', 512, (ctx, n) => {
    const rand = seeded(41)
    const tones = [0.95, 0.9, 0.97, 0.925]
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = grey(tones[i % tones.length]!)
      const x = rand() * n
      const y = rand() * n
      const r = 12 + rand() * 40
      const ry = r * (0.5 + rand() * 0.6)
      const a = rand() * Math.PI
      // The texture repeats: draw the same blotch across the edges.
      for (const [dx, dy] of [[0, 0], [n, 0], [-n, 0], [0, n], [0, -n]]) {
        ctx.beginPath()
        ctx.ellipse(x + dx!, y + dy!, r, ry, a, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  })
}

/** Ashlar stone: blocks in running bond with soft mortar lines. Eight rows per unit. */
export function stoneTexture(): CanvasTexture {
  return canvasTexture('stone', 256, (ctx, n) => {
    const rand = seeded(7)
    const rows = 8
    const h = n / rows
    const w = h * 2
    ctx.fillStyle = grey(0.86)
    ctx.fillRect(0, 0, n, n)
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 ? w / 2 : 0
      for (let c = -1; c <= n / w; c++) {
        ctx.fillStyle = grey(0.94 + rand() * 0.06)
        ctx.fillRect(c * w + offset + 1.5, r * h + 1.5, w - 3, h - 3)
      }
    }
  })
}

/** Roof tiles: rows, each a little darker at its lower edge, with staggered joints. Six rows per unit. */
export function tileTexture(): CanvasTexture {
  return canvasTexture('tiles', 256, (ctx, n) => {
    const rows = 6
    const h = n / rows
    const w = h * 0.9
    for (let r = 0; r < rows; r++) {
      const y = r * h
      ctx.fillStyle = grey(0.985 - (r % 2) * 0.025)
      ctx.fillRect(0, y, n, h)
      ctx.fillStyle = grey(0.82)
      ctx.fillRect(0, y + h - 3, n, 3)
      ctx.fillStyle = grey(0.9)
      const offset = r % 2 ? w / 2 : 0
      for (let c = 0; c <= n / w + 1; c++) ctx.fillRect(c * w + offset - 1, y, 2, h - 3)
    }
  })
}

/** Cobbles: rounded stones on a darker bed, for the plaza and the loop. */
export function cobbleTexture(): CanvasTexture {
  return canvasTexture('cobble', 256, (ctx, n) => {
    const rand = seeded(19)
    ctx.fillStyle = grey(0.86)
    ctx.fillRect(0, 0, n, n)
    const cell = 32
    for (let j = 0; j < n / cell; j++) {
      for (let i = 0; i < n / cell; i++) {
        const x = i * cell + cell / 2 + (rand() - 0.5) * 4
        const y = j * cell + cell / 2 + (rand() - 0.5) * 4
        ctx.fillStyle = grey(0.93 + rand() * 0.07)
        ctx.beginPath()
        ctx.ellipse(x, y, cell * 0.42, cell * 0.36, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  })
}

/** Awning stripes: white and one color, on a white material. Four stripes per unit. */
function stripeTexture(color: ColorRepresentation): CanvasTexture {
  const css = `#${new Color(color).getHexString()}`
  return canvasTexture(`stripes:${css}`, 128, (ctx, n) => {
    ctx.fillStyle = css
    ctx.fillRect(0, 0, n / 4, n)
    ctx.fillRect(n / 2, 0, n / 4, n)
  })
}

/** UVs from the position, in world units, so a texture keeps its size on every box and slope. */
export function worldUVs(g: BufferGeometry, scale = 1): BufferGeometry {
  if (!g.getAttribute('normal')) g.computeVertexNormals()
  const position = g.getAttribute('position')
  const normal = g.getAttribute('normal')
  const uv = new Float32Array(position.count * 2)
  for (let i = 0; i < position.count; i++) {
    const nx = Math.abs(normal.getX(i))
    const ny = Math.abs(normal.getY(i))
    const nz = Math.abs(normal.getZ(i))
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)
    let u = x
    let v = y
    if (ny >= nx && ny >= nz) v = z
    else if (nx >= nz) u = z
    uv[i * 2] = u * scale
    uv[i * 2 + 1] = v * scale
  }
  g.setAttribute('uv', new BufferAttribute(uv, 2))
  return g
}

// ---- building blocks -----------------------------------------------------------------------------

/** One geometry from many, all made plain first so boxes and slopes merge. The parts go. */
export function merge(parts: BufferGeometry[]): BufferGeometry {
  const plain = parts.map((g) => (g.index ? g.toNonIndexed() : g))
  const merged = mergeGeometries(plain)!
  for (const g of parts) g.dispose()
  for (const g of plain) if (!parts.includes(g)) g.dispose()
  return merged
}

/** A box at a place, turned first if asked. */
export function boxAt(sx: number, sy: number, sz: number, x: number, y: number, z: number, rot: { x?: number; y?: number; z?: number } = {}): BufferGeometry {
  const g = new BoxGeometry(sx, sy, sz)
  if (rot.x) g.rotateX(rot.x)
  if (rot.z) g.rotateZ(rot.z)
  if (rot.y) g.rotateY(rot.y)
  g.translate(x, y, z)
  return g
}

function flat(positions: number[]): BufferGeometry {
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  g.computeVertexNormals()
  return worldUVs(g)
}

const tri = (a: number[], b: number[], c: number[]) => [...a, ...b, ...c]

/**
 * A hip roof: four slopes to a short ridge along X. Base at y = 0, `width`
 * and `depth` include the overhang. `ridge` 0 makes a pyramid. Flat faces,
 * so the toon bands read.
 */
export function hipRoofGeometry(width: number, depth: number, height: number, ridge = 0.45): BufferGeometry {
  const w = width / 2
  const d = depth / 2
  const r = (width * ridge) / 2
  const A = [-w, 0, d]
  const B = [w, 0, d]
  const C = [w, 0, -d]
  const D = [-w, 0, -d]
  const P = [-r, height, 0]
  const Q = [r, height, 0]
  return flat([
    ...tri(A, B, Q), ...tri(A, Q, P), // front slope
    ...tri(C, D, P), ...tri(C, P, Q), // back slope
    ...tri(B, C, Q), // right end
    ...tri(D, A, P), // left end
    ...tri(D, C, B), ...tri(D, B, A), // bottom
  ])
}

/** A gable roof: two slabs to a ridge along X, open at the ends. The gable walls close them. */
export function gableRoofGeometry(width: number, depth: number, height: number, thickness = 0.06): BufferGeometry {
  const w = width / 2
  const d = depth / 2
  const t = thickness
  const A = [-w, 0, d]
  const B = [w, 0, d]
  const C = [w, 0, -d]
  const D = [-w, 0, -d]
  const P = [-w, height, 0]
  const Q = [w, height, 0]
  const A2 = [-w, t, d]
  const B2 = [w, t, d]
  const C2 = [w, t, -d]
  const D2 = [-w, t, -d]
  const P2 = [-w, height + t, 0]
  const Q2 = [w, height + t, 0]
  return flat([
    ...tri(A2, B2, Q2), ...tri(A2, Q2, P2), // front slope
    ...tri(C2, D2, P2), ...tri(C2, P2, Q2), // back slope
    ...tri(B, A, P), ...tri(B, P, Q), // under the front slope
    ...tri(D, C, Q), ...tri(D, Q, P), // under the back slope
    ...tri(A, B, B2), ...tri(A, B2, A2), // front eave
    ...tri(C, D, D2), ...tri(C, D2, C2), // back eave
    ...tri(B, Q, Q2), ...tri(B, Q2, B2), ...tri(Q, C, C2), ...tri(Q, C2, Q2), // right edge
    ...tri(P, A, A2), ...tri(P, A2, P2), ...tri(D, P, P2), ...tri(D, P2, D2), // left edge
  ])
}

/** The two triangles that close a gable roof, in the wall color. */
export function gableEndsGeometry(width: number, depth: number, height: number): BufferGeometry {
  const w = width / 2
  const d = depth / 2
  return flat([
    ...tri([w, 0, d], [w, 0, -d], [w, height, 0]),
    ...tri([-w, 0, -d], [-w, 0, d], [-w, height, 0]),
  ])
}

export interface AttachOptions {
  width?: number
  boil?: number
  map?: Texture
  /** Texture tiles per world unit. */
  uv?: number
}

/** Adds a volume of its own color to an element: a roof, a chimney, the timbers. */
export function attach(el: ArtElement, geometry: BufferGeometry, color: ColorRepresentation, options: AttachOptions = {}): Mesh {
  const { width = 2.0, boil = 0.25, map, uv = 1 } = options
  if (map) worldUVs(geometry, uv)
  const material = createToonMaterial({ color })
  if (map) material.map = map
  const mesh = new Mesh(geometry, material)
  const hull = new Mesh(hullGeometry(geometry), createOutlineMaterial({ width, color: inkOf(color, palette.outline), boil }))
  hull.renderOrder = -1
  el.body.add(hull, mesh)
  return mesh
}

/** The element of a building: its body in `color`, with a texture when asked. */
export function building(name: string, geometry: BufferGeometry, color: ColorRepresentation, map?: Texture, uv = 1): ArtElement {
  const material = createToonMaterial({ color })
  if (map) {
    worldUVs(geometry, uv)
    material.map = map
  }
  return assemble(name, geometry, material, { width: 2.2, color: inkOf(color, palette.outline), boil: 0.25 })
}

/** The parts of a building, by color, attached at the end. */
export class Parts {
  stone: BufferGeometry[] = []
  timber: BufferGeometry[] = []
  tiles: BufferGeometry[] = []
  tilesDark: BufferGeometry[] = []
  plaster: BufferGeometry[] = []
  dark: BufferGeometry[] = []

  attachTo(el: ArtElement, plaster: ColorRepresentation, tile: ColorRepresentation = town.tile): void {
    if (this.stone.length) attach(el, merge(this.stone), town.stone, { map: stoneTexture(), width: 2.0 })
    if (this.tiles.length) attach(el, merge(this.tiles), tile, { map: tileTexture(), uv: 2, width: 2.2 })
    if (this.tilesDark.length) attach(el, merge(this.tilesDark), town.tileDark, { map: tileTexture(), uv: 2, width: 2.2 })
    if (this.plaster.length) attach(el, merge(this.plaster), plaster, { width: 2.0 })
    if (this.timber.length) attach(el, merge(this.timber), town.timber, { width: 1.3 })
    if (this.dark.length) attach(el, merge(this.dark), palette.outline, { width: 1.0 })
  }
}

export const T = 0.07

/**
 * The timbers of a half-timbered floor: corner posts, beams at the top and
 * the bottom, studs on the front and the back, and braces in the middle bays
 * of the front. Returns the centers of the front bays, so windows go in the
 * outer ones.
 */
export function timberFrame(p: Parts, w: number, h: number, d: number, y0: number, z0 = 0, braces = true): number[] {
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) p.timber.push(boxAt(T, h, T, x, y0 + h / 2, z0 + z))
  for (const y of [y0 + T / 2, y0 + h - T / 2]) {
    for (const z of [-d / 2, d / 2]) p.timber.push(boxAt(w + T, T, T, 0, y, z0 + z))
    for (const x of [-w / 2, w / 2]) p.timber.push(boxAt(T, T, d + T, x, y, z0))
  }
  const n = Math.max(1, Math.round(w / 0.5))
  const bay = w / n
  for (let i = 1; i < n; i++) {
    const x = -w / 2 + i * bay
    for (const z of [-d / 2, d / 2]) p.timber.push(boxAt(T * 0.8, h, T, x, y0 + h / 2, z0 + z))
  }
  for (const z of [-d / 4, d / 4]) p.timber.push(boxAt(T, h, T * 0.8, w / 2, y0 + h / 2, z0 + z))
  const bays = Array.from({ length: n }, (_, i) => -w / 2 + (i + 0.5) * bay)
  if (braces && n >= 2) {
    const len = Math.hypot(bay, h - T * 2) * 0.92
    const angle = Math.atan2(bay, h - T * 2)
    const inner = n >= 3 ? bays.slice(1, -1) : [bays[n - 1]!]
    inner.forEach((x, i) => p.timber.push(boxAt(T * 0.8, len, T * 0.6, x, y0 + h / 2, z0 + d / 2, { z: i % 2 ? angle : -angle })))
  }
  return bays
}

/** A window: dark glass, a timber frame and two shutters, on a face that looks +Z or +X. */
export function addWindow(p: Parts, x: number, y: number, z: number, side = false, w = 0.2, h = 0.22): void {
  if (!side) {
    p.dark.push(boxAt(w, h, 0.03, x, y, z + 0.03))
    p.timber.push(boxAt(w + 0.06, h + 0.06, 0.02, x, y, z + 0.02))
    for (const s of [-1, 1]) p.timber.push(boxAt(0.08, h, 0.03, x + s * (w / 2 + 0.07), y, z + 0.025))
  } else {
    p.dark.push(boxAt(0.03, h, w, x + 0.03, y, z))
    p.timber.push(boxAt(0.02, h + 0.06, w + 0.06, x + 0.02, y, z))
    for (const s of [-1, 1]) p.timber.push(boxAt(0.03, h, 0.08, x + 0.025, y, z + s * (w / 2 + 0.07)))
  }
}

/** A door: dark planks in a timber frame, on a face that looks +Z. Its sill is at `y0`. */
export function addDoor(p: Parts, x: number, y0: number, z: number, w = 0.3, h = 0.5): void {
  p.dark.push(boxAt(w, h, 0.03, x, y0 + h / 2, z + 0.03))
  p.timber.push(boxAt(w + 0.08, h + 0.04, 0.02, x, y0 + h / 2 + 0.02, z + 0.02))
}

/** A chimney with a cap, through a roof. */
export function addChimney(p: Parts, x: number, yTop: number, z: number, height = 0.6): void {
  p.stone.push(boxAt(0.18, height, 0.18, x, yTop - height / 2, z))
  p.stone.push(boxAt(0.24, 0.05, 0.24, x, yTop + 0.025, z))
}

/** A flag: a pole and a pennant. The pennant is its own color, so it is attached apart. */
export function addFlag(el: ArtElement, p: Parts, x: number, y: number, z: number, color: ColorRepresentation): void {
  p.timber.push(boxAt(0.035, 0.6, 0.035, x, y + 0.3, z))
  attach(el, boxAt(0.3, 0.15, 0.02, x + 0.17, y + 0.5, z), color, { width: 1.4 })
}

/** A dormer on the front slope of a roof: a small box with a gable across the slope and a window. */
export function addDormer(p: Parts, x: number, roofY: number, roofH: number, roofDepth: number): void {
  const zs = roofDepth / 4
  const ys = roofY + roofH / 2
  p.plaster.push(boxAt(0.34, 0.3, 0.36, x, ys + 0.05, zs))
  const g = gableRoofGeometry(0.46, 0.5, 0.2, 0.04)
  g.rotateY(Math.PI / 2)
  g.translate(x, ys + 0.2, zs)
  p.tiles.push(g)
  p.dark.push(boxAt(0.16, 0.16, 0.03, x, ys + 0.05, zs + 0.19))
  p.timber.push(boxAt(0.22, 0.22, 0.02, x, ys + 0.05, zs + 0.18))
}

// ---- buildings -----------------------------------------------------------------------------------

export interface HouseOptions {
  width?: number
  depth?: number
  /** A two-storey house has a stone ground floor and a jettied timber floor above it. */
  storeys?: 1 | 2
  roof?: 'hip' | 'gable'
  color?: ColorRepresentation
  roofColor?: ColorRepresentation
  chimney?: boolean
  dormer?: boolean
  windows?: number
  /** A lower wing on the +X side, so the house is an L. */
  wing?: boolean
}

/**
 * A house: a stone base, a half-timbered floor, a tiled roof with a ridge
 * cap, shutters, a door, a chimney. Its base sits at y = 0 and its front
 * faces +Z. The body is the plaster of the timber floor.
 */
export function createHouse(options: HouseOptions & { flag?: ColorRepresentation | false } = {}) {
  const { width = 2.0, depth = 1.5, storeys = 2, roof = 'hip', color = town.wall, roofColor = town.tile, chimney = true, dormer = storeys === 2, windows = 2, wing = false, flag = false } = options
  const baseH = storeys === 2 ? 0.42 : 0.14
  const floorH = storeys === 2 ? 0.56 : 0.62
  const jetty = storeys === 2 ? 0.08 : 0
  const fw = width + jetty * 2
  const fd = depth + jetty * 2
  const roofY = baseH + floorH
  const roofH = roof === 'gable' ? 0.62 : 0.55
  const walls = new BoxGeometry(fw, floorH, fd)
  walls.translate(0, baseH + floorH / 2, 0)
  const el = building('house', walls, color)
  const p = new Parts()
  p.stone.push(boxAt(width, baseH, depth, 0, baseH / 2, 0))
  const bays = timberFrame(p, fw, floorH, fd, baseH)
  const roofDepth = fd + 0.36
  if (roof === 'gable') {
    const g = gableRoofGeometry(fw + 0.2, roofDepth, roofH)
    g.translate(0, roofY, 0)
    p.tiles.push(g)
    const ends = gableEndsGeometry(fw, roofDepth, roofH - 0.01)
    ends.translate(0, roofY, 0)
    p.plaster.push(ends)
    p.timber.push(boxAt(fw + 0.26, 0.05, 0.1, 0, roofY + roofH + 0.06, 0))
  } else {
    const g = hipRoofGeometry(fw + 0.36, roofDepth, roofH)
    g.translate(0, roofY, 0)
    p.tiles.push(g)
    p.timber.push(boxAt((fw + 0.36) * 0.45 + 0.1, 0.05, 0.1, 0, roofY + roofH + 0.02, 0))
  }
  if (chimney) addChimney(p, -fw * 0.3, roofY + roofH * 0.7 + 0.25, -fd * 0.15, roofH * 0.7 + 0.3)
  if (dormer) addDormer(p, fw * 0.22, roofY, roofH, roofDepth)
  // A pennant on the ridge, in the color that names the house.
  if (flag) addFlag(el, p, roof === 'gable' ? fw / 2 - 0.25 : (fw + 0.36) * 0.18, roofY + roofH + 0.04, 0, flag)
  // The front: windows in the outer bays of the timber floor, the door below or in the first bay.
  const wy = baseH + floorH * 0.55
  const front = fd / 2
  const at = windows >= 2 ? [bays[0]!, bays[bays.length - 1]!] : [bays[bays.length - 1]!]
  for (const x of at.slice(0, windows)) addWindow(p, x, wy, front)
  addWindow(p, fw / 2, wy, 0, true)
  if (storeys === 2) {
    addDoor(p, bays[0]!, 0, depth / 2, 0.3, 0.38)
    p.dark.push(boxAt(0.16, 0.14, 0.03, bays[bays.length - 1]!, baseH * 0.6, depth / 2 + 0.03))
  } else {
    addDoor(p, bays[0]!, baseH, front, 0.3, floorH * 0.7)
  }
  if (wing) {
    const ww = width * 0.6
    const wd = depth * 0.8
    const wx = fw / 2 + ww / 2 - 0.06
    const wz = depth * 0.08
    const wh = baseH + floorH * 0.55
    p.stone.push(boxAt(ww, baseH, wd, wx, baseH / 2, wz))
    p.plaster.push(boxAt(ww, wh - baseH, wd, wx, baseH + (wh - baseH) / 2, wz))
    const g = hipRoofGeometry(ww + 0.3, wd + 0.3, roofH * 0.7)
    g.translate(wx, wh, wz)
    p.tilesDark.push(g)
    addWindow(p, wx + ww / 2, wh * 0.72, wz, true, 0.16, 0.18)
  }
  p.attachTo(el, color, roofColor)
  return el
}

/**
 * The town center: a cobbled platform, a stone ground floor behind an arcade
 * of columns, a jettied half-timbered floor, a big hip roof with dormers and
 * two chimneys, a turret with a flag, and two lower wings. Big and closed:
 * the hall. Its front faces +Z.
 */
export function createTownCenter(options: { flag?: ColorRepresentation | false } = {}) {
  const { flag = false } = options
  const groundY = 0.14
  const groundH = 0.78
  const upperY = groundY + groundH
  const upperH = 0.7
  const upper = new BoxGeometry(3.2, upperH, 2.6)
  upper.translate(0, upperY + upperH / 2, -0.1)
  const el = building('townCenter', upper, town.wall)
  const p = new Parts()
  attach(el, boxAt(4.6, 0.14, 4.0, 0, 0.07, 0), town.cobble, { map: cobbleTexture(), uv: 1.5, width: 2.2 })
  p.stone.push(boxAt(2.8, groundH, 1.9, 0, groundY + groundH / 2, -0.35))
  for (let i = 0; i < 5; i++) {
    const c = new CylinderGeometry(0.08, 0.09, groundH, 10)
    c.translate(-1.2 + i * 0.6, groundY + groundH / 2, 1.0)
    p.stone.push(c)
  }
  p.timber.push(boxAt(3.3, 0.08, 0.12, 0, upperY, 1.2))
  timberFrame(p, 3.2, upperH, 2.6, upperY, -0.1)
  const roofY = upperY + upperH
  const roofH = 0.8
  const roofDepth = 3.0
  const g = hipRoofGeometry(3.6, roofDepth, roofH)
  g.translate(0, roofY, -0.1)
  p.tiles.push(g)
  p.timber.push(boxAt(3.6 * 0.45 + 0.1, 0.05, 0.1, 0, roofY + roofH + 0.02, -0.1))
  addDormer(p, -0.6, roofY, roofH, roofDepth)
  addDormer(p, 0.6, roofY, roofH, roofDepth)
  addChimney(p, 1.1, roofY + roofH * 0.75 + 0.25, -0.6, roofH * 0.75 + 0.3)
  addChimney(p, -0.5, roofY + roofH * 0.6 + 0.25, -1.0, roofH * 0.6 + 0.3)
  // The turret, at the back left corner, with the flag.
  const tx = -1.25
  const tz = -0.75
  p.stone.push(boxAt(0.6, 2.3, 0.6, tx, groundY + 1.15, tz))
  const turretRoof = hipRoofGeometry(0.84, 0.84, 0.45, 0)
  turretRoof.translate(tx, groundY + 2.3, tz)
  p.tilesDark.push(turretRoof)
  p.dark.push(boxAt(0.1, 0.22, 0.03, tx, groundY + 1.9, tz + 0.315))
  if (flag) addFlag(el, p, tx, groundY + 2.75, tz, flag)
  // The wings: the left one a little forward, so it shows past the main block.
  for (const [x, z] of [[-2.15, 0.5], [2.15, -0.3]] as const) {
    p.stone.push(boxAt(1.1, 0.34, 1.4, x, groundY + 0.17, z))
    p.plaster.push(boxAt(1.1, 0.36, 1.4, x, groundY + 0.34 + 0.18, z))
    const wr = hipRoofGeometry(1.4, 1.7, 0.38)
    wr.translate(x, groundY + 0.7, z)
    p.tilesDark.push(wr)
    addWindow(p, x, groundY + 0.5, z + 0.7, false, 0.18, 0.18)
  }
  // The big door, and the windows of the upper floor.
  p.dark.push(boxAt(0.64, 0.62, 0.03, 0, groundY + 0.31, 0.63))
  p.timber.push(boxAt(0.74, 0.68, 0.02, 0, groundY + 0.33, 0.62))
  p.timber.push(boxAt(0.03, 0.62, 0.035, 0, groundY + 0.31, 0.645))
  for (const x of [-0.95, 0, 0.95]) addWindow(p, x, upperY + upperH * 0.55, 1.2, false, 0.22, 0.24)
  addWindow(p, 1.6, upperY + upperH * 0.55, -0.1, true, 0.22, 0.24)
  p.attachTo(el, town.wall)
  return el
}

/**
 * A mill: a tapered stone tower, a half-timbered top with a thatched roof, and
 * a door. Its sails are another element (createBlades), so they can turn.
 */
export function createMill(options: { color?: ColorRepresentation; roofColor?: ColorRepresentation; flag?: ColorRepresentation | false } = {}) {
  const { color = town.wall, roofColor = town.thatch, flag = false } = options
  const topY = 1.1
  const topH = 0.55
  const top = new BoxGeometry(0.9, topH, 0.9)
  top.translate(0, topY + topH / 2, 0)
  const el = building('mill', top, color)
  const p = new Parts()
  const base = new CylinderGeometry(0.4, 0.52, topY, 12, 1)
  base.translate(0, topY / 2, 0)
  attach(el, base, town.stoneDark, { width: 2.2 })
  timberFrame(p, 0.9, topH, 0.9, topY, 0, false)
  const roof = hipRoofGeometry(1.2, 1.2, 0.42, 0.2)
  roof.translate(0, topY + topH, 0)
  p.tiles.push(roof)
  if (flag) addFlag(el, p, 0, topY + topH + 0.42, 0, flag)
  addDoor(p, 0, 0, 0.49, 0.28, 0.44)
  addWindow(p, -0.45, topY + topH * 0.55, 0, true, 0.16, 0.18)
  p.attachTo(el, color, roofColor)
  return el
}

/** The four sails of a mill, in the XY plane, the hub at the origin: spars, lattice bars and cloth. Ambient turns `inner`. */
export function createBlades(options: { length?: number; color?: ColorRepresentation } = {}) {
  const { length = 1.9, color = town.timber } = options
  const spars: BufferGeometry[] = []
  const cloths: BufferGeometry[] = []
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2
    spars.push(boxAt(0.05, length / 2, 0.05, 0, length / 4 + 0.06, 0, { z: a }))
    for (let k = 0; k < 4; k++) spars.push(boxAt(0.32, 0.02, 0.03, 0.16, 0.32 + k * 0.17, 0, { z: a }))
    cloths.push(boxAt(0.26, length / 2 - 0.36, 0.015, 0.17, length / 4 + 0.16, 0, { z: a }))
  }
  const hub = new CylinderGeometry(0.1, 0.1, 0.12, 10)
  hub.rotateX(Math.PI / 2)
  spars.push(hub)
  const el = assemble('blades', merge(spars), createToonMaterial({ color }), { width: 1.4, color: inkOf(color, palette.outline), boil: 0.25 })
  attach(el, merge(cloths), town.cloth, { width: 1.4 })
  return el
}

/**
 * A square stone watchtower: arrow slits, a wooden hoarding near the top, a
 * tiled pyramid roof and a flag.
 */
export function createTower(options: { width?: number; height?: number; flag?: ColorRepresentation } = {}) {
  const { width = 0.95, height = 2.2, flag = palette.lilac } = options
  const body = new BoxGeometry(width, height, width)
  body.translate(0, height / 2, 0)
  const el = building('tower', body, town.stone, stoneTexture())
  const p = new Parts()
  const hw = width + 0.36
  p.timber.push(boxAt(hw, 0.42, hw, 0, height + 0.21, 0))
  for (const x of [-1, 1]) for (const z of [-1, 1]) p.timber.push(boxAt(0.08, 0.22, 0.08, x * (width / 2 + 0.06), height - 0.11, z * (width / 2 + 0.06)))
  const roof = hipRoofGeometry(hw + 0.24, hw + 0.24, 0.62, 0)
  roof.translate(0, height + 0.42, 0)
  p.tiles.push(roof)
  const f = width / 2
  p.dark.push(boxAt(0.08, 0.28, 0.03, -0.16, height * 0.45, f + 0.015))
  p.dark.push(boxAt(0.08, 0.28, 0.03, 0.16, height * 0.72, f + 0.015))
  p.dark.push(boxAt(0.03, 0.28, 0.08, f + 0.015, height * 0.6, 0.1))
  for (const x of [-0.3, 0, 0.3]) p.dark.push(boxAt(0.12, 0.12, 0.03, x, height + 0.21, hw / 2 + 0.015))
  for (const z of [-0.3, 0, 0.3]) p.dark.push(boxAt(0.03, 0.12, 0.12, hw / 2 + 0.015, height + 0.21, z))
  addDoor(p, 0, 0, f, 0.3, 0.5)
  addFlag(el, p, 0, height + 1.04, 0, flag)
  p.attachTo(el, town.stone)
  return el
}

/**
 * A gate over a road that runs along X: two stone towers with hoardings and
 * tiled roofs, an arch with merlons between them, a stub of crenellated wall
 * on each side, and two open door leaves. Its front faces -X.
 */
export function createGate(options: { span?: number; roofColor?: ColorRepresentation; flag?: ColorRepresentation | false } = {}) {
  const { span = 1.5, roofColor = town.tileDark, flag = false } = options
  const tw = 0.8
  const th = 1.75
  const zt = span / 2 + tw / 2
  const stone: BufferGeometry[] = []
  for (const z of [-zt, zt]) stone.push(boxAt(tw, th, tw, 0, th / 2, z))
  stone.push(boxAt(0.6, 0.45, span, 0, 1.05 + 0.225, 0))
  for (let i = 0; i < 3; i++) for (const x of [-0.22, 0.22]) stone.push(boxAt(0.16, 0.18, 0.16, x, 1.05 + 0.45 + 0.09, -span / 2 + 0.25 + i * ((span - 0.5) / 2)))
  for (const s of [-1, 1]) {
    const z = s * (zt + tw / 2 + 0.7)
    stone.push(boxAt(0.36, 1.0, 1.4, 0, 0.5, z))
    for (let i = 0; i < 3; i++) for (const x of [-0.1, 0.1]) stone.push(boxAt(0.16, 0.18, 0.16, x, 1.09, z - 0.5 + i * 0.5))
  }
  const el = building('gate', merge(stone), town.stone, stoneTexture())
  const p = new Parts()
  for (const z of [-zt, zt]) {
    p.timber.push(boxAt(tw + 0.2, 0.36, tw + 0.2, 0, th + 0.18, z))
    const roof = hipRoofGeometry(tw + 0.4, tw + 0.4, 0.5, 0)
    roof.translate(0, th + 0.36, z)
    p.tiles.push(roof)
    p.dark.push(boxAt(0.03, 0.26, 0.08, -tw / 2 - 0.015, 1.1, z))
    p.dark.push(boxAt(0.03, 0.12, 0.12, -(tw + 0.2) / 2 - 0.015, th + 0.18, z))
  }
  // The leaves, open toward the road that comes in.
  const left = boxAt(0.05, 0.9, 0.7, 0, 0.45, 0.35, { y: -1.15 })
  left.translate(-0.3, 0, -span / 2)
  const right = boxAt(0.05, 0.9, 0.7, 0, 0.45, -0.35, { y: 1.15 })
  right.translate(-0.3, 0, span / 2)
  p.timber.push(left, right)
  if (flag) addFlag(el, p, 0, th + 0.86, -zt, flag)
  p.attachTo(el, town.stone, roofColor)
  return el
}

/**
 * A market stall: a wooden counter with goods, four posts, a striped awning
 * and two barrels. Its front faces +Z.
 */
export function createStall(options: { width?: number; depth?: number; awning?: ColorRepresentation; goods?: ColorRepresentation[] } = {}) {
  const { width = 1.3, depth = 0.9, awning = town.tile, goods = [palette.butter, palette.peach, palette.sage] } = options
  const wood: BufferGeometry[] = [boxAt(width, 0.1, depth * 0.55, 0, 0.5, depth * 0.2), boxAt(width, 0.42, 0.06, 0, 0.21, depth * 0.2 + depth * 0.275)]
  for (const z of [depth * 0.1, depth * 0.1 - 0.3]) {
    const barrel = new CylinderGeometry(0.13, 0.13, 0.32, 10)
    barrel.translate(width / 2 + 0.22, 0.16, z)
    wood.push(barrel)
  }
  const el = building('stall', merge(wood), town.wood)
  const p = new Parts()
  for (const x of [-(width / 2 - 0.05), width / 2 - 0.05]) {
    for (const z of [-depth / 2, depth / 2]) {
      const post = new CylinderGeometry(0.03, 0.03, 1.05, 8)
      post.translate(x, 0.525, z)
      p.timber.push(post)
    }
  }
  p.timber.push(boxAt(width, 0.05, 0.05, 0, 1.02, -depth / 2), boxAt(width, 0.05, 0.05, 0, 0.9, depth / 2))
  const cover = boxAt(width + 0.3, 0.035, depth + 0.35, 0, 0, 0, { x: 0.28 })
  cover.translate(0, 0.99, 0.02)
  attach(el, cover, '#ffffff', { map: stripeTexture(awning), width: 2.0 })
  goods.forEach((color, i) => attach(el, boxAt(0.18, 0.18, 0.18, (i - (goods.length - 1) / 2) * 0.36, 0.64, depth * 0.2), color, { width: 1.4 }))
  p.attachTo(el, town.wood)
  return el
}

/** A well: a stone ring, two posts and a small tiled roof. */
export function createWell() {
  const ring = new CylinderGeometry(0.36, 0.38, 0.42, 12)
  ring.translate(0, 0.21, 0)
  const el = building('well', ring, town.stone, stoneTexture())
  const p = new Parts()
  p.dark.push(boxAt(0.5, 0.02, 0.5, 0, 0.43, 0))
  for (const x of [-0.3, 0.3]) p.timber.push(boxAt(0.06, 0.62, 0.06, x, 0.42 + 0.31, 0))
  p.timber.push(boxAt(0.66, 0.05, 0.05, 0, 1.0, 0))
  const roof = gableRoofGeometry(0.8, 0.7, 0.24, 0.04)
  roof.translate(0, 1.04, 0)
  p.tiles.push(roof)
  p.attachTo(el, town.stone)
  return el
}

/** A fence along a path of straight segments: posts and two rails. `closed` joins the ends. */
export function createFence(points: V3[], options: { closed?: boolean } = {}) {
  const pts = options.closed ? [...points, points[0]!] : points
  const parts: BufferGeometry[] = []
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay, az] = pts[i - 1]!
    const [bx, , bz] = pts[i]!
    const len = Math.hypot(bx - ax, bz - az)
    const angle = -Math.atan2(bz - az, bx - ax)
    for (const y of [0.18, 0.34]) parts.push(boxAt(len, 0.035, 0.03, (ax + bx) / 2, ay + y, (az + bz) / 2, { y: angle }))
    const posts = Math.max(1, Math.round(len / 0.6))
    for (let k = 0; k <= posts; k++) {
      const t = k / posts
      parts.push(boxAt(0.06, 0.46, 0.06, ax + (bx - ax) * t, ay + 0.23, az + (bz - az) * t))
    }
  }
  return assemble('fence', merge(parts), createToonMaterial({ color: town.timber }), { width: 1.3, color: inkOf(town.timber, palette.outline), boil: 0.25 })
}

// ---- the land ------------------------------------------------------------------------------------

/**
 * The land the town stands on: a wide green plane with soft patches, its top
 * at y = 0. With `height`, its vertices rise into hills.
 */
export function createLand(options: { size?: number; color?: ColorRepresentation; height?: (x: number, z: number) => number; segments?: number } = {}) {
  const { size = 100, color = town.grass, height, segments = height ? 110 : 1 } = options
  const g = new PlaneGeometry(size, size, segments, segments)
  g.rotateX(-Math.PI / 2)
  if (height) {
    const position = g.getAttribute('position')
    for (let i = 0; i < position.count; i++) position.setY(i, height(position.getX(i), position.getZ(i)))
    g.computeVertexNormals()
  }
  const material = createToonMaterial({ color })
  const map = landTexture()
  map.repeat.set(size / 12, size / 12)
  material.map = map
  const el = assemble('land', g, material, { width: 0, opacity: 0 })
  el.hull.visible = false
  return el
}

/** A road: a flat strip along a path of straight segments. Sand, or cobbles. */
export function createRoad(points: V3[], options: { width?: number; color?: ColorRepresentation; loop?: boolean; cobbled?: boolean } = {}) {
  const { width = 1.1, color = town.sand, loop = false, cobbled = false } = options
  const pts = loop ? [...points, points[0]!] : points
  const strips: BufferGeometry[] = []
  for (let i = 1; i < pts.length; i++) {
    const [ax, , az] = pts[i - 1]!
    const [bx, , bz] = pts[i]!
    const len = Math.hypot(bx - ax, bz - az)
    strips.push(boxAt(len + width, 0.05, width, (ax + bx) / 2, 0.025, (az + bz) / 2, { y: -Math.atan2(bz - az, bx - ax) }))
  }
  return building('road', merge(strips), cobbled ? town.cobble : color, cobbled ? cobbleTexture() : undefined, 1.5)
}

/** Fields: flat tilled plots, as one swarm. Place each with `place`, paint it, then commit. */
export function createFields(count: number): Swarm {
  const g = new BoxGeometry(1.9, 0.08, 1.3)
  g.translate(0, 0.04, 0)
  return createSwarm({ count, geometry: g, color: town.field, outline: { width: 1.6, color: inkOf(town.field, palette.outline), boil: 0.2 } })
}

/** The rows of a field: a swarm of thin dark boxes. */
export function createRows(count: number): Swarm {
  const g = new BoxGeometry(1.6, 0.03, 0.06)
  g.translate(0, 0.085, 0)
  return createSwarm({ count, geometry: g, color: town.fieldDark, outline: { width: 0, opacity: 0 } })
}

/** Hay bales, lying by the fields. */
export function createBales(count: number): Swarm {
  const g = new CylinderGeometry(0.16, 0.16, 0.3, 10)
  g.rotateZ(Math.PI / 2)
  g.translate(0, 0.16, 0)
  return createSwarm({ count, geometry: g, color: town.hay, outline: { width: 1.6, color: inkOf(town.hay, palette.outline) } })
}

/** Trees: trunks and crowns as swarms that share positions. */
export function createTrunks(count: number): Swarm {
  const g = new CylinderGeometry(0.06, 0.1, 0.6, 8)
  g.translate(0, 0.3, 0)
  return createSwarm({ count, geometry: g, color: town.wood, outline: { width: 1.8, color: inkOf(town.wood, palette.outline) } })
}

/** Round trees: a lumpy crown of four spheres. */
export function createCanopies(count: number): Swarm {
  const a = new SphereGeometry(0.42, 12, 9)
  a.scale(1, 1.1, 1)
  a.translate(0, 0.86, 0)
  const b = new SphereGeometry(0.3, 10, 8)
  b.translate(0.24, 0.66, 0.18)
  const c = new SphereGeometry(0.27, 10, 8)
  c.translate(-0.22, 0.72, -0.14)
  const d = new SphereGeometry(0.24, 10, 8)
  d.translate(0.04, 1.18, -0.06)
  return createSwarm({ count, geometry: merge([a, b, c, d]), color: town.leaf, outline: { width: 2, color: inkOf(town.leaf, palette.outline) } })
}

/** Pines: three cones. */
export function createPines(count: number): Swarm {
  const a = new ConeGeometry(0.4, 0.7, 9)
  a.translate(0, 0.62, 0)
  const b = new ConeGeometry(0.31, 0.62, 9)
  b.translate(0, 1.05, 0)
  const c = new ConeGeometry(0.2, 0.52, 9)
  c.translate(0, 1.45, 0)
  return createSwarm({ count, geometry: merge([a, b, c]), color: town.pine, outline: { width: 2, color: inkOf(town.pine, palette.outline) } })
}

/** Bushes: small round crowns on the ground. */
export function createBushes(count: number): Swarm {
  const g = new SphereGeometry(0.3, 12, 9)
  g.scale(1.3, 0.8, 1)
  g.translate(0, 0.22, 0)
  return createSwarm({ count, geometry: g, color: town.leafLight, outline: { width: 1.8, color: inkOf(town.leafLight, palette.outline) } })
}

/** Rocks: low grey boulders, angular like the stone of the walls. */
export function createRocks(count: number): Swarm {
  const g = new DodecahedronGeometry(0.34, 0)
  g.scale(1.4, 0.55, 1.0)
  g.translate(0, 0.16, 0)
  return createSwarm({ count, geometry: g, color: town.stoneDark, outline: { width: 1.8, color: inkOf(town.stoneDark, palette.outline) } })
}

/** Flowers: small clusters of three dots, low in the grass. Paint each one. */
export function createFlowers(count: number): Swarm {
  const dots: BufferGeometry[] = []
  for (const [x, z, r] of [
    [0, 0, 0.045],
    [0.07, 0.03, 0.038],
    [-0.035, 0.065, 0.036],
  ] as const) {
    const d = new SphereGeometry(r, 8, 6)
    d.translate(x, r, z)
    dots.push(d)
  }
  return createSwarm({ count, geometry: merge(dots), color: palette.peach, outline: { width: 1.0, color: palette.outline } })
}

// ---- belts ---------------------------------------------------------------------------------------

/** A path of straight segments through points, by distance, so a belt keeps its corners. */
export function polyline(points: V3[]): PathFn {
  const lengths: number[] = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const [ax, ay, az] = points[i - 1]!
    const [bx, by, bz] = points[i]!
    const l = Math.hypot(bx - ax, by - ay, bz - az)
    lengths.push(l)
    total += l
  }
  return (u, out) => {
    let d = Math.min(1, Math.max(0, u)) * total
    for (let i = 0; i < lengths.length; i++) {
      const l = lengths[i]!
      if (d <= l || i === lengths.length - 1) {
        const t = l > 0 ? Math.min(1, d / l) : 0
        const a = points[i]!
        const b = points[i + 1]!
        return out.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)
      }
      d -= l
    }
    const last = points[points.length - 1]!
    return out.set(last[0], last[1], last[2])
  }
}

/**
 * A conveyor belt: a dashed line through points, just above the ground. Its
 * dashes move with `beltRun` (ambient), and `reveal` draws it as the town is
 * built. `loop` closes it.
 */
export function createBelt(points: V3[], options: { color?: ColorRepresentation; width?: number; loop?: boolean; reveal?: number; dashSize?: number; gapSize?: number } = {}): SketchLine {
  const { color = palette.outline, width = 2.6, loop = false, reveal = 0, dashSize = 0.22, gapSize = 0.16 } = options
  const raised = points.map(([x, y, z]) => [x, y + 0.08, z] as V3)
  const path = polyline(loop ? [...raised, raised[0]!] : raised)
  return createSketchLine({ path, segments: Math.max(60, points.length * 30), wobble: 0, variants: 1, dashed: true, dashSize, gapSize, width, color, reveal })
}

/** Ambient for a belt: the dashes travel. It writes only the dash offset, which no timeline writes. */
export function beltRun(line: SketchLine, time: number, speed = 0.9): void {
  line.material.dashOffset = -time * speed
}

// ---- trails and ropes ---------------------------------------------------------------------------

/** The tone of a trail worn in the grass. */
export const ground = { trail: '#C8B896' } as const

/**
 * A trail: a path worn in the grass where work has gone. A wide line in the
 * tone of dirt, no dashes, on the ground. `wobble` for a path that did not
 * repeat.
 */
export function createTrail(path: PathFn, options: { segments?: number; wobble?: number; width?: number; color?: ColorRepresentation; opacity?: number; reveal?: number } = {}): SketchLine {
  const { segments = 90, wobble = 0, width = 5, color = ground.trail, opacity = 1, reveal = 1 } = options
  return createSketchLine({ path, segments, wobble, width, color, opacity, reveal, variants: 3 })
}

/** A stake: a square post with a pointed top. The base sits at y = 0. */
export function stakeGeometry(height = 0.5, side = 0.09): BufferGeometry {
  const post = boxAt(side, height, side, 0, height / 2, 0)
  const tip = new ConeGeometry(side * 0.83, side * 1.45, 4)
  tip.rotateY(Math.PI / 4)
  tip.translate(0, height + side * 0.72, 0)
  return merge([post, tip])
}


// ---- people ------------------------------------------------------------------------------------------

/**
 * A villager: the chibi of the astronaut with a head and a hat instead of a
 * helmet. No face. Feet at y = 0, facing +Z. `shirt` and `hat` tell people
 * apart.
 */
export function createVillager(options: { shirt?: ColorRepresentation; hat?: ColorRepresentation; size?: number } = {}) {
  const { shirt = palette.surface, hat = palette.peach, size = 1.0 } = options
  const head = new SphereGeometry(0.17, 24, 18)
  head.translate(0, 0.56, 0)
  const parts = [
    head,
    part(0.14, 0.1, [0, 0.31, 0]),
    part(0.066, 0.06, [-0.072, 0.1, 0], [0, 0, 0.08]),
    part(0.066, 0.06, [0.072, 0.1, 0], [0, 0, -0.08]),
    part(0.058, 0.11, [-0.195, 0.29, 0], [0, 0, -0.45]),
    part(0.058, 0.11, [0.195, 0.29, 0], [0, 0, 0.45]),
  ]
  const body = merge(parts)
  body.scale(size, size, size)
  const el = assemble('villager', body, createToonMaterial({ color: shirt }), { width: 2.2, color: inkOf(shirt, palette.outline) })
  const brim = new CylinderGeometry(0.21, 0.21, 0.035, 20)
  brim.translate(0, 0.66, 0)
  const crown = new CylinderGeometry(0.12, 0.13, 0.13, 16)
  crown.translate(0, 0.74, 0)
  const hatGeometry = merge([brim, crown])
  hatGeometry.scale(size, size, size)
  attach(el, hatGeometry, hat, { width: 1.8 })
  return el
}
