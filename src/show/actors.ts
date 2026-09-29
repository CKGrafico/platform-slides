/**
 * The cast: every element that lives for the whole talk (docs/art/elements.md).
 * Parts move them in their choreography files, never here.
 */
import { smoothstep } from '@/animation/progress'
import { artOf, createBall, createCore } from '@/art/elements'
import { createOrbitLine } from '@/art/orbits'
import { palette } from '@/art/palette'
import { defineActor } from '@/world/actors'

/** The four tasks that leave the agent in part 10, in the order they leave. */
export const TASKS = ['labels', 'assign', 'comment', 'status'] as const

/** Outer orbit: clean, deterministic. Inner orbit: close to the core, it wobbles. */
export const OUTER = { radius: 3.6 }
export const INNER = { radius: 1.55 }
export const COVER_ORBIT = { radius: 1.45, tilt: 0.28 }

const core = defineActor({
  id: 'core',
  // Its surface deforms by itself (createCore), so it needs no ambient hook.
  create: () => createCore({ radius: 0.95 }).object,
})

const issue = defineActor({
  id: 'issue',
  create: () => createBall({ radius: 0.14, color: palette.accent }).object,
  // The one pre-show exception to "only the core moves by time": on the
  // cover the blue ball circles the core while the room fills. The orbit
  // closes to the center during the first move (the cover spans position 0 to 1),
  // so from then on the ball is placed only by choreographies.
  ambient: (o, time, position) => {
    const r = COVER_ORBIT.radius * (1 - smoothstep((position - 0.05) / 0.55))
    const a = time * 0.55
    artOf(o).inner.position.set(Math.cos(a) * r, -Math.sin(a) * r * Math.sin(COVER_ORBIT.tilt), Math.sin(a) * r * Math.cos(COVER_ORBIT.tilt))
  },
})

const coverOrbit = defineActor({
  id: 'orbit.cover',
  create: () => createOrbitLine({ spec: COVER_ORBIT, width: 3, opacity: 0.85 }).object,
})

const outerOrbit = defineActor({
  id: 'orbit.outer',
  create: () => createOrbitLine({ spec: OUTER, width: 3, opacity: 0 }).object,
})

const innerOrbit = defineActor({
  id: 'orbit.inner',
  create: () => createOrbitLine({ spec: INNER, wobble: 0.16, width: 3, opacity: 0 }).object,
})

const tasks = TASKS.map((name, i) =>
  defineActor({
    id: `task.${name}`,
    // A moon: a small, smooth sphere. Deterministic pieces never change shape.
    create: () => createBall({ radius: 0.2 }).object,
    // A small bounded sway around the angle the choreography sets, so a cube
    // never shows a single flat face. Ambient: inner only, a few degrees.
    ambient: (o, time) => {
      const inner = artOf(o).inner
      inner.rotation.y = Math.sin(time * 0.33 + i * 1.7) * 0.3
      inner.rotation.x = Math.sin(time * 0.27 + i * 0.9) * 0.2
    },
  }),
)

export const actors = [core, issue, coverOrbit, outerOrbit, innerOrbit, ...tasks]
