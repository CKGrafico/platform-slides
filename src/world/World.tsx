/**
 * The one persistent WebGL canvas. It mounts once for the whole show.
 *
 * R3F runs with frameloop="never". The GSAP ticker drives both the
 * presentation and the render, so DOM, SVG, and WebGL update in the same
 * frame from the same playhead.
 */
import { advance, Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { gsap } from '@/animation/gsap'
import { debugBus } from '@/debug/bus'
import { useEnvironment } from '@/engine/environment'
import { DPR_CAP, webglAvailable } from '@/perf/tier'
import { ActorsHost, type ActorDef } from './actors'
import { CameraRig } from './camera/CameraRig'
import { WorldSceneHost } from './WorldSceneHost'

const DPR_STEP = 0.25
const DPR_MIN = 0.75

export function World({ actors }: { actors: ActorDef[] }) {
  const { tier, viewport } = useEnvironment()
  const cap = Math.min(DPR_CAP[tier], viewport.dpr)
  const [dpr, setDpr] = useState(cap)
  const [generation, setGeneration] = useState(0)
  const [lost, setLost] = useState(false)
  const [available] = useState(webglAvailable)

  // A new tier or display resets the DPR to its cap.
  useEffect(() => setDpr(cap), [cap])
  useEffect(() => {
    debugBus.dpr = dpr
  }, [dpr])

  // The GSAP ticker renders the canvas. The presentation tick runs first (it is prioritized).
  useEffect(() => {
    const render = (time: number) => advance(time * 1000)
    gsap.ticker.add(render)
    return () => gsap.ticker.remove(render)
  }, [])

  if (!available) return null

  return (
    <Canvas
      key={generation}
      frameloop="never"
      dpr={dpr}
      style={{ visibility: lost ? 'hidden' : 'visible' }}
      gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: 45, near: 0.1, far: 200, position: [0, 0, 8] }}
      onCreated={({ gl }) => {
        debugBus.rendererCreations += 1
        const canvas = gl.domElement
        canvas.addEventListener('webglcontextlost', (e) => {
          // preventDefault lets the browser restore the context.
          e.preventDefault()
          debugBus.contextLost = true
          setLost(true)
        })
        canvas.addEventListener('webglcontextrestored', () => {
          debugBus.contextLost = false
          setLost(false)
          // Rebuild the renderer so every GPU resource uploads again.
          setGeneration((g) => g + 1)
        })
      }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(DPR_MIN, d - DPR_STEP))}
        onIncline={() => setDpr((d) => Math.min(cap, d + DPR_STEP))}
        flipflops={4}
        onFallback={() => setDpr(DPR_MIN)}
      />
      <RendererStats />
      <CameraRig />
      <ActorsHost actors={actors}>
        <WorldSceneHost />
      </ActorsHost>
    </Canvas>
  )
}

/** Copies renderer numbers to the debug bus. Cheap: plain number reads. */
function RendererStats() {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const read = () => {
      const { render, memory, programs } = gl.info
      debugBus.renderer.calls = render.calls
      debugBus.renderer.triangles = render.triangles
      debugBus.renderer.geometries = memory.geometries
      debugBus.renderer.textures = memory.textures
      debugBus.renderer.programs = programs?.length ?? 0
    }
    // Read after the render, at low priority, so the numbers are for a full frame.
    gsap.ticker.add(read)
    return () => gsap.ticker.remove(read)
  }, [gl])
  return null
}
