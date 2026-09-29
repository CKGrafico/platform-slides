/**
 * Things every scene may need that do not come from the timeline:
 * viewport, stage box, reduced motion, and quality tier.
 * These change rarely (resize, settings), so React state is fine here.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectTier } from '@/perf/tier'
import type { Tier } from './types'

/** The design aspect ratio. Layout inside the stage uses stage units. */
export const STAGE_ASPECT = 16 / 9

export interface StageBox {
  x: number
  y: number
  width: number
  height: number
}

export interface Viewport {
  width: number
  height: number
  aspect: number
  dpr: number
  /** The largest 16:9 box that fits the viewport, centred. */
  stage: StageBox
}

export interface Environment {
  viewport: Viewport
  reducedMotion: boolean
  tier: Tier
  setTier: (tier: Tier) => void
}

function measure(): Viewport {
  const width = window.innerWidth
  const height = window.innerHeight
  const aspect = width / Math.max(1, height)
  const stageWidth = aspect > STAGE_ASPECT ? height * STAGE_ASPECT : width
  const stageHeight = stageWidth / STAGE_ASPECT
  return {
    width,
    height,
    aspect,
    dpr: window.devicePixelRatio || 1,
    stage: { x: (width - stageWidth) / 2, y: (height - stageHeight) / 2, width: stageWidth, height: stageHeight },
  }
}

/** Writes the stage box as CSS variables so CSS can size things in stage units. */
function writeStageVars(v: Viewport) {
  const s = document.documentElement.style
  s.setProperty('--stage-x', `${v.stage.x}px`)
  s.setProperty('--stage-y', `${v.stage.y}px`)
  s.setProperty('--stage-w', `${v.stage.width}px`)
  s.setProperty('--stage-h', `${v.stage.height}px`)
  // 1su = 1% of the stage height. Use it for type and spacing.
  s.setProperty('--su', `${v.stage.height / 100}px`)
}

const EnvironmentContext = createContext<Environment | null>(null)

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [viewport, setViewport] = useState(measure)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [tier, setTier] = useState<Tier>(detectTier)

  useEffect(() => {
    // ResizeObserver already batches a burst (fullscreen, projector switch) into one call.
    const update = () => {
      const v = measure()
      writeStageVars(v)
      setViewport(v)
    }
    writeStageVars(measure())
    const observer = new ResizeObserver(update)
    observer.observe(document.documentElement)
    // DPR changes when the window moves to a display with a different density.
    const dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    dprQuery.addEventListener('change', update)
    return () => {
      observer.disconnect()
      dprQuery.removeEventListener('change', update)
    }
  }, [viewport.dpr])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const value = useMemo(() => ({ viewport, reducedMotion, tier, setTier }), [viewport, reducedMotion, tier])
  return <EnvironmentContext.Provider value={value}>{children}</EnvironmentContext.Provider>
}

export function useEnvironment(): Environment {
  const env = useContext(EnvironmentContext)
  if (!env) throw new Error('useEnvironment needs <EnvironmentProvider>')
  return env
}
