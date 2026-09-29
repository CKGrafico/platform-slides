/**
 * Presenter input. Every input becomes a command on the Presentation.
 * Nothing here touches a scene or an animation.
 */
import { toggleFullscreen } from './fullscreen'
import type { Presentation } from './presentation'

export interface InputOptions {
  /** Mouse wheel and trackpad step through stops. Default true. */
  wheel?: boolean
  /** Extra key handler, for the debug layer. Return true when it handled the key. */
  onKey?: (event: KeyboardEvent) => boolean
}

const NEXT = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'])
const PREV = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'])

/** Wheel delta that counts as one step. */
const WHEEL_THRESHOLD = 40
/** Quiet time after a step before the wheel can step again. Absorbs trackpad inertia. */
const WHEEL_QUIET_MS = 350

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function bindInput(p: Presentation, options: InputOptions = {}): () => void {
  const { wheel = true, onKey } = options

  const onKeyDown = (e: KeyboardEvent) => {
    if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return
    // A focused debug button handles its own Space and Enter.
    const inDebug = e.target instanceof HTMLElement && e.target.closest('[data-layer="debug"]')
    if (inDebug && (e.key === ' ' || e.key === 'Enter')) return
    if (onKey?.(e)) {
      e.preventDefault()
      return
    }
    // Holding a key must not race through the show.
    if (e.repeat && (NEXT.has(e.key) || PREV.has(e.key))) {
      e.preventDefault()
      return
    }
    let handled = true
    if (NEXT.has(e.key)) {
      if (e.shiftKey) p.nextChapter()
      else p.next()
    } else if (PREV.has(e.key)) {
      if (e.shiftKey) p.prevChapter()
      else p.prev()
    } else if (e.key === 'Home') p.first()
    else if (e.key === 'End') p.last()
    else if (e.key === 'f' || e.key === 'F') void toggleFullscreen()
    else handled = false
    if (handled) e.preventDefault()
  }

  let accumulated = 0
  let locked = false
  let quietTimer = 0
  const onWheel = (e: WheelEvent) => {
    if (isTyping(e.target) || (e.target instanceof HTMLElement && e.target.closest('[data-layer="debug"]'))) return
    e.preventDefault()
    window.clearTimeout(quietTimer)
    quietTimer = window.setTimeout(() => {
      locked = false
      accumulated = 0
    }, WHEEL_QUIET_MS)
    if (locked) return
    accumulated += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    if (Math.abs(accumulated) < WHEEL_THRESHOLD) return
    if (accumulated > 0) p.next()
    else p.prev()
    accumulated = 0
    locked = true
  }

  window.addEventListener('keydown', onKeyDown)
  if (wheel) window.addEventListener('wheel', onWheel, { passive: false })
  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('wheel', onWheel)
    window.clearTimeout(quietTimer)
  }
}
