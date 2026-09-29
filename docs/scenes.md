# Scenes and chapters

## What a scene is

A scene is one visual moment on the timeline. It plays from local progress 0 to 1. The presenter can halt it at its stops. A scene has up to three parts, and each part is optional:

| Part | Renders in | Use it for |
|---|---|---|
| `dom` | narrative layer | HTML text, SVG diagrams, UI |
| `fx` | fx layer, under the narrative | a 2D canvas with procedural drawing |
| `world` | the persistent WebGL canvas | Three.js objects, shaders, particles |

A scene with only a title and an SVG has only a `dom` part. It needs no Three.js knowledge.

## Scene definition

```tsx
import { defineScene } from '@/engine/define'

export const myScene = defineScene({
  id: 'my-scene',              // unique inside its chapter
  title: 'My scene',           // shown in the debug panel and used as the aria-label
  duration: 1,                 // timeline units. Longer scenes take more of the line
  stops: [0.4, { at: 1, duration: 2, ease: 'power3.inOut' }],
  parts: { dom: Dom, world: World, fx: Fx },
  variants: { reduced: { dom: StaticDom }, low: { dom: Dom } },
  camera: { position: [0, 1, 6], target: [0, 0, 0], fov: 40 },
  visibleWhenInactive: 'none', // 'before', 'after', or 'both' keeps the parts visible
})
```

The full scene key is `chapterId/sceneId`, for example `intro/title`. Actors, the URL hash, and the debug panel use this key.

Stop options:

- `at`: local progress where the playhead halts, in (0, 1].
- `duration`: seconds the playhead takes to arrive at this stop. Use it to pace the show. A slow reveal gets a long duration.
- `ease`: any GSAP ease for that move.

## What a scene can read

Call `useScene()` in any part:

| Field | Meaning |
|---|---|
| `local()` | local progress now, 0..1 |
| `global()` | show progress now, 0..1 |
| `state()` | `'before'`, `'active'`, or `'after'` the playhead |
| `isActive()` | true while the playhead is inside the scene |
| `direction()` | 1 after a forward command, -1 after a back command |
| `viewport` | window size, DPR, and the 16:9 stage box |
| `reducedMotion` | the user prefers reduced motion |
| `tier` | `'high'`, `'medium'`, or `'low'` |

The functions read live values. Call them in callbacks and frame loops, not during render. A scene never reads the scroll position, and it does not need to know the rest of the show.

## Scene lifecycle

1. **Mount.** A scene mounts when it is within one scene of the active scene (`mountWindow` in `src/show/index.ts`). So the next scene is ready before it plays, and the previous scene is still there for a transition.
2. **Progress.** On every frame where the playhead moves, the engine sets the scene's local progress. Before the scene it is 0. After the scene it is 1. Timelines built with `useSceneTimeline` follow it.
3. **Enter and leave.** `useSceneLifecycle({ onEnter, onLeave })` runs when the scene becomes active or stops being active. Use it for side work only, such as a preload. Never set visual state in it. Visual state comes from progress.
4. **Visibility.** Outside its own interval, the scene's DOM section is hidden and its world group is invisible. `visibleWhenInactive` changes this for transitions that overlap two scenes.
5. **Unmount.** When the scene is two or more scenes away, React unmounts it. GSAP contexts revert. Geometries and materials that the scene made must be disposed (see [conventions.md](conventions.md)).

## Chapters

A chapter groups scenes. It has an id, an optional title, its scenes, and free metadata:

```ts
import { defineChapter } from '@/engine/define'

export const intro = defineChapter({
  id: 'intro',
  title: 'Intro',
  scenes: [title, promise],
})
```

`src/show/index.ts` lists the chapters in order. It is the only file that knows the order. Navigation, offsets, stops, and the debug scene list come from it. Nothing else hardcodes the order.

## How to create a new scene

1. Make a folder: `src/show/<chapter>/<scene>/`.
2. Write `index.tsx`. Export one `defineScene(...)`. Keep the scene's GLSL, SVG, and CSS in the same folder.
3. Add the scene to its chapter's `scenes` list in `src/show/<chapter>/index.ts`. If the chapter is new, add the chapter to `src/show/index.ts`.
4. Animate only through progress. Use `useSceneTimeline` for tweens and `useProgress` for computed values.
5. If an object must live across scenes, make it an actor in `src/show/actors.ts`.
6. Run `npm run dev`. Jump to the scene from the debug panel. Scrub it with the slider, forward and back. Make sure that every position looks the same each time you land on it.
7. Run `npm run typecheck`, `npm run lint`, and `npm run build`.

A minimal DOM scene:

```tsx
import { useSceneTimeline } from '@/animation/useSceneTimeline'
import { defineScene } from '@/engine/define'
import { Stage } from '@/engine/Stage'

function Dom() {
  const scope = useSceneTimeline((tl) => {
    tl.fromTo('.headline', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0)
  })
  return (
    <div ref={scope} className="scene-root">
      <Stage>
        <h1 className="headline">A headline</h1>
      </Stage>
    </div>
  )
}

export const headline = defineScene({ id: 'headline', parts: { dom: Dom } })
```

A minimal world scene:

```tsx
import { useRef } from 'react'
import type { Mesh } from 'three'
import { useSceneTimeline } from '@/animation/useSceneTimeline'
import { defineScene } from '@/engine/define'

function World() {
  const mesh = useRef<Mesh>(null)
  useSceneTimeline((tl) => {
    tl.fromTo(mesh.current!.rotation, { y: 0 }, { y: Math.PI, duration: 1 }, 0)
  })
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  )
}

export const turn = defineScene({ id: 'turn', parts: { world: World }, camera: { position: [0, 0, 5], target: [0, 0, 0] } })
```

## Rules for scene authors

- Do not use `setTimeout`, `setInterval`, animation `onComplete` callbacks, or accumulated state to change what is on screen.
- Do not read layout (`getBoundingClientRect`, `offsetWidth`) in a progress callback or a frame loop.
- Animate `transform` and `opacity` on DOM elements. Do not animate `width`, `height`, `top`, or `left`.
- Use `uTime` and the clock only for ambient motion, such as a shimmer. The composition must come from progress.
- Do not write z-index. The layer decides the stacking. Inside a layer, DOM order decides.
- Do not add sound.
