/** Helpers to find and prepare named SVG parts for GSAP. */

/** One element marked data-anim="name". Throws when missing, so typos fail fast. */
export function svgPart<T extends Element = SVGElement>(root: Element | null, name: string): T {
  const el = root?.querySelector<T>(`[data-anim="${name}"]`)
  if (!el) throw new Error(`SVG part "${name}" not found`)
  return el
}

/** All elements marked data-anim="name". */
export function svgParts<T extends Element = SVGElement>(root: Element | null, name: string): T[] {
  return root ? Array.from(root.querySelectorAll<T>(`[data-anim="${name}"]`)) : []
}

/**
 * Tween vars for stroke drawing with GSAP DrawSVG.
 * tl.fromTo(path, draw.from, draw.to(0.4), 0.1) draws the path between local 0.1 and 0.5.
 */
export const draw = {
  from: { drawSVG: '0%' },
  to: (duration: number, extra: gsap.TweenVars = {}) => ({ drawSVG: '100%', duration, ...extra }),
}

/**
 * Tween vars for path morphing with GSAP MorphSVG.
 * `shape` is a path element, a selector, or raw path data.
 */
export const morphTo = (shape: string | SVGPathElement, duration: number, extra: gsap.TweenVars = {}) => ({
  morphSVG: shape,
  duration,
  ...extra,
})
