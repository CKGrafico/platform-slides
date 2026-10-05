import { LIVE_IDS, type LiveId, type PathId, type Pose, type WorkId } from './actors'

export type Picture = 'cover' | 'local' | 'assessment' | 'evolution' | 'platform' | 'baseline' | 'environment' | 'workflow' | 'feedback' | 'system'
export type PictureState = Record<LiveId, Pose>

/** Complete endpoints make forward, reverse, and direct navigation agree. */
export function picture(kind: Picture, step: number): PictureState {
  const state = Object.fromEntries(LIVE_IDS.map((id) => [id, { x: 20, y: 0, scale: 0.001, opacity: 0, assemble: 0, accent: 0, fluid: 0, turn: 0, phase: step, focus: 0, work: 0, cut: 0 }])) as PictureState
  let owner: WorkId = 'core'
  const put = (id: LiveId, x: number, y: number, scale = 1, extra: Partial<Pose> = {}) => {
    Object.assign(state[id], { x, y, scale, opacity: 1, assemble: 1 }, extra)
  }
  const path = (id: PathId, opacity = 0.7, accent = 0) => put(id, 0, 0, 1, { opacity, accent, focus: 0.45 })
  const levels = (large = false) => {
    for (let i = 0; i < 5; i++) put(`level.${i}` as LiveId, -36 + i * 18, large ? (i % 2 ? -3 : 1) : 12, large ? [1.5, 1.6, 1.0, 1.1, 1.0][i]! : 0.38, { opacity: large ? 1 : 0.27, turn: 0.05 * i })
  }
  const areas = (large = false) => {
    for (let i = 0; i < 4; i++) put(`parcel.${i}` as LiveId, large ? -30 + i * 20 : -27 + i * 8, large ? (i % 2 ? -3 : 1) : -12, large ? 1.9 : 0.42, { opacity: large ? 1 : 0.27 })
  }
  const local = (layers: number) => {
    put('core', 22, 0, 2.15, { fluid: 1, turn: 0.16, focus: 1 })
    if (layers >= 1) put('context', -20, 0, 1.65)
    if (layers >= 2) put('automation', -2, -4, 1.45)
    if (layers >= 3) put('harness', 29, -6, 1.5)
  }
  const field = () => {
    put('core', 0, -3, 1.25, { fluid: 1, cut: 4 })
    put('context', -25, 7, 0.65, { opacity: 0.45 })
    put('automation', -28, -11, 0.7, { opacity: 0.55 })
    put('harness', -9, -12, 0.85, { opacity: 0.65 })
    put('forge', 7, -13, 0.65, { opacity: 0.4 })
    put('wall', 16, -2, 1.0)
    put('gate', 33, -3, 0.85)
    put('measure', 36, -13, 0.7, { opacity: 0.5 })
    put('intake', -38, -3, 0.9)
    put('refine', -20, -3, 1.65)
    put('outputs', 21, 9, 0.65, { opacity: 0.6 })
    levels()
    areas()
  }
  const focus = (heroes: WorkId[], map = false) => {
    for (const id of LIVE_IDS) {
      const pose = state[id]
      if (pose.opacity === 0 || id.startsWith('path.') || id === 'packet') continue
      if (heroes.includes(id as WorkId)) { pose.focus = 1; continue }
      pose.opacity *= map ? 0.56 : 0.34
      if (!map) pose.scale *= 0.8
    }
  }
  const pipeline = (reasoning: 'core' | 'refine' = 'core') => {
    field()
    focus(['intake', reasoning, 'wall', 'outputs'])
    put('intake', -34, -2, 1.9, { focus: 1 })
    put(reasoning, -11, -2, reasoning === 'core' ? 1.72 : 3.4, { focus: 1, fluid: 1, cut: reasoning === 'core' ? 4 : 0 })
    put('wall', 13, -2, 1.6, { focus: 1 })
    put('outputs', 35, -2, 1.8, { focus: 1 })
    if (reasoning === 'refine') { state.core.x = 2; state.core.y = -13; state.core.scale = 0.52 }
    path(reasoning === 'core' ? 'path.facts' : 'path.refine', 0.8, 1)
    if (reasoning === 'core') path('path.check', 0.8, 1)
    else path('path.story', 0.7, 1)
    path('path.output', 0.8, 1)
    owner = reasoning
  }

  switch (kind) {
    case 'cover':
    case 'local':
      local(0)
      put('core', 23, 0, kind === 'cover' ? 2.25 : 2.15, { fluid: 1, turn: 0.16, focus: 1 })
      break
    case 'assessment':
      put('core', 30, -13, 0.55, { fluid: 1, opacity: 0.4 })
      levels(step === 0)
      if (step === 1) areas(true)
      break
    case 'evolution':
      local(step === 0 ? 1 : 3)
      levels()
      areas()
      if (step === 0) {
        put('context', -20, -2, 1.9, { focus: 1 })
        put('core', 14, -2, 1.9, { fluid: 1, focus: 1 })
        path('path.context', 0.7, 1)
      } else {
        put('context', -33, -6, 0.85, { opacity: 0.55 })
        put('automation', -14, -1, 1.85, { focus: 1 })
        put('harness', 16, -2, 2.35, { focus: 1 })
        put('core', 35, -11, 0.6, { fluid: 1, opacity: 0.6 })
        path('path.skills', 0.5)
        path('path.environment', 0.7)
        path('path.local', 0.5)
        owner = 'harness'
        if (step === 2) {
          put('intake', -27, -1, 1.8, { focus: 1 })
          put('automation', -9, -12, 0.7, { opacity: 0.45 })
          put('harness', 11, -1, 2.3, { focus: 1 })
          put('core', 31, -8, 0.85, { fluid: 1 })
          owner = 'intake'
          path('path.facts', 0.65)
        }
      }
      break
    case 'platform':
      field()
      focus(['wall', 'harness', 'automation', 'measure'])
      put('wall', -31, -2, 1.6, { focus: 1 })
      put('harness', -10, -2, 1.8, { focus: 1 })
      put('automation', 12, -2, 1.55, { focus: 1 })
      put('measure', 34, -2, 1.55, { focus: 1 })
      put('core', 2, -13, 0.5, { fluid: 1, opacity: 0.4 })
      path('path.health.foundations', 0.4)
      path('path.health.harness', 0.4)
      path('path.health.workflows', 0.4)
      owner = 'wall'
      if (step === 1) {
        focus(['context', 'wall', 'intake'])
        put('context', -29, -2, 1.8, { focus: 1 })
        put('wall', 0, -2, 2.05, { focus: 1 })
        put('intake', 30, -2, 1.9, { focus: 1 })
        path('path.baseline', 0.8)
      }
      break
    case 'baseline':
      field()
      focus(step === 0 ? ['context'] : step === 1 ? ['wall'] : step === 2 ? ['context', 'wall'] : ['gate', 'review'])
      put('core', 34, -11, 0.65, { fluid: 1, opacity: 0.35 })
      if (step === 0) {
        put('context', 0, -1, 3.35, { focus: 1 })
        owner = 'context'
      } else if (step === 1) {
        put('wall', 3, -1, 3.0, { focus: 1 })
        put('context', -30, -7, 1.0, { opacity: 0.5 })
        path('path.baseline', 0.75)
        owner = 'wall'
      } else if (step === 2) {
        put('context', -20, -2, 2.3, { focus: 1 })
        put('wall', 20, -2, 2.1, { focus: 1 })
        path('path.baseline', 0.85)
        owner = 'context'
      } else {
        put('gate', -13, -1, 2.3, { focus: 1 })
        put('review', 22, -3, 2.0, { focus: 1 })
        path('path.review', 0.8)
        owner = 'review'
      }
      break
    case 'environment':
      field()
      focus(step === 0 ? ['harness', 'context'] : step === 1 ? ['context', 'automation'] : step === 2 ? ['automation', 'harness'] : ['harness', 'forge'])
      put('core', 35, -12, 0.55, { fluid: 1, opacity: 0.4 })
      if (step === 0) {
        put('harness', 0, -1, 2.9, { focus: 1 })
        put('context', -29, -2, 1.45, { focus: 1 })
        owner = 'harness'
      } else if (step === 1) {
        put('context', -22, -2, 2.4, { focus: 1 })
        put('automation', 18, -2, 2.1, { focus: 1 })
        path('path.skills', 0.85)
        owner = 'context'
      } else if (step === 2) {
        put('automation', -20, -2, 2.35, { focus: 1 })
        put('harness', 22, -2, 2.25, { focus: 1 })
        path('path.environment', 0.8)
        owner = 'automation'
      } else {
        put('harness', -21, -1, 2.5, { focus: 1 })
        put('forge', 20, -2, 2.75, { focus: 1 })
        path('path.runtime', 0.85)
        owner = 'harness'
      }
      break
    case 'workflow':
      if (step === 2 || step === 3 || step === 5) {
        pipeline(step === 3 ? 'refine' : 'core')
      } else {
        field()
        if (step === 0) {
          focus(['automation', 'harness'])
          put('automation', -20, -1, 2.0, { focus: 1 })
          put('harness', 20, -2, 2.3, { focus: 1 })
          path('path.environment', 0.8)
          owner = 'automation'
        } else if (step === 1) {
          focus(['intake', 'refine'])
          put('intake', -20, -1, 2.1, { focus: 1 })
          put('refine', 17, -2, 3.9, { focus: 1, fluid: 1 })
          put('triage', -34, -13, 0.65, { opacity: 0.5 })
          path('path.refine', 0.85)
          owner = 'intake'
        } else if (step === 4) {
          focus(['intake', 'refine', 'split'], true)
          put('intake', -30, -3, 1.7, { focus: 1 })
          put('refine', 0, -1, 4.15, { focus: 1, fluid: 1 })
          put('split', 31, -3, 2.0, { focus: 1 })
          path('path.refine', 0.55)
          path('path.author', 0.9)
          path('path.split', 0.9)
          owner = 'refine'
        } else if (step === 6) {
          focus(['wall', 'gate', 'review'])
          put('wall', -29, -2, 1.75, { focus: 1 })
          put('gate', 3, -2, 2.2, { focus: 1 })
          put('review', 32, -3, 1.3, { focus: 1 })
          path('path.gate', 0.85)
          path('path.review', 0.7)
          owner = 'gate'
        } else {
          put('triage', -36, 7, 0.65)
          put('split', -20, -14, 0.85)
          put('review', 26, 9, 0.8)
          put('release', 39, 9, 1.0)
          focus(step === 7 ? ['core', 'gate', 'review', 'wall'] : ['intake', 'gate', 'release'], true)
          for (const id of ['path.refine', 'path.implement', 'path.check', 'path.gate'] as PathId[]) path(id, 0.6)
          if (step === 7) {
            path('path.fix', 0.85)
            path('path.review', 0.6)
            path('path.apply', 0.85)
            owner = 'core'
          } else {
            path('path.release', 0.85)
            owner = 'release'
          }
        }
      }
      break
    case 'feedback':
    case 'system':
      field()
      put('triage', -37, 7, 0.55)
      put('split', -20, -14, 0.65)
      put('review', 29, 8, 0.65)
      put('release', 40, 5, 0.8)
      put('audit', -34, -14, 0.9)
      if (kind === 'feedback') {
        focus(step === 2 ? ['measure', 'review'] : step === 3 ? ['measure', 'audit', 'refine'] : ['measure'])
        if (step < 2) {
          put('measure', 5, -1, 2.3, { focus: 1 })
          if (step === 0) put('missing', 32, -3, 2.0, { opacity: 0.6, focus: 1 })
          owner = 'measure'
        } else if (step === 2) {
          put('review', -20, -2, 2.2, { focus: 1 })
          put('measure', 22, -2, 1.9, { focus: 1 })
          owner = 'review'
        } else {
          put('audit', -29, -2, 2.2, { focus: 1 })
          put('refine', 2, -2, 3.25, { focus: 1, fluid: 1 })
          put('measure', 31, -2, 1.5, { focus: 1 })
          path('path.audit', 0.6)
          path('path.return', 0.9)
          path('path.health.foundations', 0.5)
          path('path.health.harness', 0.5)
          path('path.health.workflows', 0.5)
          owner = 'audit'
        }
      } else {
        for (const id of LIVE_IDS) if (state[id].opacity > 0) state[id].opacity = Math.max(0.55, state[id].opacity)
        for (const id of ['path.entry', 'path.triage', 'path.implement', 'path.check', 'path.gate', 'path.review', 'path.apply', 'path.release', 'path.observe', 'path.audit', 'path.return', 'path.local', 'path.runtime'] as PathId[]) path(id, 0.42)
        path('path.health.foundations', 0.34)
        path('path.health.harness', 0.34)
        path('path.health.workflows', 0.34)
        owner = 'core'
      }
      break
  }
  if (state.refine.fluid > 0) state.core.fluid = 0
  state[owner].work = 1
  state.packet.opacity = 0
  return state
}

export function workOwner(state: PictureState): WorkId {
  return LIVE_IDS.find((id) => state[id].work > 0.5) as WorkId ?? 'core'
}
