/**
 * The camera of the talk: the view of a strategy game, and one frame for the
 * whole show. It looks from the south east, along the diagonal of the land,
 * from far away with a narrow field of view, so buildings show two faces and
 * the picture is almost orthographic. It never turns, never zooms and never
 * pans: the whole town, out to its fifth wall, is in the frame from the cover
 * to the closing, and the map, the signs, the pennants and the names tell the
 * story.
 */
import type { CameraShot, Vec3 } from '@/world/camera/shot'

/** Around the up axis, from the south (0 looks straight north): the diagonal. */
const AZIMUTH = Math.PI / 4
/** Above the ground: about 33 degrees, like the games. */
const ELEVATION = 0.58
/** The one zoom: far enough for the fifth wall (layout.ts) with a margin all round. The frame is about 185 units wide at the target. */
export const TOWN_DISTANCE = 330
export const TOWN_FOV = 18
/** The orthographic half-height, in world units: it fits the whole city and its walls. */
export const TOWN_ORTHO = 27
const DIR: Vec3 = [Math.sin(AZIMUTH) * Math.cos(ELEVATION), Math.sin(ELEVATION), Math.cos(AZIMUTH) * Math.cos(ELEVATION)]

/** A shot of the map at `target`, at the one distance and field of view. */
export function townShot(target: Vec3, distance = TOWN_DISTANCE, fov = TOWN_FOV): CameraShot {
  return {
    position: [target[0] + DIR[0] * distance, target[1] + DIR[1] * distance, target[2] + DIR[2] * distance],
    target,
    fov,
    ortho: TOWN_ORTHO,
  }
}

/**
 * The one frame of the talk. The target sits a little south east of the hall:
 * the near side of the land is closer to the camera and looks bigger, so this
 * keeps the fifth wall off the bottom edge and the rings in the middle of the
 * screen.
 */
export const MAP_SHOT = townShot([13, 15, 4])
