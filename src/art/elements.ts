/**
 * The element kit. One factory per element in docs/art/elements.md.
 *
 * Every element is three nested parts, so each property has one owner:
 * - `object`: the choreography moves, scales, and turns this one.
 * - `inner`: entrances, exits, and the settle animate this one (motion.ts).
 * - `body` and `hull`: the toon or monolith surface, and the boiling outline.
 * Every factory returns { object, inner, body, hull, dispose }.
 */
import {
  BoxGeometry,
  Group,
  Mesh,
  SphereGeometry,
  TorusGeometry,
  type BufferGeometry,
  type ColorRepresentation,
  type Material,
  type Object3D,
} from 'three'
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

/** A deterministic piece. Sharp edges. */
export function createCube(options: { size?: number; color?: ColorRepresentation; outline?: OutlineOptions } = {}) {
  const { size = 1, color = palette.surface, outline } = options
  return assemble('cube', new BoxGeometry(size, size, size), createToonMaterial({ color }), outline)
}

/**
 * The model. Proportions 1:4:9 (depth, width, height), like the slab in
 * 2001 and in The Monolith Project. `height` is in world units.
 */
export function createMonolith(options: { height?: number; outline?: OutlineOptions } = {}): ArtElement<MonolithMaterial> {
  const { height = 2.25, outline } = options
  const unit = height / 9
  return assemble('monolith', new BoxGeometry(unit * 4, height, unit), createMonolithMaterial(), { width: 3.5, ...outline })
}

/** An event or a work item. The blue ball is the issue. */
export function createBall(options: { radius?: number; color?: ColorRepresentation; outline?: OutlineOptions } = {}) {
  const { radius = 0.12, color = palette.surface, outline } = options
  return assemble('ball', new SphereGeometry(radius, 24, 16), createToonMaterial({ color }), { width: 2.5, ...outline })
}

/** A gate that puts one ball on one path. Flat ring, lying on the XZ plane. */
export function createCaptureRing(options: { radius?: number; tube?: number; color?: ColorRepresentation; outline?: OutlineOptions } = {}) {
  const { radius = 0.6, tube = 0.08, color = palette.lilac, outline } = options
  const geometry = new TorusGeometry(radius, tube, 12, 64)
  geometry.rotateX(Math.PI / 2)
  return assemble('ring', geometry, createToonMaterial({ color }), outline)
}
