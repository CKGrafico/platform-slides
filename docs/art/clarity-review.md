# Clarity review: the diagram site against the keynote

Date: 2026-09-30. Branch `study/clarity`. Nothing here is decided yet.

## The question

A second presentation was built from the same script: a flat diagram with boxes, lanes and labeled arrows, in 20 steps. The user finds it clearer than the keynote and asks whether we went too far with effects, and whether boxes would have been the right call. This review measures both, names where the clarity comes from, and proposes what to do.

## What the diagram does

One fixed diagram of 1300 by 600 pixels, with four lanes (Business, Automation, Agents, Production and measure) and 13 boxes. Every box has a name and a one-line role ("Router: 1 event, 1 route"). Eight arrows carry a label ("1 pull request", "green", "risk", "merge"). A step is a camera position on that plane (pan and zoom, 1.1 s), one card of text, and a few arrows that draw themselves in sequence. A blue token travels from box to box. The boxes that matter get a blue ring; the rest dims. The whole map is shown at step 4, and every later step zooms into a region of a map the audience has already seen.

## Measurements

Per stop of the keynote (62 stops, 1280 by 720): art elements on screen, elements with a visible name, and how far the camera moved from the previous stop (world units).

| Part | Stops | Elements on screen | Named | Named share | Camera moves of 4 units or more |
|---|---|---|---|---|---|
| 3 State of AI | 1 | 14 | 10 | 71% | 1 |
| 4 Maturity levels | 3 | 1 | 0 to 5 | high | 2 |
| 5 Actions to Agentic Workflows | 8 | 2 to 17 | 1 to 10 | 51% | 3 |
| 6 Problems | 3 | 10 to 16 | 0 to 5 | 18% | 1 |
| 7 Change of mind | 4 | 3 to 26 | 0 to 2 | 3% | 3 |
| 8 Runtime | 3 | 7 to 10 | 1 to 3 | 21% | 1 |
| 9 Agent Harness | 8 | 0 to 24 | 0 to 10 | 9% | 2 |
| 10 Agentic Workflows | 9 | 22 to 29 | 0 to 9 | 17% | 3 |
| 11 Foundations | 6 | 3 to 36 | 0 to 6 | 11% | 3 |
| 12 Project Health | 6 | 1 to 38 | 0 to 9 | 13% | 5 |
| 13 Issue to production | 5 | 8 to 40 | 0 | 0% | 4 |
| 14 Closing | 4 | 15 to 54 | 0 | 0% | 2 |

Two halves:

| | Stops | Elements per stop | Named share |
|---|---|---|---|
| Parts 1 to 8 (the ideas) | 24 | 10 | 31% |
| Parts 9 to 14 (the system) | 38 | 25 | 9% |
| The diagram site, any step | 20 | 13 | 100%, plus 8 labeled arrows |

The camera: 30 of the 62 stops move the camera 4 units or more, and most of those moves change the angle, not only the distance. The diagram only pans and zooms on one plane.

## Where the clarity comes from

Not from the boxes. From five mechanisms that a box diagram makes easy and a 3D world makes optional:

1. **Everything has a name that stays.** A box carries its name and its role at all times. In the keynote a label appears with its stop and fades one stop later, so most of what is on screen is unnamed most of the time.
2. **The map comes first.** The diagram shows the whole system at step 4, then zooms in. The keynote builds the system over 40 minutes and shows it whole at part 13.
3. **Positions never move.** The viewer builds a mental map once. In the keynote the camera orbits, so the same element is left, then right, then behind another.
4. **Few things.** 13 boxes. The keynote shows 25 elements per stop in its second half, and 54 at the close: moons of the shell, steps, tasks, coins, walls, models, planets of the apps.
5. **Focus and dim.** The subject of the step is ringed, the rest goes grey. The keynote dims sometimes, not as a rule.

Two more things help the diagram: arrows are labeled with what flows ("1 pull request", "risk"), and the four lanes give a reading order.

## Where the keynote is better

- It is memorable. Boxes and arrows are what every other talk shows. Illustrated planets, a core that deforms, pieces pulled out of it: nobody in the room has seen that.
- Its text is stage text: one line, large, bottom left. The diagram's cards carry paragraphs. On a screen for a room, with a speaker talking, those would be read instead of listened to.
- The story motions are motivated in the sense of the design skill: the moon that unfolds into a line (5.2), the tasks pulled out of the core (10.2), the coins that drop (6.2), the burn of the titles. Each one tells a beat of the script.
- The prologue (parts 3 to 8) is about ideas, not about a system. A diagram has nothing to say there; the world does.

What is not motivated: a new camera angle at every stop of the second half. The angle changes because the world is 3D and it can, not because the story asks for it. That is the "effect for its own sake" the user senses. The boil, the grain and the burn are texture and identity; they cost little attention. The density and the camera cost a lot.

## Three options

### A. Keep the world, add the diagram's discipline

Everything stays. In parts 9 to 14:
- Names stay on. Once an element is introduced, its name remains, small, like a map label. Add the one-line role on the stop that introduces it.
- Fewer things: the shell moons, the steps, the workflow file, the tasks and the app planets hide unless they are the subject. Target 12 to 15 elements in a system shot.
- Camera: one side, one height, pan and zoom only. The angle changes at chapter changes, not at stops.
- Focus and dim: the subject at full ink, the rest at 30%.
- Label the flows: "1 pull request", "risk", "merge", "new issue" on the paths when the ball travels them.

Cost: medium. Risk: the world still has 40 elements alive, so every stop needs pruning by hand.

### B. Two registers: film for the ideas, map for the system

Parts 1 to 8 stay cinematic as they are. At the pillars intro (part 9) the camera rises and the system settles into a map: top down, fixed, every element in its lane, every element named. The lanes are rings on the disc: outer ring deterministic (GitHub Actions and the router), middle ring the agents (triage, refine, implement), center the model with its runtime, and the disc edge production and measure (walls, gate, release, coins). From there, parts 9 to 13 pan and zoom on that map, ring the subject and dim the rest, and the journey of part 13 runs on a map the audience has watched for 20 minutes. The closing pulls back to the whole map, then the film returns for the title.

The elements stay planets, coins and astronauts. The composition becomes a diagram.

Cost: high. It is a rework of the second half: cameras, a persistent label layer, pruning of elements, and the script's "System on screen" lines. Risk: the moment of flattening must feel like a reveal, not a fall.

### C. Boxes

Rebuild as the diagram site with our palette and type. Throw away the world. Cost: high, and it throws away what the user liked. Risk: the talk looks like every other talk.

## Recommendation

B. The prologue earns its spectacle because it carries ideas. The second half carries a system, and a system is read, not watched. The diagram proves that on this material a map with 13 named things is understood; our numbers show we are at 25 things and 9% named. A map inside our world keeps the identity and takes the clarity.

Before building it, one cheap test settles the debate: the mute test. One screenshot per stop, no speaker. Can a viewer say what each element is and what happens at this stop? The diagram passes at 19 of 20 steps. The keynote's second half fails most of them today, and the mock of part 13 with 13 names added shows why names alone are not enough: at 40 elements the names collide.

## Decisions for the user

1. Option A, B or C.
2. If B: does the map arrive at the pillars intro (part 9) or earlier, at the change of mind (part 7)?
3. The lanes: rings on the disc (radial) or four bands (left to right, like the diagram)?
4. Which of the 40 elements survive in a system shot. A first cut: request, router, requester, triage, refine, implement, the core with its runtime, walls, gate, release, audit, housekeeping, measures. 13, like the diagram.
