/**
 * A camera shot is plain data. The rig blends between shots by progress,
 * so a shot never holds state and the same progress gives the same frame.
 */
export type Vec3 = readonly [number, number, number]

export interface CameraShot {
  position: Vec3
  target: Vec3
  /** Vertical field of view in degrees. Default 45. Used by a perspective camera. */
  fov?: number
  /** Orthographic half-height in world units. Used by the orthographic camera. Default 62. */
  ortho?: number
  /** Rotation around the view axis in radians. Default 0. */
  roll?: number
  /** Shake strength, 0..1. Default 0. The rig adds deterministic noise. */
  shake?: number
}

export const DEFAULT_SHOT: Required<CameraShot> = {
  position: [0, 0, 8],
  target: [0, 0, 0],
  fov: 45,
  ortho: 62,
  roll: 0,
  shake: 0,
}

export function fullShot(shot: CameraShot): Required<CameraShot> {
  return { ...DEFAULT_SHOT, ...shot }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]

export function blendShots(a: CameraShot, b: CameraShot, t: number): Required<CameraShot> {
  const A = fullShot(a)
  const B = fullShot(b)
  return {
    position: lerp3(A.position, B.position, t),
    target: lerp3(A.target, B.target, t),
    fov: lerp(A.fov, B.fov, t),
    ortho: lerp(A.ortho, B.ortho, t),
    roll: lerp(A.roll, B.roll, t),
    shake: lerp(A.shake, B.shake, t),
  }
}

// ---- shot helpers: pure functions from progress to a shot -----------------

/** Moves the camera along its view line. amount > 0 moves closer. */
export function dolly(shot: CameraShot, amount: number): Required<CameraShot> {
  const s = fullShot(shot)
  const d: Vec3 = [s.target[0] - s.position[0], s.target[1] - s.position[1], s.target[2] - s.position[2]]
  const len = Math.hypot(d[0], d[1], d[2]) || 1
  const k = amount / len
  return { ...s, position: [s.position[0] + d[0] * k, s.position[1] + d[1] * k, s.position[2] + d[2] * k] }
}

/** Rotates the camera around the target on the Y axis by angle radians. */
export function orbit(shot: CameraShot, angle: number, elevation = 0): Required<CameraShot> {
  const s = fullShot(shot)
  const dx = s.position[0] - s.target[0]
  const dy = s.position[1] - s.target[1]
  const dz = s.position[2] - s.target[2]
  const radius = Math.hypot(dx, dz)
  const base = Math.atan2(dx, dz)
  return {
    ...s,
    position: [
      s.target[0] + Math.sin(base + angle) * radius,
      s.target[1] + dy + elevation,
      s.target[2] + Math.cos(base + angle) * radius,
    ],
  }
}

// ---- camera moves inside a scene ------------------------------------------

/**
 * One camera move inside a scene: from the previous shot to `shot`, over the
 * window [from, to] of local progress. `arc` pulls the camera back by that many
 * units in the middle of the move, so long moves pull back, pan, and push in.
 */
export interface ShotMove {
  from: number
  to: number
  shot: CameraShot
  arc?: number
}

const ease = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/**
 * The camera of a scene as a list of moves, starting where the previous scene
 * left it. The camera holds between moves (dwell, then travel). Pure: the same
 * local progress always gives the same shot.
 *
 *   camera: (local, from) => shotSequence(from, [{ from: 0, to: b(4), shot: WIDE }], local)
 */
export function shotSequence(start: CameraShot, moves: ShotMove[], local: number): Required<CameraShot> {
  let current = fullShot(start)
  for (const m of moves) {
    if (local <= m.from) return current
    if (local < m.to) {
      const t = ease((local - m.from) / Math.max(m.to - m.from, 1e-6))
      const next = blendShots(current, m.shot, t)
      return m.arc ? dolly(next, -m.arc * Math.sin(Math.PI * t)) : next
    }
    current = fullShot(m.shot)
  }
  return current
}
