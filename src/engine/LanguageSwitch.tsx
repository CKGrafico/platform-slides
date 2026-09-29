/**
 * Language buttons on the start screen. They show only while the playhead is
 * at the very start, so the presenter can pick the language before the talk,
 * and they never appear on stage after that. L switches at any time.
 *
 * Each language name is written in its own language, so it is not translated.
 */
import { useEffect, useRef } from 'react'
import { LOCALES, useI18n, type Locale } from '@/i18n'
import { usePresentation } from './context'

const NAMES: Record<Locale, string> = { en: 'English', es: 'Español' }

export function LanguageSwitch() {
  const p = usePresentation()
  const { locale, setLocale } = useI18n()
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
    <div ref={ref} className="language-switch" role="group" aria-label="Language">
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
  )
}
