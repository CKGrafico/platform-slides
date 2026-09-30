# Element grammar

The keynote uses a small set of elements. Each element has one meaning for the whole talk. The audience learns the meaning once and reads it everywhere after that. So an agent that builds a scene must never give an element a new meaning, and must never invent a new element without adding it here first.

The look of each element follows [art-direction.md](art-direction.md). The system is a town on a map; the reasons are in [town-proposal.md](town-proposal.md).

## The elements

| Element | Means | Look |
|---|---|---|
| The hall | the agent: the model and its runtime, OpenCode | the town center in the middle of the map: a cobbled platform, an arcade, a half-timbered floor, a big tiled roof, a turret. Big and closed at first, with all its folk at the arcade. It steps down a size each time one of them moves out to a house of their own, a third smaller by the end. One keeper stays |
| The curtain wall | the Agent Harness: the rules the hall keeps around the agent | a crenellated wall of stone on the edge of the hall's platform, with a tower at each corner and a gate of two towers at the arcade, where it stays open. It scales with the hall |
| The banner | OpenCode, the one runtime | a butter banner on the hall's turret |
| The forge and the kilns | Forge, the AI gateway, and the models behind it | a stone shed with a big chimney north of the hall; three stone kilns behind it. Two smiths from the hall work it |
| The mill | GitHub Actions: deterministic, cheap | a stone mill with a half-timbered top and lattice sails that always turn |
| Sack | an event | a sack of grain in a pastel cloth, tied at the neck. It falls into the mill |
| Cart | a piece of work, or a step that repeats | a two-wheeled wooden cart with a load. A barrel is a step of GitHub Actions, a crate is a task, a tarp covers a piece of work, a sack is a delivery. Every cart faces the way it goes. Many carts of one kind are instanced |
| The blue cart | "the issue", the one work item we follow | a cart with a Platform blue tarp, a little larger. The motif of the talk |
| Road | where work travels, again and again | a strip of sand; the loop around the hall is cobbled; the mill's road is laid as its carts come out. Before the loop is cobbled, the blue cart wears a dirt track round the hall |
| Trail | where a piece of work once went: a run, a call to Forge, a shortcut, the audit's report | a wide line in the tone of dirt, worn in the grass, on the ground. Wobbly where a run did not repeat. It breaks in two when a way is closed |
| Gatehouse | a gate that puts one cart on one route: the router, the merge gate | two stone towers with hoardings and tiled roofs, an arch with merlons, open door leaves, on a ring wall |
| Arch | the small gate of an inner ring over the road | two stone jambs and a lintel with merlons |
| Workshop | an agent with one job: triage, refine | a house on the main road: a stone base, timbers, a tiled roof, shutters. One of the hall's folk stands by its door |
| The scriptorium | the compiler | a small house north west of the hall; the scroll goes in, the crate comes out |
| The scroll and the crate | the workflow file, and the compiled workflow with its shell | a rolled scroll; a wooden crate with a palisade of stakes planted round it |
| Stake | one piece of the shell the compiler builds: permissions, the firewall, safe outputs, threat detection, telemetry, the runtime, our own step | a wooden stake with a pointed top and a band that names it, planted on a ring round the crate. Our own step is the peach one. Threat detection is pulled out and tips over in part 8 |
| Stone | an unsafe command | a grey stone thrown at the parapet. It bounces off and tumbles |
| Seal | a verb: a right a worker holds | a flat butter disc that faces the camera; a dashed ring where the right is not given |
| The market and the booth | production, and the person a risky change goes to | a stall with a striped awning outside the second ring; a small stall by the merge gate |
| The watchtower and the repair crew | the audit, and housekeeping | a stone tower with a hoarding on the first ring; one of the hall's folk who leaves it to walk the loop |
| Ring wall | a guardrail; the three rings are the three phases of Foundations | a ring of stone with merlons and towers, raised arc by arc, with the gates where the road crosses it |
| Milestone | a step of the timeline | a signpost on the road into the town; the second half stand on stone; the last is a dashed slot, "?" |
| Low wall | a maturity level (part 4); the footing a ring wall rises on (part 11) | a low ring of stone with small merlons, raised round the hall arc by arc. The levels sink back into the ground when the map keeps them; the footings stay under the walls |
| Measure | a measurement: tokens, Project Health | a stack of coins by the hall, or by the barn. A ghost stack of dashed rings when a metric is not collected |
| Villager | a person: the one who asks, the reviewer, the developer, the team, the elder, and the folk of the hall | a round chibi with a hat, no face. Eight folk stand at the hall's arcade at the start; one by one they walk out to the house that does their job now, and stay by it |
| Cottage | a product the team runs | a small house in the hamlet north east of the town |
| Field | the town's produce, once it works | a tilled plot inside a fence, with hay bales |
| Slot | an empty place waiting for a pillar | a dashed outline of the shape that will fill it |

## Rules

- **Nothing floats and nothing is a sphere.** What moves rides a road on wheels, or is carried; lines lie on the ground. The town has no moons, no balls, no orbits.
- **Distance from the hall is determinism.** Work that needs no reasoning rides the belt loop around the hall or the main road; only the hall reasons.
- **The hall gives work away; it does not lose it.** Each time a job moves out, one of its folk walks from the arcade to the house that does it now, the house appears as they arrive, and the hall steps down a size (`src/show/hall.ts`). The step down always comes with a new roof, never alone.
- **Only the ambient layer moves by time:** the sails, the blue cart's round on the cover, the sway of the people, the boil. Everything else moves by progress.
- **Only the blue cart is blue**, with two exceptions: the element that is active right now, and the lit road in part 13. Nothing else uses the accent.
- **Elements are never replaced.** They appear, move, split, merge, or leave. Once a building stands, it stays; the map only grows.
- **Every element enters and leaves the same way:** "inking" in, shrink out. Use the helpers in `src/art/motion.ts`. Walls rise from the ground; roads are laid from their west end.
- **Every building with a job flies a pennant** in the color that names it (the hall's banner is butter; triage lilac; refine and Forge peach; the scriptorium, the barn and the tidy house sage; the mill and the outer gates butter; the cottages take turns), so buildings can be told apart from a distance, with their name on the map.
- **People are villagers.** A hat, no face. No avatars, no icons of people.
- **The camera never turns and never zooms.** One angle, one distance (`src/show/shots.ts`, a frame about 27 units wide), pans only. The one exception is the closing pull-back. Build for that distance: walls heavy enough to read, buildings with room between them.

## Do and do not

| Do | Do not |
|---|---|
| Show a piece of work as a cart on a road, facing the way it goes | Draw a ball, a dot, a moon, or an orbit |
| Show where work went as a trail worn in the grass, and a level as a low wall of stone | Draw a dashed ink line, a wire in the air, or a circle that floats |
| Show the router as a gatehouse on the wall that lets one cart onto the road | Draw a router icon, an arrow junction, or a box with the word "router" |
| Show a guardrail as a ring wall with towers | Show a padlock or a shield icon |
| Show a missing metric as a ghost stack of dashed rings | Show a grey stack, a red cross, or an empty chart |
| Make the hall smaller as its folk move out, with a person walking and a new house | Add a second hall to show "less AI", or shrink the hall with nothing leaving it |
| Keep past elements on the map in a quieter tone | Delete past elements to make room |
| Label an element with a short HTML label in a `data-fit` box, or a name on the map | Put long sentences next to elements |
