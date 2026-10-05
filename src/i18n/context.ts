import { createContext } from 'react'
import type { Locale, MessageKey } from './index'

export interface I18n {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: MessageKey, values?: Record<string, string | number>) => string
}

/** Keep the context identity stable when translations and scenes reload. */
export const I18nContext = createContext<I18n | null>(null)
