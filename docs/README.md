# Keynote engine documentation

This repository holds a web keynote. The keynote runs in a browser, full screen, and the presenter controls it from the keyboard. It has no sound.

The engine is done. The show is not. The only scenes in `src/show/sandbox/` are neutral test scenes that prove the engine works. Delete them when the real show starts.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open `http://localhost:5173`. The debug panel is open in development. Press `D` to hide it.

Before you commit, run these three commands. Each one must pass:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build
```

## Where to read

| Topic | File |
|---|---|
| Architecture, presentation lifecycle, global timeline, state, dependencies | [architecture.md](architecture.md) |
| Scene lifecycle, chapters, how to create a new scene | [scenes.md](scenes.md) |
| Animation model, layers, persistent world, camera | [animation.md](animation.md) |
| Asset, SVG, shader, and procedural conventions | [conventions.md](conventions.md) |
| Performance rules, rehearsal reliability, fallbacks | [performance.md](performance.md) |
| Presenter controls and the debug workflow | [presenting.md](presenting.md) |
| What the keynote is about: the Platform repos and site | [knowledge/platform.md](knowledge/platform.md) |
| Inspiration sites, with The Monolith Project as the main art reference | [references.md](references.md) |

If you are an agent and you only have time for one file, read [scenes.md](scenes.md).
