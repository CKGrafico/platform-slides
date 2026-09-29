/**
 * The cast: every element that lives for the whole talk (docs/art/elements.md).
 * Parts move them in their choreography files, never here. Where things stand
 * is in layout.ts. What is hidden at the start is in rest.ts.
 */
import { artOf, createBall, createCapsule, createColumn, createCore, createDisc, createMoon, createPlate, createRing, createSwarm, createWall } from '@/art/elements'
import { circleXZ, createFrame, createGrid, createSketchLine, createSlot, straight, through } from '@/art/lines'
import { createOrbitLine } from '@/art/orbits'
import { palette } from '@/art/palette'
import { TorusGeometry } from 'three'
import { defineActor, type ActorDef } from '@/world/actors'
import {
  APPROVER_POS,
  APPS,
  CAPSULE_POS,
  CLEAN_ORBIT,
  CLOUD_PATHS,
  COMMANDS_FROM,
  COMPILER_POS,
  DISC_RADIUS,
  FORGE_POS,
  GATE_POS,
  GROUND_Y,
  HARNESS_RADIUS,
  IMPROVISE_PATHS,
  LANES,
  LAPTOP_POS,
  LEVEL_RADII,
  LINE_BENT,
  LINE_X,
  LINE_Y,
  LINE_Z,
  MESSY_POS,
  MODELS,
  OPENCODE,
  PHASE_RADII,
  PILE,
  PILE_R,
  ROUTER_POS,
  RUN_PATHS,
  RUNNER_POS,
  SMALL_ORBITS,
  TEAM,
  TIMELINE_PATH,
  TIMELINE_POINTS,
  TIMELINE_RADIUS,
  TIMELINE_SPLIT,
  TIDY_POS,
  TIMELINE_U,
  TOKENS_POS,
  TRIAGE_ORBIT,
  TRIAGE_POS,
  VENDOR_POS,
  VERBS,
  WALL_ANGLES,
  WALL_RADIUS,
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
        const m = createMoon({ radius: 0.09, color: palette.peach, outline: { width: 2 } })
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

const EVENT_COLORS = [palette.peach, palette.lilac, palette.butter, palette.sage, palette.peach, palette.lilac]

// GitHub Actions: the big banded planet everyone knows.
const ga = defineActor({ id: 'ga', create: () => createMoon({ radius: 0.42, color: palette.sage, pattern: 'bands', ring: palette.butter, outline: { width: 3 } }).object })
const events = EVENTS.map((name, i) => defineActor({ id: `evt.${name}`, create: () => createBall({ radius: 0.11, color: EVENT_COLORS[i] }).object }))
const STEP_LOOKS = [
  { color: palette.butter, pattern: 'bands' },
  { color: palette.lilac, pattern: 'plain' },
  { color: palette.peach, pattern: 'spots' },
  { color: palette.sage, pattern: 'plain' },
  { color: palette.butter, pattern: 'plain' },
  { color: palette.lilac, pattern: 'bands' },
] as const
const steps = STEPS.map((name, i) => defineActor({ id: `step.${name}`, create: () => createMoon({ radius: 0.17, ...STEP_LOOKS[i]! }).object }))

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

const md = defineActor({ id: 'md', create: () => createMoon({ radius: 0.26, color: palette.butter, pattern: 'bands', outline: { width: 3 } }).object })
const compiler = defineActor({
  id: 'compiler',
  create: () => {
    const el = createRing({ radius: 0.62, tube: 0.07, color: palette.lilac, facing: 'x' })
    el.object.position.set(...COMPILER_POS)
    return el.object
  },
})
const shell = SHELL.map((name) =>
  defineActor({ id: `shell.${name}`, create: () => createMoon({ radius: 0.1, color: name === 'ours' ? palette.peach : palette.surface, outline: { width: 2 } }).object }),
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

// ---- part 6: the problems ---------------------------------------------------------------------

const runPaths = RUN_PATHS.map((points, i) =>
  defineActor({
    id: `p6.path.${i}`,
    // Wobbly: the same prompt never takes the same path twice.
    create: () => createSketchLine({ path: through(points), segments: 90, wobble: 0.07, width: 2.2, opacity: 0.85, reveal: 0 }).object,
  }),
)
const pile = PILE.map((_, i) =>
  defineActor({ id: `p6.ball.${i}`, create: () => createBall({ radius: PILE_R, color: [palette.peach, palette.lilac, palette.butter, palette.sage][i % 4] }).object }),
)
const tokens = defineActor({
  id: 'tokens',
  create: () => {
    const el = createColumn({ radius: 0.15, color: palette.lilac })
    el.object.position.set(...TOKENS_POS)
    el.object.scale.y = 0.001
    return el.object
  },
})
const reviewer = defineActor({
  id: 'person.exit',
  create: () => {
    const el = createCapsule({ height: 0.62 })
    el.object.position.set(...CAPSULE_POS)
    return el.object
  },
})

// ---- part 7: the change of mind --------------------------------------------------------------

const team = TEAM.map((_, i) =>
  defineActor({ id: `person.team.${i}`, create: () => createCapsule({ height: 0.62, color: [palette.lilac, palette.sage, palette.peach][i] }).object }),
)
/** More than ten apps: small planets, each with a ring. Two swarms, four draw calls. */
const APP_COLORS = [palette.sage, palette.peach, palette.lilac, palette.butter]
const apps = defineActor({
  id: 'apps',
  create: () => {
    const sw = createSwarm({ count: APPS.length, radius: 0.2, bands: true })
    APPS.forEach((_, i) => sw.paint(i, APP_COLORS[i % APP_COLORS.length]!))
    return sw.object
  },
})
const appRings = defineActor({
  id: 'apps.rings',
  create: () => {
    const g = new TorusGeometry(0.34, 0.02, 8, 48)
    g.rotateX(Math.PI / 2)
    const sw = createSwarm({ count: APPS.length, geometry: g })
    APPS.forEach((_, i) => sw.paint(i, APP_COLORS[(i + 2) % APP_COLORS.length]!))
    return sw.object
  },
})

// ---- part 8: our runtime -----------------------------------------------------------------------

const opencode = defineActor({
  id: 'opencode',
  create: () => {
    const el = createRing({ radius: OPENCODE.radius, tube: OPENCODE.tube, color: palette.butter, facing: 'y' })
    el.object.rotation.set(OPENCODE.tilt, 0, -0.18)
    return el.object
  },
})
const forge = defineActor({
  id: 'forge',
  create: () => {
    const el = createRing({ radius: 0.62, tube: 0.075, color: palette.lilac, facing: 'y' })
    el.object.position.set(...FORGE_POS)
    return el.object
  },
})
const models = MODELS.map((p, i) =>
  defineActor({
    id: `model.${i}`,
    create: () => {
      const el = createCore({ radius: 0.3, segments: 32, outline: { width: 2.5 } })
      el.object.position.set(...p)
      return el.object
    },
  }),
)
/** Before Forge: a straight call from the agent to a vendor. */
const direct = defineActor({
  id: 'p8.direct',
  create: () => createSketchLine({ path: straight([0.7, -0.35, 0.1], VENDOR_POS), segments: 40, width: 2.5, dashed: true, reveal: 0 }).object,
})
/** After Forge: every call goes through it to one of the models. */
const forgeLines = MODELS.map((p, i) =>
  defineActor({
    id: `p8.model.${i}`,
    create: () => createSketchLine({ path: straight(FORGE_POS, p), segments: 30, width: 2, opacity: 0.8, reveal: 0 }).object,
  }),
)
const runner = defineActor({
  id: 'runner',
  create: () => {
    const el = createPlate({ radius: 1.55, color: palette.lilac })
    el.object.position.set(...RUNNER_POS)
    return el.object
  },
})

// ---- part 9: Agent Harness ----------------------------------------------------------------------

const harness = defineActor({ id: 'harness', create: () => createFrame({ radius: HARNESS_RADIUS, width: 2.2, opacity: 0 }).object })
const improvise = IMPROVISE_PATHS.map((points, i) =>
  defineActor({
    id: `p9.path.${i}`,
    create: () => createSketchLine({ path: through(points), segments: 70, wobble: 0.09, width: 2.2, opacity: 0.85, reveal: 0 }).object,
  }),
)
const cloud = CLOUD_PATHS.map((points, i) =>
  defineActor({
    id: `p9.cloud.${i}`,
    create: () => createSketchLine({ path: through(points), segments: 70, wobble: 0.12, width: 2, opacity: 0.7, reveal: 0 }).object,
  }),
)
const cleanOrbit = defineActor({
  id: 'p9.orbit',
  create: () => {
    const o = createOrbitLine({ spec: CLEAN_ORBIT, wobble: 0.015, width: 2.5, opacity: 0.9 })
    o.reveal.value = 0
    return o.object
  },
})
const COMMAND_COLORS = [palette.peach, palette.butter, palette.lilac]
const commands = COMMANDS_FROM.map((_, i) =>
  defineActor({ id: `cmd.${i}`, create: () => createBall({ radius: 0.12, color: COMMAND_COLORS[i] }).object }),
)
const laptop = defineActor({
  id: 'laptop',
  create: () => {
    const el = createPlate({ radius: 0.85, color: palette.sage })
    el.object.position.set(...LAPTOP_POS)
    return el.object
  },
})
const laptopCore = defineActor({
  id: 'core.laptop',
  create: () => {
    const el = createCore({ radius: 0.3, segments: 32, outline: { width: 2.5 } })
    el.object.position.set(LAPTOP_POS[0], LAPTOP_POS[1] + 0.55, LAPTOP_POS[2])
    return el.object
  },
})
const laptopHarness = defineActor({
  id: 'harness.laptop',
  create: () => {
    const f = createFrame({ radius: 0.48, width: 1.8, opacity: 0 })
    f.object.position.set(LAPTOP_POS[0], LAPTOP_POS[1] + 0.55, LAPTOP_POS[2])
    return f.object
  },
})

// ---- part 10: Agentic Workflows ----------------------------------------------------------------

const laneTriage = defineActor({
  id: 'lane.triage',
  create: () => {
    const o = createOrbitLine({ spec: { radius: LANES.triage.radius }, wobble: LANES.triage.wobble, width: 2.5, opacity: 0.85 })
    o.reveal.value = 0
    return o.object
  },
})
const laneRefine = defineActor({
  id: 'lane.refine',
  create: () => {
    const o = createOrbitLine({ spec: { radius: LANES.refine.radius }, wobble: LANES.refine.wobble, width: 2.5, opacity: 0.85 })
    o.reveal.value = 0
    return o.object
  },
})
const router = defineActor({
  id: 'router',
  create: () => {
    const el = createRing({ radius: 0.62, tube: 0.085, color: palette.peach, facing: 'x' })
    el.object.position.set(...ROUTER_POS)
    return el.object
  },
})
const gate = defineActor({
  id: 'gate',
  create: () => {
    const el = createRing({ radius: 0.62, tube: 0.085, color: palette.sage, facing: 'x' })
    el.object.position.set(...GATE_POS)
    return el.object
  },
})
const approver = defineActor({
  id: 'person.approver',
  create: () => {
    const el = createCapsule({ height: 0.55, color: palette.lilac })
    el.object.position.set(...APPROVER_POS)
    return el.object
  },
})
/** Work items in the pipeline, and the copies of 10.4 that wake every workflow. */
const flow = defineActor({ id: 'flow', create: () => createSwarm({ count: 12, radius: 0.11, color: palette.butter }).object })
const audit = defineActor({ id: 'audit', create: () => createMoon({ radius: 0.2, color: palette.peach, pattern: 'bands', ring: palette.lilac }).object })
const housekeeping = defineActor({ id: 'housekeeping', create: () => createMoon({ radius: 0.17, color: palette.sage, pattern: 'spots' }).object })

// ---- part 11: Foundations -----------------------------------------------------------------------

/** 11.1: a tidy system (clean orbits) and a messy one (wobbly orbits), each with its own small core. */
const smallSystems = (['tidy', 'messy'] as const).flatMap((kind) => {
  const at = kind === 'tidy' ? TIDY_POS : MESSY_POS
  return [
    defineActor({
      id: `${kind}.core`,
      create: () => {
        const el = createCore({ radius: 0.34, segments: 32, outline: { width: 2.5 } })
        el.object.position.set(...at)
        return el.object
      },
    }),
    ...SMALL_ORBITS.map((radius, i) =>
      defineActor({
        id: `${kind}.orbit.${i}`,
        create: () => {
          const o = createOrbitLine({ spec: { radius, tilt: 0.35 }, wobble: kind === 'tidy' ? 0.01 : 0.16, width: 2.2, opacity: 0.85 })
          o.reveal.value = 0
          o.object.position.set(...at)
          return o.object
        },
      }),
    ),
  ]
})
/** The moons of both small systems, and the work that arrives faster and faster. */
const smallMoons = defineActor({
  id: 'p11.moons',
  create: () => {
    const sw = createSwarm({ count: 6, radius: 0.12 })
    const colors = [palette.sage, palette.peach, palette.butter]
    for (let i = 0; i < 6; i++) sw.paint(i, colors[i % 3]!)
    return sw.object
  },
})
const smallWork = defineActor({ id: 'p11.work', create: () => createSwarm({ count: 10, radius: 0.08, color: palette.lilac }).object })

const phases = PHASE_RADII.map((radius, i) =>
  defineActor({
    id: `phase.${i}`,
    create: () => createSketchLine({ path: circleXZ([0, GROUND_Y + 0.03, 0], radius), segments: 140, width: 2.5, dashed: i === 2, reveal: 0 }).object,
  }),
)
const disc = defineActor({
  id: 'disc',
  create: () => {
    const el = createDisc({ radius: DISC_RADIUS, color: palette.surface })
    el.object.position.set(0, GROUND_Y, 0)
    return el.object
  },
})
const grid = defineActor({
  id: 'disc.grid',
  create: () => {
    const g = createGrid({ radius: DISC_RADIUS * 0.97, opacity: 0 })
    g.object.position.set(0, GROUND_Y + 0.02, 0)
    return g.object
  },
})
const walls = WALL_ANGLES.map((a, i) =>
  defineActor({
    id: `wall.${i}`,
    create: () => {
      const el = createWall({ length: 1.35, height: 0.42, color: [palette.sage, palette.lilac, palette.butter, palette.peach, palette.sage][i] })
      el.object.position.set(Math.cos(a) * WALL_RADIUS, GROUND_Y, Math.sin(a) * WALL_RADIUS)
      // Tangent to the circle, so the walls ring the lanes.
      el.object.rotation.y = -a + Math.PI / 2
      return el.object
    },
  }),
)
const verbs = VERBS.map((v) =>
  defineActor({
    id: `verb.${v.id}`,
    create: () => {
      if (v.hollow) {
        const s = createSlot({ radius: 0.12, width: 2.2 })
        s.reveal.value = 0
        s.object.position.set(...v.at)
        return s.object
      }
      const el = createMoon({ radius: 0.12, color: palette.butter })
      el.object.position.set(...v.at)
      return el.object
    },
  }),
)
/** 11.6: a shortcut from discovery straight to maintenance mode, in two halves that break apart. */
const shortcut = [0, 1].map((half) =>
  defineActor({
    id: `shortcut.${half}`,
    create: () => {
      const a = [PHASE_RADII[0]! * 0.7, GROUND_Y + 0.05, PHASE_RADII[0]! * 0.7] as const
      const m = [((PHASE_RADII[0]! + PHASE_RADII[2]!) / 2) * 0.7, GROUND_Y + 0.05, ((PHASE_RADII[0]! + PHASE_RADII[2]!) / 2) * 0.7] as const
      const c = [PHASE_RADII[2]! * 0.7, GROUND_Y + 0.05, PHASE_RADII[2]! * 0.7] as const
      return createSketchLine({ path: half === 0 ? straight(a, m) : straight(m, c), segments: 30, width: 3.5, color: palette.outline, reveal: 0 }).object
    },
  }),
)

// ---- the orbits of the ladder -------------------------------------------------------------

const outerOrbit = defineActor({
  id: 'orbit.outer',
  create: () => createOrbitLine({ spec: OUTER, width: 3, opacity: 0 }).object,
})

const innerOrbit = defineActor({
  id: 'orbit.inner',
  create: () => createOrbitLine({ spec: INNER, wobble: 0.16, width: 3, opacity: 0 }).object,
})

/** The task moons start white in the core's surface; part 10 paints them as they land. */
const TASK_PATTERNS = ['bands', 'plain', 'spots', 'bands'] as const
const tasks = TASKS.map((name, i) =>
  defineActor({
    id: `task.${name}`,
    create: () => createMoon({ radius: 0.2, pattern: TASK_PATTERNS[i] }).object,
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
  ...runPaths,
  ...pile,
  tokens,
  reviewer,
  ...team,
  apps,
  appRings,
  opencode,
  forge,
  ...models,
  direct,
  ...forgeLines,
  runner,
  harness,
  ...improvise,
  ...cloud,
  cleanOrbit,
  ...commands,
  laptop,
  laptopCore,
  laptopHarness,
  laneTriage,
  laneRefine,
  router,
  gate,
  approver,
  flow,
  audit,
  housekeeping,
  ...smallSystems,
  smallMoons,
  smallWork,
  ...phases,
  disc,
  grid,
  ...walls,
  ...verbs,
  ...shortcut,
  outerOrbit,
  innerOrbit,
  ...tasks,
]
