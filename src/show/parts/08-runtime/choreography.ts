/**
 * Part 8 moves. The shell lights up piece by piece and threat detection comes
 * off; the banner of OpenCode rises on the hall's turret; the direct call to
 * a vendor breaks, and Forge and its kilns take its place.
 */
import { Vector3, type Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { SHELL } from '../../actors'
import { HALL_BIG, KILNS, LOCK_DOCK } from '../../layout'
import { SHELL_DIRS, SHELL_RADIUS } from '../05-actions-to-agents'
import { B, grid, pulseAt } from '.'

const KEY = '08-runtime/stack'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) => {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export const runtimeMoves = defineChoreography('08-runtime', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // The person at the exit leaves the stage.
  const clear = span(0.25, 1.75)
  inkOut(tl, el('reviewer'), clear.start, clear.duration * 0.6)

  // 8.1: each piece of the shell lights up in turn (a small pulse).
  SHELL.forEach((name, i) => {
    if (name === 'ours') return
    const s = el(`shell.${name}`)
    const up = span(pulseAt(i), pulseAt(i) + 0.3)
    const down = span(pulseAt(i) + 0.3, pulseAt(i) + 0.8)
    tl.to(s.object.scale, { x: 1.45, y: 1.45, z: 1.45, duration: up.duration, ease: 'power2.out' }, up.start)
    tl.to(s.object.scale, { x: 1, y: 1, z: 1, duration: down.duration, ease: 'power2.inOut' }, down.start)
  })

  // Threat detection comes off the shell, drifts away, and fades.
  const threat = el('shell.threat')
  const i = SHELL.indexOf('threat')
  const d = SHELL_DIRS[i]!
  const dir = new Vector3(d[0], d[1], d[2]).normalize()
  const hub = new Vector3(LOCK_DOCK[0] * HALL_BIG, LOCK_DOCK[1] * HALL_BIG + 0.22, LOCK_DOCK[2] * HALL_BIG)
  const off = span(B.threat + 0.5, B.threat + 3.5)
  const tmp = new Vector3()
  drive(tl, off.start, off.duration, (u) => {
    const w = easeInOut(u)
    tmp.copy(dir).multiplyScalar(SHELL_RADIUS + 1.4 * w).add(hub)
    tmp.y -= 0.6 * w * w
    threat.object.position.copy(tmp)
  })
  const gone = span(B.threat + 3, B.threat + 3.6)
  inkOut(tl, threat, gone.start, gone.duration)

  // 8.2: the banner of OpenCode rises on the turret.
  const banner = el('banner')
  const bannerIn = span(B.opencode + 0.5, B.opencode + 1.5)
  inkIn(tl, banner, bannerIn.start, bannerIn.duration)

  // 8.3: the direct call to a vendor is drawn, then breaks in two and fades.
  const halves = [0, 1].map((h) => cast.get<Group>(`p8.direct.${h}`))
  halves.forEach((h, k) => {
    const line = sketchOf(h)
    const call = span(B.forge + 0.25 + k * 0.35, B.forge + 0.7 + k * 0.35)
    tl.to(line.reveal, { value: 1, duration: call.duration, ease: 'none' }, call.start)
    const breakAt = span(B.forge + 1.5, B.forge + 2.75)
    tl.to(h.position, { x: k === 0 ? -0.2 : 0.35, y: k === 0 ? 0.1 : 0.4, z: k === 0 ? 0.3 : -0.3, duration: breakAt.duration, ease: 'power2.out' }, breakAt.start)
    tl.to(h.rotation, { y: k === 0 ? -0.08 : 0.1, duration: breakAt.duration, ease: 'power2.out' }, breakAt.start)
    fade(tl, line.material, 0, breakAt.start + breakAt.duration * 0.35, breakAt.duration * 0.65)
  })
  // Forge takes its place: every call goes through it to one of the kilns.
  const forge = el('forge')
  const forgeIn = span(B.forge + 1.25, B.forge + 2)
  inkIn(tl, forge, forgeIn.start, forgeIn.duration)
  const toForge = sketchOf(cast.get<Group>('p8.forge'))
  const link = span(B.forge + 1.75, B.forge + 2.35)
  tl.to(toForge.reveal, { value: 1, duration: link.duration, ease: 'power2.out' }, link.start)
  KILNS.forEach((_, k) => {
    const m = el(`kiln.${k}`)
    const a = span(B.forge + 2.25 + k * 0.3, B.forge + 3 + k * 0.3)
    inkIn(tl, m, a.start, a.duration)
    const line = sketchOf(cast.get<Group>(`p8.model.${k}`))
    const l = span(B.forge + 2.5 + k * 0.3, B.forge + 3.2 + k * 0.3)
    tl.to(line.reveal, { value: 1, duration: l.duration, ease: 'power2.out' }, l.start)
  })
})
