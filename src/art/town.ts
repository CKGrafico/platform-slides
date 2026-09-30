/**
 * The town kit: buildings, belts and villagers for the map of the second half
 * (docs/art/town-proposal.md). Built like the rest of the kit: toon volumes in
 * the palette, an ink outline that boils, and the object > inner > body split,
 * so one property has one owner. A building's roof, chimney and door are
 * children of its body, so they enter, leave and scale with it.
 */
import { BoxGeometry, BufferAttribute, BufferGeometry, ConeGeometry, CylinderGeometry, Mesh, SphereGeometry, type ColorRepresentation } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { assemble, part, type ArtElement } from './elements'
import { createSketchLine, type PathFn, type SketchLine } from './lines'
import { createOutlineMaterial, hullGeometry } from './outline'
import { palette } from './palette'
import { createToonMaterial, inkOf } from './toon'

type V3 = readonly [number, number, number]

/** Adds a second volume of its own color to an element: a roof, a chimney, a hat. */
function attach(el: ArtElement, geometry: BufferGeometry, color: ColorRepresentation, width = 2.5): Mesh {
  const mesh = new Mesh(geometry, createToonMaterial({ color }))
  const hull = new Mesh(hullGeometry(geometry), createOutlineMaterial({ width, color: inkOf(color, palette.outline) }))
  hull.renderOrder = -1
  el.body.add(hull, mesh)
  return mesh
}

/** A gable roof: a prism with its ridge along X, its base at y = 0. Flat faces, so the toon bands read. */
function gableGeometry(width: number, depth: number, height: number): BufferGeometry {
  const w = width / 2
  const d = depth / 2
  const v = [
    [-w, 0, d], [w, 0, d], [0, height, d], // front triangle
    [-w, 0, -d], [w, 0, -d], [0, height, -d], // back triangle
  ]
  const faces = [
    [0, 1, 2], // front
    [4, 3, 5], // back
    [0, 2, 5], [0, 5, 3], // left slope
    [2, 1, 4], [2, 4, 5], // right slope
    [3, 4, 1], [3, 1, 0], // bottom
  ]
  const positions: number[] = []
  for (const f of faces) for (const i of f) positions.push(...v[i]!)
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  g.computeVertexNormals()
  return g
}

export interface HouseOptions {
  width?: number
  depth?: number
  height?: number
  roofHeight?: number
  color?: ColorRepresentation
  roofColor?: ColorRepresentation
  chimney?: boolean
  /** A door on the front (+Z) face. */
  door?: boolean
}

/** A house: a box with a gable roof. Its base sits at y = 0 and its front faces +Z. */
export function createHouse(options: HouseOptions = {}) {
  const { width = 1.6, depth = 1.3, height = 1.0, roofHeight = 0.6, color = palette.surface, roofColor = palette.lilac, chimney = false, door = true } = options
  const walls = new BoxGeometry(width, height, depth)
  walls.translate(0, height / 2, 0)
  const el = assemble('house', walls, createToonMaterial({ color }), { width: 2.5, color: inkOf(color, palette.outline), boil: 0.25 })
  const roof = gableGeometry(width + 0.24, depth + 0.24, roofHeight)
  roof.translate(0, height, 0)
  attach(el, roof, roofColor)
  if (chimney) {
    const c = new BoxGeometry(0.22, 0.5, 0.22)
    c.translate(width * 0.28, height + roofHeight * 0.55, 0)
    attach(el, c, color)
  }
  if (door) {
    const d = new BoxGeometry(Math.min(0.42, width * 0.3), height * 0.55, 0.06)
    d.translate(0, height * 0.275, depth / 2 + 0.02)
    attach(el, d, palette.outline, 1.5)
  }
  return el
}

/** A round tower with a cone roof: the watchtower. */
export function createTower(options: { radius?: number; height?: number; color?: ColorRepresentation; roofColor?: ColorRepresentation } = {}) {
  const { radius = 0.36, height = 1.7, color = palette.surface, roofColor = palette.sage } = options
  const body = new CylinderGeometry(radius, radius * 1.08, height, 18, 1)
  body.translate(0, height / 2, 0)
  const el = assemble('tower', body, createToonMaterial({ color }), { width: 2.5, color: inkOf(color, palette.outline), boil: 0.25 })
  const roof = new ConeGeometry(radius * 1.4, 0.6, 18, 1)
  roof.translate(0, height + 0.3, 0)
  attach(el, roof, roofColor)
  return el
}

/** A gate over a belt: two square posts and a lintel, with small pyramid roofs. Faces +Z; the belt runs along X. */
export function createGate(options: { span?: number; height?: number; color?: ColorRepresentation; roofColor?: ColorRepresentation } = {}) {
  const { span = 1.4, height = 1.3, color = palette.surface, roofColor = palette.peach } = options
  const post = (x: number) => {
    const g = new BoxGeometry(0.5, height, 0.5)
    g.translate(x, height / 2, 0)
    return g
  }
  const lintel = new BoxGeometry(span + 1.0, 0.32, 0.4)
  lintel.translate(0, height - 0.16, 0)
  const posts = [post(-(span / 2 + 0.25)), post(span / 2 + 0.25), lintel]
  const merged = mergeGeometries(posts)!
  posts.forEach((g) => g.dispose())
  const el = assemble('gate', merged, createToonMaterial({ color }), { width: 2.5, color: inkOf(color, palette.outline), boil: 0.25 })
  for (const x of [-(span / 2 + 0.25), span / 2 + 0.25]) {
    const roof = new ConeGeometry(0.42, 0.42, 4, 1)
    roof.rotateY(Math.PI / 4)
    roof.translate(x, height + 0.21, 0)
    attach(el, roof, roofColor)
  }
  return el
}

/** The ground of the town: a flat slab of paper, its top at y = 0. */
export function createPlot(options: { width?: number; depth?: number; color?: ColorRepresentation } = {}) {
  const { width = 28, depth = 15, color = palette.surface } = options
  const g = new BoxGeometry(width, 0.14, depth)
  g.translate(0, -0.07, 0)
  return assemble('plot', g, createToonMaterial({ color }), { width: 3, boil: 0.2 })
}

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
  const { color = palette.outline, width = 3.2, loop = false, reveal = 0, dashSize = 0.24, gapSize = 0.18 } = options
  const raised = points.map(([x, y, z]) => [x, y + 0.03, z] as V3)
  const path = polyline(loop ? [...raised, raised[0]!] : raised)
  return createSketchLine({ path, segments: Math.max(60, points.length * 30), wobble: 0, variants: 1, dashed: true, dashSize, gapSize, width, color, reveal })
}

/** Ambient for a belt: the dashes travel. It writes only the dash offset, which no timeline writes. */
export function beltRun(line: SketchLine, time: number, speed = 0.9): void {
  line.material.dashOffset = -time * speed
}

/**
 * A villager: the chibi of the astronaut with a head and a hat instead of a
 * helmet. No face. Feet at y = 0, facing +Z. `shirt` and `hat` tell people
 * apart.
 */
export function createVillager(options: { shirt?: ColorRepresentation; hat?: ColorRepresentation; size?: number } = {}) {
  const { shirt = palette.surface, hat = palette.peach, size = 1.25 } = options
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
  const body = mergeGeometries(parts)!
  parts.forEach((g) => g.dispose())
  body.scale(size, size, size)
  const el = assemble('villager', body, createToonMaterial({ color: shirt }), { width: 2.5, color: inkOf(shirt, palette.outline) })
  const brim = new CylinderGeometry(0.21, 0.21, 0.035, 20)
  brim.translate(0, 0.66, 0)
  const crown = new CylinderGeometry(0.12, 0.13, 0.13, 16)
  crown.translate(0, 0.74, 0)
  const hatGeometry = mergeGeometries([brim, crown])!
  brim.dispose()
  crown.dispose()
  hatGeometry.scale(size, size, size)
  attach(el, hatGeometry, hat, 2)
  return el
}
