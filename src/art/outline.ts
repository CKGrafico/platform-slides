/**
 * Boiling outlines, drawn as an inverted hull.
 *
 * The hull is the same shape with smooth normals, pushed out in clip space by a
 * width in screen pixels, and drawn with back faces only. So the outline has the
 * same thickness at any distance, and costs one extra draw per element.
 *
 * The boil: the width and a small offset change with a stepped seed
 * (artUniforms.uBoil), so the line wobbles a few times per second like a hand
 * drawing, and holds still in between.
 */
import { BackSide, Color, ShaderMaterial, type BufferGeometry, type ColorRepresentation } from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { artUniforms } from './clock'
import { palette } from './palette'

const vertexShader = /* glsl */ `
#include <common>
uniform float uWidth;
uniform float uBoilAmp;
uniform float uBoil;
uniform vec2 uResolution;

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

void main() {
  vec4 local = vec4(position, 1.0);
  vec3 n = normal;
  // World scale of the element. A shrinking element (an exit) takes its
  // outline with it, instead of leaving a dot of fixed screen width.
  float objScale = length(modelMatrix[0].xyz);
  #ifdef USE_INSTANCING
    local = instanceMatrix * local;
    n = mat3(instanceMatrix) * n;
    objScale *= length(instanceMatrix[0].xyz);
  #endif
  vec4 clip = projectionMatrix * modelViewMatrix * local;
  vec3 nView = normalize(normalMatrix * n);
  vec2 dir = (projectionMatrix * vec4(nView, 0.0)).xy;
  float len = length(dir);
  dir = len > 1e-5 ? dir / len : vec2(0.0);

  // Stepped noise per vertex: the hand-drawn wobble.
  float a = hash13(position * 3.7 + uBoil);
  float b = hash13(position * 5.3 - uBoil * 1.37);
  // Widths are authored for a 1080 px tall frame and scale with the frame.
  float scale = uResolution.y / 1080.0;
  float width = uWidth * scale * (1.0 + uBoilAmp * (a * 2.0 - 1.0)) * smoothstep(0.0, 0.12, objScale);
  vec2 jitter = (vec2(a, b) - 0.5) * uBoilAmp * uWidth * scale * 0.9;

  clip.xy += (dir * width + jitter) * 2.0 / uResolution * clip.w;
  gl_Position = clip;
}
`

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity);
  #include <colorspace_fragment>
}
`

export interface OutlineOptions {
  /** Width in pixels of a 1080 px tall frame. It scales with the frame. Default 3. */
  width?: number
  color?: ColorRepresentation
  /** Wobble strength as a share of the width. Default 0.35. */
  boil?: number
  opacity?: number
}

export type OutlineMaterial = ShaderMaterial & {
  uniforms: {
    uWidth: { value: number }
    uBoilAmp: { value: number }
    uColor: { value: Color }
    uOpacity: { value: number }
  }
}

export function createOutlineMaterial(options: OutlineOptions = {}): OutlineMaterial {
  const { width = 3, color = palette.outline, boil = 0.35, opacity = 1 } = options
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: BackSide,
    transparent: opacity < 1,
    uniforms: {
      uWidth: { value: width },
      uBoilAmp: { value: boil },
      uColor: { value: new Color(color) },
      uOpacity: { value: opacity },
      uBoil: artUniforms.uBoil,
      uResolution: artUniforms.uResolution,
    },
  }) as OutlineMaterial
}

/**
 * A copy of the geometry with shared vertices and smooth normals, so the hull
 * has no gaps at hard edges (cube corners).
 */
export function hullGeometry(geometry: BufferGeometry): BufferGeometry {
  const g = geometry.clone()
  g.deleteAttribute('normal')
  g.deleteAttribute('uv')
  const merged = mergeVertices(g, 1e-4)
  merged.computeVertexNormals()
  g.dispose()
  return merged
}
