/**
 * The only place that defines stacking order. Do not write z-index anywhere else.
 * Inside a layer, order elements by DOM order.
 */
export const LAYERS = {
  /** The persistent Three.js canvas. */
  world: 0,
  /** Optional 2D canvas for procedural visuals. */
  fx: 10,
  /** Scene HTML and SVG. */
  narrative: 20,
  /** Presentation chrome. Empty for now. */
  overlay: 30,
  /** Development tools. */
  debug: 40,
} as const

export type LayerName = keyof typeof LAYERS
