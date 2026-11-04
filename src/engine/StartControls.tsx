/**
 * The start screen controls, top right: the language, the theme and the mode.
 * They show only while the playhead is at the very start, so the presenter can set
 * them before the talk, and they never appear on stage after that.
 * L switches the language, T the theme and M the mode at any time.
 *
 * Each language shows its code, which is the same in every language, so it is not translated.
 */
import { useEffect, useRef, type ReactNode } from 'react'
import { LOCALES, useI18n, type Locale, type MessageKey } from '@/i18n'
import { usePresentation } from './context'
import { MODES, setMode, useMode, type Mode } from './mode'
import { setTheme, THEMES, useTheme, type Theme } from './theme'

const NAMES: Record<Locale, string> = { en: 'EN', es: 'ES' }
const THEME_KEYS: Record<Theme, MessageKey> = { dark: 'show.theme.dark', light: 'show.theme.light' }
const MODE_KEYS: Record<Mode, MessageKey> = { live: 'show.mode.live', calm: 'show.mode.calm' }

const ICONS: Record<Theme | Mode, ReactNode> = {
  dark: <path d="M13.5 10.2A6 6 0 0 1 5.8 2.5a6 6 0 1 0 7.7 7.7Z" />,
  light: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3" />
    </>
  ),
  // Live: a pulse. Calm: one level line.
  live: <path d="M1 8h3l2-5 4 10 2-5h3" />,
  calm: <path d="M2 8h12" />,
}

function Icon({ name }: { name: Theme | Mode }) {
  return (
    <svg className="start-icon" viewBox="0 0 16 16" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

interface Option<V extends string> {
  value: V
  label: ReactNode
  lang?: string
}

function Segmented<V extends string>({ label, options, value, onPick }: { label: string; options: Option<V>[]; value: V; onPick: (v: V) => void }) {
  return (
    <div className="start-switch" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          lang={o.lang}
          aria-pressed={o.value === value}
          onClick={(e) => {
            onPick(o.value)
            // Give focus back to the page, so Space advances the show.
            e.currentTarget.blur()
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function StartControls() {
  const p = usePresentation()
  const { locale, setLocale, t } = useI18n()
  const theme = useTheme()
  const mode = useMode()
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

  const named = (name: Theme | Mode, key: MessageKey) => (
    <>
      <Icon name={name} />
      <span data-i18n={key}>{t(key)}</span>
    </>
  )

  return (
    <div ref={ref} className="start-controls">
      <Segmented label={t('show.controls.language')} value={locale} onPick={setLocale} options={LOCALES.map((l) => ({ value: l, label: NAMES[l], lang: l }))} />
      <Segmented label={t('show.controls.theme')} value={theme} onPick={setTheme} options={THEMES.map((v) => ({ value: v, label: named(v, THEME_KEYS[v]) }))} />
      <Segmented label={t('show.controls.mode')} value={mode} onPick={setMode} options={MODES.map((v) => ({ value: v, label: named(v, MODE_KEYS[v]) }))} />
    </div>
  )
}
