/**
 * The named things of the system map: the elements that keep a name from the
 * moment they are introduced, and the four lanes of the map.
 *
 * An entry follows an actor (by id) or sits at a fixed point of the world. Its
 * name and role come from the i18n files. Parts say when a name appears
 * (map/cues.ts); this file only says what can be named and where.
 */
import { Vector3 } from 'three'
import type { AnchorTarget } from '@/art/anchor'
import type { MessageKey } from '@/i18n'
import { INNER, OUTER } from '../actors'
import { GROUND_Y, LANES, RELEASE_POS, WALL_RADIUS } from '../layout'

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

/** Back left of a ring on the pipeline plane, where the lane names sit. */
const ringBack = (radius: number, y = 0) => point(-radius * 0.72, y, -radius * 0.69)

export const MAP_ENTRIES: MapEntry[] = [
  // The four lanes, from the center out.
  { id: 'lane.model', target: point(0, 0.55, -1.3), name: 'map.lane.model', side: 'above', lane: true },
  { id: 'lane.agents', target: ringBack(LANES.refine.radius), name: 'map.lane.agents', side: 'above', lane: true },
  { id: 'lane.automation', target: ringBack(OUTER.radius + 0.55), name: 'map.lane.automation', side: 'above', lane: true },
  { id: 'lane.production', target: point(4.9, GROUND_Y, 3.7), name: 'map.lane.production', side: 'left', lane: true },

  // The center: the model and its runtime.
  // The model needs no role line: OpenCode and the Harness are named right beside it.
  { id: 'core', target: 'core', offset: [0, -1.05, 0.2], name: 'map.core', side: 'below' },
  { id: 'opencode', target: 'opencode', offset: [2.3, -1.35, 0.5], name: 'map.opencode', role: 'map.opencode.role', side: 'right' },
  { id: 'harness', target: 'harness', offset: [-1.2, -1.6, 0.5], name: 'map.harness', role: 'map.harness.role', side: 'left' },

  // The automation ring.
  { id: 'ga', target: 'ga', offset: [0, 0.55, 0], name: 'map.ga', role: 'map.ga.role', side: 'above' },
  { id: 'router', target: 'router', offset: [0, 0.95, 0], name: 'map.router', role: 'map.router.role', side: 'above' },
  { id: 'gate', target: 'gate', offset: [0, 0.95, 0], name: 'map.gate', role: 'map.gate.role', side: 'above' },
  { id: 'release', target: point(RELEASE_POS[0], RELEASE_POS[1] - 0.55, RELEASE_POS[2] + 0.2), name: 'map.release', role: 'map.release.role', side: 'below' },

  // The agents.
  { id: 'triage', target: point(LANES.triage.radius * 0.5, 0.15, LANES.triage.radius * 0.87), name: 'map.triage', role: 'map.triage.role', side: 'below' },
  { id: 'refine', target: point(-LANES.refine.radius * 0.35, 0.15, LANES.refine.radius * 0.94), name: 'map.refine', role: 'map.refine.role', side: 'below' },
  { id: 'implement', target: point(INNER.radius * 0.98, 0.15, -INNER.radius * 0.2), name: 'map.implement', role: 'map.implement.role', side: 'right' },
  { id: 'requester', target: 'person.requester', offset: [-0.25, 0.9, 0], name: 'map.requester', role: 'map.requester.role', side: 'above' },

  // Production and measure.
  { id: 'walls', target: point(0, GROUND_Y + 0.2, WALL_RADIUS + 0.55), name: 'map.walls', role: 'map.walls.role', side: 'below' },
  { id: 'audit', target: 'audit', offset: [0, 0.5, 0], name: 'map.audit', role: 'map.audit.role', side: 'above' },
  { id: 'housekeeping', target: 'housekeeping', offset: [0, 0.5, 0], name: 'map.housekeeping', role: 'map.housekeeping.role', side: 'above' },
  { id: 'health', target: 'person.health', offset: [-0.55, 1.4, 0], name: 'map.health', role: 'map.health.role', side: 'left' },
]
