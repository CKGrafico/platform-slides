/**
 * The story of the talk, told by the entities (docs/art/art-direction.md).
 * One phase change: a fluid body that does everything hands its work out, and
 * the work solidifies into rigid lattices; a flow of units scatters when it is
 * left to improvise and runs clean once the rules are in; a wall of units
 * stops it at the edge. Only the core stays fluid.
 *
 * Every move is a tween on progress, so the picture is the same however the
 * presenter arrives at a stop, and it plays backwards.
 */
import type { Points, ShaderMaterial } from 'three'
import { defineChoreography } from '@/world/actors'
import { WORK_IDS } from './actors'

const uniforms = (o: Points) => (o.material as ShaderMaterial).uniforms as Record<string, { value: number }>

export const storyMoves = defineChoreography('story', (tl, cast, t) => {
  const core = cast.get<Points>('entity')
  const stream = cast.get<Points>('stream')
  const wall = cast.get<Points>('wall')
  const win = (key: string, from: number, to: number) => t.span(key, from, to)

  /** A rigid body forms out of scattered units and settles at full size. */
  const form = (body: Points, key: string, from: number, to: number) => {
    const w = win(key, from, to)
    tl.fromTo(body.scale, { x: 0.001, y: 0.001, z: 0.001 }, { x: 1, y: 1, z: 1, duration: w.duration, ease: 'power3.out' }, w.start)
    tl.fromTo(uniforms(body).uAssemble!, { value: 0 }, { value: 1, duration: w.duration, ease: 'power3.out' }, w.start)
  }

  // The core gives work away and gets smaller, but never freezes.
  const shrink = (key: string, from: number, to: number, a: number, b: number) => {
    const w = win(key, from, to)
    tl.fromTo(core.scale, { x: a, y: a, z: a }, { x: b, y: b, z: b, duration: w.duration, ease: 'power2.inOut' }, w.start)
  }
  shrink('05-actions-to-agents/actions', 0.7, 1, 1, 0.9)
  shrink('08-runtime/stack', 0.6, 1, 0.9, 0.82)
  shrink('10-agentic-workflows/pull-out', 0.3, 0.9, 0.82, 0.72)
  shrink('10-agentic-workflows/pipeline', 0.3, 0.9, 0.72, 0.66)
  shrink('12-project-health/health', 0.2, 0.5, 0.66, 0.6)

  // Work leaves the core and solidifies, one lattice at a time.
  form(cast.get<Points>(WORK_IDS[0]), '05-actions-to-agents/actions', 0.7, 1)
  form(cast.get<Points>(WORK_IDS[1]), '08-runtime/stack', 0.6, 1)
  form(cast.get<Points>(WORK_IDS[2]), '10-agentic-workflows/pull-out', 0.3, 0.8)
  form(cast.get<Points>(WORK_IDS[3]), '10-agentic-workflows/pipeline', 0.3, 0.8)

  // Left to improvise (part 6) the core boils and the stream scatters. The Harness (part 9) calms both.
  const boil = win('06-problems/problems', 0.3, 0.9)
  tl.fromTo(uniforms(core).uFluidity!, { value: 1 }, { value: 2.6, duration: boil.duration, ease: 'power2.inOut' }, boil.start)
  tl.fromTo(uniforms(stream).uAssemble!, { value: 1 }, { value: 0.2, duration: boil.duration, ease: 'power2.inOut' }, boil.start)
  const calm = win('09-harness/harness', 0.35, 0.9)
  tl.fromTo(uniforms(core).uFluidity!, { value: 2.6 }, { value: 1, duration: calm.duration, ease: 'power2.inOut' }, calm.start)
  tl.fromTo(uniforms(stream).uAssemble!, { value: 0.2 }, { value: 1, duration: calm.duration, ease: 'power2.inOut' }, calm.start)

  // The perimeter: a rigid wall rises across the stream (part 11).
  form(wall, '11-foundations/foundations', 0.35, 0.8)
})
