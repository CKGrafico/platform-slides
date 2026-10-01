/**
 * Part 10 moves.
 *
 * pull-out: the hall is big and closed; the task carts roll out of it by the
 * door and onto the loop, and the hall shrinks each time, with its parapet and
 * its banner, the folk still at home standing on its platform; the carts of
 * the mill's road join the loop; most coins go.
 *
 * pipeline: belts everywhere with stations that wake on every cart; then one
 * belt on the main road, through the gatehouse, and one of the hall's folk
 * walks out to keep it; the workshops along it, with another who moves out to
 * refine; the merge gate, the market and the booth, and the person at the
 * exit goes; the fields; the watchtower, and the repair crew leaves the hall
 * for the loop.
 */
import { Color, Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { polyline, town } from '@/art/town'
import { sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { arcPoint, easeInOut } from '@/art/orbits'
import { palette } from '@/art/palette'
import { faceAlong, faceOnPath, yawAlong, yawOnPath, type PathAt } from '@/art/town-units'
import { defineChoreography } from '@/world/actors'
import { STEPS, TASKS } from '../../actors'
import { loopAt, mainAt as mainPath } from '../../route'
import { stackPoint, stackTilt } from '../../coins'
import { FOLK, FOLK_HOME, HALL_SCALE, hallStep, homeAfter, homeAt, homePoint, setHallScale, walkPath } from '../../hall'
import { BALES, BOOTH, COINS, FARMS, FIELDS, FIELD_TILE, HALL_DOOR, LINE_BENT, LINE_X, LINE_Y, LINE_Z, LOOP_LANDING, LOOP_SWEEP, MAIN_AT, PLATFORM_TOP, SPAGHETTI, STEP_LANDING, TOKEN_COINS, TOKENS_LEFT } from '../../layout'
import { grid, PB, pipeGrid, QB } from '.'

const PULL = '10-agentic-workflows/pull-out'
const PIPE = '10-agentic-workflows/pipeline'
const { b } = grid
const pb = pipeGrid.b

const COLORS = [palette.sage, palette.lilac, palette.peach, palette.butter]
const popAt = (i: number) => PB.pop + 1 + i * 2
const POP = 2

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
const mix = (a: number, bb: number, t: number) => a + (bb - a) * t
const frac = (v: number) => v - Math.floor(v)
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

/** The hall's scale at a beat of the pull-out: as the smiths left it, then a step smaller as each task cart leaves. */
function hallScale(beat: number): number {
  let s: number = HALL_SCALE.forge
  HALL_SCALE.tasks.forEach((after, i) => {
    const release = popAt(i) + POP * 0.5
    const before = i === 0 ? HALL_SCALE.forge : HALL_SCALE.tasks[i - 1]!
    s = beat < release ? s : mix(before, after, easeOut(win(beat, release, release + 1)))
  })
  return s
}

export const agenticWorkflowsMoves = defineChoreography('10-agentic-workflows', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(PULL, b(from), b(to))
  const q = (from: number, to: number) => t.span(PIPE, pb(from), pb(to))
  const el = (id: string) => artOf(cast.get(id))
  const tmp = new Vector3()
  const tmp2 = new Vector3()

  // The developer and the copy of the hall leave: the laptop had its beat.
  for (const id of ['dev', 'dev.hall', 'dev.harness']) {
    const out = span(0.3, 0.9)
    inkOut(tl, el(id), out.start, out.duration)
  }

  // ---- 10.2: the hall, big and closed; the task carts leave it -------------------------------
  const hall = el('hall')
  const parapet = el('harness')
  const banner = el('banner')
  const tasks = TASKS.map((name) => artOf<MeshToonMaterial>(cast.get(`task.${name}`)))
  const home = homeAfter(FOLK.smiths[1]).map((id) => ({ object: cast.get(id), spot: FOLK_HOME.find((f) => f.id === id)!.spot }))
  const door = new Vector3()
  const off = new Vector3()
  const landing = new Vector3()
  tasks.forEach((task, i) => {
    const a = span(popAt(i), popAt(i) + 0.5)
    inkIn(tl, task, a.start, a.duration)
    const target = new Color(COLORS[i])
    const tint = span(popAt(i) + POP * 0.75, popAt(i) + POP)
    tl.to(task.body.material.color, { r: target.r, g: target.g, b: target.b, duration: tint.duration, ease: 'power2.out' }, tint.start)
  })
  const extraction = span(0, PB.back)
  drive(tl, extraction.start, extraction.duration, (u) => {
    const beat = u * PB.back
    const s = hallScale(beat)
    setHallScale(hall.object, parapet.object, banner.object, s)
    for (const f of home) homePoint(f.spot, s, f.object.position)
    door.set(HALL_DOOR[0] * s, PLATFORM_TOP * s, HALL_DOOR[2] * s)
    off.set(door.x + 0.4, 0.03, 2.0 * s + 0.8)
    tasks.forEach((task, i) => {
      const v = win(beat, popAt(i), popAt(i) + POP)
      if (beat < popAt(i)) {
        task.object.position.copy(door)
        task.object.scale.setScalar(1)
        task.object.rotation.y = 0
        return
      }
      const ride = LOOP_LANDING[i]! + LOOP_SWEEP * easeInOut(win(beat, PB.distance, PB.back))
      loopAt(ride, landing)
      landing.y = 0.08
      if (v < 1) {
        // Out of the door, down off the platform, then across to the loop.
        const e = easeInOut(v)
        if (e < 0.35) {
          tmp.lerpVectors(door, off, e / 0.35)
          faceAlong(task.object, door, off)
        } else {
          tmp.lerpVectors(off, landing, (e - 0.35) / 0.65)
          faceAlong(task.object, off, landing)
        }
      } else {
        tmp.copy(landing)
        faceOnPath(task.object, loopAt, ride)
      }
      task.object.position.copy(tmp)
      task.object.scale.setScalar(1 + 0.16 * Math.sin(Math.PI * clamp01(v / 0.35)))
    })
  })

  // ---- 10.3: the carts of GitHub Actions join the loop -----------------------------------------
  const steps = STEPS.map((name) => el(`step.${name}`))
  const starts = STEPS.map((_, i) => {
    const k = i - (STEPS.length - 2)
    return k >= 0 ? v3(LINE_BENT[k]!) : new Vector3(LINE_X[i]!, LINE_Y, LINE_Z)
  })
  const joining = span(PB.back + 1, grid.totalBeats)
  drive(tl, joining.start, joining.duration, (u) => {
    const beat = PB.back + 1 + u * (grid.totalBeats - PB.back - 1)
    steps.forEach((step, k) => {
      const a = PB.back + 1 + k * 0.25
      const w = easeInOut(win(beat, a, a + 1.6))
      const at = STEP_LANDING[k]! + 0.04 * easeInOut(win(beat, PB.resort, grid.totalBeats))
      loopAt(at, tmp2)
      tmp.lerpVectors(starts[k]!, tmp2, w)
      if (w < 1) faceAlong(step.object, starts[k]!, tmp2)
      else faceOnPath(step.object, loopAt, at)
      step.object.position.copy(tmp)
      step.object.scale.setScalar(1 - 0.15 * w)
    })
  })

  // ---- 10.4: the hall is the last resort; most coins go ----------------------------------------
  const tokens = swarmOf(cast.get('tokens'))
  const coinAway = (c: number) => PB.resort + 0.5 + (TOKEN_COINS - 1 - c) * 0.12
  const away = new Vector3()
  const release = new Vector3()
  const coins = span(PB.resort, grid.totalBeats)
  drive(tl, coins.start, coins.duration, (u) => {
    const beat = PB.resort + u * (grid.totalBeats - PB.resort)
    for (let c = 0; c < TOKEN_COINS; c++) {
      stackPoint(COINS, c, 1, tmp)
      const [rx, rz] = stackTilt(c)
      const w = c < TOKENS_LEFT ? 0 : easeInOut(win(beat, coinAway(c), coinAway(c) + 1.1))
      away.set(tmp.x + 1.4 + (c % 3) * 0.5, tmp.y + 2.4 + (c % 4) * 0.3, tmp.z - 1.4 + ((c % 2) - 0.5) * 1.2)
      arcPoint(tmp, away, 0.6, w, release)
      tokens.place(c, release.x, release.y, release.z, 1 - w, rx * (1 + 6 * w), rz * (1 + 6 * w))
    }
    tokens.commit()
  })

  // ---- pipeline, 10.4 before: belts everywhere, every station waking on every cart ------------
  const spag = SPAGHETTI.map((_, i) => sketchOf(cast.get<Group>(`spag.${i}`)))
  const spagAt: PathAt[] = spag.map((line) => (u, out) => line.point(u, out))
  const spagStations = SPAGHETTI.map((_, i) => el(`spagstation.${i}`))
  spag.forEach((line, i) => {
    const draw = q(0.25 + i * 0.3, 1.75 + i * 0.3)
    tl.to(line.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
    const gone = q(QB.router + 0.25, QB.router + 1.5)
    fade(tl, line.material, 0, gone.start, gone.duration)
    const s = spagStations[i]!
    const a = q(0.75 + i * 0.3, 1.5 + i * 0.3)
    inkIn(tl, s, a.start, a.duration)
    inkOut(tl, s, gone.start, gone.duration * 0.6)
  })
  const flow = swarmOf(cast.get('flow'))
  const mainSteps: Array<[number, number, number]> = [
    [QB.router + 0.5, QB.router + 2, MAIN_AT.gate + 0.03],
    [QB.lanes, QB.lanes + 1.5, MAIN_AT.hall + 0.05],
    [QB.gate, QB.gate + 1.5, 1],
  ]
  /** How far along the main road the belt of carts reaches at a beat. */
  const revealed = (beat: number) => {
    let r = 0
    let from = 0
    for (const [a, bb, to] of mainSteps) {
      r = mix(from, to, easeInOut(win(beat, a, bb)))
      if (beat < bb) break
      from = to
    }
    return r
  }
  const booth = v3(BOOTH)
  const carts = q(0, pipeGrid.totalBeats)
  drive(tl, carts.start, carts.duration, (u) => {
    const beat = u * pipeGrid.totalBeats
    const spagOn = 1 - easeInOut(win(beat, QB.router + 0.25, QB.router + 1.5))
    // Six carts on the spaghetti, two per belt, each belt waking its station as a cart passes.
    for (let k = 0; k < 6; k++) {
      const i = k % 3
      const line = spag[i]!
      const p = frac(beat * 0.14 + k * 0.5)
      const on = spagOn * easeInOut(win(beat, 0.75 + i * 0.3, 1.75 + i * 0.3))
      line.point(p, tmp)
      tmp.y += 0.02
      flow.place(k, tmp.x, tmp.y, tmp.z, on, 0, 0, yawOnPath(spagAt[i]!, p))
    }
    spagStations.forEach((s, i) => {
      let pulse = 0
      for (let k = i; k < 6; k += 3) {
        const p = frac(beat * 0.14 + k * 0.5)
        pulse = Math.max(pulse, 1 - clamp01(Math.abs(p - 0.5) / 0.12))
      }
      s.object.scale.setScalar(1 + 0.18 * pulse * spagOn)
    })
    // Five carts on the main belt, as far as it is drawn. One of them is risky: it goes to the booth.
    const drawn = revealed(beat)
    for (let k = 0; k < 5; k++) {
      const p = (beat - (QB.router + 1.5) - k * 1.7) * 0.05
      const shownCart = p >= 0 && p <= drawn ? 1 : 0
      const pc = clamp01(p)
      mainPath(pc, tmp)
      let yaw = yawOnPath(mainPath, pc)
      if (k === 2 && p > MAIN_AT.exit) {
        mainPath(MAIN_AT.exit, tmp2)
        tmp.lerpVectors(tmp2, booth, clamp01((p - MAIN_AT.exit) / 0.08))
        yaw = yawAlong(tmp2, booth)
      }
      flow.place(6 + k, tmp.x, tmp.y, tmp.z, shownCart, 0, 0, yaw)
    }
    flow.commit()
  })

  // ---- 10.4 after: one gatehouse, and one of the hall's folk walks out of the west arch to keep it ----
  const routerWalk = q(QB.router + 0.25, QB.router + 4.25)
  walkPath(tl, cast, FOLK.router, routerWalk.start, routerWalk.duration, [homeAt(FOLK.router, HALL_SCALE.tasks[3]), [-2.8, 0, 3.4], [-5.6, 0, 5.6], [-7.6, 0, 6.6], [-21.0, 0, 7.4]])
  const routerStep = q(QB.router + 1.75, QB.router + 2.75)
  hallStep(tl, cast, routerStep.start, routerStep.duration, HALL_SCALE.tasks[3], HALL_SCALE.router, homeAfter(FOLK.router))

  // ---- 10.6: the workshops along the belt, and the person who asks -----------------------------
  for (const [id, from, to] of [['refine', 1, 1.75], ['requester', 2.5, 3.25]] as const) {
    const a = q(QB.lanes + from, QB.lanes + to)
    inkIn(tl, el(id), a.start, a.duration)
  }
  const refineWalk = q(QB.lanes + 0.25, QB.lanes + 2.25)
  walkPath(tl, cast, FOLK.refine, refineWalk.start, refineWalk.duration, [homeAt(FOLK.refine, HALL_SCALE.router), [-1.0, 0, 3.8], [-5.4, 0, 5.4], [-7.6, 0, 6.4], [-11.0, 0, 5.4], [-11.6, 0, 4.7]])
  const refineStep = q(QB.lanes + 1.75, QB.lanes + 2.75)
  hallStep(tl, cast, refineStep.start, refineStep.duration, HALL_SCALE.router, HALL_SCALE.refine, homeAfter(FOLK.refine))

  // ---- 10.6: the merge gate, the market, the booth; the person at the exit goes ----------------
  const reviewerOut = q(QB.gate + 0.25, QB.gate + 0.85)
  inkOut(tl, el('reviewer'), reviewerOut.start, reviewerOut.duration)
  for (const [id, from, to] of [['market', 1.75, 2.5], ['booth', 2.25, 3]] as const) {
    const a = q(QB.gate + from, QB.gate + to)
    inkIn(tl, el(id), a.start, a.duration)
  }
  // The town produces: the fields are tilled, fenced, and the hay stacked.
  const swarms = { fields: swarmOf(cast.get('fields')), rows: swarmOf(cast.get('rows')), bales: swarmOf(cast.get('bales')) }
  const fieldTones = [town.field, town.fieldDark, '#E4D19A']
  FIELDS.forEach((_, i) => swarms.fields.paint(i, fieldTones[i % 3]!))
  const farmland = q(QB.gate + 2, QB.gate + 4.5)
  drive(tl, farmland.start, farmland.duration, (u) => {
    const grow = (i: number, n: number) => easeOut(win(u, (i / n) * 0.5, (i / n) * 0.5 + 0.5))
    FIELDS.forEach(([x, y, z], i) => {
      const s = grow(i, FIELDS.length)
      swarms.fields.place(i, x, y, z, s)
      for (let r = 0; r < 3; r++) swarms.rows.place(i * 3 + r, x, y, z + (r - 1) * (FIELD_TILE.d * 0.3), s)
    })
    BALES.forEach(([x, y, z], i) => swarms.bales.place(i, x, y, z, grow(i, BALES.length), 0, ((i * 5) % 3) * 0.3))
    swarms.fields.commit()
    swarms.rows.commit()
    swarms.bales.commit()
  })
  FARMS.forEach((_, i) => {
    const a = q(QB.gate + 2.25 + i * 0.3, QB.gate + 3 + i * 0.3)
    inkIn(tl, el(`fence.${i}`), a.start, a.duration)
  })

  // ---- 10.6: the watchtower; the repair crew leaves the hall, walks a turn of the loop, and goes out to stand by the mill's road ----
  const towerIn = q(QB.side + 0.5, QB.side + 1.25)
  inkIn(tl, el('tower'), towerIn.start, towerIn.duration)
  const repair = el('repair')
  const RIDE = { from: QB.side + 1.5, to: QB.side + 3.2, length: 0.3 }
  const repairOut = polyline([homeAt(FOLK.tower, HALL_SCALE.refine), [3.4, 0, 1.2], [4.95, 0, -2.85]])
  loopAt(0.5 + RIDE.length, tmp)
  const repairAway = polyline([[tmp.x + 0.55, 0, tmp.z + 0.55], [5.6, 0, 1.0], [5.9, 0, -4.5], [6.4, 0, -6.8], [9.5, 0, -6.2], [11.0, 0, -4.5]])
  const step = (path: (u: number, out: Vector3) => Vector3, w: number) => {
    path(w, tmp)
    path(Math.min(1, w + 0.01), tmp2)
    repair.object.position.copy(tmp)
    const dx = tmp2.x - tmp.x
    const dz = tmp2.z - tmp.z
    if (dx * dx + dz * dz > 1e-8) repair.object.rotation.y = Math.atan2(dx, dz)
  }
  const walk = q(QB.side + 0.5, pipeGrid.totalBeats)
  drive(tl, walk.start, walk.duration, (u) => {
    const beat = QB.side + 0.5 + u * (pipeGrid.totalBeats - QB.side - 0.5)
    if (beat < RIDE.from) {
      // Off the platform, east, to the corner of the loop.
      step(repairOut, easeInOut(win(beat, QB.side + 0.5, RIDE.from)))
      return
    }
    if (beat < RIDE.to) {
      // A turn of the loop, beside the carts.
      const p = 0.5 + win(beat, RIDE.from, RIDE.to) * RIDE.length
      loopAt(p, tmp)
      loopAt(p + 0.01, tmp2)
      tmp.x += 0.55
      tmp.z += 0.55
      repair.object.position.copy(tmp)
      repair.object.rotation.y = Math.atan2(tmp2.x - tmp.x + 0.55, tmp2.z - tmp.z + 0.55)
      return
    }
    // Out of the north east postern, to stand by the mill's road: housekeeping lives with the automation.
    step(repairAway, easeInOut(win(beat, RIDE.to, pipeGrid.totalBeats)))
    if (beat >= pipeGrid.totalBeats) repair.object.rotation.y = 0.8
  })
  const towerStep = q(QB.side + 1.25, QB.side + 2.25)
  hallStep(tl, cast, towerStep.start, towerStep.duration, HALL_SCALE.refine, HALL_SCALE.tower, homeAfter(FOLK.tower))
})
