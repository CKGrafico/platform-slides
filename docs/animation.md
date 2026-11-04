# Animation, layers, world, and camera

## Animation model

GSAP is the only animation system. Every animation is a paused GSAP timeline, and the engine sets its position from progress. Nothing plays on its own.

There are two kinds of timeline:

| Timeline | Time axis | Built with | Use it for |
|---|---|---|---|
| Scene timeline | local progress, 0..1 | `useSceneTimeline(build)` | anything that belongs to one scene |
| Actor timeline | global timeline units | `defineActor({ timeline })` | objects that cross scenes |

In a scene timeline, the time is the progress. `tl.to(el, { x: 100, duration: 0.3 }, 0.2)` runs from local 0.2 to local 0.5. The engine pads the timeline to exactly 1. A timeline longer than 1 prints a warning in development.

The timeline default ease is `none`. The move between stops already has an ease. Add an ease to a tween when that tween needs its own curve.

GSAP targets can be DOM elements, SVG elements, `mesh.position`, `material.uniforms.uX`, or any plain object. So one model drives DOM, SVG, Three.js, camera parameters, shader uniforms, and procedural parameters.

For values that GSAP does not tween well, use `useProgress((local) => ...)`. The callback runs on every progress change. It must be a pure function of `local`. For example, `grid.set({ density: range(local, 0, 0.6) })`.

Helpers in `src/animation/progress.ts`:

- `range(v, a, b)` maps a window of progress to 0..1. Use it to cut a phase out of a scene.
- `lerp`, `clamp01`, `smoothstep`.
- `noise1(x)` is deterministic noise. The same input gives the same output.

Import GSAP from `@/animation/gsap`, not from `gsap`. That file registers DrawSVG and MorphSVG.

## Layers

`src/engine/layers.ts` is the only place that defines stacking order:

| Layer | Order | Contents |
|---|---|---|
| `world` | 0 | the persistent Three.js canvas |
| `fx` | 10 | scene `fx` parts: 2D canvas and procedural DOM |
| `narrative` | 20 | scene `dom` parts: HTML and SVG |
| `overlay` | 30 | presentation chrome, empty for now |
| `debug` | 40 | the debug panel, development only |

Every layer is a fixed box over the full viewport. So the layers line up exactly, and a DOM element can sit over a 3D object. Layers ignore the pointer by default, so no layer blocks another.

Inside the narrative layer, each mounted scene is one `<section class="scene">`, stacked in timeline order. Put composed content in `<Stage>`. It is the largest centred 16:9 box. Content that bleeds to the screen edges goes outside the stage, in the scene root.

Size type and spacing with the `su` unit: `calc(var(--su) * 4)` is 4% of the stage height. So the composition keeps its proportions on any screen.

## Persistent world

One WebGL canvas mounts when the show starts, and it stays until the page closes. Scenes never create a renderer. The debug panel shows how many renderers were created. The number must stay 1. It only goes up when the browser loses and restores the WebGL context.

Each scene's `world` part renders inside that canvas, in its own group. The group is hidden when the scene is inactive.

For an object that must survive across scenes, use an actor. Actors live in `src/show/actors.ts`:

```ts
import { Mesh, SphereGeometry, MeshStandardMaterial } from 'three'
import { defineActor } from '@/world/actors'

export const orb = defineActor({
  id: 'orb',
  create: () => new Mesh(new SphereGeometry(1, 48, 48), new MeshStandardMaterial()),
  timeline: (tl, mesh, { at, span }) => {
    tl.set(mesh.scale, { x: 0, y: 0, z: 0 }, 0)
    const grow = span('intro/title', 0.2, 1)
    tl.to(mesh.scale, { x: 1, y: 1, z: 1, duration: grow.duration }, grow.start)
    tl.to(mesh.position, { x: 3, duration: 1 }, at('system/overview', 0))
  },
})
```

- `at(sceneKey, local)` is the global position of a point in a scene.
- `span(sceneKey, from, to)` gives the start and duration of a window in a scene.
- A scene can read an actor with `useActor('orb')`. For example, it can place a label next to it.
- One writer per property: if the actor timeline animates `orb.position`, no scene may animate `orb.position`.

The actor pattern is how the strongest transitions will work. An object from one scene keeps its identity and changes shape, place, or material in a later scene. It is not replaced.

## Camera

There is one camera. The camera rig places it on every frame from a camera track. The track is a pure function of the playhead.

A scene sets its camera with `camera`:

- **A shot.** `{ position, target, fov?, roll?, shake? }`. The camera blends from the previous scene's end shot to this shot while the scene plays, with a smoothstep curve.
- **A function.** `(local, from) => shot`. The scene owns the camera. `from` is where the previous scene left the camera, so a part never needs another part's shot. Use it for dolly moves, orbits, and paths.
- **Nothing.** The camera keeps the previous scene's end shot.

Shot helpers in `src/world/camera/shot.ts` are pure functions:

- `dolly(shot, amount)` moves the camera along its view line.
- `orbit(shot, angle, elevation)` turns the camera around its target.
- `blendShots(a, b, t)` mixes two shots.
- `shotSequence(from, moves, local)` is the usual scene camera: a list of moves `{ from, to, shot, arc? }` in local progress. The camera holds between moves (dwell, then travel), and `arc` pulls it back in the middle of a long move.

`shake` adds noise from the clock. It is ambient and never changes the composition. To add a new camera behaviour, write a new pure helper in `shot.ts`. Do not add state to the rig.

## Transitions

The engine does not ship transitions. It keeps these open:

- The previous and next scenes stay mounted, so a transition can use both.
- `visibleWhenInactive` keeps a scene's parts on screen after or before its own interval.
- Actors carry objects across scenes, so a scene can transform an object instead of replacing it.
- The camera track makes moves between compositions continuous.
- DOM, SVG, and WebGL share one frame and one progress value, so a DOM element can hand over to a 3D object on the same frame.

## The ASCII show

Each part lists its translated beat keys in `index.tsx` and exports its moves from `choreography.ts`. `makeMoves` joins complete states from `src/show/pictures.ts`. A new state keeps the layers introduced before it. Each move starts from the preceding state.

GSAP writes actor poses and the transfer track. `AsciiRuntime` applies them before updating screen anchors.
The runtime scales glyphs with the stage height and renderer DPR. It warms the shader before the talk.
Bounded clock functions add idle drift. They never change narrative progress or worker outcomes.

Moves sit on the 120 BPM grid. Each picture stop takes four beats, which is two seconds. A chapter card takes two beats: its title arrives while the picture before it fades to a trace.
Bodies move first and land by 60 percent of the stop. A short stillness follows, and then the title, the caption, and the labels arrive in that order.
An exit fades and loosens in place. A quiet body that must cross more than 12 units dissolves where it is and re-forms at its new place. Only the active bodies and the Issue travel.
The constants are `TIMING` and `REVEAL` in `src/show/narrative.tsx`. Each body has its own drift period, so no two bodies move in step. Fluid bodies breathe by 1.5 percent.

The fixed shot includes `ortho`, the orthographic half-height. `screenToWorld` maps positions onto its isometric screen plane. Camera orientation stays fixed throughout the show.

Assembly, opacity, focus, extraction, work ownership, and handoff progress come from the playhead.
Title, caption, and label reveals follow that same progress in sequence.
Reduced motion cuts to the destination and freezes ambient movement. Reversing or restoring a stop restores the same narrative pose.
