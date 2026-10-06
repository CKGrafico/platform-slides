import type { Tier } from '@/engine/types'

/**
 * Render pixel ratio per tier. It does not follow the display: a 1x screen or projector still renders at 2x
 * on high and medium, and the browser scales down. The ASCII marks are fine detail, so this supersampling keeps
 * them sharp. Nothing gains above 2.
 */
export const DPR_CAP: Record<Tier, number> = { high: 2, medium: 2, low: 1 }

/**
 * Guesses a quality tier from the GPU name. `?tier=low|medium|high` overrides it.
 * This is a starting point only. PerformanceMonitor lowers the DPR at runtime.
 */
export function detectTier(): Tier {
  const forced = new URLSearchParams(window.location.search).get('tier')
  if (forced === 'high' || forced === 'medium' || forced === 'low') return forced

  let renderer: string
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return 'low'
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    return 'low'
  }

  const name = renderer.toLowerCase()
  if (/swiftshader|llvmpipe|software|basic render/.test(name)) return 'low'
  if (/intel/.test(name) && !/arc/.test(name)) return 'medium'
  return 'high'
}

export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}
