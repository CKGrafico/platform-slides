# Element grammar

The keynote uses a small set of elements. Each element has one meaning for the whole talk. The audience learns the meaning once and reads it everywhere after that. So an agent that builds a scene must never give an element a new meaning, and must never invent a new element without adding it here first.

The look of each element follows [art-direction.md](art-direction.md). The system is a town on a map; the reasons are in [town-proposal.md](town-proposal.md).

## The elements

| Element | Means | Look |
|---|---|---|
| The hall | the agent: the model and its runtime, OpenCode | the town center in the middle of the map: a cobbled platform, an arcade, a half-timbered floor, a big tiled roof, a turret. Big and closed at first; it shrinks as pieces leave it |
| The parapet | the Agent Harness: the rules the hall keeps around the agent | a low stone wall on the edge of the hall's platform, open at the arcade |
| The banner | OpenCode, the one runtime | a butter banner on the hall's turret |
| The forge and the kilns | Forge, the AI gateway, and the models behind it | a stone shed with a big chimney north of the hall; three stone kilns behind it |
| The mill | GitHub Actions: deterministic, cheap | a stone mill with a half-timbered top and lattice sails that always turn |
| Moon | a deterministic piece: a step, a task, a check | an illustrated ball: flat pastel, soft bands or spots, a white highlight |
| Cart | an event or a work item | a small toon ball on a belt or a road. Many carts use instancing |
| The blue cart | "the issue", the one work item we follow | Platform blue, slightly larger. The motif of the talk |
| Belt | a loop or a line that repeats | a dashed ink line whose dashes travel, on a road |
| Road | where work travels | a strip of sand; the loop around the hall is cobbled |
| Gatehouse | a gate that puts one cart on one route: the router, the merge gate | two stone towers with hoardings and tiled roofs, an arch with merlons, open door leaves, on a ring wall |
| Arch | the small gate of an inner ring over the road | two stone jambs and a lintel with merlons |
| Workshop | an agent with one job: triage, refine | a house on the main road: a stone base, timbers, a tiled roof, shutters |
| The scriptorium | the compiler | a small house north west of the hall; the scroll goes in, the crate comes out |
| The scroll and the crate | the workflow file, and the compiled workflow with its shell of small moons | a rolled scroll; a wooden crate with small moons snapped around it |
| The market and the booth | production, and the person a risky change goes to | a stall with a striped awning outside the second ring; a small stall by the merge gate |
| The watchtower and the repair crew | the audit, and housekeeping | a stone tower with a hoarding on the first ring; a villager who walks the loop |
| Ring wall | a guardrail; the three rings are the three phases of Foundations | a ring of stone with merlons and towers, raised arc by arc, with the gates where the road crosses it |
| Milestone | a step of the timeline | a signpost on the road into the town; the second half stand on stone; the last is a dashed slot, "?" |
| Level ring | a maturity level | a dashed circle on the ground around the hall |
| Measure | a measurement: tokens, Project Health | a stack of coins by the hall, or by the barn. A ghost stack of dashed rings when a metric is not collected |
| Villager | a person | a round chibi with a hat, no face: the one who asks, the reviewer, the developer, the elder, the team |
| Cottage | a product the team runs | a small house in the hamlet north east of the town |
| Field | the town's produce, once it works | a tilled plot inside a fence, with hay bales |
| Slot | an empty place waiting for a pillar | a dashed outline of the shape that will fill it |

## Rules

- **Distance from the hall is determinism.** Work that needs no reasoning rides the belt loop around the hall or the main road; only the hall reasons.
- **Only the ambient layer moves by time:** the sails, the dashes of the belts, the sway of the people, the boil. Everything else moves by progress.
- **Only the blue cart is blue**, with two exceptions: the element that is active right now, and the lit road in part 13. Nothing else uses the accent.
- **Elements are never replaced.** They appear, move, split, merge, or leave. Once a building stands, it stays; the map only grows.
- **Every element enters and leaves the same way:** "inking" in, shrink out. Use the helpers in `src/art/motion.ts`. Walls rise from the ground; roads are laid from their west end.
- **People are villagers.** A hat, no face. No avatars, no icons of people.
- **The camera never turns and never zooms.** One angle, one distance (`src/show/shots.ts`), pans only. The one exception is the closing pull-back.

## Do and do not

| Do | Do not |
|---|---|
| Show the router as a gatehouse on the wall that lets one cart onto the road | Draw a router icon, an arrow junction, or a box with the word "router" |
| Show a guardrail as a ring wall with towers | Show a padlock or a shield icon |
| Show a missing metric as a ghost stack of dashed rings | Show a grey stack, a red cross, or an empty chart |
| Make the hall smaller as work moves out of it | Add a second hall to show "less AI" |
| Keep past elements on the map in a quieter tone | Delete past elements to make room |
| Label an element with a short HTML label in a `data-fit` box, or a name on the map | Put long sentences next to elements |
