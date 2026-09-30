/**
 * The names of the system map, in the overlay layer, from the pillars to the
 * closing (docs/art/clarity-review.md). Once an element is introduced, its
 * name stays, small and quiet, like the name on a map. The stop that
 * introduces it also shows its one-line role. When a stop has a subject, the
 * other names step back.
 *
 * It reads the playhead through cues (map/cues.ts), so its state is a pure
 * function of the position. Anchors follow the actors like every label.
 */
import { useRef } from 'react'
import { useAnchor } from '@/art/anchor'
import { usePlayhead } from '@/engine/context'
import { T } from '@/i18n'
import { mapState, type MapLabelState } from './cues'
import { MAP_ENTRIES, type MapEntry } from './entries'

const SIDE_CLASS = { above: 'map-label--above', below: 'map-label--below', left: 'map-label--left', right: 'map-label--right' } as const

function MapLabel({ entry, state }: { entry: MapEntry; state: React.RefObject<Map<string, HTMLDivElement>> }) {
  const anchor = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  useAnchor(anchor, entry.target, entry.offset)
  return (
    <div ref={anchor} className="art-anchor" aria-hidden="true">
      <div
        ref={(el) => {
          box.current = el
          if (el) state.current?.set(entry.id, el)
          else state.current?.delete(entry.id)
        }}
        className={['map-label', SIDE_CLASS[entry.side ?? 'above'], entry.lane ? 'map-label--lane' : ''].filter(Boolean).join(' ')}
        style={{ opacity: 0 }}
      >
        <div className="map-name" data-fit={entry.name}>
          <T k={entry.name} />
        </div>
        {entry.role ? (
          <div className="map-role" data-fit={entry.role}>
            <T k={entry.role} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

const REST = 0.32

function apply(el: HTMLDivElement, on: number, s: MapLabelState | undefined): void {
  const name = on * (s?.name ?? 0)
  const focus = s?.focus ?? 1
  const opacity = name * (REST + (1 - REST) * focus)
  el.style.opacity = String(opacity)
  el.style.visibility = opacity > 0.01 ? '' : 'hidden'
  const role = el.querySelector<HTMLElement>('.map-role')
  if (role) {
    const r = name * (s?.role ?? 0)
    role.style.opacity = String(r)
    role.style.visibility = r > 0.01 ? '' : 'hidden'
  }
}

export function MapLabels() {
  const boxes = useRef(new Map<string, HTMLDivElement>())
  const last = useRef('')
  usePlayhead((position, model) => {
    const s = mapState(model, position)
    const key = JSON.stringify(s)
    if (key === last.current) return
    last.current = key
    for (const [id, el] of boxes.current) apply(el, s.on, s.labels[id])
  })
  return (
    <div className="scene-root map-root" aria-hidden="true">
      {MAP_ENTRIES.map((entry) => (
        <MapLabel key={entry.id} entry={entry} state={boxes} />
      ))}
    </div>
  )
}
