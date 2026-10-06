import { LIVE_IDS, type LiveId, type PathId, type Pose, type WorkId } from './actors'
import { CORE_LOCAL, LEVELS } from './layout'

export type Picture = 'cover' | 'local' | 'assessment' | 'evolution' | 'platform' | 'baseline' | 'environment' | 'workflow' | 'feedback' | 'system'
export type PictureState = Record<LiveId, Pose>

/**
 * Complete endpoints make forward, reverse, and direct navigation agree.
 * Each picture names only the two to four bodies it talks about. Everything else is hidden.
 * With `dim`, the whole picture fades to a trace behind a chapter title, and the Issue stays where it is.
 */
export function picture(kind: Picture, step: number, dim = false): PictureState {
  const state = Object.fromEntries(LIVE_IDS.map((id) => [id, { x: 20, y: 0, scale: 0.001, opacity: 0, assemble: 0, accent: 0, fluid: 0, turn: 0, phase: step, focus: 0, work: 0, cut: 0, morph: 0, morph2: 0 }])) as PictureState
  let owner: WorkId = 'core'
  const put = (id: LiveId, x: number, y: number, scale = 1, extra: Partial<Pose> = {}) => {
    Object.assign(state[id], { x, y, scale, opacity: 1, assemble: 1 }, extra)
  }
  /** A body the current beat talks about. */
  const hero = (id: LiveId, x: number, y: number, scale: number, extra: Partial<Pose> = {}) => put(id, x, y, scale, { focus: 1, ...extra })
  /** A trace of an earlier beat: small and faint, never labelled. */
  const ghost = (id: LiveId, x: number, y: number, scale: number, extra: Partial<Pose> = {}) => put(id, x, y, scale, { opacity: 0.22, ...extra })
  /** A body that leaves by gliding into the place of another, which then forms there. It ends hidden. */
  const into = (id: LiveId, x: number, y: number, scale: number) => Object.assign(state[id], { x, y, scale, opacity: 0, assemble: 1 })
  const path = (id: PathId, opacity = 0.95, accent = 1) => put(id, 0, 0, 1, { opacity, accent, focus: 0.45 })
  /** A return or a supporting link: grey and quieter than the route. */
  const back = (id: PathId, opacity = 0.5) => path(id, opacity, 0)
  const pipeline = (reasoning: 'core' | 'refine') => {
    hero('intake', -34, -2, 1.9)
    if (reasoning === 'core') hero('core', -11, -2, 1.72, { fluid: 1, cut: 4 })
    else hero('refine', -11, -2, 3.4, { fluid: 1 })
    hero('wall', 13, -2, 1.6)
    hero('outputs', 35, -2, 1.8)
    path(reasoning === 'core' ? 'path.facts' : 'path.refine')
    path(reasoning === 'core' ? 'path.check' : 'path.story')
    path('path.output')
    owner = reasoning
  }

  switch (kind) {
    case 'cover':
    case 'local':
      // On the cover the core units stand as an open laptop. On the next beat they come apart into the core.
      if (kind === 'cover') hero('core', 26, 1, 2.0, { turn: -0.55, morph: 1 })
      else hero('core', CORE_LOCAL.x, CORE_LOCAL.y, CORE_LOCAL.scale, { fluid: 1, turn: 0.16 })
      break
    case 'assessment':
      if (step === 0) {
        LEVELS.forEach((level, i) => hero(`level.${i}` as LiveId, level.x, level.y, level.scale, { turn: 0.05 * i }))
        // The core comes apart where it is. Its units fly to the five assemblies, which then form around them.
        // The Issue unit lands on level 2, Exploratory: work with an agent on a PC.
        into('core', CORE_LOCAL.x, CORE_LOCAL.y, CORE_LOCAL.scale)
        state.core.morph2 = 1
        // Thin grey links join the levels in order, from the edge of one to the edge of the next.
        for (let i = 0; i < 4; i++) back(`path.level.${i}` as PathId, 0.6)
      } else {
        for (let i = 0; i < 4; i++) hero(`parcel.${i}` as LiveId, -30 + i * 20, i % 2 ? -3 : 1, 1.9)
      }
      break
    case 'evolution': {
      // The evolution of AI as a row, like the maturity levels. Agents is the core and holds the Issue.
      // Skills, Guardrails and Harnesses are the context bank, the wall and the Harness.
      const row: [LiveId, number, Partial<Pose>][] = [
        ['era.model', 1.0, {}], ['era.prompt', 0.9, {}], ['context', 0.48, {}], ['core', 0.52, { fluid: 1 }], ['wall', 0.42, {}],
        ['harness', 0.54, {}], ['era.loop', 0.92, {}], ['era.loops', 0.78, {}], ['era.future', 0.95, { assemble: 0.32, opacity: 0.7 }],
      ]
      row.forEach(([id, scale, extra], i) => hero(id, -40 + i * 10, -1, scale, { turn: 0.04 * i, ...extra }))
      // One straight row joined in order by thin grey links, edge to edge, like a timeline. Names alternate under and over the line.
      // The way to the unknown future is fainter.
      for (let i = 0; i < 8; i++) back(`path.era.${i}` as PathId, i === 7 ? 0.3 : 0.6)
      break
    }
    case 'platform':
      if (step === 0) {
        hero('wall', -31, -2, 1.8)
        hero('harness', -10, -2, 1.9)
        hero('automation', 12, -2, 1.7)
        hero('measure', 34, -2, 1.7)
        back('path.health.foundations', 0.45)
        back('path.health.harness', 0.45)
        back('path.health.workflows', 0.45)
        owner = 'wall'
      } else {
        hero('context', -29, -2, 2.0)
        hero('wall', 0, -2, 2.1)
        hero('intake', 30, -2, 2.0)
        path('path.baseline')
        owner = 'wall'
      }
      break
    case 'baseline':
      if (step === 0) {
        hero('context', -20, -1, 2.5)
        hero('wall', 20, 2, 1.9)
        path('path.baseline')
        owner = 'context'
      } else {
        hero('gate', -13, 2, 1.9)
        hero('review', 22, 1, 1.9)
        path('path.review')
        owner = 'review'
      }
      break
    case 'environment':
      if (step === 0) {
        hero('harness', 2, -1, 2.9)
        hero('context', -29, -2, 1.8)
        owner = 'harness'
      } else {
        hero('automation', -30, -2, 1.9)
        hero('harness', -2, -1, 2.5)
        hero('forge', 27, -2, 2.5)
        path('path.environment')
        path('path.runtime')
        owner = 'harness'
      }
      break
    case 'workflow':
      if (step === 1 || step === 3) {
        pipeline('core')
      } else if (step === 2) {
        pipeline('refine')
        hero('split', 8, -11, 0.75)
        path('path.split', 0.85)
        back('path.author', 0.5)
      } else if (step === 0) {
        hero('automation', -38, 2, 1.1)
        hero('intake', -20, -1, 2.1)
        hero('refine', 17, -2, 3.9, { fluid: 1 })
        ghost('triage', -34, -13, 0.65, { opacity: 0.3 })
        path('path.refine')
        owner = 'intake'
      } else {
        hero('wall', -21, 1, 1.45)
        hero('gate', 6, 2, 1.75)
        hero('review', 33, 1, 1.35)
        hero('core', -38, 8, 0.6, { fluid: 1, opacity: 0.7 })
        path('path.gate')
        path('path.review', 0.8)
        back('path.fix', 0.6)
        back('path.apply', 0.6)
        owner = 'gate'
      }
      break
    case 'feedback':
      if (step === 0) {
        hero('measure', -8, -1, 2.3)
        hero('missing', 16, -3, 2.0, { opacity: 0.6 })
        hero('review', 36, -3, 1.4)
        owner = 'measure'
      } else {
        hero('audit', -29, -2, 2.2)
        hero('refine', 2, -2, 3.25, { fluid: 1 })
        hero('measure', 31, -2, 1.5)
        back('path.audit', 0.6)
        path('path.return')
        owner = 'audit'
      }
      break
    case 'system': {
      hero('triage', -38, 3, 1.35)
      hero('core', -19, 3, 1.2, { fluid: 1, cut: 4 })
      hero('wall', 1, 3, 1.25)
      hero('gate', 20, 3, 1.25)
      hero('deployment', 37.5, 3, 1.3)
      put('context', 0, -13, 0.75, { opacity: 0.5 })
      put('harness', 12, -13, 0.7, { opacity: 0.5 })
      put('automation', 24, -13, 0.75, { opacity: 0.5 })
      put('measure', 36, -13, 0.75, { opacity: 0.5 })
      for (let i = 0; i < 5; i++) put(`level.${i}` as LiveId, -42 + i * 6, -12, 0.32, { opacity: 0.3 })
      path('path.accept')
      path('path.check')
      path('path.gate')
      path('path.deploy')
      back('path.observe', 0.5)
      owner = 'deployment'
      break
    }
  }
  if (state.refine.fluid > 0) state.core.fluid = 0
  state[owner].work = 1
  state.packet.opacity = 0
  if (dim) {
    for (const id of LIVE_IDS) {
      const pose = state[id]
      pose.opacity = id.startsWith('path.') ? 0 : pose.opacity * 0.09
      pose.focus = 0
    }
  }
  return state
}

export function workOwner(state: PictureState): WorkId {
  return LIVE_IDS.find((id) => state[id].work > 0.5) as WorkId ?? 'core'
}
