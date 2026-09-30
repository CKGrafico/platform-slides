# Proposal: the system as a town

Date: 2026-09-30. Branch `study/clarity`. A proposal, not a decision. It follows [clarity-review.md](clarity-review.md).

## The idea

Drop the planets. The system is a town on a paper map, seen the way a strategy game shows a base: one fixed diagonal view from above, pan and zoom only. The talk starts on an almost empty plot with one building in the middle, the worker's workshop. Then, part by part, we pull pieces out of the worker onto conveyor belts, and we build what protects the town: walls, gates, a watchtower. People walk around. Requests come in as carts and leave as products.

References: Townscaper and Monument Valley for the look (pastel volumes, soft shading, ink outlines, paper ground). Factorio for the connectors (belts, splitters, the main bus against spaghetti). Age of Empires for the ages of a town. Not pixel art, not a game HUD.

## Why it is clearer

- **Iconic, not symbolic.** In the world of orbits, a ring means a gate and a frame means the Harness: the audience has to learn a code. In a town, a wall is a wall and a gate is a gate. Nothing to decode. That is what the flat diagram has and the planets do not.
- **The map for free.** A strategy game view is exactly the discipline the review asked for: one direction, fixed positions, pan and zoom. The map layer of names built for option B (map/MapLabels.tsx, map/shots.ts) transfers as it is.
- **Room for people and detail.** Villagers, carts, fields, chimneys, lamps: a town can hold many small things without losing the reading, because they are all things the eye already knows.
- **The story is a construction.** "Autonomy needs better structure": the whole talk becomes the building of that structure, and the last shot is the finished town.

## The mapping

| Script | Now (orbits) | Town |
|---|---|---|
| 3 The state of AI | ten planets on an arc | a road into the town with ten milestones; the "?" is where the road enters the fog |
| 4 Maturity levels | five rings | five ages of the town, from a hut to a walled city (Age of Empires); level 5 is the map of the talk |
| 5.1 GitHub Actions | a moon with a line | a conveyor belt with stations, deterministic and cheap |
| 5.4 A workflow is Markdown | a file planet | a scroll on a drafting table |
| 5.5 Compilation, the shell | six moons around a lock | the scroll becomes a building; the compiler adds its fence, its lock and its lamp (permissions, firewall, outputs, telemetry) |
| 6.1 Not deterministic | three wobbly paths | the same worker walks three different paths across the plot |
| 6.2 The cost | a stack of coins | coal burned by the workshop, piling up |
| 6.3 A human in the loop | an astronaut with balls piling up | one inspector's booth on the road, carts queueing |
| 7.2 Our own client | three astronauts, ten ringed planets | three villagers, ten small farms |
| 8.2 OpenCode | a thin ring | the workshop building that houses the worker |
| 8.3 Forge and the models | a ringed planet and three cores | a forge with three furnaces behind it, one chimney each |
| 9 Agent Harness | a frame around the core | the walls of the workshop, with the rules painted on them; commands bounce off the walls; a small copy of the workshop on a cart, for the laptop |
| 10.2 Pull pieces out | moons leave the core | pieces leave the worker and land on belts around the workshop |
| 10.4 Before, many workflows | many clusters waking | spaghetti belts, every station firing on every cart |
| 10.4 One router | a ring at the entrance | one gatehouse with a splitter: one cart in, one route out |
| 10.6 The lanes | three orbits | three workshops in a row on the main belt: triage, refine, implement |
| 10.6 Who asks decides | an astronaut by the lanes | a villager at the refine workshop, with the story in hand |
| 10.6 Merge gate | a ring at the exit | the exit gate with a checkpoint: green passes, risk calls a person, red goes to the bin |
| 10.6 Audit and housekeeping | two moons on a side orbit | a watchtower on the wall, and a repair crew that restarts stalled belts |
| 11.2 Three phases | three circles on the ground | the plot, the walls, the open market: who may start a change |
| 11.3 The disc | a disc with a grid | the town's land, with its grid |
| 11.4 Hard guardrails | five walls | walls with towers, literally |
| 11.5 Verbs, not trust | small moons and hollow slots | permits on a board at each gate |
| 11.6 No shortcut | a broken shortcut line | a hole in the wall, bricked up |
| 12.2 What it measures | stacks of coins | stacks of resources at the warehouse, like a game's resource bar |
| 12.3 Honest numbers | ghost stacks | empty crates marked "not collected" |
| 12.4 Needs a human | an astronaut with a card | the village elder at a notice board |
| 12.6 The loop | a path from audit to the router | the watchtower's report goes into the gatehouse as a new cart |
| 13 One real issue | the blue ball on the route | a blue cart: gate, splitter, three workshops, the walls, the exit gate, the market |
| 14 Closing | pull back over the disc | pull back over the whole town, belts running, then the road and the title |

The people stay chibi, with a hat instead of a helmet. The paper, the ink outlines that boil, the burned titles, the palette and the type all stay. Work items stay small colored spheres or become crates.

## The look and the camera

- Buildings are simple toon volumes in the palette: a box, a roof, a chimney, an inked outline. No textures, no windows drawn one by one. Townscaper, not Warcraft.
- The ground is the paper with the grid. Belts are inked dashed lines whose dashes move (a dash offset driven by progress), so the audience sees what flows and where.
- The camera looks from a corner, about 40 degrees up, with a narrow field of view from far away, so it reads like the near-orthographic view of a strategy game. Pan and zoom only. The film moves stay for the cover, the road (part 3) and the closing.

## What it costs

- A new art kit: buildings (workshop, gatehouse, forge, watchtower, warehouse, farm), walls and towers, belts and splitters, carts, hats for the people. Built from primitives like the current kit, so a day of work, not a week.
- Parts 5 to 14 rebuilt on the new kit: new positions, new moves. The engine, the stops, the captions, the checks, the i18n and the map layer stay. The cover and part 3 change little.
- The docs: elements.md and art-direction.md are rewritten.

## The plan: a slice before the whole

Build one part first and judge the style on it: part 10 (the pipeline), because it has most of the vocabulary in five stops: belts, the spaghetti, the gatehouse, three workshops, a villager, the exit gate, the watchtower. If the slice reads and looks right, rebuild the rest in show order. If it does not, we have lost one part, not the show.

## Open decisions

1. Go for the slice on part 10.
2. Tone: pastel and calm (Townscaper) or industrial (Factorio). The proposal is pastel, with Factorio for the ideas only.
3. What the model is in the town: a worker inside the workshop (the proposal), or the workshop itself.
4. Whether the ages of part 4 replace the rings, or the rings stay as the map of the talk.
