/**
 * The named things of the town: the elements that keep a name from the
 * moment they are introduced, like the names on a map.
 *
 * An entry follows an actor (by id) or sits at a fixed point of the world. Its
 * name and role come from the i18n files. Parts say when a name appears
 * (map/cues.ts); this file only says what can be named and where.
 */
import { Vector3 } from 'three'
import type { AnchorTarget } from '@/art/anchor'
import type { MessageKey } from '@/i18n'
import { COINS, KILNS, RINGS, SIGN_SPOTS, STATION } from '../layout'

export type Side = 'above' | 'below' | 'left' | 'right'

export interface MapEntry {
  id: string
  target: AnchorTarget
  /** World offset from the target, so the name clears the element. */
  offset?: readonly [number, number, number]
  name: MessageKey
  role?: MessageKey
  side?: Side
  /** A lane name: quieter, set apart from the element names. */
  lane?: boolean
}

const point = (x: number, y: number, z: number) => {
  const v = new Vector3(x, y, z)
  return () => v
}
const onRing = (ring: number, angle: number, y: number) => point(Math.cos(angle) * RINGS[ring]!, y, Math.sin(angle) * RINGS[ring]!)

/**
 * The names stand round the hall on the sides with room, at the far camera
 * (shots.ts): on screen the hall is small and its names are not, so each
 * takes its own side and its own height.
 */
export const MAP_ENTRIES: MapEntry[] = [
  // The hall and what it keeps.
  { id: 'hall', target: 'hall', offset: [1.1, 0, 4.7], name: 'town.hall', role: 'town.hall.role', side: 'below' },
  { id: 'opencode', target: 'banner', offset: [0.9, 5.5, 0], name: 'map.opencode', role: 'map.opencode.role', side: 'right' },
  // The Harness takes the name of its district's sign, south east of the hall.
  { id: 'harness', target: point(SIGN_SPOTS[0]![0] + 1.3, 0, SIGN_SPOTS[0]![2] + 3.5), name: 'map.harness', role: 'map.harness.role', side: 'below' },
  { id: 'coins', target: point(COINS[0] + 2.4, 0, COINS[2] + 1.2), name: 'town.coins', role: 'town.coins.role', side: 'right' },
  { id: 'lane.automation', target: point(4.8, 3.4, -3.4), name: 'map.lane.automation', side: 'right', lane: true },

  // The runtime.
  { id: 'forge', target: 'forge', offset: [1.5, 6.5, 0], name: 'map.forge', role: 'map.forge.role', side: 'above' },
  { id: 'models', target: point(KILNS[2]![0] + 2.0, 3.0, KILNS[2]![2] + 0.2), name: 'map.models', role: 'map.models.role', side: 'right' },

  // The automation.
  { id: 'station', target: point(STATION[0] + 4.3, 0, STATION[2] + 12.3), name: 'map.ga', role: 'map.ga.role', side: 'right' },
  { id: 'gatehouse', target: 'gatehouse', offset: [0, 9.0, 0], name: 'map.router', role: 'map.router.role', side: 'above' },
  { id: 'exit', target: 'exit', offset: [0, -0.2, 3.5], name: 'map.gate', role: 'map.gate.role', side: 'below' },
  { id: 'market', target: 'market', offset: [5.5, 1.6, 0], name: 'map.release', role: 'map.release.role', side: 'above' },

  // The agents and the people.
  { id: 'triage', target: 'triage', offset: [0, 6.5, 0], name: 'map.triage', role: 'map.triage.role', side: 'above' },
  { id: 'refine', target: 'refine', offset: [0, 1.4, 0], name: 'map.refine', role: 'map.refine.role', side: 'above' },
  { id: 'requester', target: 'requester', offset: [-2.5, 0.2, 0], name: 'map.requester', role: 'map.requester.role', side: 'left' },
  { id: 'booth', target: 'booth', offset: [0, -0.1, 5.0], name: 'town.booth', role: 'town.booth.role', side: 'below' },

  // Production and measure.
  { id: 'walls', target: onRing(2, Math.PI / 3, 3.0), name: 'map.walls', role: 'map.walls.role', side: 'above' },
  { id: 'tower', target: 'tower', offset: [0.3, 9.0, 0], name: 'map.audit', role: 'map.audit.role', side: 'above' },
  { id: 'repair', target: 'repair', offset: [0.8, 0.4, 0], name: 'map.housekeeping', role: 'map.housekeeping.role', side: 'right' },
  { id: 'health', target: 'elder', offset: [-0.7, 1.6, 0], name: 'map.health', role: 'map.health.role', side: 'left' },
]
