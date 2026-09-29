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
| mouse wheel, trackpad | one stop per gesture. The wheel must be quiet for 350 ms before the next step |

Most presentation clickers send `PageDown` and `PageUp`, so they work with no setup.

In fullscreen, the browser UI is hidden. The cursor hides after 2 seconds without movement. Text cannot be selected, and the page has no scrollbars.

## Debug panel

The debug panel loads only in development or with `?debug` in the URL. In production without `?debug`, its code is never downloaded.

- `D` shows and hides the panel.
- Type a scene number, then `Enter`, to jump to that scene. `Escape` clears the number.
- The scene list jumps to any scene.
- The slider scrubs the whole timeline. Use it to check that each position always looks the same.
- `?tier=low` forces a tier. The panel also has a tier select.

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
__keynote.goToScene('sandbox-world/grid-dolly')
__keynote.seek(4.2)
__keynote.resolve()
```

## Debug workflow for a new scene

1. Jump to the scene.
2. Scrub it slowly forward and back. Each position must look the same both ways.
3. Step through its stops with the keyboard, fast. The playhead must never overshoot or queue.
4. Refresh at a stop. The same picture must come back.
5. Watch fps, calls, and memory. Memory must not grow when you leave the scene and come back.
