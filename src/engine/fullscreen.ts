export function isFullscreen(): boolean {
  return document.fullscreenElement !== null
}

export async function toggleFullscreen(): Promise<void> {
  try {
    if (isFullscreen()) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen({ navigationUI: 'hide' })
  } catch {
    // The browser refused (no user gesture, or not allowed). The show keeps running.
  }
}

/** Hides the cursor after `idleMs` without pointer movement. Returns a cleanup function. */
export function autoHideCursor(idleMs = 2000): () => void {
  const root = document.documentElement
  let timer = 0
  const wake = () => {
    root.classList.remove('cursor-hidden')
    window.clearTimeout(timer)
    timer = window.setTimeout(() => root.classList.add('cursor-hidden'), idleMs)
  }
  window.addEventListener('pointermove', wake, { passive: true })
  wake()
  return () => {
    window.removeEventListener('pointermove', wake)
    window.clearTimeout(timer)
    root.classList.remove('cursor-hidden')
  }
}
