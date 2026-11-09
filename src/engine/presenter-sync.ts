/**
 * The link between the show window and the presenter window. Both windows are on the same origin, so a
 * BroadcastChannel joins them with no server. The show window owns the playhead. It sends its place after every
 * command, and it runs the commands the presenter window sends. The presenter window only mirrors: it never moves
 * a playhead of its own.
 */
import type { Locale } from '@/i18n'
import type { Presentation } from './presentation'

const CHANNEL = 'keynote.presenter'

export type PresenterCommand = 'next' | 'prev' | 'nextChapter' | 'prevChapter' | 'first' | 'last'

export type PresenterMessage =
  /** The show's place: the current stop (index in model.stops), and whether a move is still playing. */
  | { kind: 'state'; stop: number; total: number; moving: boolean; locale: Locale }
  | { kind: 'command'; command: PresenterCommand }
  | { kind: 'goto'; stop: number }
  /** The presenter window asks for the state when it opens. */
  | { kind: 'hello' }

export function openChannel(onMessage: (message: PresenterMessage) => void): { post: (message: PresenterMessage) => void; close: () => void } | null {
  if (typeof BroadcastChannel === 'undefined') return null
  const channel = new BroadcastChannel(CHANNEL)
  channel.onmessage = (event: MessageEvent<PresenterMessage>) => onMessage(event.data)
  return { post: (message) => channel.postMessage(message), close: () => channel.close() }
}

/** Show window side. Sends the place on every change and runs the presenter's commands. */
export function bindPresenterSync(p: Presentation, locale: () => Locale): () => void {
  const link = openChannel((message) => {
    if (message.kind === 'hello') send()
    else if (message.kind === 'goto') p.goToStop(message.stop)
    else if (message.kind === 'command') p[message.command]()
  })
  if (!link) return () => {}
  const send = () => link.post({ kind: 'state', stop: p.stopIndex(), total: p.model.stops.length, moving: !p.isSettled(), locale: locale() })
  const off = p.onTarget(send)
  send()
  return () => {
    off()
    link.close()
  }
}

/** Opens the presenter window, or brings it to the front when it is already open. */
export function openPresenterWindow(): void {
  const url = new URL(window.location.href)
  url.hash = ''
  url.searchParams.set('presenter', '')
  window.open(url.toString(), 'keynote-presenter', 'popup,width=1100,height=720')
}

export const isPresenterWindow = () => new URLSearchParams(window.location.search).has('presenter')
