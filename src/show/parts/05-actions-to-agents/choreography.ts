/**
 * Part 5 moves. Each group of elements has one drive() that writes its
 * positions from the beat, so every frame is the same however it is reached.
 */
import { Vector3, type Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { arcPoint, easeInOut, orbitOf, orbitPoint } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { EVENTS, INNER, SHELL, STEPS } from '../../actors'
import {
  COMPILER_POS,
  CORE_SCALE_AGENT,
  GA_POS,
  LINE_BENT,
  LINE_X,
  LINE_Y,
  LINE_Z,
  LOCK_DOCK,
  LOCK_POS,
  MD_OUT,
  SHELL_DIRS,
  SHELL_RADIUS,
} from '../../layout'
import { B, grid } from '.'

const KEY = '05-actions-to-agents/actions'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
const easeIn = (t: number) => Math.pow(clamp01(t), 2)
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

/** The md file enters on the core's orbit here (an angle on the inner orbit). */
const MD_ANGLE_IN = 0.35 * Math.PI
const MD_ANGLE_OUT = 0.02 * Math.PI

export const actionsToAgentsMoves = defineChoreography('05-actions-to-agents', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- 5.1: the core leaves; GitHub Actions appears ------------------------------------
  const core = el('core')
  const leave = span(0.25, 1.25)
  inkOut(tl, core, leave.start, leave.duration)
  tl.set(core.object.position, { x: 0, y: 0, z: 0 }, leave.start + leave.duration)
  tl.set(core.object.scale, { x: CORE_SCALE_AGENT, y: CORE_SCALE_AGENT, z: CORE_SCALE_AGENT }, leave.start + leave.duration)

  const ga = el('ga')
  tl.set(ga.object.position, { x: GA_POS[0], y: GA_POS[1], z: GA_POS[2] }, 0)
  const gaIn = span(2, 3)
  inkIn(tl, ga, gaIn.start, gaIn.duration)

  // ---- events fall into it, then two of them run along the line -------------------------
  const evts = EVENTS.map((name) => el(`evt.${name}`))
  evts.forEach((e, i) => {
    const s = B.events + 0.5 + i * 0.8
    const inA = span(s, s + 0.5)
    inkIn(tl, e, inA.start, inA.duration)
    const gone = span(s + 1.35, s + 1.65)
    inkOut(tl, e, gone.start, gone.duration)
  })
  // The first two come back as work running along the straight line (5.2).
  const runs = [evts[0]!, evts[1]!]
  runs.forEach((e, i) => {
    const s = B.unfold + 2 + i * 0.9
    const back = span(s, s + 0.4)
    inkIn(tl, e, back.start, back.duration)
    const gone = span(s + 2.1, s + 2.4)
    inkOut(tl, e, gone.start, gone.duration)
  })
  const fall = span(B.events, B.core)
  const gaCenter = v3(GA_POS)
  drive(tl, fall.start, fall.duration, (u) => {
    const beat = B.events + u * (B.core - B.events)
    evts.forEach((e, i) => {
      const s = B.events + 0.5 + i * 0.8
      const w = easeIn(win(beat, s, s + 1.6))
      // Straight down from above, a little to one side, into the moon.
      const x0 = GA_POS[0] + (i % 3 - 1) * 0.55
      e.object.position.set(x0 + (gaCenter.x - x0) * w, 3.6 + (GA_POS[1] - 3.6) * w, GA_POS[2])
    })
    runs.forEach((e, i) => {
      const s = B.unfold + 2 + i * 0.9
      if (beat < s) return
      const w = win(beat, s, s + 2.4)
      e.object.position.set(LINE_X[0]! + (LINE_X[6]! - LINE_X[0]!) * w, LINE_Y + 0.26, LINE_Z)
    })
  })

  // ---- 5.2: GitHub Actions unfolds into a straight line of steps -------------------------
  const steps = STEPS.map((name) => el(`step.${name}`))
  steps.forEach((s, i) => {
    const a = span(B.unfold + 0.5 + i * 0.25, B.unfold + 1.1 + i * 0.25)
    inkIn(tl, s, a.start, a.duration)
  })
  const line = sketchOf(cast.get<Group>('p5.line'))
  const drawLine = span(B.unfold + 0.5, B.unfold + 2.5)
  tl.to(line.reveal, { value: 1, duration: drawLine.duration, ease: 'power2.inOut' }, drawLine.start)

  // ---- 5.3: the core arrives; near it the line bends onto its orbit -----------------------
  const coreIn = span(B.core + 0.5, B.core + 1.5)
  inkIn(tl, core, coreIn.start, coreIn.duration)
  const orbit = orbitOf(cast.get<Group>('orbit.inner'))
  const orbitIn = span(B.core + 1, B.core + 2.75)
  tl.set(orbit.reveal, { value: 0 }, orbitIn.start)
  tl.set(orbit.material, { opacity: 0.8 }, orbitIn.start)
  tl.to(orbit.reveal, { value: 1, duration: orbitIn.duration, ease: 'power2.inOut' }, orbitIn.start)
  const curve = sketchOf(cast.get<Group>('p5.curve'))
  const bend = span(B.core + 2, B.core + 3.5)
  fade(tl, line.material, 0, bend.start, bend.duration)
  fade(tl, curve.material, 1, bend.start, bend.duration)

  const lineMoves = span(B.unfold, grid.totalBeats)
  const bent = LINE_BENT.map(v3)
  const tmp = new Vector3()
  drive(tl, lineMoves.start, lineMoves.duration, (u) => {
    const beat = B.unfold + u * (grid.totalBeats - B.unfold)
    // GitHub Actions slides to the head of the line and gets smaller.
    const head = easeInOut(win(beat, B.unfold, B.unfold + 1.5))
    ga.object.position.set(GA_POS[0] + (LINE_X[0]! - GA_POS[0]) * head, LINE_Y, LINE_Z)
    ga.object.scale.setScalar(1 - 0.38 * head)
    steps.forEach((s, i) => {
      // Each step slides out of GitHub Actions to its place on the line.
      const out = easeOut(win(beat, B.unfold + 0.5 + i * 0.25, B.unfold + 1.75 + i * 0.25))
      const from = ga.object.position.x
      tmp.set(from + (LINE_X[i + 1]! - from) * out, LINE_Y, LINE_Z)
      // The two steps near the core curve toward its orbit.
      const k = i - (steps.length - 2)
      if (k >= 0) {
        const w = easeInOut(win(beat, B.core + 2, B.core + 3.5))
        tmp.lerp(bent[k]!, w)
      }
      s.object.position.copy(tmp)
    })
  })

  // ---- 5.4 to 5.7: the workflow file, the compiler, the shell, the dock -------------------
  const mdEl = el('md')
  const mdIn = span(B.md + 0.5, B.md + 1.25)
  inkIn(tl, mdEl, mdIn.start, mdIn.duration)
  const compiler = el('compiler')
  const ringIn = span(B.compile + 0.25, B.compile + 1)
  inkIn(tl, compiler, ringIn.start, ringIn.duration)
  // The compiler ring leaves once the file is through it and docked.
  const ringOut = span(B.clusters + 0.5, B.clusters + 1)
  inkOut(tl, compiler, ringOut.start, ringOut.duration)

  const shell = SHELL.map((name) => el(`shell.${name}`))
  shell.forEach((s, i) => {
    const at = SHELL[i] === 'ours' ? B.ours + 0.5 : B.compile + 2.75 + i * 0.25
    const a = span(at, at + 0.6)
    inkIn(tl, s, a.start, a.duration)
  })

  const out = v3(MD_OUT)
  const ring = v3(COMPILER_POS)
  const lock = v3(LOCK_POS)
  const dock = v3(LOCK_DOCK)
  const center = new Vector3()
  const orbitA = new Vector3()
  const dirs = SHELL_DIRS.map((d) => v3(d).normalize().multiplyScalar(SHELL_RADIUS))
  const fileMoves = span(B.md, grid.totalBeats)
  drive(tl, fileMoves.start, fileMoves.duration, (u) => {
    const beat = B.md + u * (grid.totalBeats - B.md)
    // Along the core's orbit, then out of it.
    const along = easeInOut(win(beat, B.md + 0.5, B.md + 2))
    orbitPoint(INNER, MD_ANGLE_IN + (MD_ANGLE_OUT - MD_ANGLE_IN) * along, orbitA)
    const leave = easeInOut(win(beat, B.md + 1.8, B.md + 3))
    center.copy(orbitA).lerp(out, leave)
    // Through the compiler ring.
    const through = easeInOut(win(beat, B.compile + 1.25, B.compile + 2.75))
    if (through > 0) center.copy(out).lerp(lock, through)
    // To its dock above the core.
    const docking = easeInOut(win(beat, B.clusters + 0.5, B.clusters + 3))
    if (docking > 0) arcPoint(lock, dock, 1.2, docking, center)
    mdEl.object.position.copy(center)

    shell.forEach((s, i) => {
      const at = SHELL[i] === 'ours' ? B.ours + 0.5 : B.compile + 2.75 + i * 0.25
      // Each piece comes from the ring and snaps onto the shell.
      const snap = easeOut(win(beat, at, at + 1))
      const from = SHELL[i] === 'ours' ? tmp.copy(center).add(new Vector3(1.4, 0.2, 0.3)) : tmp.copy(ring)
      s.object.position.copy(from).lerp(center.clone().add(dirs[i]!), snap)
    })
  })

  // ---- 5.7: the triage cluster ----------------------------------------------------------------
  const triage = el('core.triage')
  const triIn = span(B.clusters + 2, B.clusters + 3)
  inkIn(tl, triage, triIn.start, triIn.duration)
  const triOrbit = orbitOf(cast.get<Group>('orbit.triage'))
  const triDraw = span(B.clusters + 2.5, B.clusters + 4)
  tl.to(triOrbit.reveal, { value: 1, duration: triDraw.duration, ease: 'power2.inOut' }, triDraw.start)
})
