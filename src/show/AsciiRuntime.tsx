import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useEnvironment } from '@/engine/environment'
import { actorEntries, getActorObject } from '@/world/actors'
import { debugBus } from '@/debug/bus'
import { updateAnchors } from '@/art/anchor'
import { Matrix4, Points, ShaderMaterial, Vector3 } from 'three'
import type { FormUnit } from '@/art/forms'
import { CONNECTIONS, poseOf, type PathId, type Transfer } from './actors'
import { screenToWorld } from './shots'

const start = new Vector3()
const end = new Vector3()
const direction = new Vector3()
const up = new Vector3()
const normal = new Vector3()
const basis = new Matrix4()

/** The port is the center of an actual unit, including its idle offset. */
function unitPort(object: Points, time: number, idle: boolean, out: Vector3): FormUnit {
  const part = Number(object.userData.workPart)
  const unit = (object.userData.units as FormUnit[])[part]!
  const phase = part * 2.399 + Number(object.userData.formSeed) * 0.17
  const fluid = idle ? poseOf(object).fluid * 0.12 : 0
  out.set(unit.at[0] + Math.sin(time * 0.42 + phase) * fluid, unit.at[1] + Math.cos(time * 0.53 + phase) * fluid, unit.at[2] + Math.sin(time * 0.37 + phase) * fluid)
  object.updateWorldMatrix(true, false)
  out.applyMatrix4(object.matrixWorld)
  return unit
}

function smooth(a: number, b: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Keep marks legible as the projector size or renderer DPR changes. */
export function AsciiRuntime() {
  const { reducedMotion, viewport } = useEnvironment()
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    let cancelled = false
    const start = performance.now()
    void gl.compileAsync(scene, camera).then(() => {
      if (!cancelled) debugBus.warmup = { ms: Math.round(performance.now() - start), programs: gl.info.programs?.length ?? 0 }
    })
    return () => { cancelled = true }
  }, [gl, scene, camera])
  useFrame(({ camera: cam, size, clock }) => {
    const ratio = viewport.stage.height / viewport.height
    const time = reducedMotion ? 0 : clock.elapsedTime
    let index = 0
    for (const [id, object] of actorEntries()) {
      if (!(object instanceof Points) || !(object.material instanceof ShaderMaterial)) continue
      const pose = poseOf(object)
      const phase = index++ * 2.399
      const weight = 0.7 + pose.focus * 0.5
      const dx = reducedMotion ? 0 : Math.sin(time * 0.38 + phase) * 0.23 * weight
      const dy = reducedMotion ? 0 : Math.sin(time * 0.52 + phase) * 0.72 * weight
      object.position.set(...screenToWorld((pose.x + dx) * ratio, (pose.y + dy) * ratio, 5))
      object.scale.setScalar(pose.scale * ratio)
      object.rotation.set(
        reducedMotion ? 0 : Math.sin(time * 0.24 + phase) * 0.075 * weight,
        pose.turn + (reducedMotion ? 0 : Math.sin(time * 0.19 + phase) * 0.18 * weight),
        reducedMotion ? 0 : Math.sin(time * 0.28 + phase) * 0.045 * weight,
      )
      object.visible = pose.opacity > 0.005 && pose.scale > 0.001
      if (!object.visible && id !== 'packet') continue
      const depthSurface = object.userData.depthSurface as { visible: boolean } | undefined
      if (depthSurface) depthSurface.visible = pose.assemble > 0.98 && pose.opacity > 0.5
      const material = object.material
      material.uniforms.uPixelRatio!.value = gl.getPixelRatio()
      material.uniforms.uSize!.value = Number(material.userData.glyphSize) * viewport.stage.height / 1080 * (0.78 + pose.focus * 0.34)
      material.uniforms.uOpacity!.value = pose.opacity
      material.uniforms.uAssemble!.value = pose.assemble
      material.uniforms.uAccent!.value = pose.accent
      material.uniforms.uFluidity!.value = reducedMotion ? 0 : pose.fluid
      material.uniforms.uTime!.value = time
      material.uniforms.uIdle!.value = reducedMotion ? 0 : 1
      material.uniforms.uWorkPart!.value = object.userData.workPart
      material.uniforms.uWorkAccent!.value = pose.work
      material.uniforms.uExtract!.value = pose.cut
    }

    const packet = getActorObject('packet') as Points | undefined
    if (packet) {
      const transfer = packet.userData.transfer as Transfer
      const source = getActorObject(transfer.from) as Points | undefined
      const target = getActorObject(transfer.to) as Points | undefined
      if (source && target) {
        const p = Math.max(0, Math.min(1, transfer.progress))
        const origin = unitPort(source, time, !reducedMotion, start)
        const destination = unitPort(target, time, !reducedMotion, end)
        const same = source === target
        ;(source.material as ShaderMaterial).uniforms.uWorkAccent!.value = same ? 1 : 1 - smooth(0, 0.22, p)
        ;(target.material as ShaderMaterial).uniforms.uWorkAccent!.value = same ? 1 : smooth(0.78, 1, p)
        up.setFromMatrixColumn(cam.matrixWorld, 1)
        const arc = Math.sin(p * Math.PI) * Math.min(3.5, start.distanceTo(end) * 0.13)
        packet.position.lerpVectors(start, end, p).addScaledVector(up, arc)
        packet.quaternion.slerpQuaternions(source.quaternion, target.quaternion, p)
        const size = origin.size * poseOf(source).scale * (1 - p) + destination.size * poseOf(target).scale * p
        packet.scale.setScalar(size * ratio / 1.25)
        const opacity = same ? 0 : smooth(0.04, 0.18, p) * (1 - smooth(0.82, 0.96, p))
        const material = packet.material as ShaderMaterial
        material.uniforms.uOpacity!.value = opacity
        material.uniforms.uAccent!.value = 1
        material.uniforms.uAssemble!.value = 1
        material.uniforms.uWorkPart!.value = -1
        packet.visible = true
        packet.userData.depthSurface.visible = opacity > 0.05
      }
    }

    for (const [id, connection] of Object.entries(CONNECTIONS)) {
      const channel = getActorObject(id as PathId) as Points | undefined
      if (!channel?.visible) continue
      const source = getActorObject(connection.from) as Points
      const target = getActorObject(connection.to) as Points
      if (!source.visible || !target.visible) { channel.visible = false; continue }
      unitPort(source, time, !reducedMotion, start)
      unitPort(target, time, !reducedMotion, end)
      const distance = start.distanceTo(end)
      if (distance < 2) { channel.visible = false; continue }
      direction.subVectors(end, start).normalize()
      up.setFromMatrixColumn(cam.matrixWorld, 1).addScaledVector(direction, -up.dot(direction)).normalize()
      normal.crossVectors(direction, up).normalize()
      basis.makeBasis(direction, up, normal)
      channel.position.lerpVectors(start, end, 0.5)
      channel.quaternion.setFromRotationMatrix(basis)
      channel.scale.set(distance / 22, 0.6 * ratio, 0.6 * ratio)
      ;(channel.material as ShaderMaterial).uniforms.uBend!.value = connection.bend
      channel.userData.depthSurface.visible = false
    }
    updateAnchors(cam, size.width, size.height, gl.getPixelRatio())
  })
  return null
}
