/**
 * Part 8 moves. The shell lights up piece by piece and threat detection comes
 * off; the OpenCode ring closes around the core; Forge replaces the direct call
 * to a vendor; the runner plate goes under the stack.
 */
import { Vector3, type Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { defineChoreography } from '@/world/actors'
import { SHELL } from '../../actors'
import { LOCK_DOCK, MODELS, PILE, SHELL_DIRS, SHELL_RADIUS } from '../../layout'
import { B, grid } from '.'

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

  // The old problem leaves the stage: the pile of work, the person, the three runs.
  const clear = span(0.25, 1.75)
  PILE.forEach((_, k) => inkOut(tl, el(`p6.ball.${k}`), clear.start + k * b(0.08), b(0.5)))
  inkOut(tl, el('person.exit'), clear.start, clear.duration * 0.6)
  for (let k = 0; k < 3; k++) fade(tl, sketchOf(cast.get<Group>(`p6.path.${k}`)).material, 0, clear.start, clear.duration)

  // 8.1: each piece of the shell lights up in turn (a small pulse).
  SHELL.forEach((name, i) => {
    if (name === 'ours') return
    const s = el(`shell.${name}`)
    const up = span(1.5 + i * 0.35, 1.85 + i * 0.35)
    const down = span(1.85 + i * 0.35, 2.4 + i * 0.35)
    tl.to(s.object.scale, { x: 1.45, y: 1.45, z: 1.45, duration: up.duration, ease: 'power2.out' }, up.start)
    tl.to(s.object.scale, { x: 1, y: 1, z: 1, duration: down.duration, ease: 'power2.inOut' }, down.start)
  })

  // Threat detection comes off the shell, drifts away, and fades.
  const threat = el('shell.threat')
  const i = SHELL.indexOf('threat')
  const d = SHELL_DIRS[i]!
  const dir = new Vector3(d[0], d[1], d[2]).normalize()
  const dock = new Vector3(LOCK_DOCK[0], LOCK_DOCK[1], LOCK_DOCK[2])
  const off = span(B.threat + 0.5, B.threat + 3.5)
  const tmp = new Vector3()
  drive(tl, off.start, off.duration, (u) => {
    const w = easeInOut(u)
    tmp.copy(dir).multiplyScalar(SHELL_RADIUS + 1.2 * w).add(dock)
    tmp.y -= 0.5 * w * w
    threat.object.position.copy(tmp)
  })
  const gone = span(B.threat + 3, B.threat + 3.6)
  inkOut(tl, threat, gone.start, gone.duration)

  // 8.2: the OpenCode ring closes around the core.
  const opencode = el('opencode')
  const ringIn = span(B.opencode + 0.5, B.opencode + 1.25)
  inkIn(tl, opencode, ringIn.start, ringIn.duration)
  const close = span(B.opencode + 0.5, B.opencode + 2.25)
  tl.fromTo(opencode.object.scale, { x: 1.9, y: 1.9, z: 1.9 }, { x: 1, y: 1, z: 1, duration: close.duration, ease: 'power3.out', immediateRender: false }, close.start)

  // 8.3: the direct call to a vendor is drawn, then cut when Forge arrives.
  const direct = sketchOf(cast.get<Group>('p8.direct'))
  const call = span(B.forge + 0.25, B.forge + 1)
  tl.to(direct.reveal, { value: 1, duration: call.duration, ease: 'power2.out' }, call.start)
  const cut = span(B.forge + 1.5, B.forge + 2.25)
  fade(tl, direct.material, 0, cut.start, cut.duration)
  const forge = el('forge')
  const forgeIn = span(B.forge + 1, B.forge + 1.75)
  inkIn(tl, forge, forgeIn.start, forgeIn.duration)
  MODELS.forEach((_, k) => {
    const m = el(`model.${k}`)
    const a = span(B.forge + 1.75 + k * 0.3, B.forge + 2.5 + k * 0.3)
    inkIn(tl, m, a.start, a.duration)
    const line = sketchOf(cast.get<Group>(`p8.model.${k}`))
    const draw = span(B.forge + 2.25 + k * 0.3, B.forge + 3 + k * 0.3)
    tl.to(line.reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
  })

  // 8.4: the runner under the whole stack.
  const runner = el('runner')
  const plate = span(B.runner + 0.5, B.runner + 1.5)
  inkIn(tl, runner, plate.start, plate.duration)
})
