/**
 * Part 6 moves. Three runs of the same work, the simple tasks in the core's
 * surface with the tokens they cost (gold coins that stack up), then the pile
 * of work in front of a person. The tasks sink back into the core at 6.3: part
 * 10 pulls them out of it.
 */
import { Vector3, type Group } from 'three'
import { boil } from '@/art/clock'
import { artOf, swarmOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, fade, inkIn } from '@/art/motion'
import { arcPoint, easeInOut } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { TASKS } from '../../actors'
import { stackPoint, stackTilt, drop } from '../../coins'
import { CORE_R, CORE_SCALE_AGENT, EXIT_FROM, PILE, TASK_DEPTH, TASK_DIRS, TOKEN_COINS, TOKENS_POS } from '../../layout'
import { B, grid } from '.'

const KEY = '06-problems/problems'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

/** Each run takes its own time: the paths have different lengths. */
const RUN_BEATS = [2.2, 3.8, 3.0]
const runStart = (k: number) => B.runs + 0.5 + k * 0.4

export const problemsMoves = defineChoreography('06-problems', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- 6.1: three runs of the same prompt -------------------------------------------------
  const balls = PILE.map((_, i) => el(`p6.ball.${i}`))
  const paths = [0, 1, 2].map((k) => sketchOf(cast.get<Group>(`p6.path.${k}`)))
  const from = v3(EXIT_FROM)
  for (let k = 0; k < 3; k++) {
    const a = span(runStart(k), runStart(k) + 0.4)
    inkIn(tl, balls[k]!, a.start, a.duration)
    const quiet = span(B.cost, B.cost + 1.5)
    fade(tl, paths[k]!.material, 0.3, quiet.start, quiet.duration)
  }
  // ---- 6.3: the rest of the work piles up in front of the person --------------------------
  const arriveAt = (j: number) => B.human + 1.5 + j * 0.55
  for (let j = 3; j < PILE.length; j++) {
    const a = span(arriveAt(j - 3), arriveAt(j - 3) + 0.3)
    inkIn(tl, balls[j]!, a.start, a.duration)
  }
  const person = el('person.exit')
  const personIn = span(B.human + 0.5, B.human + 1.5)
  inkIn(tl, person, personIn.start, personIn.duration)
  // Tension: the boil runs twice as fast. Part 7 brings it back.
  const tense = span(B.human + 1, B.human + 3)
  tl.to(boil, { fps: 8, duration: tense.duration, ease: 'none' }, tense.start)

  const tmp = new Vector3()
  const pile = PILE.map(v3)
  const all = span(B.runs, grid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = B.runs + u * (grid.totalBeats - B.runs)
    for (let k = 0; k < 3; k++) {
      const w = easeInOut(win(beat, runStart(k), runStart(k) + RUN_BEATS[k]!))
      paths[k]!.reveal.value = w
      paths[k]!.point(w, tmp)
      balls[k]!.object.position.copy(tmp)
    }
    for (let j = 3; j < PILE.length; j++) {
      const w = easeInOut(win(beat, arriveAt(j - 3), arriveAt(j - 3) + 1.4))
      arcPoint(from, pile[j]!, 0.9, w, tmp)
      balls[j]!.object.position.copy(tmp)
    }
  })

  // ---- 6.2: simple work in the core's surface, and the tokens it costs ---------------------
  const R = CORE_R * CORE_SCALE_AGENT
  const tasks = TASKS.map((name) => el(`task.${name}`))
  const dirs = TASK_DIRS.map((d) => v3(d).normalize())
  tasks.forEach((task, i) => {
    const at = span(B.cost + 0.5 + i * 0.4, B.cost + 1.2 + i * 0.4)
    inkIn(tl, task, at.start, at.duration)
  })
  // 6.3: the tasks sink back into the core and hide there, until part 10.
  const sink = (i: number) => B.human + 0.25 + i * 0.15
  tasks.forEach((task, i) => tl.set(task.inner, { visible: false }, span(sink(i) + 1, sink(i) + 1).start))
  const taskWin = span(B.cost, B.human + 2)
  drive(tl, taskWin.start, taskWin.duration, (u) => {
    const beat = B.cost + u * (B.human + 2 - B.cost)
    tasks.forEach((task, i) => {
      const w = win(beat, sink(i), sink(i) + 1)
      const depth = TASK_DEPTH + (0.45 - TASK_DEPTH) * w * w
      task.object.position.copy(dirs[i]!).multiplyScalar(depth * R)
    })
  })

  // Three gold coins drop onto the stack for each simple task the agent reasons about.
  const tokens = swarmOf(cast.get('tokens'))
  const coinAt = (c: number) => B.cost + 0.9 + Math.floor(c / 3) * 0.4 + (c % 3) * 0.12
  const coinWin = span(B.cost, grid.totalBeats)
  drive(tl, coinWin.start, coinWin.duration, (u) => {
    const beat = B.cost + u * (grid.totalBeats - B.cost)
    for (let c = 0; c < TOKEN_COINS; c++) {
      const d = drop(win(beat, coinAt(c), coinAt(c) + 0.45))
      stackPoint(TOKENS_POS, c, 1, tmp)
      const [rx, rz] = stackTilt(c)
      tokens.place(c, tmp.x, tmp.y + d.lift, tmp.z, d.scale, rx, rz)
    }
    tokens.commit()
  })
})
