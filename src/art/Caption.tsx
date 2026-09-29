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
import { Burn } from './Burn'

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export function Caption({
  k,
  fit,
  corner,
  width = 44,
  height = 14,
  className,
  children,
}: {
  k?: MessageKey
  /** Name for the overflow check when the text comes from children. */
  fit?: string
  corner: Corner
  /** Box width in su, before --caption-scale. */
  width?: number
  /** Box height in su, before --caption-scale. */
  height?: number
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={['art-caption', `art-caption--${corner}`, className].filter(Boolean).join(' ')}
      data-fit={k ?? fit ?? 'caption'}
      style={{ width: `calc(var(--su) * ${width} * var(--caption-scale))`, height: `calc(var(--su) * ${height} * var(--caption-scale))` }}
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
  /** Box width in su, before --label-scale. */
  width?: number
  mono?: boolean
  /** Opacity from local progress, 0..1. Default: always shown. */
  level?: (local: number) => number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  useAnchor(ref, target, offset)
  useProgress((local, outro) => {
    if (!box.current || (!level && outro === 0)) return
    const v = Math.min(1, Math.max(0, level ? level(local) : 1)) * (1 - outro)
    box.current.style.opacity = String(v)
  })
  return (
    <div ref={ref} className="art-anchor" aria-hidden="true">
      <div
        ref={box}
        style={{ width: `calc(var(--su) * ${width} * var(--label-scale))`, opacity: level ? 0 : undefined }}
        className={['art-label', mono ? 'art-label--mono' : '', className].filter(Boolean).join(' ')}
        data-fit={k}
      >
        <T k={k} />
      </div>
    </div>
  )
}

/**
 * A part title in the top left: a small kicker over an outlined act title.
 * Both burn with the same level.
 */
export function PartTitle({
  kicker,
  title,
  level,
  seed = 17,
  className,
}: {
  kicker: MessageKey
  title: MessageKey
  level: (local: number) => number
  seed?: number
  /** 'part-title--tall' lets a long title take two lines. */
  className?: string
}) {
  return (
    <div className={['part-title', className].filter(Boolean).join(' ')} data-fit={title}>
      <Burn level={level} seed={seed}>
        <p className="art-kicker">
          <T k={kicker} />
        </p>
        <h2 className="art-title">
          <T k={title} />
        </h2>
      </Burn>
    </div>
  )
}

/** A caption whose text burns in and out with a level, in one corner. */
export function BurnCaption({
  k,
  corner,
  level,
  width = 58,
  height = 9,
  seed = 23,
  source,
  className,
}: {
  k: MessageKey
  corner: Corner
  level: (local: number) => number
  width?: number
  height?: number
  seed?: number
  /** A short source line under the text, in the label face. */
  source?: MessageKey
  className?: string
}) {
  return (
    <Caption corner={corner} width={width} height={height} className={className} fit={k}>
      <Burn level={level} seed={seed} className={source ? 'art-caption-body' : undefined}>
        <T k={k} />
        {source ? (
          <span className="art-source">
            <T k={source} />
          </span>
        ) : null}
      </Burn>
    </Caption>
  )
}

/**
 * A small card that follows a 3D point, like a label, with any content: for a
 * panel next to an element (what needs a human, in 12.4). Its box has a fixed
 * size in su (scaled with --label-scale) and is marked data-fit.
 */
export function Card({
  fit,
  target,
  offset,
  width = 20,
  height = 10,
  level,
  className,
  children,
}: {
  fit: string
  target: AnchorTarget
  offset?: readonly [number, number, number]
  width?: number
  height?: number
  level?: (local: number) => number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  useAnchor(ref, target, offset)
  useProgress((local, outro) => {
    if (!box.current || (!level && outro === 0)) return
    const v = Math.min(1, Math.max(0, level ? level(local) : 1)) * (1 - outro)
    box.current.style.opacity = String(v)
  })
  return (
    <div ref={ref} className="art-anchor" aria-hidden="true">
      <div
        ref={box}
        className={['art-card', className].filter(Boolean).join(' ')}
        data-fit={fit}
        style={{
          width: `calc(var(--su) * ${width} * var(--label-scale))`,
          height: `calc(var(--su) * ${height} * var(--label-scale))`,
          opacity: level ? 0 : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}
