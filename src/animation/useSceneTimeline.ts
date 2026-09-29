import { useLayoutEffect, useRef, type DependencyList } from 'react'
import { useScene } from '@/engine/context'
import { gsap, type Timeline } from './gsap'

/**
 * Builds one paused GSAP timeline for the scene and scrubs it with local progress.
 *
 * The timeline time IS local progress: place tweens between 0 and 1.
 * `tl.to(el, { x: 100 }, 0.2)` starts at local 0.2. A tween with duration 0.3 ends at 0.5.
 * The engine pads the timeline to exactly 1, so positions stay true.
 *
 * Returns a ref. Put it on the scene root to scope selector strings to this scene.
 * World parts can ignore the ref and pass objects (mesh.position, material.uniforms.x).
 */
export function useSceneTimeline<T extends Element = HTMLDivElement>(
  build: (tl: Timeline) => void,
  deps: DependencyList = [],
) {
  const { runtime, key } = useScene()
  const scope = useRef<T>(null)

  useLayoutEffect(() => {
    let tl: Timeline | null = null
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true, defaults: { ease: 'none', duration: 0.25 } })
      build(tl)
      const d = tl.duration()
      if (d < 1) tl.set({}, {}, 1)
      else if (d > 1 + 1e-6 && import.meta.env.DEV) {
        console.warn(`[${key}] timeline lasts ${d.toFixed(3)}. Keep it inside 0..1 so time equals progress.`)
      }
      // A paused timeline at 0 ignores progress(0). One pass records start values.
      tl.progress(1, true).progress(0, true)
    }, scope.current ?? undefined)
    const off = runtime.onProgress((local) => tl?.progress(local))
    return () => {
      off()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtime, ...deps])

  return scope
}
