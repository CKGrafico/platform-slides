import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import { usePresentation, useScene } from '@/engine/context'
import type { ProgressMaterial } from './progressMaterial'

/**
 * Keeps the standard uniforms of a material up to date. Call it in a world part.
 * Set `progress: false` when a GSAP timeline animates uProgress itself.
 */
export function useStandardUniforms(material: ProgressMaterial, options: { progress?: boolean } = {}) {
  const { progress = true } = options
  const p = usePresentation()
  const { runtime } = useScene()

  useFrame(({ clock, gl, pointer }) => {
    const u = material.uniforms
    u.uTime.value = clock.elapsedTime
    if (progress) u.uProgress.value = runtime.local
    u.uGlobal.value = p.global
    gl.getDrawingBufferSize(u.uResolution.value)
    u.uPixelRatio.value = gl.getPixelRatio()
    u.uPointer.value.copy(pointer)
  })

  useEffect(() => () => material.dispose(), [material])
}
