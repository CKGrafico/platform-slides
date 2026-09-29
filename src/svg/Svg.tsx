/**
 * The wrapper for every scene SVG. It fixes the conventions so AI-generated
 * SVG behaves the same everywhere:
 * - One viewBox, in design units. The default is 1600 x 900 (16:9).
 * - Named parts use data-anim="name". Animate them with svgPart(root, 'name').
 * - Strokes do not scale with the SVG (vector-effect), unless scaleStroke is set.
 * - A title makes it readable by screen readers. Use decorative for pure decoration.
 */
import { forwardRef, type ReactNode, type SVGProps } from 'react'

export interface SvgProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  viewBox?: string
  title?: string
  decorative?: boolean
  scaleStroke?: boolean
  children: ReactNode
}

export const Svg = forwardRef<SVGSVGElement, SvgProps>(function Svg(
  { viewBox = '0 0 1600 900', title, decorative = false, scaleStroke = false, className, children, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={['svg', scaleStroke ? '' : 'svg-fixed-stroke', className].filter(Boolean).join(' ')}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      {...rest}
    >
      {title && !decorative ? <title>{title}</title> : null}
      {children}
    </svg>
  )
})
