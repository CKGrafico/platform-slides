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
import { COINS, GUARDRAIL_SPOTS, HALL_BIG, KILNS, LOOP, RINGS } from '../layout'

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

export const MAP_ENTRIES: MapEntry[] = [
  // The hall and what it keeps.
  // A nameplate under the loop, so the name never reaches the map of the talk in the corner.
  { id: 'hall', target: 'hall', offset: [0, -0.05, 4.6], name: 'town.hall', role: 'town.hall.role', side: 'below' },
  { id: 'opencode', target: 'banner', offset: [0.45, 1.1, 0], name: 'map.opencode', role: 'map.opencode.role', side: 'right' },
  { id: 'harness', target: point(-2.3 * HALL_BIG - 0.7, 0.5, 2.0 * HALL_BIG), name: 'map.harness', role: 'map.harness.role', side: 'left' },
  { id: 'coins', target: point(COINS[0] + 0.45, COINS[1] + 0.7, COINS[2]), name: 'town.coins', role: 'town.coins.role', side: 'right' },
  { id: 'lane.automation', target: point(1.7, 0, LOOP[1]![2] - 0.45), name: 'map.lane.automation', side: 'above', lane: true },

  // The runtime.
  { id: 'forge', target: 'forge', offset: [0, 2.2, 0], name: 'map.forge', role: 'map.forge.role', side: 'above' },
  { id: 'models', target: point(KILNS[1]![0], 1.3, KILNS[1]![2]), name: 'map.models', role: 'map.models.role', side: 'above' },

  // The automation.
  { id: 'station', target: 'station', offset: [0, 2.7, 0], name: 'map.ga', role: 'map.ga.role', side: 'above' },
  { id: 'gatehouse', target: 'gatehouse', offset: [0, 3.3, 0], name: 'map.router', role: 'map.router.role', side: 'above' },
  { id: 'exit', target: 'exit', offset: [0, 3.3, 0], name: 'map.gate', role: 'map.gate.role', side: 'above' },
  { id: 'market', target: 'market', offset: [0, 1.4, 0], name: 'map.release', role: 'map.release.role', side: 'above' },

  // The agents and the people.
  { id: 'triage', target: 'triage', offset: [0, 2.1, 0], name: 'map.triage', role: 'map.triage.role', side: 'above' },
  { id: 'refine', target: 'refine', offset: [0, 1.75, 0], name: 'map.refine', role: 'map.refine.role', side: 'above' },
  { id: 'requester', target: 'requester', offset: [0, -0.15, 0.6], name: 'map.requester', role: 'map.requester.role', side: 'below' },
  { id: 'booth', target: 'booth', offset: [0, -0.1, 1.0], name: 'town.booth', role: 'town.booth.role', side: 'below' },

  // Production and measure.
  { id: 'walls', target: onRing(GUARDRAIL_SPOTS[0]!.ring, GUARDRAIL_SPOTS[0]!.angle, 1.5), name: 'map.walls', role: 'map.walls.role', side: 'above' },
  { id: 'tower', target: 'tower', offset: [0, 4.0, 0], name: 'map.audit', role: 'map.audit.role', side: 'above' },
  { id: 'repair', target: 'repair', offset: [0, 1.4, 0], name: 'map.housekeeping', role: 'map.housekeeping.role', side: 'above' },
  { id: 'health', target: 'elder', offset: [-0.55, 1.4, 0], name: 'map.health', role: 'map.health.role', side: 'left' },
]
