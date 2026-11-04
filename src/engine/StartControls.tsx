/**
 * The start screen controls, top right: the language and the theme.
 * They show only while the playhead is at the very start, so the presenter can set
 * both before the talk, and they never appear on stage after that.
 * L switches the language and T switches the theme at any time.
 *
 * Each language shows its code, which is the same in every language, so it is not translated.
 */
import { useEffect, useRef } from 'react'
import { LOCALES, useI18n, type Locale, type MessageKey } from '@/i18n'
import { usePresentation } from './context'
import { setTheme, THEMES, useTheme, type Theme } from './theme'

const NAMES: Record<Locale, string> = { en: 'EN', es: 'ES' }
const THEME_KEYS: Record<Theme, MessageKey> = { dark: 'show.theme.dark', light: 'show.theme.light' }

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === 'dark') {
    return (
      <svg className="start-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7Z" />
      </svg>
    )
  }
  return (
    <svg className="start-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3" />
    </svg>
  )
}

export function StartControls() {
  const p = usePresentation()
  const { locale, setLocale, t } = useI18n()
  const theme = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = (position: number) => {
      const el = ref.current
      if (!el) return
      const show = position === 0
      el.style.visibility = show ? 'visible' : 'hidden'
      el.setAttribute('aria-hidden', String(!show))
    }
    update(p.position)
    return p.onFrame(update)
  }, [p])

  return (
    <div ref={ref} className="start-controls">
      <div className="start-switch" role="group" aria-label={t('show.controls.language')}>
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={l === locale}
            onClick={(e) => {
              setLocale(l)
              // Give focus back to the page, so Space advances the show.
              e.currentTarget.blur()
            }}
          >
            {NAMES[l]}
          </button>
        ))}
      </div>
      <div className="start-switch" role="group" aria-label={t('show.controls.theme')}>
        {THEMES.map((th) => (
          <button
            key={th}
            type="button"
            aria-pressed={th === theme}
            onClick={(e) => {
              setTheme(th)
              e.currentTarget.blur()
            }}
          >
            <ThemeIcon theme={th} />
            <span data-i18n={THEME_KEYS[th]}>{t(THEME_KEYS[th])}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
