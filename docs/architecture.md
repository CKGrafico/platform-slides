# Architecture

## The model in one picture

```
presenter input (keys, wheel, URL hash, debug panel)
        │  commands: next, prev, goToScene, seek
        ▼
Presentation: target position + playhead
        │  one GSAP tween moves the playhead to the target
        ▼
resolve(playhead) → chapter, scene, local progress 0..1, global progress 0..1
        │
        ▼
every mounted scene: its GSAP timeline is set to its local progress
actors: their timelines are set to the global position
camera rig: the shot is computed from the playhead
        │
        ▼
one render: DOM, SVG, 2D canvas, WebGL, in the same frame
```

The playhead is the only source of truth. A picture is a function of the playhead. If the playhead is at 3.25, the screen always shows the same thing, however the presenter got there.

The show uses one fixed orthographic camera. `src/show/AsciiRuntime.tsx` maps stage coordinates into its isometric view. It also scales character marks for the viewport and the current renderer DPR. Letterboxing preserves the same composition.

`src/show/flows.ts` defines the ten worker flows, and `src/show/Flow.tsx` draws one over the dimmed world. `src/show/Board.tsx` draws the two Project Health boards the same way. `src/show/layout.ts` holds the stage places that pictures and the core's other builds share. `src/show/pictures.ts` defines complete visual states. Each part owns its moves through `choreography.ts`. `src/show/narrative.tsx` joins those states with GSAP and shows only the active beat. The scene definitions hold the translated message keys. `scripts/rebuild-show.mjs` authors the scene contracts and script together.

## Global timeline

The show is a line of numbers called timeline units. Each scene takes `duration` units on the line (default 1). Scenes sit end to end in chapter order.

A scene owns the interval (start, end]. Position 0 belongs to the first scene. So when a scene is finished (local progress 1), the screen still shows that scene. The next scene starts to play only when the presenter advances.

A stop is a point where the presenter halts. Each scene lists its stops as local progress values in (0, 1]. The default is `[1]`: the scene plays once from 0 to 1 and halts. A stop at local 1 is always added. The show also has a start stop at position 0.

`next()` moves the target to the next stop after the target. `prev()` moves it to the stop before. The playhead follows with one GSAP tween. The tween takes the stop's `duration` in seconds (default 1.1) and its `ease` (default `power2.inOut`).

The tween time does not depend on the frame rate. If the presenter presses a key during a tween, the tween restarts from the current playhead to the new target. Key presses never queue.

## Presentation lifecycle

1. `main.tsx` renders `EnvironmentProvider` and `Keynote`.
2. `Keynote` creates one `Presentation` from `src/show/index.ts`. It reads the URL hash and puts the playhead at that stop. With no hash, the playhead is at 0.
3. `Keynote` starts the presentation tick on the GSAP ticker and binds keyboard and wheel input.
4. The persistent `World` canvas mounts once. The GSAP ticker also renders it (R3F runs with `frameloop="never"`), so DOM and WebGL update in the same frame.
5. On each frame, the tick reads the playhead. If it moved, every scene runtime gets its new local progress and state. Scene timelines, actors, and the camera update. Then the canvas renders.
6. When the active scene changes, the `leave` event fires for the old scene and `enter` for the new one. React re-renders the scene hosts, which mount the new neighbours and unmount the far scenes.
7. When the playhead arrives at a stop, the URL hash changes to `#/chapter/scene/stop`. A refresh comes back to the same stop.

## State

Global state is small and lives in three places:

| State | Where | Changes | React re-render |
|---|---|---|---|
| Playhead, target, direction | `Presentation` (plain object) | every frame | no |
| Active scene, mounted scenes | `Presentation` snapshot, read with `useSyncExternalStore` | when the active scene changes | yes, only the scene hosts |
| Viewport, reduced motion, tier | `EnvironmentProvider` | resize, settings | yes |
| Debug numbers | `debugBus` (plain object) | every frame | no, the panel polls 4 times per second |

Scene state stays inside the scene. There is no store library.

## Folders

```
src/engine/      Presentation, timeline math, input, layers, scene hosts, environment, fullscreen
src/world/       persistent canvas, actors, camera rig and camera track
src/animation/   GSAP setup, useSceneTimeline, progress math helpers
src/svg/         Svg wrapper, named parts, draw and morph helpers
src/shaders/     progress material, standard uniforms, shared GLSL
src/procedural/  procedural systems (instanced grid), FxCanvas for 2D
src/assets/      asset URLs, texture and model loaders, disposal
src/perf/        tier detection and DPR caps
src/debug/       debug bus and panel (dev or ?debug only)
src/art/         the art kit: palette, surface sampling, ASCII materials, forms, and screen anchors
src/styles/      base CSS. Show styles live in src/show/ascii.css
src/show/        the show: chapters, scenes, actors. Agents work here
public/assets/   svg, textures, models, fonts, images, video, generated
```

An agent that builds a scene must only change files in `src/show/` and `public/assets/`. If a scene seems to need an engine change, add a small primitive to the right `src/` folder and document it. Do not add scene-specific code to `src/engine/` or `src/world/`.

## Dependencies

Each dependency has a reason. Do not add a dependency without the same kind of reason, written here.

| Package | Why it is here |
|---|---|
| `react`, `react-dom` | Scene components, and one model for DOM, SVG, and the canvas tree. |
| `three` | WebGL rendering. |
| `@react-three/fiber` | One declarative, persistent canvas. Scene world parts are ordinary React components inside it. |
| `@react-three/drei` | `PerformanceMonitor` for adaptive DPR, and the GLTF and texture loaders with caching. Only imported parts ship. |
| `gsap` | The one animation model. Paused timelines scrubbed by progress work for DOM, SVG, Three.js objects, and uniforms. DrawSVG and MorphSVG ship with it. |
| `@fontsource-variable/outfit`, `@fontsource-variable/jetbrains-mono` | The two typefaces of the art direction: Outfit for titles, JetBrains Mono for the world. Both are self-hosted, so the show works offline at the venue. The Latin subsets cover Spanish. |
| `vite`, `@vitejs/plugin-react` | Dev server and build. |
| `typescript`, `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`, `globals`, `@eslint/js` | Types and lint. |

These are out on purpose:

- **Lenis and ScrollTrigger.** The page does not scroll. Scroll position is not the source of truth. The wheel is only one input that calls `next()` and `prev()`.
- **Motion or Framer Motion.** A second animation system would compete with GSAP and would not scrub by progress.
- **A state library (Zustand, Redux).** The playhead is a plain object, and the rest fits in React context.
- **Any audio library or API.** The show is silent. Lint rejects `Audio`, `AudioContext`, and `<audio>`.
