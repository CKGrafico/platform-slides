# Element grammar

The keynote uses a small set of elements. Each element has one meaning for the whole talk. The audience learns the meaning once and reads it everywhere after that. So an agent that builds a scene must never give an element a new meaning, and must never invent a new element without adding it here first.

The look of each element follows [art-direction.md](art-direction.md).

## The elements

| Element | Means | Look |
|---|---|---|
| Core | the model, the agent's reasoning | a deep indigo planet whose surface bubbles and never keeps its shape |
| Moon | a deterministic piece: an action, a script, a job, a check | a small toon sphere with craters, near-white or pastel, dark outline |
| Ball | an event or a work item | small toon sphere. Many balls use instancing |
| Blue ball | "the issue", the one work item we follow | Platform blue, slightly larger. The motif of the talk |
| Orbit | a loop that repeats | a sketchy ring line. Clean far out, wobbly near the core |
| Capture ring | a gate that puts one ball on one path: the router, triage, the merge gate | a thick flat ring the ball passes through |
| Frame | a set of rules around something: the Harness | an outline-only cage around the core |
| Disc | the ground the system stands on: Foundations | a wide flat disc with a faint grid |
| Wall | a guardrail | a low thin panel standing on the disc |
| Column | a measurement: Project Health | a toon column. A hollow outline when a metric is not collected |
| Capsule | a person | a small upright pill shape, with no face |
| Slot | an empty place waiting for a pillar | a dashed outline of the shape that will fill it |

## Rules

- **Distance from the core is determinism.** The closer an orbit is to the core, the more it wobbles. Work that needs no reasoning must sit on an outer orbit.
- **Only the core moves by time.** Everything else moves by progress. The only exceptions are ambient: the boil, the grain, dust, and a few degrees of orbital drift.
- **Only the blue ball is blue**, with two exceptions: the element that is active right now, and the lit path in part 13. Nothing else uses the accent.
- **Elements are never replaced.** They appear, move, split, merge, or leave. If a moon becomes a satellite, it is the same object that moves.
- **Every element enters and leaves the same way:** "inking" in, shrink out. Use the helpers in `src/art/motion.ts`.
- **People are capsules.** No faces, no avatars, no icons of people.

## Do and do not

| Do | Do not |
|---|---|
| Show the router as a capture ring that lets one ball onto one lane | Draw a router icon, an arrow junction, or a box with the word "router" |
| Show a guardrail as a wall on the disc | Show a padlock or a shield icon |
| Show a missing metric as a hollow column | Show a grey column, a red cross, or an empty chart |
| Make the core smaller as work moves out of it | Add a second model to show "less AI" |
| Keep past elements on screen in a quieter tone | Delete past elements to make room |
| Label an element with a short HTML label in a `data-fit` box | Put long sentences next to elements |
