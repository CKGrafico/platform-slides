/**
 * Point clouds: the one renderer of the world (docs/art/art-direction.md).
 *
 * A form is a set of beads on the surface of a low-poly geometry. The beads
 * sit on a regular grid inside each face, so a surface reads as a faceted,
 * beaded volume. The shader draws each bead as a flat, matte dot, shaded per
 * face from one fixed key, so density reads as light. No glow, no specular.
 */
import { BufferAttribute, BufferGeometry, Color, Matrix3, Matrix4, Points, ShaderMaterial, Vector3 } from 'three'

export interface SampledSurface {
  position: Float32Array
  normal: Float32Array
  seed: Float32Array
}

/** Small deterministic random, so a form is the same on every build. */
function rng(seed: number): () => number {
  let s = (seed >>> 0) || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/**
 * Sample `count` points over the triangles of a geometry, area weighted, with
 * interpolated normals. The same geometry and seed give the same points.
 */
export function sampleSurface(geometry: BufferGeometry, count: number, seed = 1): SampledSurface {
  const g = geometry.index ? geometry.toNonIndexed() : geometry
  if (!g.getAttribute('normal')) g.computeVertexNormals()
  const pos = g.getAttribute('position')
  const normal = g.getAttribute('normal')
  const tris = Math.floor(pos.count / 3)

  const a = new Vector3()
  const b = new Vector3()
  const c = new Vector3()
  const ab = new Vector3()
  const ac = new Vector3()
  const cr = new Vector3()
  const areas = new Float32Array(tris)
  let total = 0
  for (let t = 0; t < tris; t++) {
    a.fromBufferAttribute(pos, t * 3)
    b.fromBufferAttribute(pos, t * 3 + 1)
    c.fromBufferAttribute(pos, t * 3 + 2)
    ab.subVectors(b, a)
    ac.subVectors(c, a)
    cr.crossVectors(ab, ac)
    const ar = cr.length() * 0.5
    areas[t] = ar
    total += ar
  }

  const r = rng(seed)
  const position = new Float32Array(count * 3)
  const normals = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const p = new Vector3()
  const n = new Vector3()
  for (let i = 0; i < count; i++) {
    let x = r() * total
    let t = 0
    while (t < tris - 1 && x > areas[t]!) {
      x -= areas[t]!
      t++
    }
    let u = r()
    let v = r()
    if (u + v > 1) {
      u = 1 - u
      v = 1 - v
    }
    const w = 1 - u - v
    a.fromBufferAttribute(pos, t * 3)
    b.fromBufferAttribute(pos, t * 3 + 1)
    c.fromBufferAttribute(pos, t * 3 + 2)
    p.set(a.x * w + b.x * u + c.x * v, a.y * w + b.y * u + c.y * v, a.z * w + b.z * u + c.z * v)
    a.fromBufferAttribute(normal, t * 3)
    b.fromBufferAttribute(normal, t * 3 + 1)
    c.fromBufferAttribute(normal, t * 3 + 2)
    n.set(a.x * w + b.x * u + c.x * v, a.y * w + b.y * u + c.y * v, a.z * w + b.z * u + c.z * v).normalize()
    position[i * 3] = p.x
    position[i * 3 + 1] = p.y
    position[i * 3 + 2] = p.z
    normals[i * 3] = n.x
    normals[i * 3 + 1] = n.y
    normals[i * 3 + 2] = n.z
    seeds[i] = r()
  }
  if (g !== geometry) g.dispose()
  return { position, normal: normals, seed: seeds }
}

/**
 * Beads on a regular grid inside every face. Each triangle splits into k by k
 * cells and one bead sits at the centre of each cell, so no two faces share a
 * bead and the spacing is even. The normal is the flat normal of the face, so
 * the shading steps from face to face and the facets read clearly.
 * `spacing` is in the geometry's own units.
 */
export function sampleSurfaceGrid(geometry: BufferGeometry, spacing: number, seed = 1): SampledSurface {
  const g = geometry.index ? geometry.toNonIndexed() : geometry
  const pos = g.getAttribute('position')
  const tris = Math.floor(pos.count / 3)
  const a = new Vector3()
  const b = new Vector3()
  const c = new Vector3()
  const ab = new Vector3()
  const ac = new Vector3()
  const n = new Vector3()
  const centroid = new Vector3()
  const r = rng(seed)
  const position: number[] = []
  const normal: number[] = []
  const seeds: number[] = []

  const bead = (u: number, v: number) => {
    const w = 1 - u - v
    position.push(a.x * w + b.x * u + c.x * v, a.y * w + b.y * u + c.y * v, a.z * w + b.z * u + c.z * v)
    normal.push(n.x, n.y, n.z)
    seeds.push(r())
  }

  for (let t = 0; t < tris; t++) {
    a.fromBufferAttribute(pos, t * 3)
    b.fromBufferAttribute(pos, t * 3 + 1)
    c.fromBufferAttribute(pos, t * 3 + 2)
    ab.subVectors(b, a)
    ac.subVectors(c, a)
    n.crossVectors(ab, ac).normalize()
    centroid.copy(a).add(b).add(c).divideScalar(3)
    if (n.dot(centroid) < 0) n.negate()
    const edge = Math.max(a.distanceTo(b), b.distanceTo(c), c.distanceTo(a))
    const k = Math.max(1, Math.round(edge / spacing))
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k - i; j++) {
        bead((i + 1 / 3) / k, (j + 1 / 3) / k)
        if (i + j < k - 1) bead((i + 2 / 3) / k, (j + 2 / 3) / k)
      }
    }
  }
  if (g !== geometry) g.dispose()
  return { position: Float32Array.from(position), normal: Float32Array.from(normal), seed: Float32Array.from(seeds) }
}

const VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute vec3 aColor;
  attribute vec3 aScatter;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uFluidity;
  uniform float uAssemble;
  uniform vec3 uKey;
  varying vec3 vColor;
  varying float vShade;
  void main() {
    // uAssemble 1 puts every bead on its unit; 0 leaves it in the scatter field.
    vec3 p = position + aScatter * (1.0 - uAssemble);
    // uFluidity makes a reasoning entity breathe; a rigid one stays still.
    p += normal * sin(uTime * 1.6 + aSeed * 43.0) * uFluidity * 0.05;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    float d = max(0.0, dot(n, normalize(uKey)));
    vShade = 0.30 + 0.70 * d;
    vColor = aColor;
    gl_PointSize = uSize * uPixelRatio * (0.9 + 0.2 * aSeed);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(vColor * vShade, 1.0);
  }
`

export interface PointMaterialOptions {
  /** Base point size in device pixels, before the pixel ratio. */
  size?: number
  /** The one key direction, from the upper left. */
  key?: readonly [number, number, number]
  pixelRatio?: number
}

/** A flat, matte point material. No lights, no specular, no glow. */
export function createPointMaterial(options: PointMaterialOptions = {}): ShaderMaterial {
  const [kx, ky, kz] = options.key ?? [-0.45, 0.8, 0.4]
  return new ShaderMaterial({
    uniforms: {
      uSize: { value: options.size ?? 2.6 },
      uPixelRatio: { value: options.pixelRatio ?? 1 },
      uTime: { value: 0 },
      uFluidity: { value: 1 },
      uAssemble: { value: 1 },
      uKey: { value: new Vector3(kx, ky, kz).normalize() },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  })
}

export interface PointPart {
  geometry: BufferGeometry
  /** Where the part sits, in the cloud's local space. */
  matrix?: Matrix4
  color: Color | number | string
  /** Random beads over the surface. Ignored when `spacing` is set. */
  count?: number
  /** Beads on a regular grid inside each face, this far apart in the geometry's own units. */
  spacing?: number
}

/**
 * Merge many parts into one Points object. The geometry carries position,
 * normal, a per bead seed, colour and scatter offset. All parts share the material.
 */
export function buildPointCloud(parts: PointPart[], material: ShaderMaterial, seed = 1): Points {
  const samples = parts.map((part, index) =>
    part.spacing ? sampleSurfaceGrid(part.geometry, part.spacing, seed + index) : sampleSurface(part.geometry, part.count ?? 400, seed + index),
  )
  let total = 0
  for (const sample of samples) total += sample.seed.length

  const position = new Float32Array(total * 3)
  const normal = new Float32Array(total * 3)
  const aSeed = new Float32Array(total)
  const aColor = new Float32Array(total * 3)
  const aScatter = new Float32Array(total * 3)
  const v = new Vector3()
  const n = new Vector3()
  const normalMatrix = new Matrix3()
  const color = new Color()
  const scatter = rng(seed * 7 + 13)
  let offset = 0
  parts.forEach((part, index) => {
    const sample = samples[index]!
    const count = sample.seed.length
    const nm = part.matrix ? normalMatrix.getNormalMatrix(part.matrix) : null
    color.set(part.color)
    for (let i = 0; i < count; i++) {
      v.set(sample.position[i * 3]!, sample.position[i * 3 + 1]!, sample.position[i * 3 + 2]!)
      n.set(sample.normal[i * 3]!, sample.normal[i * 3 + 1]!, sample.normal[i * 3 + 2]!)
      if (part.matrix) {
        v.applyMatrix4(part.matrix)
        n.applyMatrix3(nm!).normalize()
      }
      const o = (offset + i) * 3
      position[o] = v.x
      position[o + 1] = v.y
      position[o + 2] = v.z
      normal[o] = n.x
      normal[o + 1] = n.y
      normal[o + 2] = n.z
      aColor[o] = color.r
      aColor[o + 1] = color.g
      aColor[o + 2] = color.b
      aSeed[offset + i] = sample.seed[i]!
      const sx = scatter() * 2 - 1
      const sy = scatter() * 2 - 1
      const sz = scatter() * 2 - 1
      const sl = Math.hypot(sx, sy, sz) || 1
      const sm = 0.6 + scatter() * 1.6
      aScatter[o] = (sx / sl) * sm
      aScatter[o + 1] = (sy / sl) * sm
      aScatter[o + 2] = (sz / sl) * sm
    }
    offset += count
  })

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(position, 3))
  geometry.setAttribute('normal', new BufferAttribute(normal, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(aSeed, 1))
  geometry.setAttribute('aColor', new BufferAttribute(aColor, 3))
  geometry.setAttribute('aScatter', new BufferAttribute(aScatter, 3))
  geometry.computeBoundingSphere()

  const points = new Points(geometry, material)
  points.frustumCulled = false
  points.userData.dispose = () => {
    material.dispose()
    geometry.dispose()
    for (const part of parts) part.geometry.dispose()
  }
  return points
}
