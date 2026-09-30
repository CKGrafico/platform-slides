/**
 * Part 5 moves. Each group of elements has one drive() that writes its
 * positions from the beat, so every frame is the same however it is reached.
 * Sacks fall into the mill; carts with barrels come out of it onto the road
 * and bend into the loop; the scroll goes into the scriptorium and the crate
 * comes out with its palisade of stakes; the first of the hall's folk walks
 * out to the triage house, and the hall steps down a size.
 */
import { Vector3, type Group } from 'three'
import { artOf } from '@/art/elements'
import { sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { arcPoint, easeInOut } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { EVENTS, SHELL, STEPS } from '../../actors'
import { FOLK, HALL_SCALE, hallStep, homeAfter, homeAt, walkPath } from '../../hall'
import { DOOR_BIG, LINE_BENT, LINE_X, LINE_Y, LINE_Z, LOCK_DOCK, SCRIPTORIUM_DOOR, STATION, STATION_TURN } from '../../layout'
import { B, grid, LOCK_POS, MD_OUT, SHELL_ANGLES, SHELL_RING, snapAt } from '.'

const KEY = '05-actions-to-agents/actions'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
const easeIn = (t: number) => Math.pow(clamp01(t), 2)
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

/** The mouth of the mill, where the sacks fall in, and its door, where the carts come out. */
const MILL_TOP = new Vector3(STATION[0], 1.7, STATION[2])
const MILL_DOOR = new Vector3(STATION[0] + Math.sin(STATION_TURN) * 0.7, LINE_Y, STATION[2] + Math.cos(STATION_TURN) * 0.7)

export const actionsToAgentsMoves = defineChoreography('05-actions-to-agents', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- 5.1: the mill appears, and its sails turn -------------------------------------------
  const mill = el('station')
  const millIn = span(2, 3)
  inkIn(tl, mill, millIn.start, millIn.duration)
  inkIn(tl, el('blades'), millIn.start + 0.4, millIn.duration * 0.8)

  // ---- events fall into it, then two of them run along the road ------------------------------
  const evts = EVENTS.map((name) => el(`evt.${name}`))
  evts.forEach((e, i) => {
    const s = B.events + 0.5 + i * 0.8
    const inA = span(s, s + 0.5)
    inkIn(tl, e, inA.start, inA.duration)
    const gone = span(s + 1.35, s + 1.65)
    inkOut(tl, e, gone.start, gone.duration)
  })
  const runs = [evts[0]!, evts[1]!]
  runs.forEach((e, i) => {
    const s = B.unfold + 2 + i * 0.9
    const back = span(s, s + 0.4)
    inkIn(tl, e, back.start, back.duration)
    const gone = span(s + 2.1, s + 2.4)
    inkOut(tl, e, gone.start, gone.duration)
  })
  const fall = span(B.events, B.core)
  drive(tl, fall.start, fall.duration, (u) => {
    const beat = B.events + u * (B.core - B.events)
    evts.forEach((e, i) => {
      const s = B.events + 0.5 + i * 0.8
      const w = easeIn(win(beat, s, s + 1.6))
      // Straight down from above, a little to one side, into the mill.
      const x0 = MILL_TOP.x + ((i % 3) - 1) * 0.55
      e.object.position.set(x0 + (MILL_TOP.x - x0) * w, 4.2 + (MILL_TOP.y - 4.2) * w, MILL_TOP.z + ((i % 2) - 0.5) * 0.3)
    })
    runs.forEach((e, i) => {
      const s = B.unfold + 2 + i * 0.9
      if (beat < s) return
      const w = win(beat, s, s + 2.4)
      e.object.position.set(LINE_X[0]! + 0.5 + (LINE_X[5]! - 0.5 - LINE_X[0]! - 0.5) * w, LINE_Y + 0.02, LINE_Z)
    })
  })

  // ---- 5.2: the carts come out of the mill onto a straight road ------------------------------
  const steps = STEPS.map((name) => el(`step.${name}`))
  steps.forEach((s, i) => {
    const a = span(B.unfold + 0.5 + i * 0.25, B.unfold + 1.1 + i * 0.25)
    inkIn(tl, s, a.start, a.duration)
  })
  const line = sketchOf(cast.get<Group>('p5.line'))
  const drawLine = span(B.unfold + 0.5, B.unfold + 2.5)
  tl.to(line.reveal, { value: 1, duration: drawLine.duration, ease: 'power2.inOut' }, drawLine.start)

  // ---- 5.3: the road bends into the loop around the hall -------------------------------------
  const loop = sketchOf(cast.get<Group>('loop'))
  const loopIn = span(B.core + 1, B.core + 2.75)
  inkIn(tl, el('road.loop'), loopIn.start - 0.3, loopIn.duration * 0.6)
  tl.to(loop.reveal, { value: 1, duration: loopIn.duration, ease: 'power2.inOut' }, loopIn.start)
  const wellIn = span(B.core + 1.5, B.core + 2.25)
  inkIn(tl, el('well'), wellIn.start, wellIn.duration)
  const curve = sketchOf(cast.get<Group>('p5.curve'))
  const bend = span(B.core + 2, B.core + 3.5)
  fade(tl, line.material, 0, bend.start, bend.duration)
  fade(tl, curve.material, 1, bend.start, bend.duration)

  const lineMoves = span(B.unfold, grid.totalBeats)
  const bent = LINE_BENT.map(v3)
  const tmp = new Vector3()
  const lineSpot = new Vector3()
  drive(tl, lineMoves.start, lineMoves.duration, (u) => {
    const beat = B.unfold + u * (grid.totalBeats - B.unfold)
    steps.forEach((s, i) => {
      // Each cart rolls out of the mill to its place on the road, facing west.
      const out = easeOut(win(beat, B.unfold + 0.5 + i * 0.25, B.unfold + 1.75 + i * 0.25))
      lineSpot.set(LINE_X[i]!, LINE_Y, LINE_Z)
      tmp.lerpVectors(MILL_DOOR, lineSpot, out)
      s.object.rotation.y = Math.atan2(-(LINE_Z - MILL_DOOR.z), LINE_X[i]! - MILL_DOOR.x)
      // The two carts near the hall turn toward the loop.
      const k = i - (steps.length - 2)
      if (k >= 0) {
        const w = easeInOut(win(beat, B.core + 2, B.core + 3.5))
        tmp.lerp(bent[k]!, w)
        if (w > 0) s.object.rotation.y = Math.atan2(-(bent[k]!.z - lineSpot.z), bent[k]!.x - lineSpot.x)
      }
      s.object.position.copy(tmp)
    })
  })

  // ---- 5.4 to 5.7: the scroll, the scriptorium, the crate and its palisade, the dock ----------
  const md = el('md')
  const mdIn = span(B.md + 0.5, B.md + 1.25)
  inkIn(tl, md, mdIn.start, mdIn.duration)
  // The scroll goes into the scriptorium; the crate comes out.
  const mdGone = span(B.compile + 1.2, B.compile + 1.5)
  inkOut(tl, md, mdGone.start, mdGone.duration)
  const scriptorium = el('scriptorium')
  const houseIn = span(B.compile + 0.25, B.compile + 1)
  inkIn(tl, scriptorium, houseIn.start, houseIn.duration)
  const lock = el('lock')
  const lockIn = span(B.compile + 1.6, B.compile + 2.2)
  inkIn(tl, lock, lockIn.start, lockIn.duration)

  const shell = SHELL.map((name) => el(`shell.${name}`))
  shell.forEach((s, i) => {
    const at = SHELL[i] === 'ours' ? B.ours + 0.5 : snapAt(i)
    const a = span(at, at + 0.6)
    inkIn(tl, s, a.start, a.duration)
  })

  const door = v3(DOOR_BIG)
  const out = v3(MD_OUT)
  const scriptDoor = v3(SCRIPTORIUM_DOOR)
  const lockPos = v3(LOCK_POS)
  // The crate docks at the size the hall has once the triage clerk has moved out.
  const dock = new Vector3(LOCK_DOCK[0] * HALL_SCALE.triage, LOCK_DOCK[1] * HALL_SCALE.triage, LOCK_DOCK[2] * HALL_SCALE.triage)
  const center = new Vector3()
  const crateCenter = new Vector3()
  const from = new Vector3()
  const target = new Vector3()
  const fileMoves = span(B.md, grid.totalBeats)
  drive(tl, fileMoves.start, fileMoves.duration, (u) => {
    const beat = B.md + u * (grid.totalBeats - B.md)
    // Out of the door and round to the west of the loop.
    const leave = easeInOut(win(beat, B.md + 0.5, B.md + 2.5))
    arcPoint(door, out, 1.4, leave, center)
    // To the scriptorium's door.
    const toHouse = easeInOut(win(beat, B.compile + 0.25, B.compile + 1.4))
    if (toHouse > 0) arcPoint(out, scriptDoor, 1.2, toHouse, center)
    md.object.position.copy(center)
    md.object.rotation.y = -0.6 * leave
    // The crate comes out in front of the scriptorium, then docks on the hall's platform.
    const comeOut = easeOut(win(beat, B.compile + 1.5, B.compile + 2.5))
    crateCenter.lerpVectors(scriptDoor, lockPos, comeOut)
    const docking = easeInOut(win(beat, B.clusters + 0.5, B.clusters + 3))
    if (docking > 0) arcPoint(lockPos, dock, 1.6, docking, crateCenter)
    lock.object.position.copy(crateCenter)
    shell.forEach((s, i) => {
      const at = SHELL[i] === 'ours' ? B.ours + 0.5 : snapAt(i)
      // Each stake comes from the scriptorium (ours from the town side) and plants itself on the ring.
      const snap = easeOut(win(beat, at, at + 1))
      const a = SHELL_ANGLES[i]!
      target.set(crateCenter.x + Math.cos(a) * SHELL_RING, crateCenter.y, crateCenter.z + Math.sin(a) * SHELL_RING)
      if (SHELL[i] === 'ours') from.set(crateCenter.x + 1.6, crateCenter.y, crateCenter.z + 1.0)
      else from.copy(scriptDoor)
      arcPoint(from, target, 0.9, snap, tmp)
      s.object.position.copy(tmp)
    })
  })

  // ---- 5.7: the triage house, and the first of the hall's folk moves out to it ----------------
  const triage = el('triage')
  const triIn = span(B.clusters + 2, B.clusters + 3)
  inkIn(tl, triage, triIn.start, triIn.duration)
  const walk = span(B.clusters + 0.5, B.clusters + 2.75)
  walkPath(tl, cast, FOLK.triage, walk.start, walk.duration, [homeAt(FOLK.triage, HALL_SCALE.start), [-2.7, 0, 3.3], [-6.0, 0, 4.6], [-7.3, 0, 4.5]])
  const smaller = span(B.clusters + 2, B.clusters + 3)
  hallStep(tl, cast, smaller.start, smaller.duration, HALL_SCALE.start, HALL_SCALE.triage, homeAfter(FOLK.triage))
})
