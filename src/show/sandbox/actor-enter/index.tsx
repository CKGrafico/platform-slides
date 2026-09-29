/**
 * Sandbox: the cube actor appears. The scene has no world part of its own.
 * Validates: actors on the global timeline, a static camera shot.
 */
import { defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { SceneLabel } from '../SceneLabel'

function Dom() {
  return (
    <Stage>
      <SceneLabel note="sandbox.label.actor" />
    </Stage>
  )
}

export const actorEnter = defineScene({
  id: 'actor-enter',
  title: 'Persistent actor',
  parts: { dom: Dom },
  camera: { position: [0, 0.6, 6], target: [0, 0, 0], fov: 45 },
})
