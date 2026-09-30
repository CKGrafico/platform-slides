/**
 * Where everything in the town stands (docs/art/town-proposal.md). The ground
 * is at y = 0 in the town and rises into gentle hills beyond it; x runs east,
 * z runs south. The main road runs along the south of the town, the hall sits
 * in the middle with a belt loop around it, the fields lie around the road,
 * and the woods close the land on every side.
 *
 * The camera never zooms (town/shots.ts), so the whole town fits one frame
 * with its center at (0, 0, 2): everything stays inside |x - z| < 15 and
 * |x + z| < 16, measured from there.
 */
export type V3 = readonly [number, number, number]

/** The hall: the main house, big and closed at first. Its scale before and after the extraction. */
export const HALL: V3 = [0, 0, 0]
export const HALL_BIG = 1.38
export const HALL_AFTER_EACH = [1.29, 1.2, 1.1, 1.0]
/** Where things leave the hall: its front door, past the arcade. */
export const HALL_DOOR: V3 = [0, 0.5, 1.6]

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
/** The mill of GitHub Actions, north east of the loop, its sails toward it, and where its steps land. */
export const STATION: V3 = [5.8, 0, -4.6]
export const STATION_TURN = -0.6
export const STEP_LANDING = [0.3, 0.36, 0.42, 0.48, 0.54, 0.58]

/** The well, west of the loop: the hall's first neighbour. */
export const WELL: V3 = [-6.4, 0, -0.6]

/** The main road, west to east along the south of the town. */
export const MAIN_Z = 5.6
export const MAIN: V3[] = [
  [-15, 0, MAIN_Z],
  [15, 0, MAIN_Z],
]
/** Along the main belt, as fractions of its length. */
export const MAIN_AT = { gate: 0.15, triage: 0.27, refine: 0.38, hall: 0.5, exit: 0.75, market: 0.85 }
export const GATEHOUSE: V3 = [-10.5, 0, MAIN_Z]
export const TRIAGE_HOUSE: V3 = [-8.6, 0, 3.4]
export const REFINE_HOUSE: V3 = [-6.3, 0, 3.3]
export const REQUESTER: V3 = [-6.6, 0, 7.4]
export const EXIT_GATE: V3 = [7.5, 0, MAIN_Z]
export const MARKET: V3 = [10.5, 0, 3.4]
/** The person a risky change is sent to: a booth south of the exit gate. */
export const BOOTH: V3 = [7.6, 0, 7.8]
export const TOWER: V3 = [8.6, 0, -1.6]
/** The coins burned by the hall, in a pile beside it. */
export const COINS: V3 = [3.4, 0, 1.6]

/** 10.4 before the router: belts everywhere, each with a station that woke on every cart. */
export const SPAGHETTI: V3[][] = [
  [[-15, 0, -4], [-7, 0, -1], [-1.5, 0, 8.5]],
  [[-13, 0, 9], [-6.2, 0, 0.6], [6.5, 0, -6.5]],
  [[-15, 0, 1.5], [3, 0, -6.5], [15, 0, -3]],
]
export const SPAGHETTI_STATIONS: V3[] = [
  [-7, 0, -1],
  [-6.2, 0, 0.6],
  [3, 0, -6.5],
]

// ---- the land ------------------------------------------------------------------------------------

/** Size of the land plane. */
export const LAND_SIZE = 120
/** Inside this distance from the town center the land is flat; beyond it, hills. */
export const FLAT_RADIUS = 15
export const HILLS_FROM = 24

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

/** Height of the land at a point: flat in the town, gentle hills beyond. */
export function landHeight(x: number, z: number): number {
  const r = Math.hypot(x, z - 2)
  const mask = smooth((r - FLAT_RADIUS) / (HILLS_FROM - FLAT_RADIUS))
  const n = 0.8 * noise2(x * 0.08 + 3.1, z * 0.08 + 7.3) + 0.35 * noise2(x * 0.19 + 11, z * 0.19 + 2)
  return mask * (0.8 + n * 1.3)
}

/** Fields: farm plots around the road and the town, each a few tiles inside a fence. */
export const FIELD_TILE = { w: 1.9, d: 1.3 }
const GAP = 0.15
export interface Farm {
  tiles: V3[]
  /** The fence around the farm, closed. */
  fence: V3[]
  /** Two hay bales by a corner. */
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
export const FARMS: Farm[] = [farm(-13, 0.2, 2, 3), farm(-12, 9.6, 3, 2), farm(1.5, 9.8, 3, 2), farm(13.8, 0.6, 2, 3), farm(9.0, 1.0, 2, 2), farm(-7.5, -6.2, 3, 2)]
export const FIELDS: V3[] = FARMS.flatMap((f) => f.tiles)
export const BALES: V3[] = FARMS.flatMap((f) => f.bales)

/**
 * Things nothing may stand on: buildings, roads, the loop, the fields.
 * Rectangles [x, z, half width, half depth], a little wider toward the
 * camera (south east), so no tree stands in front of a building.
 */
const KEEP_CLEAR: Array<[number, number, number, number]> = [
  [0.4, 0.4, 6.2, 5.2], // the hall and its loop
  [0, MAIN_Z, 17, 1.6], // the main road
  [GATEHOUSE[0] + 0.3, GATEHOUSE[2], 1.6, 3.2],
  [TRIAGE_HOUSE[0] + 0.4, TRIAGE_HOUSE[2] + 0.4, 2.0, 1.8],
  [REFINE_HOUSE[0] + 0.4, REFINE_HOUSE[2] + 0.4, 1.8, 1.7],
  [REQUESTER[0], REQUESTER[2], 1.2, 1.2],
  [EXIT_GATE[0] + 0.3, EXIT_GATE[2], 1.6, 3.2],
  [MARKET[0] + 0.5, MARKET[2] + 0.4, 2.0, 1.6],
  [BOOTH[0] + 0.3, BOOTH[2] + 0.3, 1.5, 1.4],
  [TOWER[0] + 0.5, TOWER[2] + 0.5, 1.8, 1.8],
  [STATION[0] + 0.5, STATION[2] + 0.5, 2.2, 2.0],
  [WELL[0] + 0.3, WELL[2] + 0.3, 1.2, 1.2],
  ...SPAGHETTI_STATIONS.map(([x, , z]) => [x + 0.3, z + 0.3, 1.3, 1.2] as [number, number, number, number]),
  ...FARMS.map((f) => {
    const [ax, , az] = f.fence[0]!
    const [cx, , cz] = f.fence[2]!
    return [(ax + cx) / 2, (az + cz) / 2, Math.abs(cx - ax) / 2 + 0.8, Math.abs(cz - az) / 2 + 0.8] as [number, number, number, number]
  }),
]
const clear = (x: number, z: number) => KEEP_CLEAR.every(([cx, cz, hw, hd]) => Math.abs(x - cx) > hw || Math.abs(z - cz) > hd)

function seeded(seed: number): () => number {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

/** Lone trees between two distances from the town center. Seeded, so the same every time. */
function plant(count: number, seed: number, inner: number, outer: number): V3[] {
  const rand = seeded(seed)
  const out: V3[] = []
  let guard = 0
  while (out.length < count && guard++ < count * 40) {
    const a = rand() * Math.PI * 2
    const r = inner + Math.sqrt(rand()) * (outer - inner)
    const x = Math.cos(a) * r * 1.3
    const z = 2 + Math.sin(a) * r
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

/** The woods: groves around the town, and lone trees between. Round trees and pines. */
const GROVES = [
  ...grove(-19, -12, 34, 6, 101),
  ...grove(-24, 4, 26, 5, 103),
  ...grove(-15, 17, 22, 5, 105),
  ...grove(-6, -18, 26, 5, 107),
  ...grove(9, -19, 30, 6, 109),
  ...grove(22, -11, 28, 5.5, 111),
  ...grove(25, 5, 22, 5, 113),
  ...grove(18, 16, 20, 5, 115),
  ...grove(3, 20, 18, 4.5, 117),
]
const LONE = [...plant(36, 7, 5.5, 16), ...plant(60, 13, 16, 32)]
const ALL_TREES = [...LONE, ...GROVES]
export const ROUND_TREES: V3[] = ALL_TREES.filter((_, i) => i % 5 !== 2 && i % 5 !== 4)
export const PINE_TREES: V3[] = ALL_TREES.filter((_, i) => i % 5 === 2 || i % 5 === 4)
export const BUSHES: V3[] = plant(44, 29, 4.5, 26)
export const ROCKS: V3[] = plant(14, 31, 8, 30)
export const FLOWERS: V3[] = plant(90, 37, 3.5, 16)
