/**
 * The world map: where things stand in the one persistent world. Parts read
 * these numbers so that an element placed in one part is where the next part
 * expects it. The model (the core) sits at the origin for most of the talk.
 */
import { Vector3 } from 'three'
import { through } from '@/art/lines'

// ---- part 3: the timeline -------------------------------------------------------------

/**
 * The timeline arc: it starts low on the left, passes in front of the core,
 * and rises on the right. Each step is closer to the last, the way the steps
 * came faster in real life.
 */
export const TIMELINE_PATH = through([
  [-7.0, -1.1, 0.6],
  [-4.6, -2.25, 1.4],
  [-1.6, -2.7, 1.8],
  [1.4, -2.35, 1.8],
  [3.9, -1.25, 1.4],
  [5.5, 0.35, 0.9],
  [6.2, 2.0, 0.4],
])

const GAP_RATIO = 0.9
const gaps = Array.from({ length: 9 }, (_, i) => Math.pow(GAP_RATIO, i))
const gapSum = gaps.reduce((a, b) => a + b, 0)

/** Path position (0..1) of each of the ten steps. */
export const TIMELINE_U: number[] = [0.03]
for (const g of gaps) TIMELINE_U.push(TIMELINE_U[TIMELINE_U.length - 1]! + (g / gapSum) * 0.94)

/** World position of each step. */
export const TIMELINE_POINTS = TIMELINE_U.map((u) => TIMELINE_PATH(u, new Vector3()))

/** In part 3 the core steps back, so the timeline is the subject. */
export const CORE_BEHIND = { x: -0.4, y: 0.9, z: -5, scale: 0.8 }

/** Radius of the sphere of each step (steps 1 to 9). Single objects grow in the first half. */
export const TIMELINE_RADIUS = [0.2, 0.23, 0.26, 0.29, 0.32, 0.27, 0.27, 0.27, 0.27]

/** Where the first half ends: steps 0 to 4 are single objects, 5 to 8 a system around one, 9 is "?". */
export const TIMELINE_SPLIT = 5

// ---- part 4: the maturity levels ------------------------------------------------------------

/** Five rings around the core, level 1 the smallest. */
export const LEVEL_RADII = [1.45, 2.05, 2.65, 3.25, 3.9]
/** Labels sit along one ray, so they never overlap. */
export const LEVEL_LABEL_ANGLE = 0.3 * Math.PI
/** The four empty slots on the level 5 ring. */
export const SLOT_ANGLES = [0.62, 0.86, 1.1, 1.34].map((f) => f * Math.PI)

// ---- the core through the talk ---------------------------------------------------------

/** Scale of the core when part 10 starts (what part 9 leaves). Part 10 grows it from here. */
export const CORE_SCALE_BEFORE_P10 = 0.8

// ---- part 5: from GitHub Actions to Agentic Workflows -------------------------------------

type V3 = readonly [number, number, number]

/** GitHub Actions, alone in the void (5.1). */
export const GA_POS: V3 = [-3.8, -0.7, 0.4]
/** The straight line of moons it unfolds into (5.2). Index 0 is the head, where GitHub Actions ends up. */
export const LINE_Y = -0.7
export const LINE_Z = 0.4
export const LINE_X = [-7.2, -6.3, -5.4, -4.5, -3.6, -2.7, -1.8]
/** Near the core the line curves onto the core's orbit (5.3). The last two moons move here. */
export const LINE_BENT: V3[] = [
  [-2.62, -0.42, 0.42],
  [-1.5, -0.08, 0.5],
]
/** The file leaves the orbit here (5.4), passes the compiler ring (5.5), and comes out as the lock file. */
export const MD_OUT: V3 = [2.5, 0.3, 0.5]
export const COMPILER_POS: V3 = [3.6, 0.3, 0.5]
export const LOCK_POS: V3 = [4.9, 0.3, 0.5]
/** Where the compiled workflow docks, above the implementation core (5.7, and the vertical axis of part 8). */
export const LOCK_DOCK: V3 = [0, 2.3, 0]
/** The shell of small moons around the lock file: six from the compiler, then "our changes". */
export const SHELL_RADIUS = 0.56
export const SHELL_DIRS: V3[] = [
  [0, 1, 0.15],
  [0.87, 0.5, 0.2],
  [0.87, -0.5, 0.2],
  [0, -1, 0.15],
  [-0.87, -0.5, 0.2],
  [-0.87, 0.5, 0.2],
  [0.35, 0.2, 0.92],
]
/** The triage cluster: a second small core with its own orbit (5.7). */
export const TRIAGE_POS: V3 = [4.4, 1.2, -1.2]
export const TRIAGE_ORBIT = { radius: 0.95, tilt: 0.3 }
/** Core scale while it is the implementation core (5.3 to part 9). */
export const CORE_SCALE_AGENT = 0.8

// ---- part 6: the problems -------------------------------------------------------------------

/** Where work leaves the implementation core, on its surface, toward the exit. */
export const EXIT_FROM: V3 = [0.62, -0.1, 0.48]
/** The person at the exit (6.3), and the pile of work in front of them. */
export const CAPSULE_POS: V3 = [3.2, -1.25, 1.5]
export const PILE_R = 0.11
/** Pile places, bottom row first. The first three are the balls of 6.1. */
export const PILE: V3[] = [
  [2.62, -1.14, 1.72],
  [2.62, -1.14, 1.48],
  [2.62, -1.14, 1.24],
  [2.4, -1.14, 1.6],
  [2.4, -1.14, 1.36],
  [2.62, -0.94, 1.6],
  [2.62, -0.94, 1.36],
  [2.5, -0.75, 1.48],
]
/** Three runs of the same prompt: three paths of different shapes and lengths (6.1). */
export const RUN_PATHS: V3[][] = [
  [EXIT_FROM, [1.3, 0.25, 0.9], [2.05, -0.45, 1.35], PILE[0]!],
  [EXIT_FROM, [1.05, 0.95, 0.9], [1.95, 1.2, 1.0], [2.9, 0.45, 1.3], [2.55, -0.45, 1.6], PILE[1]!],
  [EXIT_FROM, [0.95, -0.85, 1.1], [1.7, -1.5, 1.7], [2.35, -1.3, 1.9], PILE[2]!],
]
/** The token column next to the core (6.2). Base on the ground line. */
export const TOKENS_POS: V3 = [-1.5, -1.25, 0.7]
export const TOKENS_HEIGHT = 1.9

/**
 * Where the four task moons sit in the core's surface, from 6.2 until part 10
 * pulls them out: near the edge of the silhouette, one per quarter.
 */
export const TASK_DIRS: V3[] = [
  [-0.86, 0.42, 0.3],
  [0.88, 0.3, 0.34],
  [-0.8, -0.46, 0.36],
  [0.84, -0.42, 0.32],
]
/** Radius of the core at scale 1. */
export const CORE_R = 0.95
/** Share of the core radius where a task sits: just under the surface, half showing. */
export const TASK_DEPTH = 0.97

// ---- part 7: the change of mind ---------------------------------------------------------

/** 7.2 happens in the empty space above the system. */
export const TEAM_Y = 8.3
/** Three people on one side. */
export const TEAM: V3[] = [
  [-3.5, TEAM_Y - 0.55, 0.3],
  [-2.85, TEAM_Y - 0.55, -0.15],
  [-2.2, TEAM_Y - 0.55, 0.3],
]
/** More than ten small systems (the apps) on the other side. */
export const APPS: V3[] = Array.from({ length: 11 }, (_, i) => {
  const row = i < 6 ? 0 : 1
  const col = row === 0 ? i : i - 6
  return [0.1 + col * 1.0 + row * 0.5, TEAM_Y + (row === 0 ? 0.55 : -0.55), (col % 2) * 0.4 - 0.2] as const
})
