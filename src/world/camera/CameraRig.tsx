import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { noise1 } from '@/animation/progress'
import { usePresentation } from '@/engine/context'
import { debugBus } from '@/debug/bus'
import { createCameraTrack } from './cameraTrack'

const target = new Vector3()

/**
 * Places the single world camera from the camera track every frame.
 * The shot depends on the playhead only. Shake adds clock-based noise,
 * which is ambient: it never changes the composition.
 */
export function CameraRig() {
  const p = usePresentation()
  const camera = useThree((s) => s.camera)
  const track = useMemo(() => createCameraTrack(p.model), [p.model])

  useFrame(({ clock }) => {
    if (!(camera instanceof PerspectiveCamera)) return
    const shot = track.shotAt(p.position)
    camera.position.set(shot.position[0], shot.position[1], shot.position[2])
    if (shot.shake > 0) {
      const t = clock.elapsedTime * 6
      camera.position.x += noise1(t) * shot.shake * 0.08
      camera.position.y += noise1(t + 31.7) * shot.shake * 0.08
    }
    target.set(shot.target[0], shot.target[1], shot.target[2])
    camera.lookAt(target)
    if (shot.roll !== 0) camera.rotateZ(shot.roll)
    if (camera.fov !== shot.fov) {
      camera.fov = shot.fov
      camera.updateProjectionMatrix()
    }
    debugBus.camera.x = camera.position.x
    debugBus.camera.y = camera.position.y
    debugBus.camera.z = camera.position.z
    debugBus.camera.fov = camera.fov
  })

  return null
}
