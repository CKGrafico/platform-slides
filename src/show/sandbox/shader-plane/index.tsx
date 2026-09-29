/**
 * Sandbox: a shader plane whose uProgress follows the scene.
 * Validates: createProgressMaterial, standard uniforms, GLSL ?raw imports, camera blend.
 */
import { useState } from 'react'
import { defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'
import { createProgressMaterial, STANDARD_UNIFORMS_GLSL } from '@/shaders/progressMaterial'
import { useStandardUniforms } from '@/shaders/useStandardUniforms'
import vertexShader from '@/shaders/fullscreen.vert.glsl?raw'
import fragment from './plane.frag.glsl?raw'
import { SceneLabel } from '../SceneLabel'

function World() {
  const [material] = useState(() =>
    createProgressMaterial({ vertexShader, fragmentShader: STANDARD_UNIFORMS_GLSL + fragment }),
  )
  useStandardUniforms(material)
  return (
    <mesh position={[1.6, 0, -0.5]} material={material}>
      <planeGeometry args={[3.2, 3.2]} />
    </mesh>
  )
}

function Dom() {
  return (
    <Stage>
      <SceneLabel note="shader" />
    </Stage>
  )
}

export const shaderPlane = defineScene({
  id: 'shader-plane',
  title: 'Shader uniforms',
  stops: [0.5, 1],
  parts: { dom: Dom, world: World },
  camera: { position: [0.4, 0.2, 6.5], target: [0.2, 0, 0], fov: 42 },
})
