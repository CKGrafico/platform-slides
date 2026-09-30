/**
 * The map view of the second half of the talk (docs/art/clarity-review.md).
 *
 * From the pillars on, the system is read like a map: the camera keeps one
 * direction and one height above the disc, and only pans and zooms. So the
 * viewer builds the map once, and every element stays where it was.
 *
 * mapShot(target, distance) is the only way to make a shot in that half.
 */
import type { CameraShot, Vec3 } from '@/world/camera/shot'

/** Elevation of the map camera over the disc, in radians (about 55 degrees). */
export const MAP_ELEVATION = 0.96
/** From the target to the camera: always from the front, high. */
const DIR: Vec3 = [0, Math.sin(MAP_ELEVATION), Math.cos(MAP_ELEVATION)]

export function mapShot(target: Vec3, distance: number, fov = 34): CameraShot {
  return {
    position: [target[0] + DIR[0] * distance, target[1] + DIR[1] * distance, target[2] + DIR[2] * distance],
    target,
    fov,
  }
}

/** The whole system, on its disc. */
export const MAP_WHOLE = mapShot([0, -0.9, 0.6], 17)
