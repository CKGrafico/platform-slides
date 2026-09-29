/**
 * Part 10 moves (beats 10.2 and 10.3). All times come from the beat grid in
 * index.tsx: grid.b(n) is n beats into the scene.
 *
 * Each task cube has one writer for its position: one tween on a proxy, over
 * the whole path (out of the monolith, landing, along the orbit). So scrubbing
 * back and forth always gives the same frame.
 */
import { Color, Vector3, type Group, type MeshToonMaterial } from 'three'
import { artOf } from '@/art/elements'
import { inkIn, hidden } from '@/art/motion'
import { arcPoint, easeInOut, orbitOf, orbitPoint } from '@/art/orbits'
import { palette } from '@/art/palette'
import { defineChoreography } from '@/world/actors'
import { OUTER, TASKS } from '../../actors'
import { grid } from '.'

const KEY = '10-agentic-workflows/pull-out'
const { b } = grid

/** Scale of the monolith while it holds all the tasks, then after each task leaves. */
const GROWN = 1.55
const AFTER_EACH = [1.36, 1.19, 1.02, 0.86]
/** Where each satellite lands on the outer orbit, and how far it moves in stop 3. */
const LANDING_ANGLES = [0.12, 0.38, 0.62, 0.88].map((f) => f * Math.PI)
const ORBIT_SWEEP = 0.45
const COLORS = [palette.sage, palette.lilac, palette.sage, palette.lilac]

/**
 * Where each task waits, held close around the grown monolith: inside its
 * field, where paths wobble. Turned, so each one reads as a cube.
 */
const HELD = [
  { x: -1.15, y: 0.95, z: 0.55, ry: 0.7, rx: 0.45 },
  { x: 1.2, y: 0.55, z: 0.45, ry: -0.6, rx: 0.5 },
  { x: -1.05, y: -0.55, z: 0.6, ry: 0.75, rx: -0.45 },
  { x: 1.1, y: -0.85, z: 0.5, ry: -0.75, rx: 0.4 },
]

export const agenticWorkflowsMoves = defineChoreography('10-agentic-workflows', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))

  // Stop 1: the monolith grows to hold the tasks.
  const monolith = cast.get('monolith')
  const grow = span(0.5, 2)
  tl.to(monolith.scale, { x: GROWN, y: GROWN, z: GROWN, duration: grow.duration, ease: 'power3.inOut' }, grow.start)

  // Stop 2: the outer orbit appears as the first task gets ready to leave.
  const outer = orbitOf(cast.get<Group>('orbit.outer'))
  const outerIn = span(4.5, 6)
  tl.to(outer.material, { opacity: 0.8, duration: outerIn.duration, ease: 'power2.out' }, outerIn.start)

  // Stop 3: the inner orbit appears near the monolith. It wobbles by design.
  const inner = orbitOf(cast.get<Group>('orbit.inner'))
  const innerIn = span(14.5, 16)
  tl.to(inner.material, { opacity: 0.8, duration: innerIn.duration, ease: 'power2.out' }, innerIn.start)

  const orbitWin = span(14, 20)

  TASKS.forEach((name, i) => {
    const el = artOf<MeshToonMaterial>(cast.get(`task.${name}`))
    const held = HELD[i]!
    const start = new Vector3(held.x, held.y, held.z)
    const land = orbitPoint(OUTER, LANDING_ANGLES[i]!)
    const tmp = new Vector3()

    // Enter on the monolith's face in stop 1, one per half beat.
    hidden(tl, el)
    tl.set(el.object.position, { x: start.x, y: start.y, z: start.z }, 0)
    tl.set(el.object.rotation, { x: held.rx, y: held.ry, z: 0 }, 0)
    const enter = span(1.5 + i * 0.5, 2.25 + i * 0.5)
    inkIn(tl, el, enter.start, enter.duration)

    // Stop 2: pop out on an arc and land on the orbit, one every 2 beats.
    const pop = span(5 + i * 2, 7 + i * 2)
    const total = orbitWin.start + orbitWin.duration - pop.start
    const proxy = { u: 0 }
    tl.to(
      proxy,
      {
        u: 1,
        duration: total,
        ease: 'none',
        onUpdate: () => {
          const time = pop.start + proxy.u * total
          if (time <= pop.start + pop.duration) {
            arcPoint(start, land, 1.2, easeInOut((time - pop.start) / pop.duration), tmp)
          } else if (time < orbitWin.start) {
            tmp.copy(land)
          } else {
            const v = easeInOut((time - orbitWin.start) / orbitWin.duration)
            orbitPoint(OUTER, LANDING_ANGLES[i]! + ORBIT_SWEEP * v, tmp)
          }
          el.object.position.copy(tmp)
        },
      },
      pop.start,
    )

    // It turns into a pastel satellite as it lands.
    const target = new Color(COLORS[i])
    const tint = span(6.25 + i * 2, 7 + i * 2)
    tl.to(el.body.material.color, { r: target.r, g: target.g, b: target.b, duration: tint.duration, ease: 'power2.out' }, tint.start)

    // The monolith shrinks a step as each task leaves.
    const shrink = span(5.5 + i * 2, 6.5 + i * 2)
    const s = AFTER_EACH[i]!
    tl.to(monolith.scale, { x: s, y: s, z: s, duration: shrink.duration, ease: 'power3.out' }, shrink.start)
  })

})
