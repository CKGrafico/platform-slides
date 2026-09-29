import type { Environment } from './environment'
import type { SceneDef, SceneParts } from './types'

/** Picks the parts to render: reduced-motion variant, then low-tier variant, then the default. */
export function pickParts(def: SceneDef, env: Pick<Environment, 'reducedMotion' | 'tier'>): SceneParts {
  if (env.reducedMotion && def.variants?.reduced) return def.variants.reduced
  if (env.tier === 'low' && def.variants?.low) return def.variants.low
  return def.parts
}

/** True when a scene part must be visible in its current state. */
export function isVisible(def: SceneDef, state: 'before' | 'active' | 'after', outro = 1): boolean {
  if (state === 'active') return true
  if (state === 'after' && outro < 1) return true
  const keep = def.visibleWhenInactive ?? 'none'
  return keep === 'both' || keep === state
}
