/**
 * Two languages, English and Spanish. English is the source of truth for keys.
 *
 * - Every visible string lives in src/i18n/locales/<locale>.json under a flat key.
 * - Render text with <T k="key" /> or t('key'). Never write visible text in JSX.
 * - Both translations must take about the same space. `npm run i18n:check` fails
 *   when they do not (see scripts/check-i18n.mjs). It runs before every build.
 * - Locale comes from ?lang=es|en, then the last choice, then English.
 *   The presenter switches it live with the L key. The playhead does not move.
 */
import { useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18n } from './context'
import en from './locales/en.json'
import es from './locales/es.json'

export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export type MessageKey = keyof typeof en

const MESSAGES: Record<Locale, Record<MessageKey, string>> = { en, es }
const STORAGE_KEY = 'keynote.locale'

function initialLocale(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'en' || fromUrl === 'es') return fromUrl
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    // Storage can be blocked. English is fine.
  }
  return 'en'
}

/** Replaces {name} placeholders with values. */
function format(template: string, values?: Record<string, string | number>): string {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match))
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Ignore: the choice just does not persist.
    }
  }, [locale])

  const setLocale = useCallback((l: Locale) => setLocaleState(l), [])
  const toggleLocale = useCallback(() => setLocaleState((l) => (l === 'en' ? 'es' : 'en')), [])
  const t = useCallback(
    (key: MessageKey, values?: Record<string, string | number>) => format(MESSAGES[locale][key] ?? MESSAGES.en[key], values),
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, toggleLocale, t }), [locale, setLocale, toggleLocale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n needs <I18nProvider>')
  return ctx
}

/** Shortcut for the translate function. */
export function useT() {
  return useI18n().t
}

/**
 * A translated string. data-i18n marks it for the debug overflow check.
 * Give its box a fixed size in su units, so both languages must fit the same space.
 */
export function T({ k, values }: { k: MessageKey; values?: Record<string, string | number> }) {
  const t = useT()
  return <span data-i18n={k}>{t(k, values)}</span>
}
