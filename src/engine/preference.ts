/**
 * A viewer preference that lives on <html data-NAME>: the theme, the mode.
 * It comes from ?NAME=value, then the last choice, then the default. The browser keeps the choice.
 * CSS reads the data attribute. Code reads it with the hook or the getter.
 * A preference never changes what a scene computes from progress, only how it looks.
 */
import { useSyncExternalStore } from 'react'

export interface Preference<V extends string> {
  values: readonly V[]
  get: () => V
  set: (value: V) => void
  toggle: () => void
  useValue: () => V
}

export function createPreference<V extends string>(name: string, values: readonly V[], fallback: V): Preference<V> {
  const storageKey = `keynote.${name}`
  const listeners = new Set<() => void>()
  const valid = (v: string | null): v is V => v !== null && (values as readonly string[]).includes(v)

  let current = fallback
  const fromUrl = new URLSearchParams(window.location.search).get(name)
  if (valid(fromUrl)) current = fromUrl
  else {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (valid(saved)) current = saved
    } catch {
      // Storage can be blocked. The default is fine.
    }
  }
  document.documentElement.dataset[name] = current

  const get = () => current
  const set = (value: V) => {
    if (value === current) return
    current = value
    document.documentElement.dataset[name] = value
    try {
      window.localStorage.setItem(storageKey, value)
    } catch {
      // Ignore: the choice just does not persist.
    }
    listeners.forEach((l) => l())
  }
  const toggle = () => set(values[(values.indexOf(current) + 1) % values.length]!)
  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
  const useValue = () => useSyncExternalStore(subscribe, get)
  return { values, get, set, toggle, useValue }
}
