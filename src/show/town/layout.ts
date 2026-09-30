/**
 * Where everything in the town stands (docs/art/town-proposal.md). The ground
 * is at y = 0; x runs east, z runs south, toward the camera. The main belt
 * runs along the south of the plot, the hall sits in the middle with a belt
 * loop around it, and the watchtower stands at the north east corner.
 */
export type V3 = readonly [number, number, number]

export const PLOT = { width: 44, depth: 26, center: [0, 0, 1] as V3 }

/** The hall: the main house, big and closed at first. Its scale before and after the extraction. */
export const HALL: V3 = [0, 0, 0]
export const HALL_BIG = 1.9
export const HALL_AFTER_EACH = [1.65, 1.4, 1.2, 1.0]
/** Where things leave the hall: its front door. */
export const HALL_DOOR: V3 = [0, 0.35, 1.1]

/** The belt loop around the hall: the automation ring. Clockwise from the south west corner. */
export const LOOP: V3[] = [
  [-3.2, 0, 2.3],
  [-3.2, 0, -2.3],
  [3.2, 0, -2.3],
  [3.2, 0, 2.3],
]
/** Where each task lands on the loop (as a fraction of its length), and how far it rides in stop 2. */
export const LOOP_LANDING = [0.62, 0.72, 0.82, 0.92]
export const LOOP_SWEEP = 0.12
/** The GitHub Actions station, north of the loop, and where its steps land. */
export const STATION: V3 = [4.4, 0, -3.3]
export const STEP_LANDING = [0.3, 0.36, 0.42, 0.48, 0.54, 0.58]

/** The main belt, west to east along the south of the plot. */
export const MAIN_Z = 4.6
export const MAIN: V3[] = [
  [-14, 0, MAIN_Z],
  [14, 0, MAIN_Z],
]
/** Along the main belt, as fractions of its length. */
export const MAIN_AT = { gate: 0.18, triage: 0.27, refine: 0.37, hall: 0.5, exit: 0.75, market: 0.85 }
export const GATEHOUSE: V3 = [-9.0, 0, MAIN_Z]
export const TRIAGE_HOUSE: V3 = [-6.4, 0, 3.0]
export const REFINE_HOUSE: V3 = [-3.6, 0, 3.0]
export const REQUESTER: V3 = [-3.6, 0, 6.0]
export const EXIT_GATE: V3 = [7.0, 0, MAIN_Z]
export const MARKET: V3 = [9.8, 0, 3.0]
/** The person a risky change is sent to: a booth south of the exit gate. */
export const BOOTH: V3 = [7.0, 0, 6.6]
export const TOWER: V3 = [9.4, 0, -3.8]
/** The coins burned by the hall, in a pile beside it. */
export const COINS: V3 = [3.0, 0, 0.2]

/** 10.4 before the router: belts everywhere, each with a station that woke on every cart. */
export const SPAGHETTI: V3[][] = [
  [[-14, 0, -3.5], [-6, 0, -1], [-1, 0, 6.5]],
  [[-12, 0, 7], [-4, 0, 1], [5, 0, -5]],
  [[-14, 0, 1.5], [2, 0, -4.5], [14, 0, -1]],
]
export const SPAGHETTI_STATIONS: V3[] = [
  [-6, 0, -1],
  [-4, 0, 1],
  [2, 0, -4.5],
]
