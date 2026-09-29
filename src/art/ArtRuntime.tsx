/**
 * The art runtime, mounted once inside the persistent canvas (World `extras`).
 * - Advances the shared clock and the boil step (clock.ts).
 * - Keeps the resolution uniform in sync for outlines and lines.
 * - Places screen anchors after the camera has moved (anchor.ts).
 * - Provides the key light and the ambient light for toon shading.
 */
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { debugBus } from '@/debug/bus'
import { useEnvironment } from '@/engine/environment'
import { updateAnchors } from './anchor'
import { artUniforms, boil, tickArt } from './clock'

export function ArtRuntime() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const { reducedMotion, tier } = useEnvironment()

  // Reduced motion freezes the ambient layer (time, boil). The low tier keeps
  // time but drops the boil, the most frequent change on screen.
  useEffect(() => {
    boil.enabled = !reducedMotion && tier !== 'low'
  }, [reducedMotion, tier])

  // Compile every shader before the talk, so nothing compiles on stage during a
  // move. Every art material exists in the cast from the start.
  useEffect(() => {
    let cancelled = false
    const start = performance.now()
    void gl.compileAsync(scene, camera).then(() => {
      if (cancelled) return
      debugBus.warmup = { ms: Math.round(performance.now() - start), programs: gl.info.programs?.length ?? 0 }
    })
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera])

  useFrame(({ clock, camera: cam, size }) => {
    gl.getDrawingBufferSize(artUniforms.uResolution.value)
    tickArt(reducedMotion ? 0 : clock.elapsedTime)
    updateAnchors(cam, size.width, size.height, gl.getPixelRatio())
  })

  // Three.js divides light by pi. With ambient + key = pi, the light band shows
  // the palette color exactly. The ambient is a little lilac, so the shadow band
  // is a tint of the color, never a pure grey.
  return (
    <>
      <ambientLight color="#E6E0F2" intensity={1.0} />
      <directionalLight position={[-4, 7, 5]} intensity={2.14} />
    </>
  )
}
