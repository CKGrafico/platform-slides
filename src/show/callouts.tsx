/**
 * The panels that name a form: a thin terminal plate joined to the form by one
 * straight leader line (docs/art/art-direction.md). They show only while the
 * story needs the name, and a panel is pinned to its form on screen.
 *
 * The state is a pure function of the playhead, like every overlay.
 */
import { useRef } from 'react'
import { Vector3 } from 'three'
import { useAnchor } from '@/art/anchor'
import { usePlayhead } from '@/engine/context'
import { T, type MessageKey } from '@/i18n'
import { STREAM_POINT } from './actors'
import { level, type Cue } from './cues'

interface Callout {
  id: string
  /** An actor id, or a function that returns a world point. */
  target: string | (() => Vector3)
  name: MessageKey
  /** Where the panel sits from the form, in stage units (right and down are positive). */
  dx: number
  dy: number
  appear: Cue
  /** The name goes when this cue is reached. */
  leave?: Cue
}

const cue = (key: string, from: number, span = 0.1): Cue => ({ key, from, to: from + span })
const CLOSE = cue('14-closing/closing', 0.3)
const STREAM_AT = new Vector3(...STREAM_POINT)
const streamPoint = () => STREAM_AT

const CALLOUTS: Callout[] = [
  { id: 'core', target: 'entity', name: 'node.core', dx: -16, dy: -13, appear: cue('05-actions-to-agents/actions', 0.65), leave: CLOSE },
  { id: 'work', target: 'work.0', name: 'node.work', dx: 4, dy: 13, appear: cue('05-actions-to-agents/actions', 0.85), leave: CLOSE },
  { id: 'stream', target: streamPoint, name: 'node.stream', dx: 3, dy: -14, appear: cue('06-problems/problems', 0.15), leave: CLOSE },
  { id: 'wall', target: 'wall', name: 'node.wall', dx: -12, dy: -12, appear: cue('11-foundations/foundations', 0.5), leave: CLOSE },
]

function Panel({ item, boxes }: { item: Callout; boxes: React.RefObject<Map<string, HTMLDivElement>> }) {
  const anchor = useRef<HTMLDivElement>(null)
  useAnchor(anchor, item.target)
  const left = item.dx < 0
  return (
    <div ref={anchor} className="callout-anchor" aria-hidden="true">
      <div
        ref={(el) => {
          if (el) boxes.current?.set(item.id, el)
          else boxes.current?.delete(item.id)
        }}
        className="callout"
        style={{ opacity: 0 }}
      >
        <span className="callout-dot" />
        <svg className="callout-line" viewBox="0 0 1 1" aria-hidden="true">
          <line x1="0" y1="0" x2={item.dx} y2={item.dy} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="callout-panel" style={{ left: `calc(var(--su) * ${item.dx})`, top: `calc(var(--su) * ${item.dy})`, transform: `translate(${left ? '-100%' : '0'}, -50%)` }} data-fit={item.name}>
          <T k={item.name} />
        </div>
      </div>
    </div>
  )
}

export function Callouts() {
  const boxes = useRef(new Map<string, HTMLDivElement>())
  const last = useRef('')
  usePlayhead((position, model) => {
    const state = CALLOUTS.map((c) => c.id + ':' + (level(model, position, c.appear) * (1 - level(model, position, c.leave ?? null))).toFixed(3)).join('|')
    if (state === last.current) return
    last.current = state
    for (const c of CALLOUTS) {
      const el = boxes.current.get(c.id)
      if (!el) continue
      const v = level(model, position, c.appear) * (1 - level(model, position, c.leave ?? null))
      el.style.opacity = String(v)
      el.style.visibility = v > 0.01 ? '' : 'hidden'
    }
  })
  return (
    <div className="scene-root callout-root" aria-hidden="true">
      {CALLOUTS.map((c) => (
        <Panel key={c.id} item={c} boxes={boxes} />
      ))}
    </div>
  )
}



