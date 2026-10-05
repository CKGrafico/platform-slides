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
      local(3)
      levels()
      areas()
      if (step === 0) {
        put('context', -34, -1, 1.5, { focus: 1 })
        put('automation', -12, -2, 1.5, { focus: 1 })
        put('harness', 11, -2, 1.9, { focus: 1 })
        put('core', 34, -2, 1.5, { fluid: 1, focus: 1 })
        path('path.skills', 0.7, 1)
        path('path.environment', 0.7)
        path('path.local', 0.7)
      } else {
        put('context', -33, -6, 0.85, { opacity: 0.55 })
        put('automation', -9, -12, 0.7, { opacity: 0.45 })
        put('harness', 11, -1, 2.3, { focus: 1 })
        put('core', 31, -8, 0.85, { fluid: 1 })
        put('intake', -27, -1, 1.8, { focus: 1 })
        path('path.skills', 0.5)
        path('path.environment', 0.7)
        path('path.local', 0.5)
        path('path.facts', 0.65)
        owner = 'intake'
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
      focus(step === 0 ? ['context', 'wall'] : ['gate', 'review'])
      put('core', 34, -11, 0.65, { fluid: 1, opacity: 0.35 })
      if (step === 0) {
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
      focus(step === 0 ? ['harness', 'context'] : ['automation', 'harness', 'forge'])
      put('core', 35, -12, 0.55, { fluid: 1, opacity: 0.4 })
      if (step === 0) {
        put('harness', 0, -1, 2.9, { focus: 1 })
        put('context', -29, -2, 1.45, { focus: 1 })
        owner = 'harness'
      } else {
        put('automation', -30, -2, 1.9, { focus: 1 })
        put('harness', -2, -1, 2.5, { focus: 1 })
        put('forge', 27, -2, 2.5, { focus: 1 })
        path('path.environment', 0.8)
        path('path.runtime', 0.85)
        path('path.local', 0.45)
        owner = 'harness'
      }
      break
    case 'workflow':
      if (step === 1 || step === 2 || step === 3) {
        pipeline(step === 2 ? 'refine' : 'core')
        if (step === 2) {
          put('split', -38, -12, 0.9, { focus: 1 })
          path('path.split', 0.8)
          path('path.author', 0.6)
        }
      } else {
        field()
        if (step === 0) {
          focus(['automation', 'intake', 'refine'])
          put('automation', -38, 2, 0.9, { focus: 1 })
          put('intake', -20, -1, 2.1, { focus: 1 })
          put('refine', 17, -2, 3.9, { focus: 1, fluid: 1 })
          put('triage', -34, -13, 0.65, { opacity: 0.5 })
          path('path.refine', 0.85)
          owner = 'intake'
        } else {
          focus(['wall', 'gate', 'review'])
          put('wall', -27, -2, 1.75, { focus: 1 })
          put('gate', 3, -2, 2.2, { focus: 1 })
          put('review', 31, -3, 1.4, { focus: 1 })
          put('core', -38, -8, 0.7, { fluid: 1, opacity: 0.6 })
          path('path.gate', 0.85)
          path('path.review', 0.7)
          path('path.fix', 0.8)
          path('path.apply', 0.75)
          owner = 'gate'
        }
      }
      break
    case 'feedback':
      field()
      put('audit', -34, -14, 0.9)
      focus(step === 0 ? ['measure', 'missing', 'review'] : ['measure', 'audit', 'refine'])
      if (step === 0) {
        put('measure', -8, -1, 2.3, { focus: 1 })
        put('missing', 16, -3, 2.0, { opacity: 0.6, focus: 1 })
        put('review', 36, -3, 1.4, { focus: 1 })
        owner = 'measure'
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
      break
    case 'system': {
      const quiet = (id: LiveId, x: number, y: number, scale: number, opacity: number) => put(id, x, y, scale, { opacity })
      put('triage', -38, 3, 1.35, { focus: 1 })
      put('core', -19, 3, 1.2, { fluid: 1, cut: 4, focus: 1 })
      put('wall', 1, 3, 1.25, { focus: 1 })
      put('gate', 20, 3, 1.25, { focus: 1 })
      put('deployment', 37.5, 3, 1.3, { focus: 1 })
      quiet('context', 0, -13, 0.75, 0.5)
      quiet('harness', 12, -13, 0.7, 0.5)
      quiet('automation', 24, -13, 0.75, 0.5)
      quiet('measure', 36, -13, 0.75, 0.5)
      for (let i = 0; i < 5; i++) put(`level.${i}` as LiveId, -42 + i * 6, -12, 0.32, { opacity: 0.3 })
      quiet('intake', -46, 3, 0.5, 0.22)
      quiet('split', -28, -8, 0.45, 0.22)
      quiet('refine', -9, -8, 0.45, 0.22)
      quiet('outputs', 10.5, -8, 0.45, 0.22)
      quiet('review', 29, -8, 0.4, 0.22)
      path('path.accept', 0.8, 1)
      path('path.check', 0.8, 1)
      path('path.gate', 0.8, 1)
      path('path.deploy', 0.8, 1)
      path('path.observe', 0.5)
      owner = 'deployment'
      break
    }
  }
  if (state.refine.fluid > 0) state.core.fluid = 0
  state[owner].work = 1
  state.packet.opacity = 0
  return state
}

export function workOwner(state: PictureState): WorkId {
  return LIVE_IDS.find((id) => state[id].work > 0.5) as WorkId ?? 'core'
}
