/**
 * Asset access. Files live in public/assets/<kind>/.
 * There is no audio kind and no audio loader. This show is silent.
 */
import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect } from 'react'
import { SRGBColorSpace, type Texture } from 'three'

export type AssetKind = 'svg' | 'textures' | 'models' | 'fonts' | 'images' | 'video' | 'generated' | 'sponsors' | 'foundations' | 'quotes'

/**
 * URL of a file in public/assets. asset('models', 'thing.glb') -> '/assets/models/thing.glb'.
 * It starts with the build's base path, so the show also works under a sub-path such as GitHub Pages' /<repo>/.
 */
export function asset(kind: AssetKind, file: string): string {
  return `${import.meta.env.BASE_URL}assets/${kind}/${file}`
}

/** A color texture with the right color space. Suspends until it loads (wrap in <Suspense>). */
export function useColorTexture(url: string): Texture {
  const texture = useTexture(url)
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 4
    texture.needsUpdate = true
  }, [texture])
  return texture
}

/** A GLTF model. Suspends until it loads. The result is cached and shared: clone before you change it. */
export function useModel(url: string) {
  return useGLTF(url)
}

/**
 * Starts downloading scene assets early. Call it at module level in a scene file,
 * or in a neighbour scene's enter hook, so the asset is ready before the scene plays.
 */
export const preload = {
  model: (url: string) => useGLTF.preload(url),
  texture: (url: string) => useTexture.preload(url),
  image: (url: string) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    return img.decode().catch(() => undefined)
  },
}
