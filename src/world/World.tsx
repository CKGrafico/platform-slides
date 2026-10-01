/**
 * The one persistent WebGL canvas. It mounts once for the whole show.
 *
 * R3F runs with frameloop="never". The GSAP ticker drives both the
 * presentation and the render, so DOM, SVG, and WebGL update in the same
 * frame from the same playhead.
 */
import { advance, Canvas, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useEffect, useState, type ReactNode } from 'react'
import { gsap } from '@/animation/gsap'
import { debugBus } from '@/debug/bus'
import { useEnvironment } from '@/engine/environment'
import { DPR_CAP, webglAvailable } from '@/perf/tier'
import { ActorsHost, type ActorDef, type ChoreographyDef } from './actors'
import { CameraRig } from './camera/CameraRig'
import { WorldSceneHost } from './WorldSceneHost'

const DPR_STEP = 0.25
const DPR_MIN = 0.75

export function World({
  actors,
  choreographies,
  extras,
}: {
  actors: ActorDef[]
  choreographies?: ChoreographyDef[]
  /** Extra world content rendered once inside the canvas, after everything else (for example the art runtime). */
  extras?: ReactNode
}) {
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
    // R3F stores this value as clock.elapsedTime, so pass seconds, not milliseconds.
    const render = (time: number) => advance(time)
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
      gl={{
        antialias: tier !== 'low',
        powerPreference: 'high-performance',
        alpha: true,
        stencil: false,
        // Development only: keep the frame, so screenshots and captures are reliable.
        preserveDrawingBuffer: import.meta.env.DEV,
      }}
      // The near and far planes fit a map seen from far away (show/shots.ts): nothing stands closer than the land's near corner, and the far corner of the land must be inside.
      camera={{ fov: 45, near: 10, far: 900, position: [0, 0, 8] }}
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
      <ActorsHost actors={actors} choreographies={choreographies}>
        <WorldSceneHost />
      </ActorsHost>
      {extras}
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
