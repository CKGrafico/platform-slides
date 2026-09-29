/**
 * Renders the world part of every mounted scene inside the persistent canvas.
 * Each part sits in its own group. The group hides when the scene is inactive.
 */
import { useEffect, useRef, type ReactNode } from 'react'
import type { Group } from 'three'
import { SceneProvider, usePresentation, usePresentationSnapshot } from '@/engine/context'
import { useEnvironment } from '@/engine/environment'
import { isVisible, pickParts } from '@/engine/parts'
import type { SceneRuntime } from '@/engine/presentation'
import type { ResolvedScene } from '@/engine/show-model'

export function WorldSceneHost() {
  const p = usePresentation()
  const env = useEnvironment()
  const { mounted } = usePresentationSnapshot()

  return (
    <>
      {mounted.map((index) => {
        const scene = p.model.scenes[index]!
        const Part = pickParts(scene.def, env).world
        if (!Part) return null
        const runtime = p.scenes[index]!
        return (
          <SceneProvider key={scene.key} runtime={runtime} scene={scene}>
            <SceneGroup runtime={runtime} scene={scene}>
              <Part />
            </SceneGroup>
          </SceneProvider>
        )
      })}
    </>
  )
}

function SceneGroup({ runtime, scene, children }: { runtime: SceneRuntime; scene: ResolvedScene; children: ReactNode }) {
  const ref = useRef<Group>(null)
  useEffect(
    () =>
      runtime.onProgress(() => {
        if (ref.current) ref.current.visible = isVisible(scene.def, runtime.state)
      }),
    [runtime, scene],
  )
  return (
    <group ref={ref} name={scene.key}>
      {children}
    </group>
  )
}
