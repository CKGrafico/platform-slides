/**
 * Point clouds: the one renderer of the world (docs/art/art-direction.md).
 *
 * A form is a set of points sampled on the surface of a geometry. The shader
 * draws each point as a flat, matte dot, shaded from one fixed key, so density
 * reads as light and the surface stays faceted. No glow, no specular. Points
 * land on faces, so a low-poly unit never reads as a smooth sphere.
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
    // uAssemble 1 puts every point on its unit; 0 leaves it in the scatter field.
    vec3 p = position + aScatter * (1.0 - uAssemble);
    // uFluidity makes a reasoning entity breathe; a rigid one stays still.
    p += normal * sin(uTime * 1.6 + aSeed * 43.0) * uFluidity * 0.05;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    float d = max(0.0, dot(n, normalize(uKey)));
    vShade = 0.28 + 0.72 * d;
    vColor = aColor;
    gl_PointSize = uSize * uPixelRatio * (0.85 + 0.35 * aSeed);
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
  count: number
}

/**
 * Merge many parts into one Points object. The geometry carries position,
 * normal, a per point seed and a per point colour. All parts share the material.
 */
export function buildPointCloud(parts: PointPart[], material: ShaderMaterial, seed = 1): Points {
  let total = 0
  for (const part of parts) total += part.count

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
  let s = seed
  for (const part of parts) {
    const sample = sampleSurface(part.geometry, part.count, s++)
    const nm = part.matrix ? normalMatrix.getNormalMatrix(part.matrix) : null
    color.set(part.color)
    for (let i = 0; i < part.count; i++) {
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
    offset += part.count
  }

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
