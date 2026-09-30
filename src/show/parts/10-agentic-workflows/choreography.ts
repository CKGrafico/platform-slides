/**
 * Part 10 moves, as the town. The world of orbits steps out while the town is
 * on (the slice of docs/art/town-proposal.md), and comes back after it.
 *
 * pull-out: the hall is big and closed; the tasks leave it by the door and
 * land on the belt loop, and the hall shrinks each time; the GitHub Actions
 * station and its steps join the loop; most coins go.
 *
 * pipeline: belts everywhere with stations that wake on every cart; then one
 * main belt with a gatehouse; the workshops along it; the exit gate, the
 * market and the booth; the watchtower and the repair crew on the loop.
 */
import { Color, Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { town } from '@/art/town'
import { sketchOf } from '@/art/lines'
import { drive, fade, hidden, inkIn, inkOut, shown } from '@/art/motion'
import { arcPoint, easeInOut } from '@/art/orbits'
import { palette } from '@/art/palette'
import { defineChoreography } from '@/world/actors'
import { STEPS, TASKS } from '../../actors'
import { stackPoint, stackTilt } from '../../coins'
import { TOKEN_COINS, TOKENS_LEFT } from '../../layout'
import { BALES, BOOTH, BUSHES, COINS, FARMS, FIELDS, FIELD_TILE, FLOWERS, HALL_AFTER_EACH, HALL_BIG, HALL_DOOR, LOOP_LANDING, LOOP_SWEEP, MAIN_AT, PINE_TREES, ROCKS, ROUND_TREES, SPAGHETTI, STATION, STEP_LANDING } from '../../town/layout'
import { grid, PB, pipeGrid, QB } from '.'

const PULL = '10-agentic-workflows/pull-out'
const PIPE = '10-agentic-workflows/pipeline'
const { b } = grid
const pb = pipeGrid.b

/** The town's art elements: they wait hidden until this part. Belts are lines and start with reveal 0. */
const TOWN_ART = ['plot', 'road.main', 'road.loop', 'hall', 'well', 'station', 'blades', 'gatehouse', 'exit', 'triage', 'refine', 'market', 'booth', 'tower', 'requester', 'repair', 'spagstation.0', 'spagstation.1', 'spagstation.2', ...FARMS.map((_, i) => `fence.${i}`)].map((n) => `town.${n}`)
/** The land's swarms: placed by a drive, so they start at nothing. Nature first; the fields when the town produces. */
const NATURE = ['trunks', 'canopies', 'pines', 'bushes', 'rocks', 'flowers'].map((n) => `town.${n}`)
const FARMLAND = ['fields', 'rows', 'bales'].map((n) => `town.${n}`)
/** Actors of the world of orbits that the town borrows: the tasks, the steps, the coins, the carts. */
const BORROWED = new Set<string>(['flow', 'tokens', ...TASKS.map((n) => `task.${n}`), ...STEPS.map((n) => `step.${n}`)])

const COLORS = [palette.sage, palette.lilac, palette.peach, palette.butter]
const popAt = (i: number) => PB.pop + 1 + i * 2
const POP = 2

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
const mix = (a: number, bb: number, t: number) => a + (bb - a) * t
const frac = (v: number) => v - Math.floor(v)
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

/** The hall's scale at a beat: big, then a step smaller as each task leaves. */
function hallScale(beat: number): number {
  let s = HALL_BIG
  HALL_AFTER_EACH.forEach((after, i) => {
    const release = popAt(i) + POP * 0.5
    const before = i === 0 ? HALL_BIG : HALL_AFTER_EACH[i - 1]!
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

  // ---- the hand-over: the world of orbits steps out, and comes back after the town ----------
  for (const id of TOWN_ART) hidden(tl, el(id))
  const out = span(0.05, 0.05).start
  // A hair after the last stop, so the world of orbits is not back on it.
  const back = t.at(PIPE, 1) + 0.01
  for (const id of cast.ids()) {
    if (BORROWED.has(id)) continue
    const o = cast.get(id)
    const isTown = id.startsWith('town.')
    tl.set(o, { visible: isTown }, out)
    tl.set(o, { visible: !isTown }, back)
  }

  // ---- 10.2: the hall, big and closed; the tasks leave it -----------------------------------
  const plot = el('town.plot')
  const hall = el('town.hall')
  tl.set(hall.object.scale, { x: HALL_BIG, y: HALL_BIG, z: HALL_BIG }, 0)
  const plotIn = span(0.25, 1.25)
  inkIn(tl, plot, plotIn.start, plotIn.duration)

  // An empty map: the woods, bushes, rocks and flowers come up from nothing, a little apart.
  const swarms = Object.fromEntries([...NATURE, ...FARMLAND].map((id) => [id, swarmOf(cast.get(id))]))
  const leafTones = [town.leaf, town.leafLight, town.leafDark]
  const petals = [palette.peach, palette.lilac, palette.butter, palette.surface]
  ROUND_TREES.forEach((_, i) => swarms['town.canopies']!.paint(i, leafTones[i % 3]!))
  FLOWERS.forEach((_, i) => swarms['town.flowers']!.paint(i, petals[i % 4]!))
  const land = span(0.3, 2.4)
  drive(tl, land.start, land.duration, (u) => {
    const grow = (i: number, n: number) => easeOut(win(u, (i / n) * 0.55, (i / n) * 0.55 + 0.45))
    ROUND_TREES.forEach(([x, y, z], i) => {
      const s = grow(i, ROUND_TREES.length)
      swarms['town.trunks']!.place(i, x, y, z, s)
      swarms['town.canopies']!.place(i, x, y, z, s * (0.8 + 0.35 * (((i * 7) % 5) / 5)))
    })
    PINE_TREES.forEach(([x, y, z], i) => {
      const s = grow(i, PINE_TREES.length)
      swarms['town.trunks']!.place(ROUND_TREES.length + i, x, y, z, s)
      swarms['town.pines']!.place(i, x, y, z, s * (0.8 + 0.4 * (((i * 3) % 5) / 5)))
    })
    BUSHES.forEach(([x, y, z], i) => swarms['town.bushes']!.place(i, x, y, z, grow(i, BUSHES.length)))
    ROCKS.forEach(([x, y, z], i) => swarms['town.rocks']!.place(i, x, y, z, grow(i, ROCKS.length), 0, ((i * 13) % 7) * 0.4))
    FLOWERS.forEach(([x, y, z], i) => swarms['town.flowers']!.place(i, x, y, z, grow(i, FLOWERS.length)))
    for (const id of NATURE) swarms[id]!.commit()
  })
  const hallIn = span(0.75, 1.75)
  inkIn(tl, hall, hallIn.start, hallIn.duration)
  inkIn(tl, el('town.well'), hallIn.start + 0.6, hallIn.duration * 0.8)

  const loop = sketchOf(cast.get<Group>('town.loop'))
  const loopIn = span(PB.pop, PB.pop + 2)
  inkIn(tl, el('town.road.loop'), loopIn.start - 0.25, loopIn.duration * 0.6)
  tl.to(loop.reveal, { value: 1, duration: loopIn.duration, ease: 'power2.inOut' }, loopIn.start)

  const tasks = TASKS.map((name) => artOf<MeshToonMaterial>(cast.get(`task.${name}`)))
  const door = v3(HALL_DOOR)
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
    hall.object.scale.setScalar(hallScale(beat))
    tasks.forEach((task, i) => {
      const v = win(beat, popAt(i), popAt(i) + POP)
      if (beat < popAt(i)) {
        task.object.position.copy(door)
        task.object.scale.setScalar(1)
        return
      }
      const ride = LOOP_LANDING[i]! + LOOP_SWEEP * easeInOut(win(beat, PB.distance, PB.back))
      loop.point(ride, tmp2)
      tmp2.y += 0.22
      if (v < 1) arcPoint(door, tmp2, 1.1, easeInOut(v), tmp)
      else tmp.copy(tmp2)
      task.object.position.copy(tmp)
      task.object.scale.setScalar(1 + 0.16 * Math.sin(Math.PI * clamp01(v / 0.35)))
    })
  })

  // ---- 10.3: the GitHub Actions station and its steps join the loop ----------------------------
  const station = el('town.station')
  const stationIn = span(PB.back + 0.5, PB.back + 1.5)
  inkIn(tl, station, stationIn.start, stationIn.duration)
  inkIn(tl, el('town.blades'), stationIn.start + stationIn.duration * 0.4, stationIn.duration * 0.6)
  const steps = STEPS.map((name) => el(`step.${name}`))
  const stationDoor = v3(STATION).add(new Vector3(-0.6, 0.3, 0.5))
  steps.forEach((step, k) => {
    const a = span(PB.back + 1 + k * 0.25, PB.back + 1.5 + k * 0.25)
    inkIn(tl, step, a.start, a.duration)
    tl.set(step.object.scale, { x: 0.7, y: 0.7, z: 0.7 }, a.start)
  })
  const joining = span(PB.back + 1, grid.totalBeats)
  drive(tl, joining.start, joining.duration, (u) => {
    const beat = PB.back + 1 + u * (grid.totalBeats - PB.back - 1)
    steps.forEach((step, k) => {
      const a = PB.back + 1 + k * 0.25
      const w = easeInOut(win(beat, a, a + 1.6))
      loop.point(STEP_LANDING[k]! + 0.04 * easeInOut(win(beat, PB.resort, grid.totalBeats)), tmp2)
      tmp2.y += 0.2
      arcPoint(stationDoor, tmp2, 0.8, w, tmp)
      step.object.position.copy(tmp)
    })
  })

  // ---- 10.4: the hall is the last resort; most coins go ----------------------------------------
  const tokens = swarmOf(cast.get('tokens'))
  const coinAway = (c: number) => PB.resort + 0.5 + (TOKEN_COINS - 1 - c) * 0.12
  const away = new Vector3()
  const release = new Vector3()
  const coins = span(0.25, grid.totalBeats)
  drive(tl, coins.start, coins.duration, (u) => {
    const beat = 0.25 + u * (grid.totalBeats - 0.25)
    const pile = easeOut(win(beat, 0.25, 1.25))
    for (let c = 0; c < TOKEN_COINS; c++) {
      stackPoint(COINS, c, 1, tmp)
      const [rx, rz] = stackTilt(c)
      const w = c < TOKENS_LEFT ? 0 : easeInOut(win(beat, coinAway(c), coinAway(c) + 1.1))
      away.set(tmp.x + 1.4 + (c % 3) * 0.5, tmp.y + 2.4 + (c % 4) * 0.3, tmp.z - 1.4 + ((c % 2) - 0.5) * 1.2)
      arcPoint(tmp, away, 0.6, w, release)
      tokens.place(c, release.x, release.y, release.z, pile * (1 - w), rx * (1 + 6 * w), rz * (1 + 6 * w))
    }
    tokens.commit()
  })

  // ---- pipeline, 10.4 before: belts everywhere, every station waking on every cart ------------
  const spag = SPAGHETTI.map((_, i) => sketchOf(cast.get<Group>(`town.spag.${i}`)))
  const spagStations = SPAGHETTI.map((_, i) => el(`town.spagstation.${i}`))
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
  const main = sketchOf(cast.get<Group>('town.main'))
  const mainSteps: Array<[number, number, number]> = [
    [QB.router + 0.5, QB.router + 2, MAIN_AT.gate + 0.04],
    [QB.lanes, QB.lanes + 1.5, MAIN_AT.hall + 0.06],
    [QB.gate, QB.gate + 1.5, 1],
  ]
  /** How much of the main belt is drawn at a beat. */
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
  // The road is laid as the belt is drawn: it grows from its west end.
  const roadMain = el('town.road.main')
  const belt = q(QB.router + 0.5, QB.router + 0.5)
  shown(tl, roadMain, belt.start)
  drive(tl, belt.start, t.at(PIPE, 1) - belt.start, (u) => {
    const beat = QB.router + 0.5 + u * (pipeGrid.totalBeats - QB.router - 0.5)
    const r = revealed(beat)
    main.reveal.value = r
    roadMain.object.scale.x = Math.max(0.001, r)
  })
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
      tmp.y += 0.14
      flow.place(k, tmp.x, tmp.y, tmp.z, on)
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
      const p = (beat - (QB.router + 1.5) - k * 1.7) * 0.055
      const shown = p >= 0 && p <= drawn ? 1 : 0
      main.point(clamp01(p), tmp)
      tmp.y += 0.14
      if (k === 2 && p > MAIN_AT.exit) {
        main.point(MAIN_AT.exit, tmp2)
        tmp2.y += 0.14
        arcPoint(tmp2, booth, 0.5, clamp01((p - MAIN_AT.exit) / 0.08), tmp)
      }
      flow.place(6 + k, tmp.x, tmp.y, tmp.z, shown)
    }
    flow.commit()
  })

  // ---- 10.4 after: one gatehouse -----------------------------------------------------------------
  const gatehouse = el('town.gatehouse')
  const gateIn = q(QB.router + 1, QB.router + 1.75)
  inkIn(tl, gatehouse, gateIn.start, gateIn.duration)

  // ---- 10.6: the workshops along the belt, and the person who asks -----------------------------
  for (const [id, from, to] of [['town.triage', 0.5, 1.25], ['town.refine', 1, 1.75], ['town.requester', 2.5, 3.25]] as const) {
    const a = q(QB.lanes + from, QB.lanes + to)
    inkIn(tl, el(id), a.start, a.duration)
  }

  // ---- 10.6: the exit gate, the market, the booth ----------------------------------------------
  for (const [id, from, to] of [['town.exit', 0.75, 1.5], ['town.market', 1.75, 2.5], ['town.booth', 2.25, 3]] as const) {
    const a = q(QB.gate + from, QB.gate + to)
    inkIn(tl, el(id), a.start, a.duration)
  }
  // The town produces: the fields are tilled, fenced, and the hay stacked.
  const fieldTones = [town.field, town.fieldDark, '#E4D19A']
  FIELDS.forEach((_, i) => swarms['town.fields']!.paint(i, fieldTones[i % 3]!))
  const farmland = q(QB.gate + 2, QB.gate + 4.5)
  drive(tl, farmland.start, farmland.duration, (u) => {
    const grow = (i: number, n: number) => easeOut(win(u, (i / n) * 0.5, (i / n) * 0.5 + 0.5))
    FIELDS.forEach(([x, y, z], i) => {
      const s = grow(i, FIELDS.length)
      swarms['town.fields']!.place(i, x, y, z, s)
      for (let r = 0; r < 3; r++) swarms['town.rows']!.place(i * 3 + r, x, y, z + (r - 1) * (FIELD_TILE.d * 0.3), s)
    })
    BALES.forEach(([x, y, z], i) => swarms['town.bales']!.place(i, x, y, z, grow(i, BALES.length), 0, ((i * 5) % 3) * 0.3))
    for (const id of FARMLAND) swarms[id]!.commit()
  })
  FARMS.forEach((_, i) => {
    const a = q(QB.gate + 2.25 + i * 0.3, QB.gate + 3 + i * 0.3)
    inkIn(tl, el(`town.fence.${i}`), a.start, a.duration)
  })

  // ---- 10.6: the watchtower and the repair crew on the loop -------------------------------------
  const towerIn = q(QB.side + 0.5, QB.side + 1.25)
  inkIn(tl, el('town.tower'), towerIn.start, towerIn.duration)
  const repair = el('town.repair')
  const repairIn = q(QB.side + 1, QB.side + 1.75)
  inkIn(tl, repair, repairIn.start, repairIn.duration)
  const walk = q(QB.side + 1, pipeGrid.totalBeats)
  drive(tl, walk.start, walk.duration, (u) => {
    const p = frac(0.5 + u * 0.35)
    loop.point(p, tmp)
    loop.point(p + 0.01, tmp2)
    tmp.x += 0.55
    tmp.z += 0.55
    repair.object.position.copy(tmp)
    repair.object.rotation.y = Math.atan2(tmp2.x - tmp.x + 0.55, tmp2.z - tmp.z + 0.55)
  })
})
