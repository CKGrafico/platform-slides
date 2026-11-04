/**
 * Two themes, dark and light. Dark is the designed look of the show.
 * Light is the same picture with its brightness turned over, for bright rooms and screens:
 * base.css inverts every layer but the debug panel and keeps the hue, so the accent stays blue.
 * Photos turn back, so they look as they were taken.
 *
 * Theme comes from ?theme=dark|light, then the last choice, then dark.
 * The presenter switches it on the start screen or with the T key. The playhead does not move.
 * The choice lives on <html data-theme>, so it never changes what a scene computes from progress.
 */
import { useSyncExternalStore } from 'react'

export const THEMES = ['dark', 'light'] as const
export type Theme = (typeof THEMES)[number]

const STORAGE_KEY = 'keynote.theme'
const listeners = new Set<() => void>()

function initialTheme(): Theme {
  const fromUrl = new URLSearchParams(window.location.search).get('theme')
  if (fromUrl === 'dark' || fromUrl === 'light') return fromUrl
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // Storage can be blocked. Dark is fine.
  }
  return 'dark'
}

let current: Theme = initialTheme()
document.documentElement.dataset.theme = current

export function getTheme(): Theme {
  return current
}

export function setTheme(theme: Theme): void {
  if (theme === current) return
  current = theme
  document.documentElement.dataset.theme = theme
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Ignore: the choice just does not persist.
  }
  listeners.forEach((l) => l())
}

export function toggleTheme(): void {
  setTheme(current === 'dark' ? 'light' : 'dark')
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme)
}
