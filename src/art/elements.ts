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
  BoxGeometry,
  type BufferAttribute,
  Group,
  Mesh,
  SphereGeometry,
  TorusGeometry,
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

/** A deterministic piece. Sharp edges. */
export function createCube(options: { size?: number; color?: ColorRepresentation; outline?: OutlineOptions } = {}) {
  const { size = 1, color = palette.surface, outline } = options
  return assemble('cube', new BoxGeometry(size, size, size), createToonMaterial({ color }), outline)
}

/**
 * The model: a planet whose surface bubbles and never keeps its shape. It is the
 * only element that moves by time (ambient), and time stops under reduced
 * motion (the art clock passes 0). Body and outline deform with the same noise.
 */
export function createCore(options: { radius?: number; outline?: OutlineOptions } = {}): ArtElement<MonolithMaterial> {
  const { radius = 1, outline } = options
  const geometry = new SphereGeometry(radius, 64, 48)
  const el = assemble('core', geometry, createMonolithMaterial(), { width: 3.5, color: palette.text, ...outline })
  const targets = [el.body.geometry, el.hull.geometry].map((g) => {
    const pos = g.attributes.position as BufferAttribute
    return { g, pos, dirs: Float32Array.from(pos.array as ArrayLike<number>).map((v) => v / radius) }
  })
  const deform = (time: number) => {
    const t = time * 0.35
    for (const { g, pos, dirs } of targets) {
      const a = pos.array as Float32Array
      for (let i = 0; i < a.length; i += 3) {
        const x = dirs[i]!, y = dirs[i + 1]!, z = dirs[i + 2]!
        const n = Math.sin(x * 2.3 + t) * Math.sin(y * 2.9 - t * 0.8) * Math.sin(z * 2.6 + t * 1.3) + 0.5 * Math.sin(x * 4.1 - y * 3.7 + t * 1.7)
        const r = radius * (1 + 0.075 * n)
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
  return el
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
