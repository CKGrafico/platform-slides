/**
 * The palette "Lilac and sage". The only place that defines colors.
 * CSS reads them as variables (applyPaletteCssVars), Three.js reads them as hex.
 * See docs/art/art-direction.md for the role of each color.
 */
export const palette = {
  /** The world is monochrome plus one accent (docs/art/art-direction.md). */
  voidTop: '#121216',
  voidBottom: '#0A0A0B',
  surface: '#E8E9EC',
  sage: '#8A8F98',
  lilac: '#63686F',
  peach: '#A7ABB1',
  butter: '#C7CAD0',
  outline: '#8A8F98',
  text: '#E8E9EC',
  accent: '#2F69FF',
  core: '#1A1A20',
  coreNoise: '#3A3A44',
  /** The dark backdrop of the point-cloud world. */
  backdrop: '#0A0A0B',
  /** Point off-white: the lit side of a unit. */
  ink: '#E8E9EC',
  /** Point grey: the shadow side, and distant, cheap work. */
  dust: '#8A8F98',
} as const

export type PaletteColor = keyof typeof palette

/** Writes the palette as CSS variables on the root, for example --c-accent. */
export function applyPaletteCssVars(root: HTMLElement = document.documentElement): void {
  const toKebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
  for (const [name, value] of Object.entries(palette)) {
    root.style.setProperty(`--c-${toKebab(name)}`, value)
  }
}
