import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import { BufferAttribute, Euler, Matrix4, Mesh, Quaternion, Vector3, type Points, type ShaderMaterial } from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { createAsciiDepthMaterial, createAsciiMaterial } from './ascii'
import { buildPointCloud, type PointPart } from './points'
import { palette } from './palette'

/** A machined unit with square and hexagonal faces. */
type UnitShape = 'cell' | 'block' | 'prism' | 'slab'

function unitGeometry(shape: UnitShape = 'cell') {
  const vertices: Vector3[] = []
  if (shape !== 'cell') {
    const half = shape === 'slab' ? [1.0, 0.35, 0.85] : shape === 'prism' ? [0.72, 1.35, 0.72] : [0.86, 0.86, 0.86]
    const bevel = shape === 'slab' ? 0.16 : 0.24
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      for (let axis = 0; axis < 3; axis++) {
        const xyz = [x * half[0]!, y * half[1]!, z * half[2]!]
        xyz[axis] = [x, y, z][axis]! * (half[axis]! - bevel)
        vertices.push(new Vector3(...xyz))
      }
    }
    return new ConvexGeometry(vertices)
  }
  for (let zero = 0; zero < 3; zero++) {
    for (const swap of [false, true]) {
      for (const a of [-1, 1]) {
        for (const b of [-1, 1]) {
          const xyz = [0, 0, 0]
          xyz[(zero + 1) % 3] = a * (swap ? 2 : 1)
          xyz[(zero + 2) % 3] = b * (swap ? 1 : 2)
          vertices.push(new Vector3(...xyz).multiplyScalar(1 / Math.sqrt(5)))
        }
      }
    }
  }
  return new ConvexGeometry(vertices)
}

export interface FormUnit {
  at: readonly [number, number, number]
  size: number
  rotation?: readonly [number, number, number]
  shape?: UnitShape
}

/** One draw call for an aggregate. Surface spacing is measured in world units. */
export function createForm(units: FormUnit[], seed: number, spacing = 0.34, glyphSize = 13): Points {
  const parts: PointPart[] = units.map(({ at, size, rotation, shape }) => ({
    geometry: unitGeometry(shape),
    matrix: new Matrix4().compose(new Vector3(...at), new Quaternion().setFromEuler(new Euler(...(rotation ?? [0, 0, 0]))), new Vector3(size, size, size)),
    color: palette.ink,
    spacing: spacing / size,
  }))
  const object = buildPointCloud(parts, createAsciiMaterial(glyphSize), seed)
  object.userData.units = units
  object.userData.formSeed = seed
  object.userData.workPart = units.length - 1
  const centers = new Float32Array(object.geometry.getAttribute('position').count * 3)
  const phases = new Float32Array(object.geometry.getAttribute('position').count)
  const positions = object.geometry.getAttribute('position')
  const owners = object.geometry.getAttribute('aPart')
  for (let i = 0; i < positions.count; i++) {
    const owner = owners.getX(i)
    centers.set(units[owner]!.at, i * 3)
    phases[i] = owner * 2.399 + seed * 0.17
  }
  object.geometry.setAttribute('aCenter', new BufferAttribute(centers, 3))
  object.geometry.setAttribute('aUnitPhase', new BufferAttribute(phases, 1))
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

export function cluster(seed: number, size = 1): Points {
  const units: FormUnit[] = [
    { at: [-3.7, 0, 0], size: 3.2, shape: 'block', rotation: [0.12, 0.18, 0] },
    { at: [1.4, 3.8, -1.1], size: 3.4, shape: 'block', rotation: [0, 0.24, 0.2] },
    { at: [3.6, -1.4, 1.3], size: 3.0, rotation: [0.12, -0.12, 0.05] },
    { at: [-0.4, -4.1, 1.1], size: 2.9, shape: 'block', rotation: [0.2, 0.1, 0.12] },
    { at: [-5.5, 4.1, -1.4], size: 1.25, shape: 'block' },
    { at: [5.3, -4.5, -1.7], size: 1.5 },
    { at: [5.7, 4.7, -2.4], size: 1.0, shape: 'prism', rotation: [0, 0, 0.3] },
    { at: [-4.2, -4.8, -2.2], size: 1.0 },
    { at: [-1.5, 5.4, 3.4], size: 1.0, shape: 'slab', rotation: [0.1, 0.4, 0] },
    { at: [1.4, -1.4, -4.1], size: 1.6, shape: 'slab' },
    { at: [7, 1.1, 1.2], size: 0.65, shape: 'block' },
    { at: [-6.9, -2.3, 2.4], size: 0.8 },
    { at: [3.2, -5.9, 3.2], size: 0.55, shape: 'block' },
    { at: [-2.4, 3.4, -4.3], size: 0.65 },
  ]
  return createForm(units.map((u) => ({ ...u, at: u.at.map((n) => n * size) as [number, number, number], size: u.size * size })), seed, 0.34 * size)
}

export function lattice(seed: number, cols = 3, rows = 2, layers = 2): Points {
  const units: FormUnit[] = []
  for (let x = 0; x < cols; x++) {
    for (let z = 0; z < rows; z++) {
      for (let y = 0; y < layers; y++) {
        units.push({ at: [(x - (cols - 1) / 2) * 2.5, (y - (layers - 1) / 2) * 2.1, (z - (rows - 1) / 2) * 2.5], size: 1.05, shape: 'block' })
      }
    }
  }
  return createForm(units, seed, 0.24, 11)
}

export function constraint(seed: number, opening = false): Points {
  const units: FormUnit[] = []
  for (let x = -3; x <= 3; x++) {
    for (let y = -2; y <= 2; y++) {
      if (opening && Math.abs(x) <= 1 && Math.abs(y) <= 1) continue
      units.push({ at: [x * 1.7, y * 1.7, 0], size: 0.88, shape: 'block' })
      if ((Math.abs(x) === 3 || Math.abs(y) === 2) && (x + y) % 2 === 0) {
        units.push({ at: [x * 1.7, y * 1.7, -1.9], size: 0.88, shape: 'block' })
      }
    }
  }
  return createForm(units, seed, 0.23, 11)
}

/** An aligned frame with an open center and two rows in depth. */
export function frame(seed: number): Points {
  const units: FormUnit[] = []
  for (const z of [-1.6, 1.6]) {
    for (const x of [-3.2, 3.2]) for (const y of [-2.2, 0, 2.2]) {
      units.push({ at: [x, y, z], size: 0.8, shape: 'prism' })
    }
    for (const y of [-4, 4]) for (const x of [-2.2, 0, 2.2]) {
      units.push({ at: [x, y, z], size: 1, shape: 'slab' })
    }
  }
  return createForm(units, seed, 0.23, 11)
}

/** Repeated blocks form a stepped assembly with a visible side profile. */
export function steps(seed: number): Points {
  const units: FormUnit[] = []
  for (let x = 0; x < 4; x++) for (let y = 0; y <= x; y++) for (const z of [-1.2, 1.2]) {
    units.push({ at: [(x - 1.5) * 2.3, y * 2.1 - 3.1, z], size: 1, shape: 'block' })
  }
  return createForm(units, seed, 0.24, 11)
}
