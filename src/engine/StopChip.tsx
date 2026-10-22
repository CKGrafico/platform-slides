/**
 * The stop chip: a small mark in the bottom right corner, for the speaker.
 * It shows the number of the stop the talk is at (1 to N over the whole talk),
 * so a stop can be named without a screenshot ("between 23 and 24"), and while
 * the playhead travels between two stops it shows a bar that fills, so the
 * speaker knows a press is still playing and does not press twice. Quiet by
 * design: small mono type at low opacity, a little brighter only while moving.
 *
 * On its left, a clock shows how long the talk has run, in hours and minutes. It starts when the page loads on the
 * first stop, so pressing F5 there sets it to 00:00. A reload anywhere later keeps counting from the saved start,
 * so a reload in the middle of the talk does not lose the time. It is presenter chrome, not part of the picture.
 */
import { useEffect, useRef } from 'react'
import { palette } from '@/art/palette'
import { usePlayhead } from './context'
import { Stage } from './Stage'

const EPS = 1e-4
const CLOCK_KEY = 'keynote.clock.start'

const pad = (n: number) => String(n).padStart(2, '0')

export function StopChip() {
  const root = useRef<HTMLDivElement>(null)
  const number = useRef<HTMLSpanElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const last = useRef({ position: -1, forward: true, text: '' })
  const clock = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // The first stop writes no hash, so an empty hash means the page loaded on the first stop.
    const atStart = window.location.hash === ''
    let start = Date.now()
    try {
      const saved = Number(window.localStorage.getItem(CLOCK_KEY))
      if (!atStart && saved > 0 && saved <= start) start = saved
      window.localStorage.setItem(CLOCK_KEY, String(start))
    } catch {
      // Without storage the clock still runs from this load.
    }
    const render = () => {
      const minutes = Math.floor((Date.now() - start) / 60000)
      const text = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
      if (clock.current && clock.current.textContent !== text) clock.current.textContent = text
    }
    render()
    const id = window.setInterval(render, 5000)
    return () => window.clearInterval(id)
  }, [])

  usePlayhead((position, model) => {
    const stops = model.stops
    if (!stops.length) return
    let i = 0
    for (let k = 0; k < stops.length; k++) if (stops[k]!.position <= position + EPS) i = k
    const at = stops[i]!
    const next = stops[i + 1]
    const between = next !== undefined && position > at.position + EPS && position < next.position - EPS
    const state = last.current
    if (between) {
      if (position > state.position + EPS) state.forward = true
      else if (position < state.position - EPS) state.forward = false
    }
    state.position = position
    // The number of the stop the playhead is at, or the one it is heading to.
    const target = between ? (state.forward ? i + 1 : i) : i
    const progress = between && next ? (position - at.position) / (next.position - at.position) : 0
    const fraction = between ? (state.forward ? progress : 1 - progress) : 0
    const text = String(target + 1)
    if (number.current && state.text !== text) {
      number.current.textContent = text
      state.text = text
    }
    if (root.current) root.current.dataset.moving = between ? 'true' : 'false'
    if (fill.current) fill.current.style.transform = `scaleX(${between ? fraction : 0})`
  })

  return (
    <Stage className="chip-stage">
      <div ref={root} className="stop-chip" aria-hidden="true" data-moving="false">
        <span ref={clock} className="stop-chip-clock" />
        <span ref={number} className="stop-chip-number" />
        <div className="stop-chip-bar" style={{ background: palette.outline }}>
          <div ref={fill} className="stop-chip-fill" style={{ background: palette.accent }} />
        </div>
      </div>
    </Stage>
  )
}
