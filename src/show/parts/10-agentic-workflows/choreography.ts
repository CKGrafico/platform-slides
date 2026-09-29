/**
 * Part 10 moves, for its two scenes. All times come from the beat grids in
 * index.tsx.
 *
 * pull-out. The extraction: the tasks sit in the core's surface. One per two
 * beats, a task sinks a little, the surface swells, the task pushes out and
 * drags the surface with it like a drop, the surface snaps back and wobbles,
 * and the task flies on an arc to the clean outer orbit, where it turns
 * pastel. One drive() writes the core scale, the four bumps, and the tasks
 * from the beat alone, so any frame is always the same. A second drive then
 * brings GitHub Actions and its steps onto the same orbit.
 *
 * pipeline. Events wake every workflow; then one router; the lanes; a person
 * who approves; the merge gate; audit and housekeeping on their own orbit.
 */
import { Color, Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf, coreOf, swarmOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { arcPoint, easeInOut, orbitOf, orbitPoint } from '@/art/orbits'
import { palette } from '@/art/palette'
import { defineChoreography } from '@/world/actors'
import { OUTER, STEPS, TASKS } from '../../actors'
import {
  APPROVER_POS,
  AUDIT_END,
  CORE_R,
  CORE_SCALE_AFTER_P10,
  CORE_SCALE_BEFORE_P10,
  EVENTS_FROM,
  HOUSEKEEPING_END,
  LINE_BENT,
  LINE_X,
  LINE_Y,
  LINE_Z,
  SIDE_ORBIT,
  TASK_DEPTH,
  TASK_DIRS,
  TOKEN_COINS,
  TOKENS_LEFT,
  TOKENS_POS,
  TRIAGE_ASIDE,
} from '../../layout'
import { stackPoint, stackTilt } from '../../coins'
import { routePoint, ROUTE } from '../../route'
import { grid, PB, pipeGrid, QB } from '.'

const PULL = '10-agentic-workflows/pull-out'
const PIPE = '10-agentic-workflows/pipeline'
const { b } = grid
const pb = pipeGrid.b

const R0 = CORE_R
/** Scale of the core while it holds all the tasks, then after each task leaves. */
const GROWN = 1.55
const AFTER_EACH = [1.36, 1.19, 1.02, CORE_SCALE_AFTER_P10]
/** Where each satellite lands on the outer orbit, and how far it moves in stop 3. */
const LANDING_ANGLES = [0.12, 0.38, 0.62, 0.88].map((f) => f * Math.PI)
const ORBIT_SWEEP = 0.45
const COLORS = [palette.sage, palette.lilac, palette.peach, palette.butter]

/** Where each task sits in the surface (since 6.2): near the edge of the silhouette, so the drop shows in profile. */
const DIRS = TASK_DIRS.map((d) => new Vector3(d[0], d[1], d[2]).normalize())

const popAt = (i: number) => PB.pop + 1 + i * 2
/** Each task rises from inside the core to its surface while the core grows (stop 1). */
const riseAt = (i: number) => [1.25 + i * 0.5, 2.5 + i * 0.5] as const
const POP = 2
const GROW = [0.5, 2] as const
const SWEEP = [PB.distance, PB.back] as const

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
const easeIn = (t: number) => Math.pow(clamp01(t), 2.2)
const mix = (a: number, bb: number, t: number) => a + (bb - a) * t
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

/** Core scale at a beat: it grows to hold the tasks, then shrinks a step as each one leaves. */
function coreScale(beat: number): number {
  let s = mix(CORE_SCALE_BEFORE_P10, GROWN, easeInOut(win(beat, GROW[0], GROW[1])))
  AFTER_EACH.forEach((after, i) => {
    const release = popAt(i) + POP * 0.6
    const before = i === 0 ? GROWN : AFTER_EACH[i - 1]!
    s = beat < release ? s : mix(before, after, easeOut(win(beat, release, release + 1)))
  })
  return s
}

/** The ring of GitHub Actions at the end of 10.3: tasks, then its steps, then GitHub Actions itself. */
const RING = 11
// GitHub Actions (the last one) ends behind the core, so it never covers it.
const ringAngle = (k: number, spin: number) => 1.5 * Math.PI + ((k - (RING - 1)) * Math.PI * 2) / RING + spin

export const agenticWorkflowsMoves = defineChoreography('10-agentic-workflows', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(PULL, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- clear what part 9 left: the ride on the clean orbit, the developer ---------------------
  const clear = span(0.25, 1.5)
  inkOut(tl, el('p6.ball.0'), clear.start, clear.duration * 0.5)
  fade(tl, orbitOf(cast.get<Group>('p9.orbit')).material, 0, clear.start, clear.duration)
  inkOut(tl, el('person.dev'), clear.start, clear.duration * 0.6)
  inkOut(tl, el('core.laptop'), clear.start, clear.duration * 0.5)
  fade(tl, segmentsOf(cast.get<Group>('harness.laptop')).material, 0, clear.start, clear.duration * 0.5)
  // The triage cluster steps aside, so the outer orbit is free.
  const aside = span(0.25, 3)
  for (const id of ['core.triage', 'orbit.triage']) {
    tl.to(cast.get(id).position, { x: TRIAGE_ASIDE[0], y: TRIAGE_ASIDE[1], z: TRIAGE_ASIDE[2], duration: aside.duration, ease: 'power3.inOut' }, aside.start)
  }
  // The implement orbit steps back while the core grows through it, then returns.
  const inner = orbitOf(cast.get<Group>('orbit.inner'))
  const dim = span(GROW[0], GROW[1])
  fade(tl, inner.material, 0.12, dim.start, dim.duration)
  const innerBack = span(PB.distance + 0.5, PB.distance + 2)
  fade(tl, inner.material, 0.8, innerBack.start, innerBack.duration)

  // ---- 10.2: the extraction ------------------------------------------------------------------
  const coreObj = cast.get('core')
  const core = coreOf(coreObj)
  const harness = cast.get<Group>('harness')
  const opencode = cast.get('opencode')
  const tasks = TASKS.map((name) => artOf<MeshToonMaterial>(cast.get(`task.${name}`)))
  // The tasks wait inside the core since 6.3. They show as they rise to its surface.
  tasks.forEach((task, i) => tl.set(task.inner, { visible: true }, span(riseAt(i)[0], riseAt(i)[0]).start))
  const landing = LANDING_ANGLES.map((a) => orbitPoint(OUTER, a))
  const tmp = new Vector3()
  const release = new Vector3()

  const extraction = span(0, PB.back)
  drive(tl, extraction.start, extraction.duration, (u) => {
    const beat = u * PB.back
    const s = coreScale(beat)
    coreObj.scale.setScalar(s)
    // The frame and the runtime ring stay around the core as it grows and shrinks.
    harness.scale.setScalar((0.9 * s) / CORE_SCALE_BEFORE_P10)
    opencode.scale.setScalar(s / CORE_SCALE_BEFORE_P10)
    const R = R0 * s

    tasks.forEach((task, i) => {
      const dir = DIRS[i]!
      const bump = core.bumps[i]!
      bump.dir.copy(dir)
      let amount: number
      let width = 0.12
      let pop = 1
      const p = popAt(i)
      const v = win(beat, p, p + POP)
      if (beat < p) {
        // It rises from inside the core to its surface, and the surface holds it as the core grows.
        const [ra, rb] = riseAt(i)
        const rise = easeOut(win(beat, ra, rb))
        tmp.copy(dir).multiplyScalar(mix(0.45, TASK_DEPTH, rise) * R)
        amount = 0.02 * rise + 0.035 * Math.sin(Math.PI * rise)
      } else if (v < 0.3) {
        // Anticipation: it sinks a little while the surface swells.
        const w = easeInOut(v / 0.3)
        tmp.copy(dir).multiplyScalar(mix(TASK_DEPTH, 0.9, w) * R)
        amount = mix(0.02, 0.09, w)
      } else if (v < 0.58) {
        // It pushes out, and the surface stretches after it: a drop with a thin neck.
        const w = (v - 0.3) / 0.28
        tmp.copy(dir).multiplyScalar(mix(0.9, 1.62, easeIn(w)) * R)
        amount = mix(0.09, 0.46, easeIn(w))
        width = mix(0.12, 0.018, w)
      } else {
        // Release: the surface snaps back and wobbles; the task flies to its orbit.
        const w = (v - 0.58) / 0.42
        const snap = Math.min(1, w / 0.12)
        const wobble = Math.exp(-w * 5) * Math.cos(w * 22)
        amount = snap < 1 ? mix(0.46, -0.08, easeOut(snap)) : -0.08 * wobble
        width = mix(0.018, 0.1, easeOut(snap))
        release.copy(dir).multiplyScalar(1.62 * R)
        if (beat < SWEEP[0]) {
          arcPoint(release, landing[i]!, 0.9, easeInOut(w), tmp)
        } else {
          orbitPoint(OUTER, LANDING_ANGLES[i]! + ORBIT_SWEEP * easeInOut(win(beat, SWEEP[0], SWEEP[1])), tmp)
        }
        // A small pop in size as it breaks free.
        pop = 1 + 0.16 * Math.sin(Math.PI * clamp01(w / 0.35))
      }
      bump.amount = amount
      bump.width = width
      task.object.position.copy(tmp)
      task.object.scale.setScalar(pop)
    })
  })

  // The frame and the runtime ring step aside for the extraction, then come back.
  const frameLines = segmentsOf(harness)
  const aside2 = span(0.5, 1.5)
  fade(tl, frameLines.material, 0.1, aside2.start, aside2.duration)
  const frameBack = span(PB.back + 0.5, PB.back + 2.5)
  fade(tl, frameLines.material, 0.9, frameBack.start, frameBack.duration)
  const ringEl = el('opencode')
  const ringOut = span(0.5, 1.1)
  inkOut(tl, ringEl, ringOut.start, ringOut.duration)
  const ringBack = span(PB.back + 1, PB.back + 2)
  inkIn(tl, ringEl, ringBack.start, ringBack.duration)

  const outer = orbitOf(cast.get<Group>('orbit.outer'))
  const outerIn = span(PB.pop + 0.5, PB.pop + 2)
  fade(tl, outer.material, 0.8, outerIn.start, outerIn.duration)

  tasks.forEach((task, i) => {
    const target = new Color(COLORS[i])
    const tint = span(popAt(i) + POP * 0.75, popAt(i) + POP)
    tl.to(task.body.material.color, { r: target.r, g: target.g, b: target.b, duration: tint.duration, ease: 'power2.out' }, tint.start)
  })

  // ---- 10.3: GitHub Actions and its steps join the outer orbit ----------------------------------
  const ga = el('ga')
  const steps = STEPS.map((name) => el(`step.${name}`))
  const linePos = [
    ...STEPS.map((_, i) => (i < 4 ? new Vector3(LINE_X[i + 1]!, LINE_Y, LINE_Z) : v3(LINE_BENT[i - 4]!))),
    new Vector3(LINE_X[0]!, LINE_Y, LINE_Z),
  ]
  const taskFrom = LANDING_ANGLES.map((a) => a + ORBIT_SWEEP)
  const curve = sketchOf(cast.get<Group>('p5.curve'))
  const lineOut = span(PB.back, PB.back + 1.5)
  fade(tl, curve.material, 0, lineOut.start, lineOut.duration)
  const back = span(PB.back, grid.totalBeats)
  const movers = [...steps, ga]
  drive(tl, back.start, back.duration, (u) => {
    const beat = PB.back + u * (grid.totalBeats - PB.back)
    const spin = 0.35 * easeInOut(win(beat, PB.back + 3, grid.totalBeats))
    tasks.forEach((task, i) => {
      const w = easeInOut(win(beat, PB.back + 0.5, PB.back + 2.5))
      orbitPoint(OUTER, mix(taskFrom[i]!, ringAngle(i, 0), w) + spin, tmp)
      task.object.position.copy(tmp)
    })
    movers.forEach((m, k) => {
      const a = PB.back + 0.5 + k * 0.3
      const w = easeInOut(win(beat, a, a + 2))
      orbitPoint(OUTER, ringAngle(4 + k, spin), release)
      arcPoint(linePos[k]!, release, 1.1, w, tmp)
      m.object.position.copy(tmp)
    })
    // GitHub Actions stays the biggest planet of the ring.
    ga.object.scale.setScalar(0.62 + 0.1 * easeInOut(win(beat, PB.back + 2, PB.back + 3.5)))
  })

  // ---- 10.3: the model is the last resort; most tokens go -------------------------------------
  const tokens = swarmOf(cast.get('tokens'))
  const coinAway = (c: number) => PB.resort + 0.5 + (TOKEN_COINS - 1 - c) * 0.12
  const away = new Vector3()
  const resort = span(PB.resort, grid.totalBeats)
  drive(tl, resort.start, resort.duration, (u) => {
    const beat = PB.resort + u * (grid.totalBeats - PB.resort)
    for (let c = 0; c < TOKEN_COINS; c++) {
      stackPoint(TOKENS_POS, c, 1, tmp)
      const [rx, rz] = stackTilt(c)
      // The top coins fly off, up and away, and are gone; the bottom ones stay.
      const w = c < TOKENS_LEFT ? 0 : easeInOut(win(beat, coinAway(c), coinAway(c) + 1.1))
      away.set(tmp.x - 1.2 - (c % 3) * 0.5, tmp.y + 2.2 + (c % 4) * 0.3, tmp.z + ((c % 2) - 0.5) * 1.2)
      arcPoint(tmp, away, 0.6, w, release)
      tokens.place(c, release.x, release.y, release.z, 1 - w, rx * (1 + 6 * w), rz * (1 + 6 * w))
    }
    tokens.commit()
  })

  // ---- pipeline ---------------------------------------------------------------------------------
  const q = (from: number, to: number) => t.span(PIPE, pb(from), pb(to))
  const flow = swarmOf(cast.get('flow'))
  const triage = el('core.triage')
  const triageAt = v3(TRIAGE_ASIDE)
  const eventsFrom = v3(EVENTS_FROM)
  const origin = new Vector3(0, 0, 0)
  const wakeAt = (e: number) => QB.before + 0.5 + e * 0.9

  // 10.4 before: every event wakes both workflows. Each one pulses as it wakes.
  // A drive, not tweens: the core's scale is written by drives (the extraction),
  // and a tween going back would restore a value recorded before any drive ran.
  const pulseWin = q(0, QB.router)
  drive(tl, pulseWin.start, pulseWin.duration, (u) => {
    const beat = u * QB.router
    let pulse = 0
    for (let e = 0; e < 3; e++) {
      const up = win(beat, wakeAt(e) + 1.3, wakeAt(e) + 1.55)
      const down = win(beat, wakeAt(e) + 1.55, wakeAt(e) + 2.1)
      pulse = Math.max(pulse, easeOut(up) * (1 - easeInOut(down)))
    }
    triage.object.scale.setScalar(1 + 0.14 * pulse)
    coreObj.scale.setScalar(CORE_SCALE_AFTER_P10 * (1 + 0.14 * pulse))
  })

  // 10.4 after: the triage cluster joins the system as a lane; the router at the entrance.
  const merge = q(QB.router + 0.25, QB.router + 2)
  tl.to(triage.object.position, { x: 0, y: 0, z: 0, duration: merge.duration, ease: 'power3.in' }, merge.start)
  inkOut(tl, triage, merge.start + merge.duration * 0.7, merge.duration * 0.3)
  const triOrbit = orbitOf(cast.get<Group>('orbit.triage'))
  fade(tl, triOrbit.material, 0, merge.start, merge.duration * 0.6)
  const routerEl = el('router')
  const routerIn = q(QB.router + 0.5, QB.router + 1.25)
  inkIn(tl, routerEl, routerIn.start, routerIn.duration)
  const laneT = orbitOf(cast.get<Group>('lane.triage'))
  const laneR = orbitOf(cast.get<Group>('lane.refine'))
  const drawT = q(QB.router + 1.5, QB.router + 3)
  tl.to(laneT.reveal, { value: 1, duration: drawT.duration, ease: 'power2.inOut' }, drawT.start)
  const drawR = q(QB.lanes + 0.25, QB.lanes + 1.75)
  tl.to(laneR.reveal, { value: 1, duration: drawR.duration, ease: 'power2.inOut' }, drawR.start)

  // A human approves the story before implement starts.
  const approver = el('person.approver')
  tl.set(approver.object.position, { x: APPROVER_POS[0], y: APPROVER_POS[1], z: APPROVER_POS[2] }, 0)
  const approverIn = q(QB.lanes + 1.5, QB.lanes + 2.25)
  inkIn(tl, approver, approverIn.start, approverIn.duration)

  // 10.6: the merge gate on the way out.
  const gateEl = el('gate')
  const gateIn = q(QB.gate + 0.25, QB.gate + 1)
  inkIn(tl, gateEl, gateIn.start, gateIn.duration)

  // Audit and housekeeping circle to one side.
  const auditEl = el('audit')
  const houseEl = el('housekeeping')
  const sideIn = q(QB.side + 0.5, QB.side + 1.25)
  inkIn(tl, auditEl, sideIn.start, sideIn.duration)
  inkIn(tl, houseEl, sideIn.start + sideIn.duration * 0.4, sideIn.duration)

  // One writer for every work item of the pipeline scene and the side orbit.
  const all = q(0, pipeGrid.totalBeats)
  drive(tl, all.start, all.duration, (u) => {
    const beat = u * pipeGrid.totalBeats
    // Before: three events, two copies each, one to each workflow.
    for (let e = 0; e < 3; e++) {
      const w = win(beat, wakeAt(e), wakeAt(e) + 1.4)
      const alive = w > 0 && w < 1 ? 1 : 0
      for (let c = 0; c < 2; c++) {
        arcPoint(eventsFrom, c === 0 ? triageAt : origin, c === 0 ? 1.6 : 0.8, easeInOut(w), tmp)
        flow.place(e * 2 + c, tmp.x, tmp.y, tmp.z, alive * Math.min(1, w * 6, (1 - w) * 6))
      }
    }
    // After: one work item through the router, the lanes, the gate, and out.
    let r: number
    if (beat < QB.router + 1) r = 0
    else if (beat < QB.lanes) r = ROUTE.lanes * win(beat, QB.router + 1, QB.lanes - 0.5)
    else if (beat < QB.gate) r = ROUTE.lanes + (ROUTE.exit - ROUTE.lanes) * easeInOut(win(beat, QB.lanes + 0.5, QB.gate - 0.5))
    else r = ROUTE.exit + (1 - ROUTE.exit) * easeInOut(win(beat, QB.gate + 0.75, QB.side - 0.5))
    routePoint(r, tmp)
    const shown = beat > QB.router + 1 && r < 0.999 ? 1 : 0
    flow.place(6, tmp.x, tmp.y + 0.02, tmp.z, shown * Math.min(1, (beat - QB.router - 1) * 3))
    flow.commit()

    // The side orbit: audit and housekeeping arrive and move along it.
    const side = win(beat, QB.side + 0.5, pipeGrid.totalBeats)
    orbitPoint(SIDE_ORBIT, AUDIT_END - 0.5 + side * 0.5, tmp)
    auditEl.object.position.copy(tmp)
    orbitPoint(SIDE_ORBIT, HOUSEKEEPING_END - 0.5 + side * 0.5, tmp)
    houseEl.object.position.copy(tmp)
  })
})
