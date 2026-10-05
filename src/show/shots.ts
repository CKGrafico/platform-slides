/**
 * A fixed isometric camera for the whole show. Orthographic projection keeps
 * each assembly legible. Choreography moves the forms through the frame.
 */
import type { CameraShot, Vec3 } from '@/world/camera/shot'

/** Around the up axis, from the south (0 looks straight north): the diagonal. */
const AZIMUTH = Math.PI / 4
/** About 33 degrees above the horizontal plane. */
const ELEVATION = 0.58
/** Perspective fallback values. The live show uses orthographic projection. */
const WORLD_DISTANCE = 330
const WORLD_FOV = 18
/** Orthographic half-height, in world units. */
const WORLD_ORTHO = 27
const DIR: Vec3 = [Math.sin(AZIMUTH) * Math.cos(ELEVATION), Math.sin(ELEVATION), Math.cos(AZIMUTH) * Math.cos(ELEVATION)]

/** A shot at `target`, with the fixed projection and angle. */
function worldShot(target: Vec3, distance = WORLD_DISTANCE, fov = WORLD_FOV): CameraShot {
  return {
    position: [target[0] + DIR[0] * distance, target[1] + DIR[1] * distance, target[2] + DIR[2] * distance],
    target,
    fov,
    ortho: WORLD_ORTHO,
  }
}

/**
 * The frame of the talk. The target gives the shared screen plane its origin.
 */
export const MAP_SHOT = worldShot([13, 15, 4])

/**
 * World position of a point seen at `sx`, `sy` on the screen (in world units
 * from the centre of the frame, right and up) and at height `y`. The camera
 * never moves, so this places a body exactly where the audience will see it.
 */
export function screenToWorld(sx: number, sy: number, y: number): [number, number, number] {
  const t = MAP_SHOT.target
  const rx = Math.cos(AZIMUTH)
  const rz = -Math.sin(AZIMUTH)
  const ux = -Math.sin(ELEVATION) * Math.sin(AZIMUTH)
  const uy = Math.cos(ELEVATION)
  const uz = -Math.sin(ELEVATION) * Math.cos(AZIMUTH)
  const k = (y - t[1] - sy * uy) / DIR[1]
  return [t[0] + sx * rx + sy * ux + k * DIR[0], y, t[2] + sx * rz + sy * uz + k * DIR[2]]
}
