/**
 * The app shell: one presentation, one world, and the layer stack.
 * Scenes never import this file.
 */
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { gsap } from '@/animation/gsap'
import { debugBus } from '@/debug/bus'
import { useI18n } from '@/i18n'
import { World } from '@/world/World'
import type { ActorDef, ChoreographyDef } from '@/world/actors'
import { PresentationProvider } from './context'
import { DomSceneHost } from './DomSceneHost'
import { useEnvironment } from './environment'
import { autoHideCursor } from './fullscreen'
import { bindInput } from './input'
import { LanguageSwitch } from './LanguageSwitch'
import { Layer } from './layers-component'
import { Presentation } from './presentation'
import { StopChip } from './StopChip'
import type { ShowDef } from './types'

const debugAllowed = import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')
// The debug code is a separate chunk. Production only downloads it with ?debug.
const DebugPanel = debugAllowed ? lazy(() => import('@/debug/DebugPanel')) : null

export interface KeynoteProps {
  show: ShowDef
  actors: ActorDef[]
  /** Moves of each part of the talk on the shared actors, in show order. */
  choreographies?: ChoreographyDef[]
  /** Rendered once inside the persistent canvas (for example the art runtime). */
  world?: ReactNode
  /** Rendered once in the overlay layer, over the scenes. */
  overlay?: ReactNode
  /** Rendered once in the grain layer, over everything but the debug panel. */
  grain?: ReactNode
}

export function Keynote({ show, actors, choreographies, world, overlay, grain }: KeynoteProps) {
  const env = useEnvironment()
  const { toggleLocale } = useI18n()
  const [presentation] = useState(() => {
    const p = new Presentation(show)
    p.restoreFromHash(window.location.hash)
    p.tick()
    return p
  })
  const [debugOpen, setDebugOpen] = useState(false)

  useEffect(() => {
    presentation.reducedMotion = env.reducedMotion
  }, [presentation, env.reducedMotion])

  useEffect(() => {
    // Dev-only handle for inspection from the console or a test browser.
    if (import.meta.env.DEV) (window as unknown as { __keynote?: Presentation }).__keynote = presentation
    const stop = presentation.start()
    let digits = ''
    const unbind = bindInput(presentation, {
      onKey: (e) => {
        // L switches the language live, in production too. The playhead does not move.
        if (e.key === 'l' || e.key === 'L') {
          toggleLocale()
          return true
        }
        if (!debugAllowed) return false
        if (e.key === 'd' || e.key === 'D') {
          setDebugOpen((o) => !o)
          return true
        }
        // Type a scene number, then Enter, to jump there.
        if (/^[0-9]$/.test(e.key)) {
          digits += e.key
          return true
        }
        if (e.key === 'Enter' && digits) {
          const scene = presentation.model.scenes[Number(digits) - 1]
          digits = ''
          if (scene) presentation.goToScene(scene.key)
          return true
        }
        if (e.key === 'Escape') digits = ''
        return false
      },
    })
    const unhide = autoHideCursor()
    // Back/forward buttons or a pasted URL.
    const onHash = () => {
      if (presentation.isSettled()) presentation.restoreFromHash(window.location.hash)
    }
    window.addEventListener('hashchange', onHash)

    let frames = 0
    let last = performance.now()
    const fps = () => {
      frames += 1
      const now = performance.now()
      if (now - last >= 500) {
        debugBus.fps = (frames * 1000) / (now - last)
        debugBus.frameMs = (now - last) / frames
        frames = 0
        last = now
      }
    }
    gsap.ticker.add(fps)

    return () => {
      stop()
      unbind()
      unhide()
      window.removeEventListener('hashchange', onHash)
      gsap.ticker.remove(fps)
    }
  }, [presentation, toggleLocale])

  return (
    <PresentationProvider value={presentation}>
      <main className="keynote">
        <Layer name="world">
          <World actors={actors} choreographies={choreographies} extras={world} />
        </Layer>
        <Layer name="fx">
          <DomSceneHost part="fx" />
        </Layer>
        <Layer name="narrative">
          <DomSceneHost part="dom" />
        </Layer>
        <Layer name="overlay">
          {overlay}
          <LanguageSwitch />
          <StopChip />
        </Layer>
        {grain ? <Layer name="grain">{grain}</Layer> : null}
        {DebugPanel && debugOpen ? (
          <Layer name="debug">
            <Suspense fallback={null}>
              <DebugPanel />
            </Suspense>
          </Layer>
        ) : null}
      </main>
    </PresentationProvider>
  )
}
