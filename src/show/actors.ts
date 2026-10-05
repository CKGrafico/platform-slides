import { cluster, constraint, createForm, frame, lattice, steps } from '@/art/forms'
import { defineActor } from '@/world/actors'
import type { Points, ShaderMaterial } from 'three'

export const CONNECTIONS = {
  'path.entry': { from: 'intake', to: 'triage', bend: 0 },
  'path.triage': { from: 'triage', to: 'refine', bend: 0 },
  'path.refine': { from: 'intake', to: 'refine', bend: 0 },
  'path.split': { from: 'refine', to: 'split', bend: 0 },
  'path.author': { from: 'refine', to: 'intake', bend: 5 },
  'path.implement': { from: 'refine', to: 'core', bend: 0 },
  'path.check': { from: 'core', to: 'wall', bend: 0 },
  'path.gate': { from: 'wall', to: 'gate', bend: 0 },
  'path.fix': { from: 'gate', to: 'core', bend: 7 },
  'path.review': { from: 'gate', to: 'review', bend: 0 },
  'path.apply': { from: 'review', to: 'core', bend: 6 },
  'path.release': { from: 'gate', to: 'release', bend: 0 },
  'path.observe': { from: 'release', to: 'measure', bend: 0 },
  'path.audit': { from: 'measure', to: 'audit', bend: 4 },
  'path.return': { from: 'audit', to: 'refine', bend: 6 },
  'path.local': { from: 'harness', to: 'core', bend: 0 },
  'path.parcel.0': { from: 'core', to: 'parcel.0', bend: 0 },
  'path.parcel.1': { from: 'core', to: 'parcel.1', bend: 0 },
  'path.parcel.2': { from: 'core', to: 'parcel.2', bend: 0 },
  'path.parcel.3': { from: 'core', to: 'parcel.3', bend: 0 },
  'path.facts': { from: 'intake', to: 'core', bend: 0 },
  'path.story': { from: 'refine', to: 'wall', bend: 0 },
  'path.output': { from: 'wall', to: 'outputs', bend: 0 },
  'path.baseline': { from: 'context', to: 'wall', bend: 0 },
  'path.skills': { from: 'context', to: 'automation', bend: 0 },
  'path.context': { from: 'context', to: 'core', bend: 0 },
  'path.environment': { from: 'automation', to: 'harness', bend: 0 },
  'path.runtime': { from: 'harness', to: 'forge', bend: 0 },
  'path.health.foundations': { from: 'measure', to: 'wall', bend: 5 },
  'path.health.harness': { from: 'measure', to: 'harness', bend: 7 },
  'path.health.workflows': { from: 'measure', to: 'automation', bend: 9 },
} as const
export type PathId = keyof typeof CONNECTIONS
const FORM_IDS = ['core', 'packet', 'context', 'intake', 'refine', 'automation', 'harness', 'forge', 'wall', 'gate', 'measure', 'missing', 'flow', 'parcel.0', 'parcel.1', 'parcel.2', 'parcel.3', 'triage', 'split', 'review', 'audit', 'release', 'outputs', 'level.0', 'level.1', 'level.2', 'level.3', 'level.4'] as const
export const LIVE_IDS = [...FORM_IDS, ...Object.keys(CONNECTIONS) as PathId[]]
export type LiveId = typeof LIVE_IDS[number]
export type WorkId = typeof FORM_IDS[number]
export interface Transfer { from: WorkId; to: WorkId; progress: number }

export interface Pose {
  x: number
  y: number
  scale: number
  opacity: number
  assemble: number
  accent: number
  fluid: number
  turn: number
  phase: number
  focus: number
  work: number
  cut: number
}

export function poseOf(object: Points): Pose { return object.userData.pose as Pose }

function stream() {
  const object = createForm(Array.from({ length: 34 }, (_, i) => ({
    at: [(i / 33 - 0.5) * 22, Math.sin(i * 2.4) * 0.45, Math.cos(i * 1.7) * 0.6] as [number, number, number],
    size: 0.22 + i % 4 * 0.055,
    shape: 'block' as const,
  })), 40, 0.12, 5.5)
  ;(object.material as ShaderMaterial).uniforms.uStream!.value = 1
  return object
}

const factories: Record<WorkId, () => Points> = {
  core: () => cluster(7),
  packet: () => createForm([{ at: [0, 0, 0], size: 1.25, shape: 'block' }], 91, 0.2, 12),
  context: () => lattice(30, 2, 3),
  intake: () => lattice(31, 2, 2),
  refine: () => cluster(32, 0.4),
  automation: () => steps(33),
  harness: () => frame(34),
  forge: () => createForm(Array.from({ length: 12 }, (_, i) => ({ at: [(i % 4 - 1.5) * 1.5, Math.floor(i / 4) * 1.5 - 1.5, 0] as [number, number, number], size: 0.85, shape: 'slab' })), 35, 0.22, 11),
  wall: () => constraint(36),
  gate: () => constraint(37, true),
  measure: () => lattice(38, 3, 4),
  missing: () => createForm([{ at: [-2, 0, 0], size: 0.4 }, { at: [2, 0, 0], size: 0.4 }], 39),
  flow: () => createForm(Array.from({ length: 38 }, (_, i) => ({
    at: [(i / 37 - 0.5) * 22, Math.sin(i * 2.4) * 0.65, Math.cos(i * 1.7) * 1.1] as [number, number, number],
    size: 0.18 + (i % 5) * 0.065,
    rotation: [i * 0.31, i * 0.22, 0] as [number, number, number],
  })), 40, 0.12, 4.5),
  'parcel.0': () => lattice(41, 3, 2),
  'parcel.1': () => lattice(42, 2, 2, 3),
  'parcel.2': () => lattice(43, 2, 3),
  'parcel.3': () => lattice(44, 3, 1, 3),
  triage: () => frame(45),
  split: () => createForm([{ at: [-2.4, 0, 0], size: 1, shape: 'block' }, { at: [0, 1.7, 0], size: 1, shape: 'block' }, { at: [2.4, 0, 0], size: 1, shape: 'block' }], 46, 0.23, 11),
  review: () => constraint(47, true),
  audit: () => createForm(Array.from({ length: 6 }, (_, i) => ({ at: [(i % 3 - 1) * 2.2, Math.floor(i / 3) * 2.2 - 1.1, 0] as [number, number, number], size: 0.8, shape: 'prism' })), 48, 0.23, 11),
  release: () => createForm(Array.from({ length: 4 }, (_, i) => ({ at: [0, (i - 1.5) * 1.5, 0] as [number, number, number], size: 1.5, shape: 'slab' })), 49, 0.23, 11),
  outputs: () => lattice(50, 2, 2, 2),
  'level.0': () => createForm([{ at: [0, 0, 0], size: 2.1, shape: 'block' }], 51, 0.24, 11),
  'level.1': () => createForm([{ at: [-2.1, -1, 0], size: 1.2, shape: 'block' }, { at: [1.2, 1.4, 0.8], size: 1.5 }, { at: [2.7, -1.4, 0], size: 0.8, shape: 'slab' }], 52, 0.24, 11),
  'level.2': () => frame(53),
  'level.3': () => lattice(54, 3, 3, 2),
  'level.4': () => createForm(Array.from({ length: 35 }, (_, i) => {
    const x = i % 5 - 2
    const y = Math.floor(i / 5) - 3
    return { at: [x * 2.1, y * 1.6, Math.abs(x) === 2 || Math.abs(y) === 3 ? -1.3 : 1.3] as [number, number, number], size: Math.abs(x) === 2 || Math.abs(y) === 3 ? 0.8 : 0.55, shape: 'block' as const }
  }), 55, 0.24, 11),
}

export const actors = LIVE_IDS.map((id) => defineActor({
  id,
  create: () => {
    const object = id.startsWith('path.') ? stream() : factories[id as WorkId]()
    if (id === 'packet') {
      object.userData.transfer = { from: 'core', to: 'core', progress: 1 } satisfies Transfer
    }
    if (id === 'core' || id === 'refine') object.userData.workPart = 2
    object.userData.pose = { x: 18, y: 0, scale: 1, opacity: 0, assemble: 1, accent: 0, fluid: 0, turn: 0, phase: 0, focus: 0, work: 0, cut: 0 } satisfies Pose
    return object
  },
}))
