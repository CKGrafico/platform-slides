import type { Material, Object3D, Texture } from 'three'

function disposeMaterial(material: Material) {
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && (value as Texture).isTexture) (value as Texture).dispose()
  }
  material.dispose()
}

/**
 * Frees GPU memory for everything under an object: geometries, materials, textures.
 * R3F does this for JSX objects. Call it for objects you create by hand.
 * Do not call it on shared or cached assets (useGLTF, useTexture results).
 */
export function disposeObject(root: Object3D): void {
  root.traverse((node) => {
    const mesh = node as Object3D & { geometry?: { dispose(): void }; material?: Material | Material[] }
    mesh.geometry?.dispose()
    if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial)
    else if (mesh.material) disposeMaterial(mesh.material)
  })
}
