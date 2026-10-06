import { cluster, createForm, era, gate, harness, laptopLayout, laptopScreen, lattice, level, plate, spreadUnits, steps, triage, upright, wall, type FormUnit } from '@/art/forms'
import { spreadLayout } from './layout'
import { createAsciiMaterial } from '@/art/ascii'
import { defineActor } from '@/world/actors'
import { Points, type BufferGeometry, type ShaderMaterial } from 'three'

/**
 * A channel between two bodies. By default it runs between the Issue ports of the two bodies.
 * With `edge`, it is a thin link that leaves the edge of one body and enters the edge of the next, for a row of steps.
 * With `over` as well, the thin link leaves the top of one body and lands on the top of the other, and `bend` arcs it
 * upward by that many stage units. Rows use it for a return that must not cross the row or its names.
 */
export interface Connection { from: WorkId; to: WorkId; bend: number; edge?: true; over?: true }

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
  'path.accept': { from: 'triage', to: 'core', bend: 0 },
  'path.deploy': { from: 'gate', to: 'deployment', bend: 0 },
  'path.observe': { from: 'deployment', to: 'measure', bend: 5 },
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
  // Foundations holds three convention sets.
  'path.found.0': { from: 'wall', to: 'parcel.0', bend: 0, edge: true },
  'path.found.1': { from: 'wall', to: 'parcel.1', bend: 0, edge: true },
  'path.found.2': { from: 'wall', to: 'parcel.2', bend: 0, edge: true },
  // agent-harness installs four parts.
  'path.kit.0': { from: 'harness', to: 'kit.spec', bend: 0, edge: true },
  'path.kit.1': { from: 'harness', to: 'kit.plugin', bend: 0, edge: true },
  'path.kit.2': { from: 'harness', to: 'context', bend: 0, edge: true },
  'path.kit.3': { from: 'harness', to: 'wall', bend: 0, edge: true },
  // agentic-workflows: an event, the workflow, the agent, the validated writes.
  'path.async.0': { from: 'intake', to: 'automation', bend: 0, edge: true },
  'path.async.1': { from: 'automation', to: 'core', bend: 0, edge: true },
  'path.async.2': { from: 'core', to: 'outputs', bend: 0, edge: true },
  // The four pillars of Platform, in order.
  'path.pillar.0': { from: 'wall', to: 'harness', bend: 0, edge: true },
  'path.pillar.1': { from: 'harness', to: 'automation', bend: 0, edge: true },
  'path.pillar.2': { from: 'automation', to: 'measure', bend: 0, edge: true },
  // project-health feeds what it measures back to the other three pillars: one cycle.
  'path.pillar.back.2': { from: 'measure', to: 'automation', bend: 4, edge: true, over: true },
  'path.pillar.back.1': { from: 'measure', to: 'harness', bend: 8, edge: true, over: true },
  'path.pillar.back.0': { from: 'measure', to: 'wall', bend: 12, edge: true, over: true },
  // The five maturity levels, as one line from level to level.
  'path.level.0': { from: 'level.0', to: 'level.1', bend: 0, edge: true },
  'path.level.1': { from: 'level.1', to: 'level.2', bend: 0, edge: true },
  'path.level.2': { from: 'level.2', to: 'level.3', bend: 0, edge: true },
  'path.level.3': { from: 'level.3', to: 'level.4', bend: 0, edge: true },
  // The evolution of AI, as one line from step to step.
  'path.era.0': { from: 'era.model', to: 'era.prompt', bend: 0, edge: true },
  'path.era.1': { from: 'era.prompt', to: 'context', bend: 0, edge: true },
  'path.era.2': { from: 'context', to: 'core', bend: 0, edge: true },
  'path.era.3': { from: 'core', to: 'wall', bend: 0, edge: true },
  'path.era.4': { from: 'wall', to: 'harness', bend: 0, edge: true },
  'path.era.5': { from: 'harness', to: 'era.loop', bend: 0, edge: true },
  'path.era.6': { from: 'era.loop', to: 'era.loops', bend: 0, edge: true },
  'path.era.7': { from: 'era.loops', to: 'era.future', bend: 0, edge: true },
} as const satisfies Record<string, Connection>
export type PathId = keyof typeof CONNECTIONS
const FORM_IDS = ['core', 'packet', 'context', 'intake', 'refine', 'automation', 'harness', 'forge', 'wall', 'gate', 'measure', 'missing', 'flow', 'parcel.0', 'parcel.1', 'parcel.2', 'parcel.3', 'triage', 'split', 'review', 'audit', 'release', 'outputs', 'level.0', 'level.1', 'level.2', 'level.3', 'level.4', 'deployment', 'era.model', 'era.prompt', 'era.loop', 'era.loops', 'era.future', 'kit.spec', 'kit.plugin'] as const
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
  /** 0 keeps the units at home. 1 moves them into the form's first other build, if it has one. */
  morph: number
  /** The same for the form's second other build. */
  morph2: number
  /** 1 paints the body's mark units in the accent blue as well. See userData.markParts. */
  marks: number
}

export function poseOf(object: Points): Pose { return object.userData.pose as Pose }

/** A wide route: three lanes of small beads. Same-lane pitch keeps the beads apart, so they never fuse. */
function streamUnits(n = 45): FormUnit[] {
  return Array.from({ length: n }, (_, i) => {
    const lane = i % 3
    return {
      at: [(i / (n - 1) - 0.5) * 22, [-0.7, 0.1, 0.7][lane]! + Math.sin(i * 2.4) * 0.15, [0.6, -0.7, 0.1][lane]! + Math.cos(i * 1.7) * 0.15] as [number, number, number],
      size: 0.28 + (i % 5) * 0.055,
      shape: (['cell', 'cubocta', 'block'] as const)[lane],
      rotation: [i * 0.31, i * 0.22, 0] as [number, number, number],
    }
  })
}

/** A thin link: one dense lane of equal beads, so it reads as a fine line. */
function linkUnits(n = 150): FormUnit[] {
  return Array.from({ length: n }, (_, i) => ({
    at: [(i / (n - 1) - 0.5) * 22, 0, 0] as [number, number, number],
    size: 0.22,
    shape: 'cubocta' as const,
    rotation: [i * 0.31, i * 0.22, 0] as [number, number, number],
  }))
}

type StreamKind = 'wide' | 'thin'
/** Every channel of one kind draws the same beads, so they share one geometry. The last owner disposes it. */
const shared: Partial<Record<StreamKind, { geometry: BufferGeometry; source: Points; users: number }>> = {}

function stream(kind: StreamKind = 'wide'): Points {
  let object: Points
  let owner = shared[kind]
  if (!owner) {
    object = kind === 'thin' ? createForm(linkUnits(), 41, 0.17, 7, { depth: false }) : createForm(streamUnits(), 40, 0.17, 7, { depth: false })
    owner = shared[kind] = { geometry: object.geometry, source: object, users: 0 }
  } else {
    object = new Points(owner.geometry, createAsciiMaterial(7))
    object.frustumCulled = false
    const { units, formSeed, workPart, drift } = owner.source.userData
    Object.assign(object.userData, { units, formSeed, workPart, drift })
  }
  owner.users++
  const material = object.material as ShaderMaterial
  material.uniforms.uStream!.value = 1
  object.userData.dispose = () => {
    material.dispose()
    owner.users--
    if (owner.users === 0) {
      owner.geometry.dispose()
      if (shared[kind] === owner) delete shared[kind]
    }
  }
  return object
}

const factories: Record<WorkId, () => Points> = {
  // Two other builds: the laptop of the cover, and the core taken apart over the five maturity assemblies.
  core: () => {
    const object = cluster(7, 1, (units) => [laptopLayout(units), spreadLayout(units)])
    // While the core stands as the laptop, the blue moves over the screen tiles. See AsciiRuntime.
    object.userData.screenParts = laptopScreen(object.userData.units as FormUnit[])
    // Two units on the front of the mass that can join the Issue in blue, far from it and from each other.
    // Units 4 to 7 leave later, so they are skipped.
    object.userData.markParts = spreadUnits(object.userData.units as FormUnit[], 2, 2, [4, 5, 6, 7])
    return object
  },
  packet: () => createForm([{ at: [0, 0, 0], size: 1.25, shape: 'block' }], 91, 0.2, 13),
  context: () => lattice(30, 5, 2, 1),
  intake: () => lattice(31, 2, 2, 4),
  refine: () => cluster(32, 0.42),
  automation: () => steps(33),
  harness: () => harness(34),
  forge: () => plate(35),
  wall: () => wall(36),
  gate: () => gate(37),
  measure: () => lattice(38, 3, 3, 3, 2.1, 1, 0.24),
  missing: () => createForm([{ at: [-2, 0, 0], size: 0.4 }, { at: [2, 0, 0], size: 0.4 }], 39, 0.3, 9),
  flow: () => stream(),
  'parcel.0': () => lattice(41, 3, 2, 1, 2.1, 1, 0.26),
  'parcel.1': () => lattice(42, 2, 2, 3, 2.1, 1, 0.26),
  'parcel.2': () => lattice(43, 2, 3, 1, 2.1, 1, 0.26),
  'parcel.3': () => lattice(44, 3, 1, 3, 2.1, 1, 0.26),
  triage: () => triage(45),
  split: () => createForm([{ at: [-2.6, -0.3, 0], size: 1, shape: 'block' }, { at: [0, 1.8, 0], size: 1, shape: 'block' }, { at: [2.6, -0.3, 0], size: 1, shape: 'block' }], 46, 0.24, 11, { work: 1 }),
  review: () => upright(47),
  audit: () => createForm(Array.from({ length: 6 }, (_, i) => ({ at: [(i % 3 - 1) * 2.2, Math.floor(i / 3) * 2.8 - 1.4, 0] as [number, number, number], size: 0.9, shape: 'prism' as const })), 48, 0.24, 11),
  release: () => createForm(Array.from({ length: 4 }, (_, i) => ({ at: [0, (i - 1.5) * 1.5, 0] as [number, number, number], size: 1.5, shape: 'slab' as const })), 49, 0.24, 11),
  outputs: () => lattice(50, 2, 2, 2),
  deployment: () => lattice(56, 4, 2, 2),
  'level.0': () => level(51, 0),
  'level.1': () => level(52, 1),
  'level.2': () => level(53, 2),
  'level.3': () => level(54, 3),
  'level.4': () => level(55, 4),
  // The steps of the evolution of AI without an element of their own. Agents, Skills, Guardrails and Harnesses reuse theirs.
  'era.model': () => era(58, 'model'),
  'era.prompt': () => era(59, 'prompt'),
  'era.loop': () => era(60, 'loop'),
  'era.loops': () => era(61, 'loops'),
  'era.future': () => era(62, 'future'),
  // agent-harness parts without an element of their own. Skills and guardrails reuse the context bank and the wall.
  'kit.spec': () => era(63, 'spec'),
  'kit.plugin': () => era(64, 'plugin'),
}

export const actors = LIVE_IDS.map((id) => defineActor({
  id,
  create: () => {
    const object = id.startsWith('path.') ? stream((CONNECTIONS[id as PathId] as Connection).edge ? 'thin' : 'wide') : factories[id as WorkId]()
    if (id === 'packet') {
      object.userData.transfer = { from: 'core', to: 'core', progress: 1 } satisfies Transfer
    }
    object.userData.pose = { x: 18, y: 0, scale: 1, opacity: 0, assemble: 1, accent: 0, fluid: 0, turn: 0, phase: 0, focus: 0, work: 0, cut: 0, morph: 0, morph2: 0, marks: 0 } satisfies Pose
    return object
  },
}))
