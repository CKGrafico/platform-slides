/**
 * The presenter window: what the speaker sees on the laptop while the show runs on the projector.
 * Press P in the show to open it. It shows the stop number, the talk clock, the current title with its
 * speaker notes, and the next title. It has no world and no WebGL, so it costs almost nothing.
 *
 * It never owns a playhead. The show window sends its place over the presenter channel, and the keys and
 * buttons here send commands back (src/engine/presenter-sync.ts). The window follows the show's language.
 */
import { useEffect, useState } from 'react'
import { useI18n, type MessageKey } from '@/i18n'
import { openChannel, type PresenterCommand, type PresenterMessage } from './presenter-sync'
import { CLOCK_KEY } from './StopChip'

/** One stop of the show, in show order: the message key of its title, and what the speaker says. */
export interface StopNote {
  heading: string
  notes: string
}

type ShowState = Extract<PresenterMessage, { kind: 'state' }>

const NEXT = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'])
const PREV = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'])

const pad = (n: number) => String(n).padStart(2, '0')
/** Titles carry line breaks and *marks* for the stage. Here they are plain text. */
const plain = (text: string) => text.replaceAll('*', '').replaceAll('\n', ' ')

function readClock(): string {
  let start = 0
  try {
    start = Number(window.localStorage.getItem(CLOCK_KEY))
  } catch {
    // Without storage there is no shared clock.
  }
  if (!(start > 0)) return '--:--'
  const minutes = Math.max(0, Math.floor((Date.now() - start) / 60000))
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
}

export function PresenterView({ notes }: { notes: StopNote[] }) {
  const { t, locale, setLocale } = useI18n()
  const [state, setState] = useState<ShowState | null>(null)
  const [clock, setClock] = useState(readClock)
  const [send, setSend] = useState<((message: PresenterMessage) => void) | null>(null)

  useEffect(() => {
    const link = openChannel((message) => {
      if (message.kind === 'state') setState(message)
    })
    if (!link) return
    setSend(() => link.post)
    link.post({ kind: 'hello' })
    return () => link.close()
  }, [])

  useEffect(() => {
    if (state && state.locale !== locale) setLocale(state.locale)
  }, [state, locale, setLocale])

  useEffect(() => {
    document.title = t('presenter.title')
  }, [t])

  useEffect(() => {
    const id = window.setInterval(() => setClock(readClock()), 5000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!send) return
    const command = (c: PresenterCommand) => send({ kind: 'command', command: c })
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return
      if (NEXT.has(e.key)) command(e.shiftKey ? 'nextChapter' : 'next')
      else if (PREV.has(e.key)) command(e.shiftKey ? 'prevChapter' : 'prev')
      else if (e.key === 'Home') command('first')
      else if (e.key === 'End') command('last')
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [send])

  if (!state) {
    return (
      <main className="presenter presenter--waiting">
        <p className="presenter-label">{t('presenter.waiting')}</p>
      </main>
    )
  }

  const current = notes[state.stop]
  const next = notes[state.stop + 1]
  const heading = (note: StopNote | undefined) => (note ? plain(t(note.heading as MessageKey)) : '')

  return (
    <main className="presenter">
      <header className="presenter-bar">
        <span>{t('presenter.stop', { n: state.stop + 1, total: state.total })}</span>
        {state.moving ? <span className="presenter-moving">{t('presenter.moving')}</span> : null}
        <span className="presenter-clock">{clock}</span>
      </header>
      <section className="presenter-now">
        <p className="presenter-label">{t('presenter.now')}</p>
        <h1 className="presenter-heading">{heading(current)}</h1>
        <p className="presenter-label">{t('presenter.notes')}</p>
        <p className="presenter-notes">{current?.notes || t('presenter.empty')}</p>
      </section>
      <aside className="presenter-side">
        <p className="presenter-label">{t('presenter.next')}</p>
        <p className="presenter-next">{next ? heading(next) : t('presenter.end')}</p>
        <div className="presenter-buttons">
          <button type="button" onClick={() => send?.({ kind: 'command', command: 'prev' })}>{t('presenter.back')}</button>
          <button type="button" className="presenter-primary" onClick={() => send?.({ kind: 'command', command: 'next' })}>{t('presenter.forward')}</button>
        </div>
        <p className="presenter-hint">{t('presenter.keys')}</p>
      </aside>
    </main>
  )
}

export default PresenterView
