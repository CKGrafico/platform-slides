/**
 * Part 11 moves. Two small systems where work arrives faster and faster; the
 * phases on the ground; the disc and its grid; the walls; the verbs; and a
 * shortcut that breaks.
 */
import { Vector3, type Group } from 'three'
import { artOf, swarmOf } from '@/art/elements'
import { segmentsOf, sketchOf } from '@/art/lines'
import { drive, fade, inkIn, inkOut } from '@/art/motion'
import { easeInOut, orbitOf, orbitPoint } from '@/art/orbits'
import { defineChoreography } from '@/world/actors'
import { MESSY_POS, PHASE_RADII, SMALL_ORBITS, TIDY_POS, VERBS, WALL_ANGLES } from '../../layout'
import { B, grid } from '.'

const KEY = '11-foundations/foundations'
const { b } = grid

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const win = (beat: number, a: number, bb: number) => clamp01((beat - a) / (bb - a))
const v3 = (p: readonly [number, number, number]) => new Vector3(p[0], p[1], p[2])

/** When each piece of work reaches the small systems: faster and faster. */
const ARRIVALS = Array.from({ length: 10 }, (_, i) => B.amplify + 1.2 + 4 * (1 - Math.pow(0.82, i)) * 1.1)

export const foundationsMoves = defineChoreography('11-foundations', (tl, cast, t) => {
  const span = (from: number, to: number) => t.span(KEY, b(from), b(to))
  const el = (id: string) => artOf(cast.get(id))

  // ---- 11.1: a tidy system and a messy one -----------------------------------------------------
  for (const kind of ['tidy', 'messy'] as const) {
    const a = span(B.amplify + 0.25, B.amplify + 1)
    inkIn(tl, el(`${kind}.core`), a.start, a.duration)
    SMALL_ORBITS.forEach((_, i) => {
      const o = orbitOf(cast.get<Group>(`${kind}.orbit.${i}`))
      const draw = span(B.amplify + 0.5 + i * 0.25, B.amplify + 1.5 + i * 0.25)
      tl.to(o.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
      // The messy one loses its orbits as the work speeds up.
      if (kind === 'messy') {
        const lose = span(B.amplify + 3.4 + i * 0.4, B.amplify + 4.4 + i * 0.4)
        fade(tl, o.material, 0.12, lose.start, lose.duration)
      }
    })
  }
  const moons = swarmOf(cast.get('p11.moons'))
  const work = swarmOf(cast.get('p11.work'))
  const tidy = v3(TIDY_POS)
  const messy = v3(MESSY_POS)
  const tmp = new Vector3()
  const amp = span(B.amplify, B.phases + 1)
  drive(tl, amp.start, amp.duration, (u) => {
    const beat = B.amplify + u * (B.phases + 1 - B.amplify)
    const shown = win(beat, B.amplify + 0.75, B.amplify + 1.5) * (1 - win(beat, B.phases, B.phases + 0.75))
    for (let i = 0; i < 6; i++) {
      const isTidy = i < 3
      const center = isTidy ? tidy : messy
      const r = SMALL_ORBITS[i % 2]!
      const a = (i % 3) * 2.1 + beat * 0.25
      orbitPoint({ radius: r, tilt: 0.35, center: [center.x, center.y, center.z] }, a, tmp)
      if (!isTidy) {
        // The messy system breaks apart: its moons drift off as the work arrives faster.
        const loose = win(beat, B.amplify + 3.2 + (i - 3) * 0.35, B.amplify + 5.5)
        tmp.add(new Vector3(Math.cos(a) * 2.2, 0.8 - (i - 3) * 0.9, 0.4).multiplyScalar(easeInOut(loose)))
      }
      moons.place(i, tmp.x, tmp.y, tmp.z, shown)
    }
    ARRIVALS.forEach((at, k) => {
      const w = win(beat, at - 0.9, at)
      const target = k % 2 === 0 ? tidy : messy
      tmp.set(target.x + (k % 4 < 2 ? -3.2 : 3.2), target.y + 2.2, 0).lerp(target, easeInOut(w))
      work.place(k, tmp.x, tmp.y, tmp.z, w > 0 && w < 1 ? 1 : 0)
    })
    moons.commit()
    work.commit()
  })
  for (const kind of ['tidy', 'messy'] as const) {
    const out = span(B.phases, B.phases + 0.75)
    inkOut(tl, el(`${kind}.core`), out.start, out.duration)
    SMALL_ORBITS.forEach((_, i) => fade(tl, orbitOf(cast.get<Group>(`${kind}.orbit.${i}`)).material, 0, out.start, out.duration))
  }

  // ---- 11.2: three phase circles on the ground ----------------------------------------------------
  PHASE_RADII.forEach((_, i) => {
    const c = sketchOf(cast.get<Group>(`phase.${i}`))
    const draw = span(B.phases + 0.75 + i * 0.6, B.phases + 2.25 + i * 0.6)
    tl.to(c.reveal, { value: 1, duration: draw.duration, ease: 'power2.inOut' }, draw.start)
  })

  // ---- 11.3: the disc forms under everything -------------------------------------------------------
  const disc = el('disc')
  const discIn = span(B.disc + 0.25, B.disc + 1.75)
  inkIn(tl, disc, discIn.start, discIn.duration)
  const gridLines = segmentsOf(cast.get<Group>('disc.grid'))
  const gridIn = span(B.disc + 1.25, B.disc + 2.5)
  fade(tl, gridLines.material, 0.22, gridIn.start, gridIn.duration)

  // ---- 11.4: low walls rise around the lanes --------------------------------------------------------
  WALL_ANGLES.forEach((_, i) => {
    const w = el(`wall.${i}`)
    const rise = span(B.walls + 0.5 + i * 0.3, B.walls + 1.5 + i * 0.3)
    inkIn(tl, w, rise.start, rise.duration)
    tl.fromTo(w.object.scale, { y: 0.001 }, { y: 1, duration: rise.duration, ease: 'power3.out', immediateRender: false }, rise.start)
  })

  // ---- 11.5: verbs, not trust ----------------------------------------------------------------------
  VERBS.forEach((v, i) => {
    const at = span(B.verbs + 0.5 + i * 0.25, B.verbs + 1.25 + i * 0.25)
    if (v.hollow) {
      tl.to(sketchOf(cast.get<Group>(`verb.${v.id}`)).reveal, { value: 1, duration: at.duration, ease: 'power2.out' }, at.start)
    } else {
      inkIn(tl, el(`verb.${v.id}`), at.start, at.duration)
    }
  })

  // ---- 11.6: a shortcut from the first phase to the last breaks apart ------------------------------
  const halves = [0, 1].map((h) => cast.get<Group>(`shortcut.${h}`))
  halves.forEach((h, k) => {
    const s = sketchOf(h)
    const draw = span(B.skip + 0.5 + k * 0.4, B.skip + 1.1 + k * 0.4)
    tl.to(s.reveal, { value: 1, duration: draw.duration, ease: 'power2.out' }, draw.start)
    const breakAt = span(B.skip + 1.9, B.skip + 3.4)
    tl.to(h.position, { x: k === 0 ? -0.25 : 0.35, y: k === 0 ? -0.05 : 0.2, z: k === 0 ? 0.3 : -0.35, duration: breakAt.duration, ease: 'power2.out' }, breakAt.start)
    tl.to(h.rotation, { y: k === 0 ? 0.12 : -0.16, duration: breakAt.duration, ease: 'power2.out' }, breakAt.start)
    fade(tl, s.material, 0, breakAt.start + breakAt.duration * 0.4, breakAt.duration * 0.6)
  })
})
