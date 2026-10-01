/**
 * The map of the town: where everything stands in the one persistent world
 * (docs/art/town-proposal.md). The hall sits at the origin; x runs east, z
 * runs south, toward the camera. The main road runs west to east along the
 * south of the hall; three ring walls rise around the hall in part 11, with
 * gates where the road crosses them; the woods close the land beyond.
 *
 * The camera never zooms (shots.ts), so a frame shows a diamond of about
 * 25 units around its target: |x - z| < 25.4 and |x + z| < 26.1 from it.
 */
export type V3 = readonly [number, number, number]

// ---- the hall: the agent ---------------------------------------------------------------------

export const HALL: V3 = [0, 0, 0]
/** Big and closed at the start. It steps down each time one of its folk moves out (hall.ts). */
export const HALL_BIG = 1.25
/** The top of the hall's platform (local units): where its folk and its carts stand. */
export const PLATFORM_TOP = 0.14
/** Where things leave the hall: its front door, past the arcade (in the hall's local units). */
export const HALL_DOOR: V3 = [0, 0.5, 1.6]
/** The task carts on the platform, in front of the arcade (local units). */
export const TASK_SPOTS: V3[] = [
  [-1.2, PLATFORM_TOP, 1.5],
  [-0.4, PLATFORM_TOP, 1.5],
  [0.4, PLATFORM_TOP, 1.5],
  [1.2, PLATFORM_TOP, 1.5],
]
/**
 * The folk of the hall at the start, on the platform (local units): four in
 * the bays of the arcade, one by each wing, two at the front corners. The
 * order they leave in is in hall.ts.
 */
export const FOLK_SPOTS: V3[] = [
  [-0.9, PLATFORM_TOP, 0.82],
  [-0.3, PLATFORM_TOP, 0.82],
  [0.3, PLATFORM_TOP, 0.82],
  [0.9, PLATFORM_TOP, 0.82],
  [-2.15, PLATFORM_TOP, 1.45],
  [2.15, PLATFORM_TOP, 0.7],
  [-1.25, PLATFORM_TOP, 1.72],
  [1.25, PLATFORM_TOP, 1.72],
]
/** The compiled workflow docks on the platform's back left corner (local units). */
export const LOCK_DOCK: V3 = [-1.95, PLATFORM_TOP, -1.5]
/** The top of the turret, where the banner of OpenCode stands (local units). */
export const TURRET_TOP: V3 = [-1.25, 2.9, -0.75]
/** The coins burned by the hall, in a pile beside it, outside the platform. */
export const COINS: V3 = [3.35, 0, 0.8]

/** The belt loop around the hall: the automation ring. Clockwise from the south west corner. */
export const LOOP: V3[] = [
  [-4.4, 0, 3.4],
  [-4.4, 0, -3.4],
  [4.4, 0, -3.4],
  [4.4, 0, 3.4],
]
/** Where each task lands on the loop (as a fraction of its length), and how far it rides in stop 2. */
export const LOOP_LANDING = [0.62, 0.72, 0.82, 0.92]
export const LOOP_SWEEP = 0.12

// ---- GitHub Actions: the mill and its line of steps ---------------------------------------------

/** The mill, north east of the loop, its sails toward it. */
export const STATION: V3 = [5.6, 0, -6.4]
export const STATION_TURN = -0.6
/** Where its steps land on the loop (10.3). */
export const STEP_LANDING = [0.3, 0.36, 0.42, 0.48, 0.54, 0.58]
/** The straight belt of steps that leaves the mill westward (5.2). */
export const LINE_Z = -6.4
export const LINE_Y = 0.08
export const LINE_X = [4.4, 3.6, 2.8, 2.0, 1.2, 0.4]
export const LINE_FROM: V3 = [5.0, LINE_Y, LINE_Z]
export const LINE_TO: V3 = [-0.2, LINE_Y, LINE_Z]
/** Near the hall the line bends onto the loop (5.3). The last two steps move here. */
export const LINE_BENT: V3[] = [
  [0.6, LINE_Y, -5.3],
  [-0.2, LINE_Y, -4.2],
]

// ---- roads -----------------------------------------------------------------------------------------

export const MAIN_Z = 5.6
/** The main road, west to east along the south of the town, from the outer gate to the outer gate. */
export const MAIN: V3[] = [
  [-18.5, 0, MAIN_Z],
  [18.5, 0, MAIN_Z],
]
/** The road into the town (part 3): from the far west to the outer gate. */
export const TIMELINE_ROAD: V3[] = [
  [-47.5, 0, MAIN_Z],
  [-18.5, 0, MAIN_Z],
]
/** Along the main belt, as fractions of its length. */
const mainAt = (x: number) => (x - MAIN[0]![0]) / (MAIN[1]![0] - MAIN[0]![0])

// ---- the rings: the walls of part 11 -----------------------------------------------------------

/** Radii of the three ring walls around the hall, and where the road crosses each (a gate). */
export const RINGS = [7.4, 12.4, 19.0]
export const RING_THICKNESS = 0.5
const crossing = (r: number) => Math.sqrt(r * r - MAIN_Z * MAIN_Z)
export const RING_CROSSINGS = RINGS.map(crossing)
/** Angles (radians, +z toward the camera) where each ring has a tower of its own on the wall. */
export const RING_TOWERS: number[][] = [
  [-2.0, 2.7, 1.57],
  [-0.52, -1.57, -2.62, 1.05, 2.09],
  [-0.52, -1.57, -2.62, Math.PI, 1.05, 2.09],
]
/** Each ring is built as arcs, so it can rise around the town. */
export const RING_ARCS = 8
const deg = (d: number) => (d * Math.PI) / 180

// ---- buildings ---------------------------------------------------------------------------------------

export const GATEHOUSE: V3 = [-RING_CROSSINGS[1]!, 0, MAIN_Z]
export const EXIT_GATE: V3 = [RING_CROSSINGS[1]!, 0, MAIN_Z]
export const ARCH_W: V3 = [-RING_CROSSINGS[0]!, 0, MAIN_Z]
export const ARCH_E: V3 = [RING_CROSSINGS[0]!, 0, MAIN_Z]
export const OUTER_W: V3 = [-RING_CROSSINGS[2]!, 0, MAIN_Z]
export const OUTER_E: V3 = [RING_CROSSINGS[2]!, 0, MAIN_Z]
export const TRIAGE_HOUSE: V3 = [-8.6, 0, 3.4]
export const REFINE_HOUSE: V3 = [-6.3, 0, 3.3]
export const REQUESTER: V3 = [-6.6, 0, 7.4]
export const MARKET: V3 = [14.2, 0, 3.6]
/** The person a risky change is sent to: a booth south of the exit gate. */
export const BOOTH: V3 = [5.8, 0, 8.3]
export const WELL: V3 = [-9.6, 0, 1.4]
/** The compiler: a scriptorium north west of the loop. */
export const SCRIPTORIUM: V3 = [-8.0, 0, -4.5]
export const SCRIPTORIUM_DOOR: V3 = [-8.0, 0.3, -3.5]
/** Forge, and the kilns of the models behind it. */
export const FORGE: V3 = [-2.5, 0, -8.2]
export const KILNS: V3[] = [
  [-5.0, 0, -10.0],
  [-2.9, 0, -10.6],
  [-0.8, 0, -10.2],
]
/** Before Forge, the agent called a vendor straight away, far to the east. */
export const VENDOR: V3 = [22, 0.08, -6]
/** The watchtower of the audit: on the first ring, north of the hall. */
export const TOWER_ANGLE = deg(-75)
export const TOWER: V3 = [Math.cos(TOWER_ANGLE) * RINGS[0]!, 0, Math.sin(TOWER_ANGLE) * RINGS[0]!]
/** The barn and the stacks of measures beside it, between the first ring and the exit gate (part 12). */
export const BARN: V3 = [8.8, 0, 0.2]
export const MAIN_AT = { gate: mainAt(GATEHOUSE[0]), triage: mainAt(TRIAGE_HOUSE[0]), refine: mainAt(REFINE_HOUSE[0]), hall: 0.5, exit: mainAt(EXIT_GATE[0]), market: mainAt(MARKET[0]) }

// ---- people --------------------------------------------------------------------------------------------

/** The person at the exit (6.3), and the carts of work that queue up in front of them on the road. */
export const REVIEWER: V3 = [9.4, 0, 6.8]
export const PILE: V3[] = [
  [8.4, 0.04, 5.6],
  [7.8, 0.04, 5.6],
  [7.2, 0.04, 5.6],
  [8.1, 0.04, 6.35],
  [7.5, 0.04, 6.35],
  [6.6, 0.04, 5.6],
  [6.9, 0.04, 6.35],
  [6.0, 0.04, 5.6],
]
/** The three of the team (7.2), by the hamlet of the products. */
export const TEAM: V3[] = [
  [13.6, 0, -2.9],
  [14.6, 0, -2.3],
  [15.6, 0, -2.9],
]
/** More than ten products: cottages in a hamlet outside the second ring, north east. */
export const APPS: V3[] = Array.from({ length: 11 }, (_, i) => {
  const row = Math.floor(i / 4)
  const col = i % 4
  return [12.0 + col * 1.7 + (row % 2) * 0.85, 0, -4.2 - row * 2.3] as const
})
/** The developer with the copy of the hall (9.5), south of the road. */
export const DEV_POS: V3 = [-2.5, 0, 8.0]
/** The elder who looks at what needs a human (12.4), by the stacks. */
export const HEALTH_PERSON: V3 = [3.8, 0, 8.6]

// ---- the paths of the story --------------------------------------------------------------------------

/** The hall's door in the world, while the hall is big. */
export const DOOR_BIG: V3 = [HALL_DOOR[0] * HALL_BIG, HALL_DOOR[1] * HALL_BIG, HALL_DOOR[2] * HALL_BIG]
/** Where a cart leaves the hall: on the platform, at the door, at the hall's first size. */
export const DOOR_GROUND: V3 = [HALL_DOOR[0] * HALL_BIG, PLATFORM_TOP * HALL_BIG, HALL_DOOR[2] * HALL_BIG]
/** Three runs of the same prompt: three paths of different shapes and lengths from the door to the pile (6.1). */
export const RUN_PATHS: V3[][] = [
  [DOOR_GROUND, [1.5, 0.06, 3.2], [3.6, 0.06, 4.6], [6.0, 0.06, 5.4], PILE[0]!],
  [DOOR_GROUND, [-1.6, 0.06, 3.4], [0.6, 0.06, 5.0], [3.2, 0.06, 7.0], [6.4, 0.06, 6.4], PILE[1]!],
  [DOOR_GROUND, [2.4, 0.06, 2.2], [4.9, 0.06, 3.3], [6.9, 0.06, 4.5], PILE[2]!],
]
/** Every repo improvises: three runs from the hall, three different paths (9.1). */
export const IMPROVISE_PATHS: V3[][] = [
  [DOOR_GROUND, [-2.2, 0.06, 3.6], [-4.6, 0.06, 4.6], [-6.9, 0.06, 6.2]],
  [DOOR_GROUND, [1.8, 0.06, 3.0], [3.2, 0.06, 5.4], [1.4, 0.06, 7.8]],
  [DOOR_GROUND, [2.6, 0.06, 2.4], [5.6, 0.06, 1.6], [7.6, 0.06, -1.0]],
]
/** "Solve this issue": a cloud of possible paths (9.3). */
export const CLOUD_PATHS: V3[][] = [
  [DOOR_GROUND, [1.4, 0.06, 3.4], [3.8, 0.06, 4.2], [6.2, 0.06, 3.6]],
  [DOOR_GROUND, [-1.2, 0.06, 3.6], [-0.4, 0.06, 5.6], [1.8, 0.06, 7.2]],
  [DOOR_GROUND, [0.8, 0.06, 3.8], [1.2, 0.06, 6.0], [3.6, 0.06, 7.8]],
  [DOOR_GROUND, [-2.4, 0.06, 3.2], [-4.2, 0.06, 5.4], [-4.6, 0.06, 7.6]],
  [DOOR_GROUND, [2.2, 0.06, 2.6], [5.0, 0.06, 2.2], [7.2, 0.06, 4.4]],
]
/** Unsafe commands fly at the parapet from here and bounce off (9.4). */
export const COMMANDS_FROM: V3[] = [
  [7.2, 1.3, 6.4],
  [8.6, 0.9, 3.4],
  [6.0, 1.7, 8.6],
]

/** 10.4 before the router: belts everywhere, each with a station that woke on every cart. */
export const SPAGHETTI: V3[][] = [
  [[-17, 0, -5], [-8.6, 0, -1.2], [-0.5, 0, 9.0]],
  [[-14, 0, 9], [-5.9, 0, -2.4], [7.5, 0, -9.5]],
  [[-17, 0, 3], [2.2, 0, -10.2], [16, 0, -12]],
]
export const SPAGHETTI_STATIONS: V3[] = [
  [-8.6, 0, -1.2],
  [-5.9, 0, -2.4],
  [2.2, 0, -10.2],
]

/** The audit's report goes into the gatehouse as a new cart (12.6): from the watchtower, around the west. */
export const AUDIT_LOOP: V3[] = [TOWER, [-1.0, 0, -8.7], [-6.5, 0, -7.5], [-10.5, 0, -3.0], [-11.5, 0, 2.0], [GATEHOUSE[0], 0, GATEHOUSE[2] - 1.3]]

/** After release, the issue goes on to production: east, out of the outer gate. */
export const PRODUCTION: V3 = [26, 0.14, MAIN_Z]

// ---- part 4: the levels, and part 11: the phases and the verbs -------------------------------------

/** Five ring walls round the land, level 1 the smallest, far apart. Part 4 pulls the camera back to show them all. */
export const LEVEL_RADII = [5.5, 9.5, 13.5, 17.5, 21]
/** The four empty slots on the level 5 ring, on its west arc, where the frame has room for their names. */
export const SLOT_ANGLES = [deg(125), deg(140), deg(155), deg(170)]
/** The three phases: the plans of the three walls. Their labels sit at the front of each circle, one below the other. */
export const PHASE_LABEL_DIR: V3 = [0, 0, 1]
export const PHASE_LABEL_R = [5.6, 10.0, 14.6]
/** Verbs (11.5): what a worker may do, as small moons; what it may not, as hollow slots. */
export const VERBS: Array<{ id: string; at: V3; hollow: boolean }> = [
  { id: 'pr', at: [2.6, 3.0, 2.9], hollow: false },
  { id: 'merge-no', at: [2.6, 2.15, 2.9], hollow: true },
  { id: 'main-no', at: [2.6, 1.3, 2.9], hollow: true },
  { id: 'merge', at: [EXIT_GATE[0], 3.1, EXIT_GATE[2] + 0.4], hollow: false },
  { id: 'issue', at: [TRIAGE_HOUSE[0] + 1.6, 1.75, TRIAGE_HOUSE[2] + 0.4], hollow: false },
  { id: 'code-no', at: [TRIAGE_HOUSE[0] + 1.6, 0.8, TRIAGE_HOUSE[2] + 0.4], hollow: true },
]
/** Where the five guardrail names sit: on wall segments the camera sees (ring index, angle). */
export const GUARDRAIL_SPOTS: Array<{ ring: number; angle: number }> = [
  { ring: 0, angle: deg(100) },
  { ring: 0, angle: deg(55) },
  { ring: 1, angle: deg(70) },
  { ring: 1, angle: deg(112) },
  { ring: 2, angle: deg(88) },
]
/** 11.6: a shortcut from the first phase straight to the last, in two halves that break apart. */
export const SHORTCUT: V3[] = [
  [-3.6, 0.05, -4.2],
  [-9.2, 0.05, -8.4],
  [-14.6, 0.05, -12.4],
]

// ---- part 11: tidy and messy ---------------------------------------------------------------------------

export const TIDY_POS: V3 = [-16, 0, -5]
export const MESSY_POS: V3 = [-12, 0, -9]

// ---- part 12: the measures -------------------------------------------------------------------------------

/**
 * Measures stack up on both sides of the road, like the stores of a game:
 * four south of it, then two more north of it by the barn, with the two that
 * are not collected beside them.
 */
export const METRIC_BASES: V3[] = [
  [6.4, 0, 7.3],
  [7.7, 0, 7.3],
  [9.0, 0, 7.3],
  [10.3, 0, 7.3],
  [6.3, 0, 1.6],
  [7.6, 0, 1.6],
  [8.9, 0, 1.6],
  [10.2, 0, 1.6],
]
/** Coins in each collected measure, and in each ghost stack of a measure that is not collected. */
export const METRIC_COINS = [9, 6, 7, 11, 5, 7]
export const GHOST_COINS = 8
/** Metric coins are bigger than token coins. */
export const METRIC_COIN_SCALE = 1.5
/** The stack of token coins beside the hall (6.2): three coins per simple task. */
export const TOKEN_COINS = 12
/** Coins left once the simple work leaves the agent (10.3). */
export const TOKENS_LEFT = 3

// ---- part 3: the milestones on the road ------------------------------------------------------------------

const GAP_RATIO = 0.93
const gaps = Array.from({ length: 9 }, (_, i) => Math.pow(GAP_RATIO, i))
const gapSum = gaps.reduce((a, b) => a + b, 0)
/** X of each of the ten milestones on the road into the town: each closer to the last. */
export const MILESTONE_X: number[] = [-44]
for (const g of gaps) MILESTONE_X.push(MILESTONE_X[MILESTONE_X.length - 1]! + (g / gapSum) * 22.5)
/** The milestones stand on the north side of the road, so their names sit above it. */
export const MILESTONE_Z = MAIN_Z - 1.15
export const MILESTONES: V3[] = MILESTONE_X.map((x) => [x, 0, MILESTONE_Z] as const)
/** Steps 0 to 4 are single objects, 5 to 8 a system around one, 9 is "?". */
export const TIMELINE_SPLIT = 5

// ---- the land --------------------------------------------------------------------------------------------

/** Size of the land plane. */
export const LAND_SIZE = 130

/** Deterministic 2D value noise, -1..1. */
function noise2(x: number, z: number): number {
  const i = Math.floor(x)
  const j = Math.floor(z)
  const fx = x - i
  const fz = z - j
  const h = (a: number, b: number) => {
    const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
    return (s - Math.floor(s)) * 2 - 1
  }
  const sx = fx * fx * (3 - 2 * fx)
  const sz = fz * fz * (3 - 2 * fz)
  const a = h(i, j) + (h(i + 1, j) - h(i, j)) * sx
  const b = h(i, j + 1) + (h(i + 1, j + 1) - h(i, j + 1)) * sx
  return a + (b - a) * sz
}

const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** How far a point is outside the flat land: the town, the road into it, the hamlets. Negative inside. */
function outsideFlat(x: number, z: number): number {
  const town = Math.hypot(x, z) - (RINGS[2]! + 2.5)
  const road = Math.max(Math.abs(x + 31) - 18, Math.abs(z - MAIN_Z) - 3.5)
  const west = Math.hypot(x + 14, z + 7) - 6
  return Math.min(town, road, west)
}

/** Height of the land at a point: flat in the town and along the road, gentle hills beyond. */
export function landHeight(x: number, z: number): number {
  const mask = smooth(outsideFlat(x, z) / 9)
  const n = 0.8 * noise2(x * 0.08 + 3.1, z * 0.08 + 7.3) + 0.35 * noise2(x * 0.19 + 11, z * 0.19 + 2)
  return mask * (0.8 + n * 1.3)
}

/** Fields: farm plots around the town, each a few tiles inside a fence. */
export const FIELD_TILE = { w: 1.9, d: 1.3 }
const GAP = 0.15
export interface Farm {
  tiles: V3[]
  fence: V3[]
  bales: V3[]
}
function farm(cx: number, cz: number, cols: number, rows: number): Farm {
  const tiles: V3[] = []
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) tiles.push([cx + (i - (cols - 1) / 2) * (FIELD_TILE.w + GAP), 0, cz + (j - (rows - 1) / 2) * (FIELD_TILE.d + GAP)])
  const hw = (cols * (FIELD_TILE.w + GAP)) / 2 + 0.3
  const hd = (rows * (FIELD_TILE.d + GAP)) / 2 + 0.3
  const fence: V3[] = [
    [cx - hw, 0, cz + hd],
    [cx - hw, 0, cz - hd],
    [cx + hw, 0, cz - hd],
    [cx + hw, 0, cz + hd],
  ]
  const bales: V3[] = [
    [cx + hw + 0.4, 0, cz + hd - 0.3],
    [cx + hw + 0.4, 0, cz + hd - 0.75],
  ]
  return { tiles, fence, bales }
}
export const FARMS: Farm[] = [farm(-15.5, 0.2, 2, 3), farm(-11, 9.6, 3, 2), farm(1.5, 9.8, 3, 2), farm(15.5, 1.0, 2, 3), farm(9.2, -2.4, 2, 2), farm(-6.5, -13.4, 3, 2)]
export const FIELDS: V3[] = FARMS.flatMap((f) => f.tiles)
export const BALES: V3[] = FARMS.flatMap((f) => f.bales)

/**
 * Things nothing may stand on: buildings, roads, the loop, the rings, the
 * fields. Rectangles [x, z, half width, half depth], a little wider toward
 * the camera (south east), so no tree stands in front of a building.
 */
const rect = (p: V3, hw: number, hd: number, lean = 0.4): [number, number, number, number] => [p[0] + lean, p[2] + lean, hw, hd]
const KEEP_CLEAR: Array<[number, number, number, number]> = [
  [0.4, 0.4, 6.4, 5.4], // the hall and its loop
  [-2, MAIN_Z, 48, 1.8], // the roads, into the town and through it
  rect(GATEHOUSE, 1.8, 3.4, 0.3),
  rect(EXIT_GATE, 1.8, 3.4, 0.3),
  rect(OUTER_W, 1.8, 3.4, 0.3),
  rect(OUTER_E, 1.8, 3.4, 0.3),
  rect(ARCH_W, 1.2, 2.6, 0.2),
  rect(ARCH_E, 1.2, 2.6, 0.2),
  rect(TRIAGE_HOUSE, 2.0, 1.8),
  rect(REFINE_HOUSE, 1.8, 1.7),
  rect(REQUESTER, 1.2, 1.2),
  rect(MARKET, 2.0, 1.6, 0.5),
  rect(BOOTH, 1.5, 1.4, 0.3),
  rect(TOWER, 1.8, 1.8, 0.5),
  rect(STATION, 2.2, 2.0, 0.5),
  rect(WELL, 1.2, 1.2, 0.3),
  rect(SCRIPTORIUM, 1.8, 1.6),
  rect(FORGE, 2.0, 1.8),
  ...KILNS.map((k) => rect(k, 1.2, 1.2, 0.3)),
  rect(BARN, 2.0, 1.8, 0.5),
  [8.4, 4.4, 3.2, 3.8], // the stacks of measures
  rect(REVIEWER, 1.4, 1.4, 0.3),
  rect(DEV_POS, 1.2, 1.2, 0.3),
  rect(HEALTH_PERSON, 1.2, 1.2, 0.3),
  [14.6, -6.0, 3.4, 4.2], // the hamlet and the team
  rect(TIDY_POS, 2.6, 2.4),
  rect(MESSY_POS, 2.6, 2.4),
  [3.4, LINE_Z, 3.8, 1.4], // the line of steps
  ...SPAGHETTI_STATIONS.map((p) => rect(p, 1.3, 1.2, 0.3)),
  ...MILESTONES.map((p) => rect(p, 0.9, 1.0, 0.2)),
  ...FARMS.map((f) => {
    const [ax, , az] = f.fence[0]!
    const [cx, , cz] = f.fence[2]!
    return [(ax + cx) / 2, (az + cz) / 2, Math.abs(cx - ax) / 2 + 0.8, Math.abs(cz - az) / 2 + 0.8] as [number, number, number, number]
  }),
]
const clear = (x: number, z: number) => {
  if (KEEP_CLEAR.some(([cx, cz, hw, hd]) => Math.abs(x - cx) <= hw && Math.abs(z - cz) <= hd)) return false
  const r = Math.hypot(x, z)
  return RINGS.every((ring) => Math.abs(r - ring) > 1.3)
}

function seeded(seed: number): () => number {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

/** Lone trees between two distances from the hall. Seeded, so the same every time. */
function plant(count: number, seed: number, inner: number, outer: number): V3[] {
  const rand = seeded(seed)
  const out: V3[] = []
  let guard = 0
  while (out.length < count && guard++ < count * 40) {
    const a = rand() * Math.PI * 2
    const r = inner + Math.sqrt(rand()) * (outer - inner)
    const x = Math.cos(a) * r * 1.3
    const z = Math.sin(a) * r
    if (!clear(x, z)) continue
    out.push([x, landHeight(x, z), z])
  }
  return out
}

/** A grove: trees packed around a point. */
function grove(cx: number, cz: number, count: number, radius: number, seed: number): V3[] {
  const rand = seeded(seed)
  const out: V3[] = []
  let guard = 0
  while (out.length < count && guard++ < count * 40) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * radius
    const x = cx + Math.cos(a) * r * 1.3
    const z = cz + Math.sin(a) * r
    if (!clear(x, z)) continue
    if (out.some(([ox, , oz]) => Math.hypot(ox - x, oz - z) < 0.75)) continue
    out.push([x, landHeight(x, z), z])
  }
  return out
}

/** The woods: groves around the town and along the road, and lone trees between. Round trees and pines. */
const GROVES = [
  ...grove(-22, -14, 30, 6, 101),
  ...grove(-27, 0, 22, 5, 103),
  ...grove(-20, 14, 24, 5, 105),
  ...grove(-8, -20, 28, 6, 107),
  ...grove(8, -22, 30, 6, 109),
  ...grove(22, -14, 26, 5.5, 111),
  ...grove(26, 4, 22, 5, 113),
  ...grove(18, 16, 22, 5, 115),
  ...grove(3, 21, 20, 5, 117),
  ...grove(-36, -3, 26, 6, 119),
  ...grove(-30, 12, 24, 6, 121),
  ...grove(-44, 10, 20, 5, 123),
  ...grove(-46, -2, 18, 5, 125),
]
const LONE = [...plant(40, 7, 5.5, 20), ...plant(70, 13, 20, 40)]
const ALL_TREES = [...LONE, ...GROVES]
export const ROUND_TREES: V3[] = ALL_TREES.filter((_, i) => i % 5 !== 2 && i % 5 !== 4)
export const PINE_TREES: V3[] = ALL_TREES.filter((_, i) => i % 5 === 2 || i % 5 === 4)
export const BUSHES: V3[] = [...plant(50, 29, 4.5, 30), ...grove(-30, 6, 12, 8, 127)]
export const ROCKS: V3[] = plant(18, 31, 8, 34)
export const FLOWERS: V3[] = [...plant(110, 37, 3.5, 20), ...grove(-30, 5.6, 40, 9, 129)]
