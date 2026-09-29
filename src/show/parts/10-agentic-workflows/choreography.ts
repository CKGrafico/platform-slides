/**
 * Part 10 moves (beats 10.2 and 10.3). All times come from the beat grid in
 * index.tsx: grid.b(n) is n beats into the scene.
 *
 * The extraction: the tasks sit in the core's surface. One per two beats, a
 * task sinks a little, the surface swells, the task pushes out and drags the
 * surface with it like a drop, the surface snaps back and wobbles, and the task
 * flies on an arc to the clean outer orbit, where it turns pastel.
 *
 * One writer for all of it: a single drive() over the scene computes the core
 * scale, the four bumps on the core's surface, and every task position from
 * the beat alone. So any frame, reached from anywhere, is always the same.
 */
import { Color, Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf, coreOf } from '@/art/elements'
import { drive } from '@/art/motion'
import { arcPoint, easeInOut, orbitOf, orbitPoint } from '@/art/orbits'
import { palette } from '@/art/palette'
import { defineChoreography } from '@/world/actors'
import { OUTER, TASKS } from '../../actors'
import { CORE_R, CORE_SCALE_BEFORE_P10, TASK_DEPTH, TASK_DIRS } from '../../layout'
import { grid } from '.'

const KEY = '10-agentic-workflows/pull-out'
const { b } = grid

const R0 = CORE_R
/** Scale of the core while it holds all the tasks, then after each task leaves. */
const GROWN = 1.55
const AFTER_EACH = [1.36, 1.19, 1.02, 0.86]
/** Where each satellite lands on the outer orbit, and how far it moves in stop 3. */
const LANDING_ANGLES = [0.12, 0.38, 0.62, 0.88].map((f) => f * Math.PI)
const ORBIT_SWEEP = 0.45
const COLORS = [palette.sage, palette.lilac, palette.sage, palette.lilac]

/** Where each task sits in the surface (since 6.2): near the edge of the silhouette, so the drop shows in profile. */
const DIRS = TASK_DIRS.map((d) => new Vector3(d[0], d[1], d[2]).normalize())

// Beats of the story.
const GROW = [0.5, 2] as const
const popAt = (i: number) => 5 + i * 2
const POP = 2
const SWEEP = [14, 20] as const

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
const easeIn = (t: number) => Math.pow(clamp01(t), 2.2)
const mix = (a: number, bb: number, t: number) => a + (bb - a) * t

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

export const agenticWorkflowsMoves = defineChoreography('10-agentic-workflows', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  const coreObj = cast.get('core')
  const core = coreOf(coreObj)
  const tasks = TASKS.map((name) => artOf<MeshToonMaterial>(cast.get(`task.${name}`)))
  const landing = LANDING_ANGLES.map((a) => orbitPoint(OUTER, a))
  const tmp = new Vector3()
  const release = new Vector3()

  const scene = span(0, grid.totalBeats)
  drive(tl, scene.start, scene.duration, (u) => {
    const beat = u * grid.totalBeats
    const s = coreScale(beat)
    coreObj.scale.setScalar(s)
    const R = R0 * s

    tasks.forEach((el, i) => {
      const dir = DIRS[i]!
      const bump = core.bumps[i]!
      bump.dir.copy(dir)
      let amount: number
      let width = 0.12
      let pop = 1

      const p = popAt(i)
      const v = win(beat, p, p + POP)
      if (beat < p) {
        // It sits in the surface, and the surface holds it as the core grows.
        tmp.copy(dir).multiplyScalar(TASK_DEPTH * R)
        amount = 0.02
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
      el.object.position.copy(tmp)
      el.object.scale.setScalar(pop)
    })
  })

  // Stop 2: the outer orbit appears as the first task gets ready to leave.
  const outer = orbitOf(cast.get<Group>('orbit.outer'))
  const outerIn = span(4.5, 6)
  tl.to(outer.material, { opacity: 0.8, duration: outerIn.duration, ease: 'power2.out' }, outerIn.start)

  // Stop 3: the inner orbit appears near the core. It wobbles by design.
  const inner = orbitOf(cast.get<Group>('orbit.inner'))
  const innerIn = span(14.5, 16)
  tl.to(inner.material, { opacity: 0.8, duration: innerIn.duration, ease: 'power2.out' }, innerIn.start)

  // Each task turns into a pastel satellite as it lands.
  tasks.forEach((el, i) => {
    const target = new Color(COLORS[i])
    const tint = span(popAt(i) + POP * 0.75, popAt(i) + POP)
    tl.to(el.body.material.color, { r: target.r, g: target.g, b: target.b, duration: tint.duration, ease: 'power2.out' }, tint.start)
  })
})
