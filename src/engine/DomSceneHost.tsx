/**
 * Renders the DOM part of every mounted scene into the narrative layer.
 * Scenes stay mounted while they are near the playhead, so a transition can
 * use both the outgoing and the incoming scene.
 */
import { useEffect, useRef } from 'react'
import { SceneProvider, usePresentation, usePresentationSnapshot } from './context'
import { useEnvironment } from './environment'
import { isVisible, pickParts } from './parts'
import type { SceneRuntime } from './presentation'
import type { ResolvedScene } from './show-model'

export function DomSceneHost({ part }: { part: 'dom' | 'fx' }) {
  const p = usePresentation()
  const env = useEnvironment()
  const { mounted } = usePresentationSnapshot()

  return (
    <>
      {mounted.map((index) => {
        const scene = p.model.scenes[index]!
        const Part = pickParts(scene.def, env)[part]
        if (!Part) return null
        const runtime = p.scenes[index]!
        return (
          <SceneProvider key={scene.key} runtime={runtime} scene={scene}>
            <SceneShell runtime={runtime} scene={scene}>
              <Part />
            </SceneShell>
          </SceneProvider>
        )
      })}
    </>
  )
}

/** One box per scene. Visibility follows the scene state without a React render. */
function SceneShell({
  runtime,
  scene,
  children,
}: {
  runtime: SceneRuntime
  scene: ResolvedScene
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(
    () =>
      runtime.onProgress(() => {
        const el = ref.current
        if (!el) return
        el.dataset.state = runtime.state
        el.style.visibility = isVisible(scene.def, runtime.state, runtime.outro) ? 'visible' : 'hidden'
        el.setAttribute('aria-hidden', String(runtime.state !== 'active'))
      }),
    [runtime, scene],
  )
  return (
    <section
      ref={ref}
      className="scene"
      data-scene={scene.key}
      aria-label={scene.def.title ?? scene.def.id}
    >
      {children}
    </section>
  )
}
