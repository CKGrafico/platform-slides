/**
 * Sandbox: a procedural grid driven by named parameters, a camera path
 * computed from progress, and a 2D canvas in the fx layer.
 * Validates: procedural systems, function cameras, the fx layer.
 */
import { useCallback } from 'react'
import { range } from '@/animation/progress'
import { useProgress } from '@/engine/context'
import { defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { FxCanvas, type FxSize } from '@/procedural/FxCanvas'
import { createInstancedGrid } from '@/procedural/instancedGrid'
import { useProcedural } from '@/procedural/useProcedural'
import { dolly, orbit } from '@/world/camera/shot'
import { SceneLabel } from '../SceneLabel'

function World() {
  const grid = useProcedural(() => createInstancedGrid({ size: 18, spread: 0.45, density: 0 }))
  useProgress((local) => grid.set({ density: range(local, 0, 0.6), activity: range(local, 0.5, 1) * 0.5 }))
  return <primitive object={grid.object} position={[0, -1.2, 0]} />
}

function Fx() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, { width, height }: FxSize, local: number) => {
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = 'rgba(232, 232, 230, 0.18)'
    ctx.lineWidth = 1
    const lines = Math.round(24 * local)
    for (let i = 0; i < lines; i++) {
      const y = (height / 24) * (i + 0.5)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width * local, y)
      ctx.stroke()
    }
  }, [])
  return <FxCanvas draw={draw} />
}

function Dom() {
  return (
    <Stage>
      <SceneLabel note="sandbox.label.grid" />
    </Stage>
  )
}

const BASE = { position: [0, 2.5, 7] as const, target: [0, 0, 0] as const, fov: 45 }

export const gridDolly = defineScene({
  id: 'grid-dolly',
  title: 'Procedural grid and camera path',
  duration: 1.5,
  stops: [0.5, 1],
  parts: { dom: Dom, world: World, fx: Fx },
  // A function camera owns the shot: orbit and dolly as pure functions of progress.
  camera: (local) => ({ ...dolly(orbit(BASE, local * 0.9, local * 1.5), local * 2), shake: range(local, 0.8, 1) * 0.5 }),
})
