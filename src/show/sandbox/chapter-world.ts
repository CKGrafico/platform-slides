import { defineChapter } from '@/engine/define'
import { actorEnter } from './actor-enter'
import { gridDolly } from './grid-dolly'
import { shaderPlane } from './shader-plane'

export const sandboxWorld = defineChapter({
  id: 'sandbox-world',
  title: 'Sandbox: world',
  scenes: [actorEnter, shaderPlane, gridDolly],
})
