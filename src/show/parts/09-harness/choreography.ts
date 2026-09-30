/**
 * Part 9 moves. Three improvised runs, the parapet that closes around the
 * hall, the cloud of paths that becomes one path on the loop, the commands
 * that bounce off, and the copy of the hall that flies to a developer's side.
 */
import { Vector3, type Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { arcPoint, easeInOut } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { CLOUD_PATHS, COMMANDS_FROM, DEV_POS, HALL_BIG, IMPROVISE_PATHS, PILE } from '../../layout'
import { B, grid } from '.'

const KEY = '09-harness/harness'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

const RUN_BEATS = [2.4, 3.4, 2.9]
const runAt = (k: number) => B.improvise + 0.5 + k * 0.35
const cmdAt = (i: number) => B.commands + 0.25 + i * 0.5

/** Where the commands hit the parapet: its south east corner, while the hall is big. */
const IMPACTS: Array<readonly [number, number, number]> = [
  [2.4, 0.5, 2.0 * HALL_BIG + 0.1],
  [2.3 * HALL_BIG + 0.1, 0.5, 1.5],
  [1.5, 0.5, 2.0 * HALL_BIG + 0.1],
]
/** The copy of the hall stands here, at this size (actors.ts). */
const DEV_COPY = new Vector3(DEV_POS[0] + 0.75, 0, DEV_POS[2] - 0.15)
const DEV_SCALE = 0.16

export const harnessMoves = defineChoreography('09-harness', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- 9.1: every repo improvises ------------------------------------------------------------
  const balls = [0, 1, 2].map((k) => el(`p6.ball.${k}`))
  const runs = [0, 1, 2].map((k) => sketchOf(cast.get<Group>(`p9.path.${k}`)))
  balls.forEach((ball, k) => {
    const a = span(runAt(k), runAt(k) + 0.4)
    inkIn(tl, ball, a.start, a.duration)
    // Balls 1 and 2 leave with the paths; ball 0 stays to ride the loop.
    if (k > 0) {
      const out = span(B.frame, B.frame + 0.6)
      inkOut(tl, ball, out.start, out.duration)
    }
  })
  const quiet = span(B.frame, B.frame + 1.2)
  runs.forEach((r) => fade(tl, r.material, 0, quiet.start, quiet.duration))

  // ---- 9.2: the parapet closes around the hall -------------------------------------------------
  const parapet = el('harness')
  const close = span(B.frame + 0.5, B.frame + 2.25)
  inkIn(tl, parapet, close.start, close.duration * 0.7)
  tl.fromTo(parapet.object.scale, { x: HALL_BIG * 1.5, y: HALL_BIG, z: HALL_BIG * 1.5 }, { x: HALL_BIG, y: HALL_BIG, z: HALL_BIG, duration: close.duration, ease: 'power3.out', immediateRender: false }, close.start)

  // ---- 9.3: a cloud of paths, then one nearly clean path on the loop -------------------------
  const cloud = CLOUD_PATHS.map((_, i) => sketchOf(cast.get<Group>(`p9.cloud.${i}`)))
  cloud.forEach((c, i) => {
    const draw = span(B.cloud + 0.4 + i * 0.2, B.cloud + 1.9 + i * 0.2)
    tl.to(c.reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
    const back = span(B.clean + 0.5, B.clean + 1.75)
    tl.to(c.reveal, { value: 0, duration: back.duration, ease: 'power2.in' }, back.start)
  })
  const clean = sketchOf(cast.get<Group>('p9.clean'))
  const cleanIn = span(B.clean + 1.25, B.clean + 3)
  tl.to(clean.reveal, { value: 1, duration: cleanIn.duration, ease: 'power2.inOut' }, cleanIn.start)

  // One writer for the balls of 9.1 and the ride on the loop.
  const paths = IMPROVISE_PATHS.map((_, k) => runs[k]!)
  const pile = PILE.slice(0, 3).map(v3)
  const tmp = new Vector3()
  const onto = new Vector3()
  const all = span(B.improvise, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = B.improvise + u * (grid.totalBeats - B.improvise)
    balls.forEach((ball, k) => {
      const w = easeInOut(win(beat, runAt(k), runAt(k) + RUN_BEATS[k]!))
      paths[k]!.reveal.value = w
      // Before its run the ball is still where part 6 left it, on the pile (hidden
      // since part 8). So this drive starts exactly where part 6's ended.
      if (beat < runAt(k)) {
        ball.object.position.copy(pile[k]!)
        return
      }
      paths[k]!.point(w, tmp)
      if (k === 0 && beat >= B.clean + 1.25) {
        // The same work, now on one nearly clean path round the loop, again and again.
        const ride = win(beat, B.clean + 1.25, grid.totalBeats)
        const join = easeInOut(win(beat, B.clean + 1.25, B.clean + 2.75))
        clean.point((0.55 + ride * 1.4) % 1, onto)
        paths[0]!.point(1, tmp)
        tmp.lerp(onto, join)
      }
      ball.object.position.copy(tmp)
    })
  })

  // ---- 9.4: unsafe commands fly at the parapet and bounce off ----------------------------------
  const cmds = COMMANDS_FROM.map((_, i) => el(`cmd.${i}`))
  cmds.forEach((c, i) => {
    const a = span(cmdAt(i), cmdAt(i) + 0.4)
    inkIn(tl, c, a.start, a.duration)
    const out = span(cmdAt(i) + 2.3, cmdAt(i) + 2.7)
    inkOut(tl, c, out.start, out.duration)
  })
  const from = COMMANDS_FROM.map(v3)
  const impact = IMPACTS.map(v3)
  const away = from.map((p, i) => p.clone().add(new Vector3(1.2, i === 1 ? 1.6 : 1.0, 1.2)))
  const cmdWin = span(B.commands, B.laptop)
  drive(tl, cmdWin.start, cmdWin.duration, (u) => {
    const beat = B.commands + u * (B.laptop - B.commands)
    cmds.forEach((c, i) => {
      const w = win(beat, cmdAt(i), cmdAt(i) + 2.7)
      if (w < 0.4) {
        // In, fast, straight at the parapet.
        tmp.lerpVectors(from[i]!, impact[i]!, Math.pow(w / 0.4, 1.6))
      } else {
        // Bounced away on an arc.
        arcPoint(impact[i]!, away[i]!, 0.8, 1 - Math.pow(1 - (w - 0.4) / 0.6, 2.4), tmp)
      }
      c.object.position.copy(tmp)
    })
  })

  // ---- 9.5: a copy of the hall, with its parapet, flies to the developer's side --------------
  const dev = el('dev')
  const devIn = span(B.laptop + 0.25, B.laptop + 1)
  inkIn(tl, dev, devIn.start, devIn.duration)
  const copies = [el('dev.hall'), el('dev.harness')]
  const copyIn = span(B.laptop + 0.25, B.laptop + 0.75)
  copies.forEach((c) => inkIn(tl, c, copyIn.start, copyIn.duration))
  const fly = span(B.laptop + 0.25, B.laptop + 2.5)
  const start = new Vector3(0, 0, 0)
  drive(tl, fly.start, fly.duration, (u) => {
    const w = easeInOut(u)
    arcPoint(start, DEV_COPY, 2.2, w, tmp)
    const s = HALL_BIG * 0.8 * (1 - w) + DEV_SCALE * w
    copies.forEach((c) => {
      c.object.position.copy(tmp)
      c.object.scale.setScalar(s)
    })
  })
})
