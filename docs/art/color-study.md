# Colour study

Feedback on 2026-10-06 said the keynote lacks colour. The art direction is a monochrome world with one blue accent for the Issue ([art-direction.md](art-direction.md)). This study tests how much colour the talk can take without losing that accent. Nothing here is decided yet. The default stays `mono`.

Choose a variant with `?palette=` in the URL. The code is in `src/show/palette.ts` and at the end of `src/show/ascii.css`.

| Variant | World (forms) | Flows and boards |
|---|---|---|
| `mono` (default) | grey points, blue Issue | grey, blue main route |
| `semantic` | unchanged | state in colour: done in teal, stopped or blocked in rose, waits for a person in amber, rework returns in rose. Status chips and success bars follow the same colours |
| `duo` | unchanged | three colours in all: grey, the Issue blue, and one muted rose `#e2566f` only where the system says no (stop nodes, rework returns) |
| `pillars` | as `semantic`, plus a soft tint per pillar: Foundations teal, agent-harness amber, agentic-workflows cyan, project-health rose | as `semantic` |

The colours are the Platform status colours from `Foundations/ai/DESIGN.md`: rose `#f33859`, amber `#fbc740`, teal `#3abaaf`, cyan `#00b5f1`. A tinted form moves halfway from its grey toward its colour, so it stays matte. The Issue blue always wins over a tint.

The presenter rejected `pillars` on 2026-10-06: the monochrome world with the blue Issue is the look they like. They asked for two or three colours at most.

Open points before a decision:

- Cyan for agentic-workflows sits close to the Issue blue. If `pillars` wins, consider another colour for it, or keep that pillar grey.
- Rose means "stopped" in flows. In `pillars` it also marks project-health, so the same colour has two meanings. The element grammar allows one meaning per element.
- If a variant wins, update the palette table and the "one accent" rule in [art-direction.md](art-direction.md) and [elements.md](elements.md).
