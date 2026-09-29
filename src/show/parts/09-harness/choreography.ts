/**
 * Part 9 moves. Three improvised runs, the frame that closes around the core,
 * the cloud of paths that becomes one orbit, the commands that bounce off, and
 * the copy of the frame that flies to the laptop.
 */
import { Vector3, type Group } from 'three'
import { artOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { arcPoint, easeInOut, orbitOf, orbitPoint } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { CLEAN_ORBIT, CLOUD_PATHS, COMMANDS_FROM, HARNESS_RADIUS, IMPROVISE_PATHS, LAPTOP_POS } from '../../layout'
import { B, grid } from '.'

const KEY = '09-harness/harness'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

const RUN_BEATS = [2.4, 3.4, 2.9]
const runAt = (k: number) => B.improvise + 0.5 + k * 0.35
const cmdAt = (i: number) => B.commands + 0.25 + i * 0.5

export const harnessMoves = defineChoreography('09-harness', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- 9.1: every repo improvises ------------------------------------------------------------
  const balls = [0, 1, 2].map((k) => el(`p6.ball.${k}`))
  const runs = [0, 1, 2].map((k) => sketchOf(cast.get<Group>(`p9.path.${k}`)))
  balls.forEach((ball, k) => {
    const a = span(runAt(k), runAt(k) + 0.4)
    inkIn(tl, ball, a.start, a.duration)
    // Balls 1 and 2 leave with the paths; ball 0 stays to ride the clean orbit.
    if (k > 0) {
      const out = span(B.frame, B.frame + 0.6)
      inkOut(tl, ball, out.start, out.duration)
    }
  })
  const quiet = span(B.frame, B.frame + 1.2)
  runs.forEach((r) => fade(tl, r.material, 0, quiet.start, quiet.duration))

  // ---- 9.2: the frame closes around the core ---------------------------------------------------
  const frameObj = cast.get<Group>('harness')
  const frame = segmentsOf(frameObj)
  const close = span(B.frame + 0.5, B.frame + 2.25)
  fade(tl, frame.material, 0.9, close.start, close.duration * 0.6)
  tl.fromTo(frameObj.scale, { x: 2.3, y: 2.3, z: 2.3 }, { x: 1, y: 1, z: 1, duration: close.duration, ease: 'power3.out', immediateRender: false }, close.start)

  // ---- 9.3: a cloud of paths, then one nearly clean orbit ---------------------------------------
  const cloud = CLOUD_PATHS.map((_, i) => sketchOf(cast.get<Group>(`p9.cloud.${i}`)))
  cloud.forEach((c, i) => {
    const draw = span(B.cloud + 0.4 + i * 0.2, B.cloud + 1.9 + i * 0.2)
    tl.to(c.reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
    const back = span(B.clean + 0.5, B.clean + 1.75)
    tl.to(c.reveal, { value: 0, duration: back.duration, ease: 'power2.in' }, back.start)
  })
  const tighten = span(B.clean, B.clean + 1.5)
  tl.to(frameObj.scale, { x: 0.9, y: 0.9, z: 0.9, duration: tighten.duration, ease: 'power3.inOut' }, tighten.start)
  const orbit = orbitOf(cast.get<Group>('p9.orbit'))
  const orbitIn = span(B.clean + 1.25, B.clean + 3)
  tl.to(orbit.reveal, { value: 1, duration: orbitIn.duration, ease: 'power2.inOut' }, orbitIn.start)

  // One writer for the balls of 9.1 and the ride on the clean orbit.
  const paths = IMPROVISE_PATHS.map((_, k) => runs[k]!)
  const tmp = new Vector3()
  const orbitTmp = new Vector3()
  const all = span(B.improvise, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = B.improvise + u * (grid.totalBeats - B.improvise)
    balls.forEach((ball, k) => {
      const w = easeInOut(win(beat, runAt(k), runAt(k) + RUN_BEATS[k]!))
      paths[k]!.reveal.value = w
      paths[k]!.point(w, tmp)
      if (k === 0 && beat >= B.clean + 1.25) {
        // The same work, now on one nearly clean orbit, again and again.
        const ride = win(beat, B.clean + 1.25, grid.totalBeats)
        const onto = easeInOut(win(beat, B.clean + 1.25, B.clean + 2.75))
        orbitPoint(CLEAN_ORBIT, 0.6 + ride * Math.PI * 2.2, tmp.set(0, 0, 0))
        paths[0]!.point(1, orbitTmp)
        tmp.lerpVectors(orbitTmp, tmp, onto)
      }
      ball.object.position.copy(tmp)
    })
  })

  // ---- 9.4: unsafe commands fly at the frame and bounce off -------------------------------------
  const cmds = COMMANDS_FROM.map((_, i) => el(`cmd.${i}`))
  cmds.forEach((c, i) => {
    const a = span(cmdAt(i), cmdAt(i) + 0.4)
    inkIn(tl, c, a.start, a.duration)
    const out = span(cmdAt(i) + 2.3, cmdAt(i) + 2.7)
    inkOut(tl, c, out.start, out.duration)
    // The frame gives a little where each one hits.
    const hit = span(cmdAt(i) + 1, cmdAt(i) + 1.2)
    const back = span(cmdAt(i) + 1.2, cmdAt(i) + 1.8)
    tl.to(frameObj.scale, { x: 0.95, y: 0.95, z: 0.95, duration: hit.duration, ease: 'power2.out' }, hit.start)
    tl.to(frameObj.scale, { x: 0.9, y: 0.9, z: 0.9, duration: back.duration, ease: 'power2.inOut' }, back.start)
  })
  const from = COMMANDS_FROM.map(v3)
  const impact = from.map((p) => p.clone().normalize().multiplyScalar(HARNESS_RADIUS * 0.95))
  const away = from.map((p, i) => p.clone().add(new Vector3(0.8, i === 1 ? 1.4 : -1.2, -1.2)))
  const cmdWin = span(B.commands, B.laptop)
  drive(tl, cmdWin.start, cmdWin.duration, (u) => {
    const beat = B.commands + u * (B.laptop - B.commands)
    cmds.forEach((c, i) => {
      const w = win(beat, cmdAt(i), cmdAt(i) + 2.7)
      if (w < 0.4) {
        // In, fast, straight at the frame.
        tmp.lerpVectors(from[i]!, impact[i]!, Math.pow(w / 0.4, 1.6))
      } else {
        // Bounced away on an arc.
        arcPoint(impact[i]!, away[i]!, 0.6, 1 - Math.pow(1 - (w - 0.4) / 0.6, 2.4), tmp)
      }
      c.object.position.copy(tmp)
    })
  })

  // ---- 9.5: a copy of the frame flies to the laptop ---------------------------------------------
  const plate = el('laptop')
  const plateIn = span(B.laptop + 0.5, B.laptop + 1.25)
  inkIn(tl, plate, plateIn.start, plateIn.duration)
  const small = el('core.laptop')
  const smallIn = span(B.laptop + 1, B.laptop + 1.75)
  inkIn(tl, small, smallIn.start, smallIn.duration)
  const copyObj = cast.get<Group>('harness.laptop')
  const copy = segmentsOf(copyObj)
  const copyIn = span(B.laptop + 0.25, B.laptop + 0.75)
  fade(tl, copy.material, 0.9, copyIn.start, copyIn.duration)
  const home = new Vector3(LAPTOP_POS[0], LAPTOP_POS[1] + 0.55, LAPTOP_POS[2])
  const fly = span(B.laptop + 0.25, B.laptop + 2.5)
  const start = new Vector3(0, 0, 0)
  drive(tl, fly.start, fly.duration, (u) => {
    const w = easeInOut(u)
    arcPoint(start, home, 1.4, w, tmp)
    copyObj.position.copy(tmp)
    // From the size of the big frame to the size of the laptop's.
    copyObj.scale.setScalar(((HARNESS_RADIUS * 0.9) / 0.48) * (1 - w) + w)
  })
})
