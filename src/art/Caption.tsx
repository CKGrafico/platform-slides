/**
 * Captions and labels, in the rules of docs/art/art-direction.md:
 * - A Caption sits in one corner of the stage, inside the 6% safe area, in a
 *   fixed box sized in su and marked data-fit, so both languages must fit it.
 * - A Label follows a 3D element on screen through a screen anchor.
 * Visible text always comes from the i18n files.
 */
import { useRef, type ReactNode } from 'react'
import { useProgress } from '@/engine/context'
import { T, type MessageKey } from '@/i18n'
import { useAnchor, type AnchorTarget } from './anchor'

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export function Caption({
  k,
  corner,
  width = 44,
  height = 14,
  className,
  children,
}: {
  k?: MessageKey
  corner: Corner
  /** Box width in su. */
  width?: number
  /** Box height in su. */
  height?: number
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={['art-caption', `art-caption--${corner}`, className].filter(Boolean).join(' ')}
      data-fit={k ?? 'caption'}
      style={{ width: `calc(var(--su) * ${width})`, height: `calc(var(--su) * ${height})` }}
    >
      {k ? <T k={k} /> : children}
    </div>
  )
}

export function Label({
  k,
  target,
  offset,
  width = 16,
  mono = true,
  level,
  className,
}: {
  k: MessageKey
  target: AnchorTarget
  offset?: readonly [number, number, number]
  /** Box width in su. */
  width?: number
  mono?: boolean
  /** Opacity from local progress, 0..1. Default: always shown. */
  level?: (local: number) => number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  useAnchor(ref, target, offset)
  useProgress((local) => {
    if (!box.current || !level) return
    const v = Math.min(1, Math.max(0, level(local)))
    box.current.style.opacity = String(v)
  })
  return (
    <div ref={ref} className="art-anchor" aria-hidden="true">
      <div
        ref={box}
        style={{ width: `calc(var(--su) * ${width})`, opacity: level ? 0 : undefined }}
        className={['art-label', mono ? 'art-label--mono' : '', className].filter(Boolean).join(' ')}
        data-fit={k}
      >
        <T k={k} />
      </div>
    </div>
  )
}
