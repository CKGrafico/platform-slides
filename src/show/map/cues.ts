/**
 * When the map labels (MapLabels.tsx) change. Parts register cues at module
 * load, on their own beat grids:
 *
 * - show / hide: the map is on between the reveal (part 9) and the closing.
 * - appear(id, cue): the name of an entry comes in and stays.
 * - role(id, pulse): the one-line role shows under the name, for the stop
 *   that introduces the element.
 * - focus(ids, pulse): these entries are the subject; the other names step
 *   back while the pulse is up.
 * - leave(id, cue): the name goes for good (its element left the map).
 */
import type { ShowModel } from '@/engine/show-model'
import { level, pulse, type Cue, type Pulse } from '../cues'

const cues = {
  show: null as Cue | null,
  /** A pulse steps the layer out and back. A plain cue hides it for good. */
  hides: [] as Array<Pulse | Cue>,
  appear: new Map<string, Cue>(),
  leave: new Map<string, Cue>(),
  role: new Map<string, Pulse[]>(),
  focus: [] as Array<{ ids: string[]; pulse: Pulse }>,
}

export const mapCues = {
  show(cue: Cue) {
    cues.show = cue
  },
  /**
   * Hides the whole layer. Pass a `Pulse` to step it out and bring it back;
   * pass a `Cue` to hide it from then on.
   */
  hide(hide: Pulse | Cue) {
    cues.hides.push(hide)
  },
  appear(id: string, cue: Cue) {
    cues.appear.set(id, cue)
  },
  leave(id: string, cue: Cue) {
    cues.leave.set(id, cue)
  },
  role(id: string, p: Pulse) {
    const list = cues.role.get(id) ?? []
    list.push(p)
    cues.role.set(id, list)
  },
  focus(ids: string[], p: Pulse) {
    cues.focus.push({ ids, pulse: p })
  },
}

export interface MapLabelState {
  name: number
  role: number
  /** 1 when the entry is the subject, 0 when another entry is. */
  focus: number
}

export interface MapState {
  on: number
  labels: Record<string, MapLabelState>
}

export function mapState(model: ShowModel, position: number): MapState {
  let hidden = 0
  for (const h of cues.hides) hidden = Math.max(hidden, 'rise' in h ? pulse(model, position, h) : level(model, position, h))
  const on = level(model, position, cues.show) * (1 - hidden)
  const labels: Record<string, MapLabelState> = {}
  // The strongest focus pulse right now, and which entries it names.
  let strongest = 0
  let focused: string[] = []
  for (const f of cues.focus) {
    const v = pulse(model, position, f.pulse)
    if (v > strongest) {
      strongest = v
      focused = f.ids
    }
  }
  for (const [id, cue] of cues.appear) {
    const name = level(model, position, cue) * (1 - level(model, position, cues.leave.get(id) ?? null))
    const role = (cues.role.get(id) ?? []).reduce((m, p) => Math.max(m, pulse(model, position, p)), 0)
    const focus = strongest === 0 || focused.includes(id) ? 1 : 1 - strongest
    labels[id] = { name, role, focus }
  }
  return { on, labels }
}
