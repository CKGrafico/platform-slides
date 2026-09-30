/**
 * The camera of the talk: the view of a strategy game. One angle and one zoom
 * for the whole map: it looks from the south east, along the diagonal of the
 * land, from far away with a narrow field of view, so buildings show two faces
 * and the picture is almost orthographic. It never turns and never zooms:
 * every shot is a pan across the land, like scrolling the map. The one
 * exception is the closing, which pulls back to show the whole town.
 */
import type { CameraShot, Vec3 } from '@/world/camera/shot'

/** Around the up axis, from the south (0 looks straight north): the diagonal. */
const AZIMUTH = Math.PI / 4
/** Above the ground: about 33 degrees, like the games. */
const ELEVATION = 0.58
/** The one zoom of the map. The frame is about 27 units wide at the target. */
export const TOWN_DISTANCE = 50
export const TOWN_FOV = 18
const DIR: Vec3 = [Math.sin(AZIMUTH) * Math.cos(ELEVATION), Math.sin(ELEVATION), Math.cos(AZIMUTH) * Math.cos(ELEVATION)]

/** A pan of the map to `target`. The distance and the field of view are the same for every shot, so the camera only slides. */
export function townShot(target: Vec3, distance = TOWN_DISTANCE, fov = TOWN_FOV): CameraShot {
  return {
    position: [target[0] + DIR[0] * distance, target[1] + DIR[1] * distance, target[2] + DIR[2] * distance],
    target,
    fov,
  }
}
