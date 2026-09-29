/**
 * The palette "Lilac and sage". The only place that defines colors.
 * CSS reads them as variables (applyPaletteCssVars), Three.js reads them as hex.
 * See docs/art/art-direction.md for the role of each color.
 */
export const palette = {
  voidTop: '#C8C1D6',
  voidBottom: '#D9E0D7',
  surface: '#F2F1EE',
  sage: '#9FB7A6',
  lilac: '#B7A7CC',
  outline: '#2E2A4A',
  text: '#1F1D33',
  accent: '#2F69FF',
  core: '#28233F',
  coreNoise: '#4E4679',
} as const

export type PaletteColor = keyof typeof palette

/** Writes the palette as CSS variables on the root, for example --c-accent. */
export function applyPaletteCssVars(root: HTMLElement = document.documentElement): void {
  const toKebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
  for (const [name, value] of Object.entries(palette)) {
    root.style.setProperty(`--c-${toKebab(name)}`, value)
  }
}
