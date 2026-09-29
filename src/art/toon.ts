/**
 * Toon shading with two light bands, in the craft of The Monolith Project.
 * One shared gradient map, nearest filtering, no smooth falloff.
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
}

export function createToonMaterial({ color, opacity = 1 }: ToonOptions): MeshToonMaterial {
  return new MeshToonMaterial({
    color: new Color(color),
    gradientMap: toonGradient(),
    transparent: opacity < 1,
    opacity,
    // The palette is authored as final screen colors. No tone mapping, so
    // cubes, lines, and outlines show the same indigo and the same pastels.
    toneMapped: false,
  })
}
