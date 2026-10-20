# Keynote engine documentation

This repository holds a web keynote. The keynote runs in a browser, full screen, and the presenter controls it from the keyboard. It has no sound.

The show uses abstract geometric entities with ASCII surfaces ([art/art-direction.md](art/art-direction.md), [art/elements.md](art/elements.md)). Its 23 stops, five of them worker flows and four of them Project Health boards, follow work from a personal PC to the Plain Concepts Platform. The cover also introduces the speaker. The maturity assessment precedes the capability path. Foundations and the local Harness come before cloud workflows.

The cast has 29 form actors and 33 route channels. Bounded idle motion keeps the field alive between stops.
The town, orbit visuals, and visibility veil are removed. Git preserves their source history. The previous script stays in `docs/script/script-orbits-archive.md`.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open `http://localhost:5173`. Press `D` to open the debug panel (it starts closed).

The bottom right corner shows the stop chip, for the speaker: the number of the stop the talk is at (1 to N over the whole talk, so a stop can be named without a screenshot), and, while a press is still playing, a bar that fills. Do not press again until the bar is gone. The chip lives in `src/engine/StopChip.tsx`.

Before you commit, run these commands. Each one must pass. `build` also runs the language check:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build
```

```bash
npm run i18n:check
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
| The talk script, beat by beat (work here first) | [script/script.md](script/script.md) |
| Verified routes, returns, worker ownership, and manual release | [knowledge/workflow-routes.md](knowledge/workflow-routes.md) |
| Published phases, hard guardrails, the Harness, and measurement limits | [knowledge/website-reading.md](knowledge/website-reading.md) |
| Five maturity levels, four assessment areas, and scoring | [knowledge/maturity.md](knowledge/maturity.md) |
| Art direction: the style bible | [art/art-direction.md](art/art-direction.md) |
| Element grammar: what each element means | [art/elements.md](art/elements.md) |
| ASCII forms, poses, materials, and resource disposal | [art/ascii.md](art/ascii.md) |
| Next technical steps for the art kit | [art/next-steps.md](art/next-steps.md) |
| Our anonymised numbers | [knowledge/our-numbers.md](knowledge/our-numbers.md) |
| Draft story of the talk (not binding) | [knowledge/talk-notes.md](knowledge/talk-notes.md) |
| Public industry numbers to compare against | [knowledge/benchmarks.md](knowledge/benchmarks.md) |
| English and Spanish text | [conventions.md](conventions.md#text-and-languages) |
| Inspiration sites, with The Monolith Project as the main art reference | [references.md](references.md) |

If you are an agent and you only have time for one file, read [scenes.md](scenes.md).
