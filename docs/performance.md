# Performance and reliability

The show runs on a conference laptop and a projector. A stable 60 frames per second is more important than detail.

## What the engine does

- **One loop.** The GSAP ticker runs the presentation tick first, then the WebGL render. There is one `requestAnimationFrame` loop for the whole show.
- **No React render per frame.** The playhead is a plain object. React re-renders only when the active scene changes.
- **Pixel ratio caps.** Each tier caps the DPR: high 2, medium 1.5, low 1. A projector gains nothing above 2.
- **Adaptive DPR.** Drei `PerformanceMonitor` lowers the DPR in steps of 0.25 when the frame rate drops, down to 0.75, and raises it again when frames recover.
- **Tier guess.** `detectTier()` reads the GPU name. Software renderers are low, integrated Intel is medium, and the rest are high. Force a tier with `?tier=low`.
- **Mount window.** Only the active scene and its neighbours are mounted. Far scenes cost nothing.
- **Hidden scenes.** Inactive scene groups are invisible, so Three.js skips them.

## Rules for scene authors

- Animate DOM `transform` and `opacity` only. Other properties cause layout or paint on every frame.
- Never read layout in a progress callback or a frame loop.
- Do not allocate in a frame loop. Make vectors and objects once, outside the loop.
- Use `InstancedMesh` for many copies of one shape.
- Share geometries and materials. Dispose what you create.
- Keep draw calls low. The debug panel shows calls and triangles for each frame.
- Keep textures at the size they appear on screen. A 4K texture for a small object wastes memory.
- Give an expensive scene a `variants.low` part that does less, for example fewer particles or no post effects.
- Check the scene at 1920x1080 with the debug panel open. The frame rate must stay near 60.

## Rehearsal reliability

| Situation | What happens |
|---|---|
| Page refresh | The URL hash holds the last stop. The show comes back to it. |
| Start from the beginning | `Home` goes to the start. Opening the URL without a hash also starts at 0. |
| Jump during rehearsal | Use the debug scene list, type a scene number then `Enter`, or open `#/chapter/scene/stop`. |
| Go backwards | `prev()` mirrors the forward move. The picture at each stop is the same in both directions. |
| Fast or repeated key presses | Each press moves the target. The playhead retargets and never queues. A held key does nothing after the first press. |
| Resize, fullscreen, projector switch | One `ResizeObserver` updates the viewport and the stage box. The canvas resizes itself. The playhead does not change. |
| Dropped frames | Progress comes from the tween's clock, not from frame counts. A slow frame shows the correct later state. |
| WebGL context loss | The canvas hides, and the DOM layers keep working. When the browser restores the context, the canvas is rebuilt at the same playhead. |
| No WebGL at all | The world layer does not render. DOM and SVG scenes still work. |

## Graceful degradation

- A scene can declare `variants.reduced` and `variants.low`. The engine picks reduced first, then low, then the default parts.
- With `prefers-reduced-motion`, moves between stops are instant. Content stays readable. The cinematic motion does not need to survive.
- A fallback does not need to be beautiful. It must show the content of the scene.

## Before a talk

1. Run `npm run build`, then `npm run preview`. Present from the production build.
2. Open it full screen on the real projector. Walk through every stop once.
3. Check the frame rate with `?debug`. Close it again with `D`.
4. Close other tabs and apps that use the GPU.
