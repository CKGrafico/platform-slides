/**
 * React bindings for the presentation and for a single scene.
 * Scenes use useScene(). Only engine and debug code use usePresentation().
 */
import { createContext, useContext, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import type { Direction, Presentation, SceneRuntime, SceneState, Snapshot } from './presentation'
import type { ResolvedScene } from './show-model'
import { useEnvironment, type Viewport } from './environment'
import type { Tier } from './types'

const PresentationContext = createContext<Presentation | null>(null)

export function PresentationProvider({ value, children }: { value: Presentation; children: ReactNode }) {
  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>
}

export function usePresentation(): Presentation {
  const p = useContext(PresentationContext)
  if (!p) throw new Error('usePresentation needs <PresentationProvider>')
  return p
}

/** Re-renders only when the active scene changes. */
export function usePresentationSnapshot(): Snapshot {
  const p = usePresentation()
  return useSyncExternalStore(p.subscribe, p.getSnapshot)
}

// ---- scene context ----------------------------------------------------------

export interface SceneApi {
  key: string
  index: number
  scene: ResolvedScene
  runtime: SceneRuntime
  /** Local progress now, 0..1. Read it in callbacks, not during render. */
  local: () => number
  /** Global progress now, 0..1. */
  global: () => number
  state: () => SceneState
  isActive: () => boolean
  /** Direction of the last command: 1 forward, -1 back. */
  direction: () => Direction
  viewport: Viewport
  reducedMotion: boolean
  tier: Tier
}

const SceneContext = createContext<{ runtime: SceneRuntime; scene: ResolvedScene } | null>(null)

export function SceneProvider({
  runtime,
  scene,
  children,
}: {
  runtime: SceneRuntime
  scene: ResolvedScene
  children: ReactNode
}) {
  return <SceneContext.Provider value={{ runtime, scene }}>{children}</SceneContext.Provider>
}

export function useScene(): SceneApi {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must run inside a scene part')
  const p = usePresentation()
  const env = useEnvironment()
  const { runtime, scene } = ctx
  return {
    key: scene.key,
    index: scene.index,
    scene,
    runtime,
    local: () => runtime.local,
    global: () => p.global,
    state: () => runtime.state,
    isActive: () => runtime.state === 'active',
    direction: () => p.direction,
    viewport: env.viewport,
    reducedMotion: env.reducedMotion,
    tier: env.tier,
  }
}

/**
 * Runs fn with the local progress now and on every change.
 * Use it for values that GSAP does not animate. Keep fn cheap and free of layout reads.
 */
export function useProgress(fn: (local: number) => void): void {
  const { runtime } = useScene()
  const ref = useRef(fn)
  useEffect(() => {
    ref.current = fn
  })
  useEffect(() => runtime.onProgress((l) => ref.current(l)), [runtime])
}

/**
 * Enter and leave hooks. Use them for side work (start a loop, preload).
 * Never set visual state here: visual state comes from progress only.
 */
export function useSceneLifecycle(handlers: {
  onEnter?: (direction: Direction) => void
  onLeave?: (direction: Direction) => void
}): void {
  const { runtime } = useScene()
  const ref = useRef(handlers)
  useEffect(() => {
    ref.current = handlers
  })
  useEffect(() => {
    const a = runtime.onEnter((d) => ref.current.onEnter?.(d))
    const b = runtime.onLeave((d) => ref.current.onLeave?.(d))
    return () => {
      a()
      b()
    }
  }, [runtime])
}
