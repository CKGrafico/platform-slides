/**
 * Turns scene camera definitions into one continuous camera path over the show.
 *
 * - A scene with a function camera owns the shot: shot = fn(local).
 * - A scene with a static shot blends from the previous scene's end shot to its own.
 * - A scene without a camera keeps the previous end shot.
 */
import { smoothstep } from '@/animation/progress'
import { resolve, type ShowModel } from '@/engine/show-model'
import { blendShots, DEFAULT_SHOT, fullShot, type CameraShot } from './shot'

export interface CameraTrack {
  shotAt(position: number): Required<CameraShot>
}

export function createCameraTrack(model: ShowModel): CameraTrack {
  const endShots: Required<CameraShot>[] = []
  model.scenes.forEach((scene, i) => {
    const cam = scene.def.camera
    const previous = i === 0 ? DEFAULT_SHOT : endShots[i - 1]!
    endShots.push(!cam ? previous : typeof cam === 'function' ? fullShot(cam(1, previous)) : fullShot(cam))
  })

  return {
    shotAt(position) {
      const { sceneIndex, local } = resolve(model, position)
      const cam = model.scenes[sceneIndex]!.def.camera
      const start = sceneIndex === 0 ? DEFAULT_SHOT : endShots[sceneIndex - 1]!
      if (!cam) return start
      if (typeof cam === 'function') return fullShot(cam(local, start))
      return blendShots(start, cam, smoothstep(local))
    },
  }
}
