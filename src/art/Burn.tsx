/**
 * Burn: text that appears and disappears through a noise threshold, with a thin
 * accent edge, in the spirit of The Monolith Project's titles.
 *
 * <Burn level={...}> reads a level from 0 (gone) to 1 (fully shown) on every
 * progress change, and applies an SVG filter to its content only while
 * 0 < level < 1. At 0 the content is hidden, at 1 it is plain text with no
 * filter, so a title at rest costs nothing.
 *
 * The noise is fixed (a seed per instance), so the same level always gives the
 * same picture. Burning out uses the same function backwards.
 *
 * Put Burn inside a positioned text box (a Caption, a title), not around it.
 * It fills that box, so the filter only covers the text. Do not put absolutely
 * positioned children inside Burn: a CSS filter makes its element their
 * containing block, so they would jump while the text burns.
 */
import { useId, useRef, type ReactNode } from 'react'
import { useProgress } from '@/engine/context'
import { palette } from './palette'

/** Softness of the threshold edge. Higher is sharper. */
const SHARPNESS = 14
/** Width of the accent edge, in the same units as the level. */
const EDGE = 0.07

export function Burn({
  level,
  seed = 3,
  className,
  children,
}: {
  /** Maps local progress to a level, 0..1. */
  level: (local: number) => number
  seed?: number
  className?: string
  children: ReactNode
}) {
  const raw = useId()
  const id = `burn-${raw.replace(/[^a-zA-Z0-9-]/g, '')}`
  const box = useRef<HTMLSpanElement>(null)
  const textA = useRef<SVGFEFuncAElement>(null)
  const edgeA = useRef<SVGFEFuncAElement>(null)

  useProgress((local) => {
    const el = box.current
    if (!el) return
    // 16 steps per burn: the filter re-renders at most 16 times, and the reveal
    // gets a slight stop-motion feel.
    const v = Math.round(Math.min(1, Math.max(0, level(local))) * 16) / 16
    if (v <= 0) {
      el.style.visibility = 'hidden'
      el.style.filter = ''
      return
    }
    el.style.visibility = ''
    if (v >= 1) {
      el.style.filter = ''
      return
    }
    // alpha = clamp(k * (v - noise)): shown where the noise is below the level.
    // The edge band uses a slightly higher level, then the text is drawn over it.
    textA.current?.setAttribute('intercept', String(SHARPNESS * v))
    edgeA.current?.setAttribute('intercept', String(SHARPNESS * (v + EDGE)))
    el.style.filter = `url(#${id})`
  })

  return (
    <span ref={box} className={['art-burn', className].filter(Boolean).join(' ')} style={{ visibility: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id={id} x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves={3} seed={seed} result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -0.3" result="n" />
          <feComponentTransfer in="n" result="textMask">
            <feFuncA ref={textA} type="linear" slope={-SHARPNESS} intercept="0" />
          </feComponentTransfer>
          <feComponentTransfer in="n" result="edgeMask">
            <feFuncA ref={edgeA} type="linear" slope={-SHARPNESS} intercept="0" />
          </feComponentTransfer>
          <feFlood floodColor={palette.accent} result="accent" />
          <feComposite in="accent" in2="SourceAlpha" operator="in" result="accentText" />
          <feComposite in="accentText" in2="edgeMask" operator="in" result="edge" />
          <feComposite in="SourceGraphic" in2="textMask" operator="in" result="text" />
          <feMerge>
            <feMergeNode in="edge" />
            <feMergeNode in="text" />
          </feMerge>
        </filter>
      </svg>
      {children}
    </span>
  )
}

/** Level helper: burn in over [inStart, inEnd], hold, burn out over [outStart, outEnd]. */
export function burnWindow(inStart: number, inEnd: number, outStart = 2, outEnd = 3) {
  return (local: number) => {
    if (local < inStart) return 0
    if (local < inEnd) return (local - inStart) / (inEnd - inStart)
    if (local < outStart) return 1
    if (local < outEnd) return 1 - (local - outStart) / (outEnd - outStart)
    return 0
  }
}
