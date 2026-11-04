# Presenter controls and debug workflow

## Presenter controls

| Key | Action |
|---|---|
| `→` `↓` `Space` `PageDown` `Enter` | next stop |
| `←` `↑` `Backspace` `PageUp` | previous stop |
| `Shift` + next key | next chapter |
| `Shift` + previous key | start of this chapter, then the previous chapter |
| `Home` | start of the show |
| `End` | end of the show |
| `F` | fullscreen on and off |
| `L` | switch between English and Spanish |
| `T` | switch between the dark and the light theme |
| `M` | switch between the live and the calm mode |
| mouse wheel, trackpad | one stop per gesture. The wheel must be quiet for 350 ms before the next step |

Most presentation clickers send `PageDown` and `PageUp`, so they work with no setup.

The start screen also shows the language, theme and mode buttons in the top right corner. They hide as soon as the show moves. The browser keeps each choice for the next visit. `?lang=es`, `?theme=light` and `?mode=calm` in the URL set them too.

The light theme puts the show on a warm off-white. Text is dark grey, not black, and the blue is the same corporate blue as in the dark theme. Photos do not change. Use it in a bright room or on a screen that washes out dark slides. The DOM colors are tokens at the top of `src/show/ascii.css`. The world takes its light colors from `lightPalette` in `src/art/palette.ts`.

Calm mode is for a deck that people read at their own pace, for example a link sent to a client. The world holds still, each press cuts to the next stop and fades it in, diagrams show whole, and the footer shows "02 / 25" instead of the clock. To share it, send a link that sets everything, for example `https://platform.ckgrafico.com/?mode=calm&theme=light&lang=es`. [art/art-direction.md](art/art-direction.md#themes-and-modes) lists every change.

In fullscreen, the browser UI is hidden. The cursor hides after 2 seconds without movement. Text cannot be selected, and the page has no scrollbars.

## Debug panel

The debug panel loads only in development or with `?debug` in the URL. In production without `?debug`, its code is never downloaded.

- `D` shows and hides the panel.
- Type a scene number, then `Enter`, to jump to that scene. `Escape` clears the number.
- The scene list jumps to any scene.
- The slider scrubs the whole timeline. Use it to check that each position always looks the same.
- `?tier=low` forces a tier. The panel also has a tier select.
- `?motion=reduced` turns reduced motion on without changing the system setting: each stop is a cut, and the ambient life, the boil, and the grain stop. Use it to check the talk the way a viewer with reduced motion sees it. It also works in production, if the laptop at the venue cannot keep the moves smooth.

The panel shows:

| Field | Meaning |
|---|---|
| global | show progress and position in timeline units |
| chapter, scene | the active chapter and scene |
| local | local progress of the active scene |
| stop | the stop the presenter is at, and "moving" during a move |
| direction | 1 forward, -1 back |
| fps | frames per second and milliseconds per frame. Orange below 55 |
| gl | draw calls and triangles in the last frame |
| memory | geometries, textures, and shader programs on the GPU |
| camera | camera position and field of view |
| renderers | WebGL renderers created. Orange above 1 |
| viewport | window size and current DPR |
| tier | quality tier, and whether reduced motion is on |

In development, `window.__keynote` holds the presentation. Use it from the console:

```js
__keynote.goToScene('10-agentic-workflows/pull-out')
__keynote.seek(4.2)
__keynote.resolve()
```

## Debug workflow for a new scene

1. Jump to the scene.
2. Scrub it slowly forward and back. Each position must look the same both ways.
3. Step through its stops with the keyboard, fast. The playhead must never overshoot or queue.
4. Refresh at a stop. The same picture must come back.
5. Watch fps, calls, and memory. Memory must not grow when you leave the scene and come back.
