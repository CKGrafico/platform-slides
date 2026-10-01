/**
 * The map of the town: where everything stands in the one persistent world
 * (docs/art/town-proposal.md). The hall sits at the origin; x runs east, z
 * runs south, toward the camera. Five ring walls stand round the hall,
 * fifteen units apart (the maturity levels of part 4), and the town is built
 * between them, district by district: the agent's precinct inside the first
 * wall, the workshops in the second band, Foundations and Project Health in
 * the third, the hamlet and the market in the fourth, farms in the fifth. The
 * main road runs west to east along the south of the hall, through a gate in
 * every wall; the road of milestones comes in from the west edge of the frame
 * to the outer gate; the woods close the land beyond the fifth wall.
 *
 * The camera never moves (shots.ts): the whole map is in the frame, about 185
 * units wide at the hall, so everything here is sized for that distance.
 */
export type V3 = readonly [number, number, number]
const deg = (d: number) => (d * Math.PI) / 180

// ---- the rings: the five walls -----------------------------------------------------------------

/**
 * Radii of the five ring walls round the hall, fifteen units apart: the
 * maturity levels of part 4, level 1 the smallest. They rise in part 4 and
 * never leave; every district of the town is built between two of them.
 */
export const RINGS = [9, 24, 39, 54, 69]
export const RING_THICKNESS = 1.2
export const RING_HEIGHT = 2.2
/** Each ring is built as arcs, so it can rise round the town piece by piece. */
export const RING_ARCS = 8
/** Gates, arches, the watchtower and the milestones are sized up for the far camera, so they read against the walls. */
export const GATE_SCALE = 1.5
export const ARCH_SCALE = 1.6
export const TOWER_SCALE = 1.8
export const MILESTONE_SCALE = 1.8

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

// ---- roads -----------------------------------------------------------------------------------------

export const MAIN_Z = 5.6
const crossing = (r: number) => Math.sqrt(r * r - MAIN_Z * MAIN_Z)
/** Where the main road crosses each ring: a gate on each side. */
export const RING_CROSSINGS = RINGS.map(crossing)
/** The main road, west to east along the south of the hall, from the outer gate to the outer gate. */
export const MAIN: V3[] = [
  [-RING_CROSSINGS[4]!, 0, MAIN_Z],
  [RING_CROSSINGS[4]!, 0, MAIN_Z],
]
/** The road into the town (part 3): from the west edge of the frame to the outer gate. */
export const TIMELINE_ROAD: V3[] = [
  [-105, 0, MAIN_Z],
  [-RING_CROSSINGS[4]!, 0, MAIN_Z],
]
/** Along the main road, as fractions of its length. */
const mainAt = (x: number) => (x - MAIN[0]![0]) / (MAIN[1]![0] - MAIN[0]![0])

// ---- gates: an opening in every wall where the road crosses it ---------------------------------------

/** Arches on the first, third and fourth wall; the gatehouse and the merge gate on the second; gate towers on the fifth. */
export const ARCH_W: V3 = [-RING_CROSSINGS[0]!, 0, MAIN_Z]
export const ARCH_E: V3 = [RING_CROSSINGS[0]!, 0, MAIN_Z]
export const GATEHOUSE: V3 = [-RING_CROSSINGS[1]!, 0, MAIN_Z]
export const EXIT_GATE: V3 = [RING_CROSSINGS[1]!, 0, MAIN_Z]
export const ARCH_3W: V3 = [-RING_CROSSINGS[2]!, 0, MAIN_Z]
export const ARCH_3E: V3 = [RING_CROSSINGS[2]!, 0, MAIN_Z]
export const ARCH_4W: V3 = [-RING_CROSSINGS[3]!, 0, MAIN_Z]
export const ARCH_4E: V3 = [RING_CROSSINGS[3]!, 0, MAIN_Z]
export const OUTER_W: V3 = [-RING_CROSSINGS[4]!, 0, MAIN_Z]
export const OUTER_E: V3 = [RING_CROSSINGS[4]!, 0, MAIN_Z]
/** The mill's road runs west along this line (5.2), into the first wall through a postern. */
export const LINE_Z = -6.6
/** Two posterns in the first wall: one north, toward Forge, and one north east, where the mill's road comes in. */
export const POSTERN_N: V3 = [0, 0, -RINGS[0]!]
export const POSTERN_NE: V3 = [Math.sqrt(RINGS[0]! * RINGS[0]! - LINE_Z * LINE_Z), 0, LINE_Z]
/** Half the length of the gap a wall leaves for an arch or a gate, along the wall: the wall ends inside the gate's own stubs. */
const ARCH_GAP = 2.6
const GATE_GAP = 3.4
/** The openings of each wall (ring index): where a gate stands, and the half-length of its gap. */
export const RING_OPENINGS: Array<Array<{ at: V3; half: number }>> = [
  [
    { at: ARCH_W, half: ARCH_GAP },
    { at: ARCH_E, half: ARCH_GAP },
    { at: POSTERN_N, half: ARCH_GAP },
    { at: POSTERN_NE, half: ARCH_GAP },
  ],
  [
    { at: GATEHOUSE, half: GATE_GAP },
    { at: EXIT_GATE, half: GATE_GAP },
  ],
  [
    { at: ARCH_3W, half: ARCH_GAP },
    { at: ARCH_3E, half: ARCH_GAP },
  ],
  [
    { at: ARCH_4W, half: ARCH_GAP },
    { at: ARCH_4E, half: ARCH_GAP },
  ],
  [
    { at: OUTER_W, half: GATE_GAP },
    { at: OUTER_E, half: GATE_GAP },
  ],
]

// ---- GitHub Actions: the mill and its line of steps ---------------------------------------------

/** The mill, north east of the first wall, its sails toward the hall. */
export const STATION: V3 = [13.2, 0, -6.6]
export const STATION_TURN = -0.6
/** Where its steps land on the loop (10.3). */
export const STEP_LANDING = [0.3, 0.36, 0.42, 0.48, 0.54, 0.58]
/** The straight belt of steps that leaves the mill westward (5.2), through the postern. */
export const LINE_Y = 0.08
export const LINE_X = [11.2, 8.8, 6.4, 4.0, 1.6, -0.8]
export const LINE_FROM: V3 = [11.8, LINE_Y, LINE_Z]
export const LINE_TO: V3 = [-1.4, LINE_Y, LINE_Z]
/** Near the hall the line bends onto the loop (5.3). The last two steps move here. */
export const LINE_BENT: V3[] = [
  [0.2, LINE_Y, -5.3],
  [-0.8, LINE_Y, -4.2],
]

// ---- buildings ---------------------------------------------------------------------------------------

/** Inside the first wall, with the hall: the well. */
export const WELL: V3 = [-6.2, 0, 1.8]
/** The compiler: a scriptorium north west of the first wall. */
export const SCRIPTORIUM: V3 = [-12.0, 0, -6.5]
export const SCRIPTORIUM_DOOR: V3 = [-12.0, 0.3, -5.5]
/** The workshops on the road, west of the hall, inside the second wall. */
export const TRIAGE_HOUSE: V3 = [-17.5, 0, 3.2]
export const REFINE_HOUSE: V3 = [-12.5, 0, 3.3]
export const REQUESTER: V3 = [-10.0, 0, 8.2]
/** Forge, north of the first wall, and the kilns of the models behind it. */
export const FORGE: V3 = [-2.0, 0, -16.5]
export const KILNS: V3[] = [
  [-5.5, 0, -19.5],
  [-2.5, 0, -20.2],
  [0.5, 0, -19.8],
]
/** Before Forge, the agent called a vendor straight away, far to the east. */
export const VENDOR: V3 = [30, 0.08, -12]
/** The watchtower of the audit: built into the first wall, north west of the hall. */
export const TOWER_ANGLE = deg(-120)
export const TOWER: V3 = [Math.cos(TOWER_ANGLE) * RINGS[0]!, 0, Math.sin(TOWER_ANGLE) * RINGS[0]!]
/** The market: east on the road, between the third and the fourth wall. */
export const MARKET: V3 = [46, 0, 3.4]
/** The person a risky change is sent to: a booth outside the merge gate, south of the road. */
export const BOOTH: V3 = [31, 0, 10]
/** The barn and the stacks of measures beside it, south west, between the second and the third wall (part 12): the side of the map the camera spreads wide. */
export const BARN: V3 = [-15, 0, 26]
export const MAIN_AT = { gate: mainAt(GATEHOUSE[0]), triage: mainAt(TRIAGE_HOUSE[0]), refine: mainAt(REFINE_HOUSE[0]), hall: mainAt(0), exit: mainAt(EXIT_GATE[0]), market: mainAt(MARKET[0]) }

// ---- people --------------------------------------------------------------------------------------------

/** The person at the exit (6.3), outside the merge gate, and the carts of work that queue up inside it on the road. */
export const REVIEWER: V3 = [26.5, 0, 7.8]
export const PILE: V3[] = [
  [21.6, 0.04, 5.6],
  [19.4, 0.04, 5.6],
  [17.2, 0.04, 5.6],
  [20.5, 0.04, 7.3],
  [18.3, 0.04, 7.3],
  [15.0, 0.04, 5.6],
  [16.1, 0.04, 7.3],
  [12.8, 0.04, 5.6],
]
/** The three of the team (7.2), by the hamlet of the products. */
export const TEAM: V3[] = [
  [29.5, 0, -30],
  [31.0, 0, -28],
  [32.5, 0, -30.5],
]
/** More than ten products: cottages in a hamlet north east, between the third and the fourth wall. */
export const APPS: V3[] = Array.from({ length: 11 }, (_, i) => {
  const row = Math.floor(i / 4)
  const col = i % 4
  return [33.0 + col * 2.3 + (row % 2) * 1.15, 0, -27 - row * 2.5] as const
})
/** The developer with the copy of the hall (9.5), south of the road inside the second wall, clear of the hall's names on screen. */
export const DEV_POS: V3 = [-6.0, 0, 19.0]
/** The elder who looks at what needs a human (12.4), by the stacks. */
export const HEALTH_PERSON: V3 = [-21.5, 0, 29.5]

// ---- the districts: where each pillar's sign stands --------------------------------------------------------

/** One spot per pillar, at the entrance of its district: Agent Harness, Agentic Workflows, Foundations, Project Health. Part 4 draws an empty slot on each. */
export const SIGN_SPOTS: V3[] = [
  [3.0, 0, 6.5],
  [-19.5, 0, 9.0],
  [-22, 0, -17],
  [-16, 0, 21],
]

// ---- the paths of the story --------------------------------------------------------------------------

/** The hall's door in the world, while the hall is big. */
export const DOOR_BIG: V3 = [HALL_DOOR[0] * HALL_BIG, HALL_DOOR[1] * HALL_BIG, HALL_DOOR[2] * HALL_BIG]
/** Where a cart leaves the hall: on the platform, at the door, at the hall's first size. */
export const DOOR_GROUND: V3 = [HALL_DOOR[0] * HALL_BIG, PLATFORM_TOP * HALL_BIG, HALL_DOOR[2] * HALL_BIG]
/** Three runs of the same prompt: three paths of different shapes and lengths from the door, out of the east arch, to the pile (6.1). */
export const RUN_PATHS: V3[][] = [
  [DOOR_GROUND, [2.2, 0.06, 3.6], [5.0, 0.06, 5.2], [7.0, 0.06, 5.9], [12.0, 0.06, 5.0], PILE[0]!],
  [DOOR_GROUND, [-1.4, 0.06, 3.6], [1.0, 0.06, 5.4], [4.4, 0.06, 6.6], [7.2, 0.06, 6.0], [13.0, 0.06, 7.2], PILE[1]!],
  [DOOR_GROUND, [2.8, 0.06, 2.4], [5.6, 0.06, 3.8], [7.4, 0.06, 5.4], [11.0, 0.06, 4.6], PILE[2]!],
]
/** Every repo improvises: three runs from the hall, three different paths (9.1). */
export const IMPROVISE_PATHS: V3[][] = [
  [DOOR_GROUND, [-2.4, 0.06, 3.8], [-5.2, 0.06, 5.2], [-7.4, 0.06, 6.2], [-10.5, 0.06, 7.0]],
  [DOOR_GROUND, [-1.6, 0.06, 3.4], [-2.8, 0.06, 5.4], [-4.4, 0.06, 6.8]],
  [DOOR_GROUND, [2.6, 0.06, 2.4], [5.4, 0.06, 1.4], [7.2, 0.06, -1.2]],
]
/** "Solve this issue": a cloud of possible paths inside the first wall (9.3). */
export const CLOUD_PATHS: V3[][] = [
  [DOOR_GROUND, [1.4, 0.06, 3.4], [3.8, 0.06, 4.4], [6.0, 0.06, 3.6]],
  [DOOR_GROUND, [-1.2, 0.06, 3.6], [-0.4, 0.06, 5.4], [1.6, 0.06, 7.0]],
  [DOOR_GROUND, [0.8, 0.06, 3.8], [1.4, 0.06, 5.6], [3.4, 0.06, 6.8]],
  [DOOR_GROUND, [-2.4, 0.06, 3.2], [-3.8, 0.06, 5.0], [-4.4, 0.06, 6.4]],
  [DOOR_GROUND, [2.2, 0.06, 2.6], [4.8, 0.06, 2.2], [6.6, 0.06, 3.8]],
]
/** Unsafe commands fly at the curtain wall from the east, inside the first wall, and bounce off (9.4). */
export const COMMANDS_FROM: V3[] = [
  [9.4, 1.3, 1.0],
  [10.2, 0.9, -0.6],
  [8.6, 1.7, 2.4],
]

/** 10.4 before the router: belts everywhere across the town, each with a station that woke on every cart. */
export const SPAGHETTI: V3[][] = [
  [[-34, 0, -12], [-18.5, 0, -3.5], [-9.5, 0, 11], [-2, 0, 19]],
  [[-24, 0, 22], [-13.5, 0, -1.0], [15, 0, -19]],
  [[-36, 0, -3], [-18, 0, -9.5], [-8, 0, -10.5], [0, 0, -9], [14, 0, -15], [30, 0, -18]],
]
export const SPAGHETTI_STATIONS: V3[] = [
  [-18.5, 0, -3.5],
  [-13.5, 0, -1.0],
  [14, 0, -15],
]

/** The audit's report goes into the gatehouse as a new cart (12.6): from the watchtower, around the west, outside the first wall. */
export const AUDIT_LOOP: V3[] = [TOWER, [-8, 0, -11], [-14, 0, -11], [-19, 0, -6], [-22, 0, -1], [GATEHOUSE[0], 0, GATEHOUSE[2] - 1.5]]

/** After release, the issue goes on to production: east, out of the outer gate. */
export const PRODUCTION: V3 = [75, 0.14, MAIN_Z]

// ---- part 11: the phases, the guardrails and the verbs ----------------------------------------------

/** The three phases are the three inner walls. Their names sit on the ground just inside each, south west of the hall, reading leftward, each a row lower on screen. */
export const PHASE_LABELS: V3[] = [
  [-6.5, 0.1, 7.0],
  [-8.0, 0.1, 20.5],
  [-12.0, 0.1, 37.0],
]
/** Verbs (11.5): what a worker may do, as seals; what it may not, as hollow slots. High over the hall, by the merge gate, and west of triage. */
export const VERBS: Array<{ id: string; at: V3; hollow: boolean; side: 'left' | 'right' }> = [
  { id: 'pr', at: [2.6, 42.0, 2.9], hollow: false, side: 'right' },
  { id: 'merge-no', at: [2.6, 36.0, 2.9], hollow: true, side: 'right' },
  { id: 'main-no', at: [2.6, 30.0, 2.9], hollow: true, side: 'right' },
  { id: 'merge', at: [EXIT_GATE[0], 0.2, EXIT_GATE[2] + 0.4], hollow: false, side: 'right' },
  { id: 'issue', at: [TRIAGE_HOUSE[0] - 1.6, 5.8, TRIAGE_HOUSE[2] + 0.4], hollow: false, side: 'left' },
  { id: 'code-no', at: [TRIAGE_HOUSE[0] - 1.6, 1.5, TRIAGE_HOUSE[2] + 0.4], hollow: true, side: 'left' },
]
/** Where the five guardrail names sit: one on each wall, on a stretch with room on screen (ring index, angle, height over the wall's foot, and whether the name ends at the spot). */
export const GUARDRAIL_SPOTS: Array<{ ring: number; angle: number; height: number; end: boolean }> = [
  { ring: 0, angle: deg(105), height: 2.2, end: true },
  { ring: 1, angle: deg(155), height: 3.2, end: true },
  { ring: 2, angle: deg(112), height: 1.5, end: true },
  { ring: 3, angle: deg(80), height: 2.8, end: false },
  { ring: 4, angle: deg(100), height: 2.8, end: false },
]
/** 11.6: a shortcut from the first wall straight out past the third, in two halves that break apart. */
export const SHORTCUT: V3[] = [
  [3.0, 0.05, -5.2],
  [10.0, 0.05, -17.3],
  [17.5, 0.05, -30.3],
]

// ---- part 11: tidy and messy ---------------------------------------------------------------------------

/** Two houses north west, between the second and the third wall, wide apart on screen. */
export const TIDY_POS: V3 = [-30, 0, -12]
export const MESSY_POS: V3 = [-14, 0, -30]

// ---- part 12: the measures -------------------------------------------------------------------------------

/**
 * Measures stack up in front of the barn, like the stores of a game: four in
 * a front row, then two more in a back row by the barn, with the two that are
 * not collected beside them.
 */
export const METRIC_BASES: V3[] = [
  [-17.4, 0, 33.0],
  [-16.0, 0, 33.0],
  [-14.6, 0, 33.0],
  [-13.2, 0, 33.0],
  [-17.5, 0, 27.6],
  [-16.1, 0, 27.6],
  [-14.7, 0, 27.6],
  [-13.3, 0, 27.6],
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
/** X of each of the ten milestones on the road into the town: each closer to the last, the "?" just before the outer gate. */
export const MILESTONE_X: number[] = [-102]
for (const g of gaps) MILESTONE_X.push(MILESTONE_X[MILESTONE_X.length - 1]! + (g / gapSum) * 30)
/** The milestones stand on the north side of the road, so their names sit above it. */
export const MILESTONE_Z = MAIN_Z - 1.15
export const MILESTONES: V3[] = MILESTONE_X.map((x) => [x, 0, MILESTONE_Z] as const)
/** Steps 0 to 4 are single objects, 5 to 8 a system around one, 9 is "?". */
export const TIMELINE_SPLIT = 5

// ---- the land --------------------------------------------------------------------------------------------

/** Size of the land plane: it reaches past every edge of the frame. */
export const LAND_SIZE = 260

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

/** How far a point is outside the flat land: the town out to its fifth wall, and the road into it. Negative inside. */
function outsideFlat(x: number, z: number): number {
  const town = Math.hypot(x, z) - (RINGS[4]! + 3)
  const roadMid = (TIMELINE_ROAD[0]![0] + TIMELINE_ROAD[1]![0]) / 2
  const roadHalf = (TIMELINE_ROAD[1]![0] - TIMELINE_ROAD[0]![0]) / 2
  const road = Math.max(Math.abs(x - roadMid) - roadHalf - 2, Math.abs(z - MAIN_Z) - 4.5)
  return Math.min(town, road)
}

/** Height of the land at a point: flat in the town and along the road, gentle hills beyond. */
export function landHeight(x: number, z: number): number {
  const mask = smooth(outsideFlat(x, z) / 9)
  const n = 0.8 * noise2(x * 0.08 + 3.1, z * 0.08 + 7.3) + 0.35 * noise2(x * 0.19 + 11, z * 0.19 + 2)
  return mask * (0.8 + n * 1.3)
}

/** Fields: farm plots in the outer bands of the town, each a few tiles inside a fence. */
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
/** Five farms between the third and the fourth wall, four between the fourth and the fifth. */
export const FARMS: Farm[] = [
  farm(-40, 22, 3, 2),
  farm(10, 46, 3, 2),
  farm(44, 20, 2, 3),
  farm(-20, -42, 3, 2),
  farm(14, -45, 2, 3),
  farm(-55, 25, 3, 2),
  farm(30, 52, 3, 2),
  farm(55, -25, 2, 3),
  farm(-25, -55, 3, 2),
]
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
  [(TIMELINE_ROAD[0]![0] + MAIN[1]![0]) / 2, MAIN_Z, (MAIN[1]![0] - TIMELINE_ROAD[0]![0]) / 2 + 2, 2.4], // the roads, into the town and through it
  [PRODUCTION[0] + 2, MAIN_Z, 4, 2.4], // the road on to production
  ...[GATEHOUSE, EXIT_GATE, OUTER_W, OUTER_E].map((g) => rect(g, 2.4, 5.0, 0.3)),
  ...[ARCH_W, ARCH_E, ARCH_3W, ARCH_3E, ARCH_4W, ARCH_4E, POSTERN_N, POSTERN_NE].map((g) => rect(g, 2.0, 4.0, 0.2)),
  rect(TRIAGE_HOUSE, 2.0, 1.8),
  rect(REFINE_HOUSE, 1.8, 1.7),
  rect(REQUESTER, 1.2, 1.2),
  rect(MARKET, 2.0, 1.6, 0.5),
  rect(BOOTH, 1.5, 1.4, 0.3),
  rect(TOWER, 2.4, 2.4, 0.5),
  rect(STATION, 2.4, 2.2, 0.5),
  rect(WELL, 1.2, 1.2, 0.3),
  rect(SCRIPTORIUM, 1.8, 1.6),
  rect(FORGE, 2.0, 1.8),
  ...KILNS.map((k) => rect(k, 1.2, 1.2, 0.3)),
  rect(BARN, 2.0, 1.8, 0.5),
  [-15.0, 30.5, 3.4, 4.2], // the stacks of measures
  rect(REVIEWER, 1.4, 1.4, 0.3),
  rect(DEV_POS, 1.6, 1.4, 0.3),
  rect(HEALTH_PERSON, 1.2, 1.2, 0.3),
  [37.5, -29.6, 6.0, 4.4], // the hamlet
  ...TEAM.map((p) => rect(p, 1.0, 1.0, 0.3)),
  rect(TIDY_POS, 2.6, 2.4),
  rect(MESSY_POS, 2.6, 2.4),
  [5.4, LINE_Z, 7.4, 1.6], // the line of steps
  ...SPAGHETTI_STATIONS.map((p) => rect(p, 1.3, 1.2, 0.3)),
  ...SIGN_SPOTS.map((p) => rect(p, 1.8, 1.8, 0.3)),
  ...MILESTONES.map((p) => rect(p, 1.4, 1.6, 0.2)),
  ...FARMS.map((f) => {
    const [ax, , az] = f.fence[0]!
    const [cx, , cz] = f.fence[2]!
    return [(ax + cx) / 2, (az + cz) / 2, Math.abs(cx - ax) / 2 + 0.8, Math.abs(cz - az) / 2 + 0.8] as [number, number, number, number]
  }),
]
const clear = (x: number, z: number) => {
  if (KEEP_CLEAR.some(([cx, cz, hw, hd]) => Math.abs(x - cx) <= hw && Math.abs(z - cz) <= hd)) return false
  const r = Math.hypot(x, z)
  return RINGS.every((ring) => Math.abs(r - ring) > 1.9)
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

/** The woods: groves in the hills beyond the fifth wall and in the empty bands, and lone trees between. Round trees and pines. */
const GROVES = [
  ...grove(-85, -30, 30, 7, 101),
  ...grove(-70, -65, 26, 6, 103),
  ...grove(-30, -85, 30, 7, 105),
  ...grove(20, -88, 26, 6, 107),
  ...grove(65, -65, 28, 6, 109),
  ...grove(88, -25, 24, 6, 111),
  ...grove(90, 25, 26, 6, 113),
  ...grove(70, 60, 28, 6, 115),
  ...grove(30, 85, 26, 6, 117),
  ...grove(-25, 88, 28, 7, 119),
  ...grove(-65, 60, 26, 6, 121),
  ...grove(-88, 30, 24, 6, 123),
  ...grove(-100, -15, 20, 5, 125),
  ...grove(-45, -45, 20, 6, 131),
  ...grove(45, 45, 20, 6, 133),
  ...grove(-50, 40, 18, 5, 135),
  ...grove(46, -42, 18, 5, 137),
  ...grove(-5, -46, 16, 5, 139),
  ...grove(-42, -12, 14, 5, 141),
  ...grove(40, 30, 14, 5, 143),
]
const LONE = [...plant(90, 7, 10, 68), ...plant(110, 13, 73, 96)]
const ALL_TREES = [...LONE, ...GROVES]
export const ROUND_TREES: V3[] = ALL_TREES.filter((_, i) => i % 5 !== 2 && i % 5 !== 4)
export const PINE_TREES: V3[] = ALL_TREES.filter((_, i) => i % 5 === 2 || i % 5 === 4)
export const BUSHES: V3[] = [...plant(70, 29, 6, 70), ...grove(-85, 28, 10, 7, 127)]
export const ROCKS: V3[] = plant(28, 31, 12, 90)
export const FLOWERS: V3[] = [...plant(170, 37, 5, 66), ...grove(-60, 40, 40, 9, 129)]
