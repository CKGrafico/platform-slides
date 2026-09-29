/**
 * Optional 2D canvas for a scene's procedural visuals (lines, flows, graphs).
 * Put it in a scene's fx part, so it renders in the fx layer. It sizes itself to the viewport and DPR,
 * and calls draw on every frame where progress changes or the size changes.
 * draw must be a pure function of (ctx, size, local) so a seek redraws the same frame.
 */
import { useEffect, useRef } from 'react'
import { useProgress, useScene } from '@/engine/context'

export interface FxSize {
  width: number
  height: number
  dpr: number
}

export function FxCanvas({
  draw,
  maxDpr = 2,
}: {
  draw: (ctx: CanvasRenderingContext2D, size: FxSize, local: number) => void
  maxDpr?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { viewport, runtime } = useScene()
  const sizeRef = useRef<FxSize>({ width: 1, height: 1, dpr: 1 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(viewport.dpr, maxDpr)
    canvas.width = Math.round(viewport.width * dpr)
    canvas.height = Math.round(viewport.height * dpr)
    sizeRef.current = { width: viewport.width, height: viewport.height, dpr }
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, sizeRef.current, runtime.local)
    }
  }, [viewport, maxDpr, draw, runtime])

  useProgress((local) => {
    const ctx = ref.current?.getContext('2d')
    if (ctx) draw(ctx, sizeRef.current, local)
  })

  return <canvas ref={ref} className="fx-canvas" aria-hidden="true" />
}
