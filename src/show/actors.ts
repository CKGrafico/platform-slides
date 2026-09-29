/**
 * The cast: every element that lives for the whole talk (docs/art/elements.md).
 * Parts move them in their choreography files, never here. Where things stand
 * is in layout.ts. What is hidden at the start is in rest.ts.
 */
import { artOf, createBall, createCore, createMoon, createRing } from '@/art/elements'
import { createFrame, createSketchLine, createSlot, straight, through } from '@/art/lines'
import { createOrbitLine } from '@/art/orbits'
import { palette } from '@/art/palette'
import { defineActor, type ActorDef } from '@/world/actors'
import {
  COMPILER_POS,
  LEVEL_RADII,
  LINE_BENT,
  LINE_X,
  LINE_Y,
  LINE_Z,
  TIMELINE_PATH,
  TIMELINE_POINTS,
  TIMELINE_RADIUS,
  TIMELINE_SPLIT,
  TIMELINE_U,
  TRIAGE_ORBIT,
  TRIAGE_POS,
} from './layout'

/** The four tasks that leave the agent in part 10, in the order they leave. */
export const TASKS = ['labels', 'assign', 'comment', 'status'] as const

/** Outer orbit: clean, deterministic. Inner orbit: close to the core, it wobbles. */
export const OUTER = { radius: 3.6 }
export const INNER = { radius: 1.55 }
export const COVER_ORBIT = { radius: 1.45, tilt: 0.28 }

/**
 * The radius of the blue ball's orbit on the cover. A plain value that part 3
 * tweens to 0, so the ball spirals into the core when the talk starts.
 */
export const issueOrbit = { radius: COVER_ORBIT.radius }

// ---- the model and the issue --------------------------------------------------------

const core = defineActor({
  id: 'core',
  // Its surface deforms by itself (createCore), so it needs no ambient hook.
  create: () => createCore({ radius: 0.95, segments: 80 }).object,
})

const issue = defineActor({
  id: 'issue',
  create: () => createBall({ radius: 0.14, color: palette.accent }).object,
  // The one pre-show exception to "only the core moves by time": on the cover
  // the blue ball circles the core while the room fills. Part 3 closes the
  // orbit (issueOrbit.radius to 0), and from then on only choreographies place it.
  ambient: (o, time) => {
    const r = issueOrbit.radius
    const a = time * 0.55
    artOf(o).inner.position.set(Math.cos(a) * r, -Math.sin(a) * r * Math.sin(COVER_ORBIT.tilt), Math.sin(a) * r * Math.cos(COVER_ORBIT.tilt))
  },
})

const coverOrbit = defineActor({
  id: 'orbit.cover',
  create: () => createOrbitLine({ spec: COVER_ORBIT, width: 3, opacity: 0.85 }).object,
})

// ---- part 3: the timeline -----------------------------------------------------------

/** Ids of the ten steps of the timeline, in order. The last one is the "?" slot. */
export const TIMELINE_IDS = TIMELINE_POINTS.map((_, i) => (i < 9 ? `tl.step.${i}` : 'tl.slot'))

const at = (i: number) => TIMELINE_POINTS[i]!

// Every step stands still at its place on the arc. Parts only show, hide, and scale them.
const timelineSteps = TIMELINE_RADIUS.map((radius, i) =>
  defineActor({
    id: `tl.step.${i}`,
    create: () => {
      const el = createBall({ radius, color: palette.surface, outline: { width: 3 } })
      el.object.position.copy(at(i))
      return el.object
    },
  }),
)

// Guardrails: a ring around the model.
const tlRing = defineActor({
  id: 'tl.ring',
  create: () => {
    const el = createRing({ radius: 0.5, tube: 0.04, color: palette.sage })
    el.object.position.copy(at(TIMELINE_SPLIT))
    el.object.rotation.set(0.35, 0, 0.25)
    return el.object
  },
})

// Harnesses: a frame around the model.
const tlFrame = defineActor({
  id: 'tl.frame',
  create: () => {
    const f = createFrame({ radius: 0.48, width: 2, opacity: 0 })
    f.object.position.copy(at(TIMELINE_SPLIT + 1))
    return f.object
  },
})

// Loop engineering: one loop. Autonomous loops: two loops that work together.
const LOOPS = [
  { id: 'a', step: TIMELINE_SPLIT + 2, radius: 0.5, tilt: 0.45, speed: 0.6 },
  { id: 'b', step: TIMELINE_SPLIT + 3, radius: 0.46, tilt: 0.5, speed: 0.7 },
  { id: 'c', step: TIMELINE_SPLIT + 3, radius: 0.64, tilt: -0.35, speed: -0.45 },
]
const tlLoops = LOOPS.flatMap((l) => {
  const spec = { radius: l.radius, tilt: l.tilt }
  return [
    defineActor({
      id: `tl.orbit.${l.id}`,
      create: () => {
        const o = createOrbitLine({ spec, width: 2.5, opacity: 0 })
        o.object.position.copy(at(l.step))
        return o.object
      },
    }),
    defineActor({
      id: `tl.moon.${l.id}`,
      create: () => {
        const m = createMoon({ radius: 0.085, color: palette.lilac, outline: { width: 2 } })
        m.object.position.copy(at(l.step))
        return m.object
      },
      // Ambient: the moon goes round its loop. The choreography only places the
      // loop's center (object.position) and shows it.
      ambient: (o, time) => {
        const a = time * l.speed + l.radius * 7
        artOf(o).inner.position.set(Math.cos(a) * l.radius, -Math.sin(a) * l.radius * Math.sin(l.tilt), Math.sin(a) * l.radius * Math.cos(l.tilt))
      },
    }),
  ]
})

const tlSlot = defineActor({
  id: 'tl.slot',
  create: () => {
    const s = createSlot({ radius: 0.34, width: 3 })
    s.reveal.value = 0
    s.object.position.copy(at(9))
    return s.object
  },
})

// The arc, in two halves, so the first half can dim while the second lights up.
const splitU = (TIMELINE_U[TIMELINE_SPLIT - 1]! + TIMELINE_U[TIMELINE_SPLIT]!) / 2
const tlArcA = defineActor({
  id: 'tl.arc.a',
  create: () => createSketchLine({ path: (u, out) => TIMELINE_PATH(u * splitU, out), segments: 90, width: 2.5, opacity: 0.9, reveal: 0 }).object,
})
const tlArcB = defineActor({
  id: 'tl.arc.b',
  create: () =>
    createSketchLine({ path: (u, out) => TIMELINE_PATH(splitU + u * (1 - splitU), out), segments: 90, width: 2.5, opacity: 0.9, reveal: 0 }).object,
})

// ---- part 4: the maturity levels ------------------------------------------------------

const levelRings = LEVEL_RADII.map((radius, i) =>
  defineActor({
    id: `level.${i + 1}`,
    create: () => {
      const o = createOrbitLine({ spec: { radius }, width: i === 4 ? 3.5 : 2.5, opacity: 0.9 })
      o.reveal.value = 0
      return o.object
    },
  }),
)
const levelSlots = [1, 2, 3, 4].map((n) =>
  defineActor({
    id: `level.slot.${n}`,
    create: () => {
      const s = createSlot({ radius: 0.34, width: 3 })
      s.reveal.value = 0
      return s.object
    },
  }),
)

// ---- part 5: from GitHub Actions to Agentic Workflows --------------------------------------

/** The six events that fall into GitHub Actions (5.1). */
export const EVENTS = ['issue', 'pr', 'push', 'label', 'merge', 'release'] as const
/** The six kinds of step it unfolds into (5.2). */
export const STEPS = ['marketplace', 'ours', 'scripts', 'clis', 'code', 'apis'] as const
/** The shell the compiler builds around the agent (5.5), then our own step (5.6). */
export const SHELL = ['permissions', 'firewall', 'outputs', 'threat', 'telemetry', 'runtime', 'ours'] as const

const EVENT_COLORS = [palette.sage, palette.lilac, palette.surface, palette.sage, palette.lilac, palette.surface]

const ga = defineActor({ id: 'ga', create: () => createMoon({ radius: 0.42, outline: { width: 3 } }).object })
const events = EVENTS.map((name, i) => defineActor({ id: `evt.${name}`, create: () => createBall({ radius: 0.11, color: EVENT_COLORS[i] }).object }))
const steps = STEPS.map((name) => defineActor({ id: `step.${name}`, create: () => createMoon({ radius: 0.17 }).object }))

const lineStart = [LINE_X[0]!, LINE_Y, LINE_Z] as const
const lineEnd = [LINE_X[LINE_X.length - 1]!, LINE_Y, LINE_Z] as const
const straightLine = defineActor({
  id: 'p5.line',
  create: () => createSketchLine({ path: straight(lineStart, lineEnd), segments: 60, width: 2.5, reveal: 0 }).object,
})
// Near the core the same line bends onto the core's orbit.
const curvedLine = defineActor({
  id: 'p5.curve',
  create: () =>
    createSketchLine({
      path: through([lineStart, [LINE_X[3]!, LINE_Y, LINE_Z], [LINE_X[4]!, LINE_Y + 0.02, LINE_Z], LINE_BENT[0]!, LINE_BENT[1]!, [-1.1, 0.0, 1.05]]),
      segments: 90,
      width: 2.5,
      opacity: 0,
    }).object,
})

const md = defineActor({ id: 'md', create: () => createMoon({ radius: 0.26, color: palette.surface, outline: { width: 3 } }).object })
const compiler = defineActor({
  id: 'compiler',
  create: () => {
    const el = createRing({ radius: 0.62, tube: 0.07, color: palette.lilac, facing: 'x' })
    el.object.position.set(...COMPILER_POS)
    return el.object
  },
})
const shell = SHELL.map((name) =>
  defineActor({ id: `shell.${name}`, create: () => createMoon({ radius: 0.1, color: name === 'ours' ? palette.lilac : palette.surface, outline: { width: 2 } }).object }),
)

const triageCore = defineActor({
  id: 'core.triage',
  create: () => {
    const el = createCore({ radius: 0.5, segments: 40, outline: { width: 3 } })
    el.object.position.set(...TRIAGE_POS)
    return el.object
  },
})
const triageOrbit = defineActor({
  id: 'orbit.triage',
  create: () => {
    const o = createOrbitLine({ spec: TRIAGE_ORBIT, wobble: 0.12, width: 2.5, opacity: 0.85 })
    o.reveal.value = 0
    o.object.position.set(...TRIAGE_POS)
    return o.object
  },
})

// ---- part 10 (style frame) ---------------------------------------------------------------

const outerOrbit = defineActor({
  id: 'orbit.outer',
  create: () => createOrbitLine({ spec: OUTER, width: 3, opacity: 0 }).object,
})

const innerOrbit = defineActor({
  id: 'orbit.inner',
  create: () => createOrbitLine({ spec: INNER, wobble: 0.16, width: 3, opacity: 0 }).object,
})

const tasks = TASKS.map((name, i) =>
  defineActor({
    id: `task.${name}`,
    create: () => createMoon({ radius: 0.2 }).object,
    // A small bounded sway, so a moon never shows one fixed face. Ambient: inner only.
    ambient: (o, time) => {
      const inner = artOf(o).inner
      inner.rotation.y = Math.sin(time * 0.33 + i * 1.7) * 0.3
      inner.rotation.x = Math.sin(time * 0.27 + i * 0.9) * 0.2
    },
  }),
)

export const actors: ActorDef[] = [
  core,
  issue,
  coverOrbit,
  ...timelineSteps,
  tlRing,
  tlFrame,
  ...tlLoops,
  tlSlot,
  tlArcA,
  tlArcB,
  ...levelRings,
  ...levelSlots,
  ga,
  ...events,
  ...steps,
  straightLine,
  curvedLine,
  md,
  compiler,
  ...shell,
  triageCore,
  triageOrbit,
  outerOrbit,
  innerOrbit,
  ...tasks,
]
