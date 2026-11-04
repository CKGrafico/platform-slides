/**
 * Two themes, dark and light. Dark is the designed look of the show. Light is for bright rooms and screens.
 * Both use the same corporate blue. The DOM colors are tokens in src/show/ascii.css, and the world reads
 * the theme through setWorldTheme (src/art/ascii.ts).
 *
 * Theme comes from ?theme=dark|light, then the last choice, then dark.
 * The presenter switches it on the start screen or with the T key. The playhead does not move.
 */
import { createPreference } from './preference'

export const THEMES = ['dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

const theme = createPreference<Theme>('theme', THEMES, 'dark')

export const getTheme = theme.get
export const setTheme = theme.set
export const toggleTheme = theme.toggle
export const useTheme = theme.useValue
