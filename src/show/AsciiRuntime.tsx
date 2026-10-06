import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useEnvironment } from '@/engine/environment'
import { actorEntries, getActorObject } from '@/world/actors'
import { debugBus } from '@/debug/bus'
import { updateAnchors } from '@/art/anchor'
import { Matrix4, Points, ShaderMaterial, Vector3 } from 'three'
import type { FormUnit } from '@/art/forms'
import { CONNECTIONS, poseOf, type Connection, type PathId, type Transfer } from './actors'
import { screenToWorld } from './shots'

/**
 * Ambient motion per class of body. Rates are radians per second, so the periods are 9 to 37 s.
 * Amplitudes are in pose units (yaw, pitch and roll in radians). Fluid bodies breathe a little.
 * Rigid banks and walls keep their internal alignment and only drift as one piece.
 */
const CALM_OFF = { dx: 0, dy: 0, dxRate: 0, dyRate: 0, pitch: 0, yaw: 0, roll: 0, pitchRate: 0, yawRate: 0, rollRate: 0, breath: 0 }
const CALM = {
  fluid: { dx: 0.25, dy: 0.6, dxRate: 0.48, dyRate: 0.7, pitch: 0.06, yaw: 0.12, roll: 0.03, pitchRate: 0.3, yawRate: 0.22, rollRate: 0.37, breath: 0.015 },
  rigid: { dx: 0.15, dy: 0.45, dxRate: 0.39, dyRate: 0.5, pitch: 0.03, yaw: 0.05, roll: 0.02, pitchRate: 0.25, yawRate: 0.2, rollRate: 0.33, breath: 0 },
  heavy: { dx: 0.1, dy: 0.3, dxRate: 0.33, dyRate: 0.42, pitch: 0.02, yaw: 0.035, roll: 0, pitchRate: 0.22, yawRate: 0.17, rollRate: 0, breath: 0 },
}

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
  const builds = (object.userData.morphCenters as number[][][] | undefined) ?? []
  const weights = [poseOf(object).morph, poseOf(object).morph2]
  const at = [0, 1, 2].map((k) => builds.reduce((sum, build, b) => sum + (build[part]![k]! - unit.at[k]!) * weights[b]!, unit.at[k]!))
  const phase = part * 2.399 + Number(object.userData.formSeed) * 0.17
  // The same drift and breathing as UNIT_MOTION in src/art/ascii.ts, so a port stays on its unit.
  const drift = idle ? poseOf(object).fluid * Number(object.userData.drift ?? 0.12) : 0
  const length = Math.hypot(unit.at[0], unit.at[1], unit.at[2]) || 1
  const radial = Math.sin(time * 0.45 + phase * 1.7) * 1.2 / length
  out.set(
    at[0]! + (Math.sin(time * 0.42 + phase) + unit.at[0] * radial) * drift,
    at[1]! + (Math.cos(time * 0.53 + phase) + unit.at[1] * radial) * drift,
    at[2]! + (Math.sin(time * 0.37 + phase) + unit.at[2] * radial) * drift,
  )
  object.updateWorldMatrix(true, false)
  out.applyMatrix4(object.matrixWorld)
  return unit
}

const center = new Vector3()
const forward = new Vector3()
const along = new Vector3()
const lift = new Vector3()

/** The middle of a body on screen: the mean of its unit centers, in world space. */
function bodyCenter(object: Points, out: Vector3) {
  const units = object.userData.units as FormUnit[]
  out.set(0, 0, 0)
  for (const unit of units) out.add(center.set(...unit.at))
  object.updateWorldMatrix(true, false)
  return out.multiplyScalar(1 / units.length).applyMatrix4(object.matrixWorld)
}

/** How far a body reaches from its middle along `along`, counting each unit as a sphere. */
function bodyReach(object: Points, middle: Vector3, along: Vector3) {
  const units = object.userData.units as FormUnit[]
  const scale = object.scale.x
  let reach = 0
  for (const unit of units) {
    center.set(...unit.at).applyMatrix4(object.matrixWorld).sub(middle)
    reach = Math.max(reach, center.dot(along) + unit.size * 0.95 * scale)
  }
  return reach
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
      const phase = index * 2.399
      // Each body has its own period, so no two bodies move in step.
      const jitter = 1 + 0.12 * (((index++ * 7) % 5) - 2) / 2
      const weight = 0.7 + pose.focus * 0.5
      const fluid = pose.fluid > 0.5
      const heavy = id === 'wall' || id === 'gate' || id === 'review'
      const motion = reducedMotion ? CALM_OFF : fluid ? CALM.fluid : heavy ? CALM.heavy : CALM.rigid
      const t = time * jitter
      const dx = Math.sin(t * motion.dxRate + phase) * motion.dx * weight
      const dy = Math.sin(t * motion.dyRate + phase) * motion.dy * weight
      const breath = 1 + Math.sin(t * 0.9 + phase) * motion.breath
      object.position.set(...screenToWorld((pose.x + dx) * ratio, (pose.y + dy) * ratio, 5))
      object.scale.setScalar(pose.scale * ratio * breath)
      object.rotation.set(
        Math.sin(t * motion.pitchRate + phase) * motion.pitch * weight,
        pose.turn + Math.sin(t * motion.yawRate + phase) * motion.yaw * weight,
        Math.sin(t * motion.rollRate + phase) * motion.roll * weight,
      )
      object.visible = pose.opacity > 0.005 && pose.scale > 0.001
      if (!object.visible && id !== 'packet') continue
      const depthSurface = object.userData.depthSurface as { visible: boolean } | undefined
      if (depthSurface) depthSurface.visible = pose.assemble > 0.98 && pose.opacity > 0.2
      const material = object.material
      material.uniforms.uPixelRatio!.value = gl.getPixelRatio()
      // Large bodies get larger marks, so they read as surfaces. Small bodies read as fine dust.
      const bulk = Math.min(1.3, Math.max(0.7, 0.55 + 0.45 * pose.scale))
      material.uniforms.uSize!.value = Number(material.userData.glyphSize) * viewport.stage.height / 1080 * (0.78 + pose.focus * 0.34) * bulk
      material.uniforms.uOpacity!.value = pose.opacity
      material.uniforms.uAssemble!.value = pose.assemble
      material.uniforms.uAccent!.value = pose.accent
      material.uniforms.uFluidity!.value = reducedMotion ? 0 : pose.fluid
      material.uniforms.uTime!.value = time
      material.uniforms.uIdle!.value = reducedMotion ? 0 : 1
      material.uniforms.uWorkPart!.value = object.userData.workPart
      material.uniforms.uWorkAccent!.value = pose.work
      material.uniforms.uExtract!.value = pose.cut
      material.uniforms.uMorph!.value = pose.morph
      material.uniforms.uMorph2!.value = pose.morph2
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
        const arc = Math.sin(p * Math.PI) * Math.min(6, start.distanceTo(end) * 0.11)
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
        const packetDepth = packet.userData.depthSurface as { visible: boolean } | undefined
        if (packetDepth) packetDepth.visible = opacity > 0.05
      }
    }

    for (const [id, connection] of Object.entries(CONNECTIONS) as [PathId, Connection][]) {
      const channel = getActorObject(id) as Points | undefined
      if (!channel?.visible) continue
      const source = getActorObject(connection.from) as Points
      const target = getActorObject(connection.to) as Points
      if (!source.visible || !target.visible) { channel.visible = false; continue }
      if (connection.over) {
        // A return over a row: it leaves the top of one body and lands on the top of the other, with a small gap.
        bodyCenter(source, start)
        bodyCenter(target, end)
        lift.setFromMatrixColumn(cam.matrixWorld, 1).normalize()
        const gap = 0.5 * ratio
        start.addScaledVector(lift, bodyReach(source, start, lift) + gap)
        end.addScaledVector(lift, bodyReach(target, end, lift) + gap)
      } else if (connection.edge) {
        // An edge link leaves the near edge of one body and enters the near edge of the next, with a small gap at each end.
        // The edge is measured on the screen plane, so the gap looks the same whatever the depth between the two bodies.
        bodyCenter(source, start)
        bodyCenter(target, end)
        direction.subVectors(end, start).normalize()
        cam.getWorldDirection(forward)
        along.copy(direction).addScaledVector(forward, -direction.dot(forward)).normalize()
        const slope = Math.max(0.2, direction.dot(along))
        const gap = 0.5 * ratio
        start.addScaledVector(direction, (bodyReach(source, start, along) + gap) / slope)
        along.negate()
        end.addScaledVector(direction, -(bodyReach(target, end, along) + gap) / slope)
      } else {
        unitPort(source, time, !reducedMotion, start)
        unitPort(target, time, !reducedMotion, end)
      }
      const distance = start.distanceTo(end)
      if (distance < 2) { channel.visible = false; continue }
      direction.subVectors(end, start).normalize()
      up.setFromMatrixColumn(cam.matrixWorld, 1).addScaledVector(direction, -up.dot(direction)).normalize()
      normal.crossVectors(direction, up).normalize()
      basis.makeBasis(direction, up, normal)
      channel.position.lerpVectors(start, end, 0.5)
      channel.quaternion.setFromRotationMatrix(basis)
      const thickness = (connection.edge ? 0.4 : 0.85) * ratio
      channel.scale.set(distance / 22, thickness, thickness)
      const uniforms = (channel.material as ShaderMaterial).uniforms
      // A thin link is scaled across by its thickness, so its arc is given in stage units and undone here.
      uniforms.uBend!.value = connection.edge ? (connection.bend * ratio) / thickness : connection.bend * 0.7
      // Undo the length scale on each bead, so beads keep their shape on long and short channels.
      uniforms.uStretch!.value = distance / 22 / thickness
    }
    updateAnchors(cam, size.width, size.height, gl.getPixelRatio())
  })
  return null
}
