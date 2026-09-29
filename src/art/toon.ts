/**
 * Toon shading with two light bands, in the craft of The Monolith Project.
 * One shared gradient map, nearest filtering, no smooth falloff.
 *
 * Spheres (planets, balls, people) can also get the highlight of a flat
 * illustration: a small hard white spot near the upper left edge. It is fixed
 * in view space, so every planet shows it in the same place, like a drawing.
 */
import { Color, DataTexture, MeshToonMaterial, NearestFilter, RedFormat, type ColorRepresentation } from 'three'

let gradient: DataTexture | null = null

/** Two bands: the shadow band and the light band. */
export function toonGradient(): DataTexture {
  if (gradient) return gradient
  // Shadow at 58% light, full light above the threshold.
  const data = new Uint8Array([148, 255])
  gradient = new DataTexture(data, data.length, 1, RedFormat)
  gradient.minFilter = NearestFilter
  gradient.magFilter = NearestFilter
  gradient.generateMipmaps = false
  gradient.needsUpdate = true
  return gradient
}

export interface ToonOptions {
  color: ColorRepresentation
  opacity?: number
  /** The white highlight spot of an illustrated planet. For spheres only. */
  highlight?: boolean
}

const HIGHLIGHT = /* glsl */ `
  // Illustrated highlight: a small hard white spot near the upper left edge.
  {
    float hl = dot(normalize(normal), normalize(vec3(-0.5, 0.62, 0.6)));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), step(0.972, hl) * 0.9);
  }
  #include <dithering_fragment>
`

export function createToonMaterial({ color, opacity = 1, highlight = false }: ToonOptions): MeshToonMaterial {
  const material = new MeshToonMaterial({
    color: new Color(color),
    gradientMap: toonGradient(),
    transparent: opacity < 1,
    opacity,
    // The palette is authored as final screen colors. No tone mapping, so
    // moons, lines, and outlines show the same indigo and the same pastels.
    toneMapped: false,
  })
  if (highlight) {
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', HIGHLIGHT)
    }
    material.customProgramCacheKey = () => 'toon-highlight'
  }
  return material
}

/**
 * The outline color of a pastel element: a deep shade of its own color, pulled
 * toward the indigo, like the ink of an illustrated planet.
 */
export function inkOf(color: ColorRepresentation, outline: ColorRepresentation): Color {
  const c = new Color(color)
  const hsl = { h: 0, s: 0, l: 0 }
  c.getHSL(hsl)
  const shade = new Color().setHSL(hsl.h, Math.min(1, hsl.s * 1.1 + 0.08), Math.max(0.16, hsl.l * 0.34))
  return shade.lerp(new Color(outline), 0.35)
}
