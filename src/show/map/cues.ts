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
 */
import type { ShowModel } from '@/engine/show-model'
import { level, pulse, type Cue, type Pulse } from '../cues'

const cues = {
  show: null as Cue | null,
  hide: null as Cue | null,
  appear: new Map<string, Cue>(),
  role: new Map<string, Pulse[]>(),
  focus: [] as Array<{ ids: string[]; pulse: Pulse }>,
}

export const mapCues = {
  show(cue: Cue) {
    cues.show = cue
  },
  hide(cue: Cue) {
    cues.hide = cue
  },
  appear(id: string, cue: Cue) {
    cues.appear.set(id, cue)
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
  const on = level(model, position, cues.show) * (1 - level(model, position, cues.hide))
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
    const name = level(model, position, cue)
    const role = (cues.role.get(id) ?? []).reduce((m, p) => Math.max(m, pulse(model, position, p)), 0)
    const focus = strongest === 0 || focused.includes(id) ? 1 : 1 - strongest
    labels[id] = { name, role, focus }
  }
  return { on, labels }
}
