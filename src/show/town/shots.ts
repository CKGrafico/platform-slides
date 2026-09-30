/**
 * The camera of the town: the view of a strategy game. It looks from the
 * south west, high, with a narrow field of view from far away, so the picture
 * is almost orthographic. It never turns: every shot is a pan or a zoom.
 */
import type { CameraShot, Vec3 } from '@/world/camera/shot'

/** Around the up axis, from the south (0 looks straight north). */
const AZIMUTH = 0.55
/** Above the ground. */
const ELEVATION = 0.74
const DIR: Vec3 = [Math.sin(AZIMUTH) * Math.cos(ELEVATION), Math.sin(ELEVATION), Math.cos(AZIMUTH) * Math.cos(ELEVATION)]

export function townShot(target: Vec3, distance: number, fov = 26): CameraShot {
  return {
    position: [target[0] + DIR[0] * distance, target[1] + DIR[1] * distance, target[2] + DIR[2] * distance],
    target,
    fov,
  }
}
