# Element grammar

The keynote uses a small set of elements. Each element has one meaning for the whole talk. The audience learns the meaning once and reads it everywhere after that. So an agent that builds a scene must never give an element a new meaning, and must never invent a new element without adding it here first.

The look of each element follows [art-direction.md](art-direction.md). The system is an abstract world of geometric entities drawn with ASCII surfaces. The form kit is in [ascii.md](ascii.md).

## The three laws

1. **The picture is material, not objects.** A form is an aggregate of many small units. It forms and unforms. Nothing is a solid object with a fixed shape.
2. **Rigidity is determinism.** Aligned units show repeatable work. Whole assemblies can float without changing their internal alignment. The active reasoning core alone keeps its units fluid.
3. **One accent, one meaning.** The world is monochrome. Exactly one colour, the blue, marks the work we follow at this moment.

A story rule sits under the three: nothing appears without a reason the beat before it showed.

## The elements

| Element | Means | Look |
|---|---|---|
| Unit | the smallest piece of the world | one small flat-faced polyhedron: a rhombic dodecahedron, a truncated octahedron, a cuboctahedron, a low-poly icosahedron, a hexagonal prism or a beveled slab. Never a perfect sphere, never a plain sharp cube |
| Entity | a body of work | an aggregate of units, packed in a cluster. Units hold together by proximity, never by fusion. An entity can be dense or sparse |
| The core | the agent: the model and its runtime, OpenCode | the largest entity, the densest, and the only one that stays fluid. Its units slowly reshuffle. It loses units as work leaves it |
| Deterministic work | a step that repeats | a rigid assembly of aligned units that floats as one body |
| Reasoning work | a step that needs the model | a fluid entity near the core: units loose, drifting, deforming |
| The flow | work that travels | a stream of loose units moving along a channel, like a material caught mid-motion |
| The guardrail | a constraint that fails the build | a rigid wall of aligned units that stops a flow |
| The gate | the merge gate | a rigid wall with one opening where a single blue unit passes |
| The issue | the one work item we follow | one blue unit within an assembly. It leaves a real unit during a transfer and docks inside the next assembly |
| Triage | the front door for outside collaborators | an open frame of aligned units before Refine |
| Split | large work becomes smaller Issues | separate beveled units that feed the same route independently |
| Owner review | a decision that needs a person | a second open frame on the branch from Merge Gate |
| Audit | read the repo and create one Issue | an aligned bank of prisms that returns work to Refine |
| Release | a manually dispatched publishing step | a stack of beveled slabs after the merge gate |
| Deployed application | the eligible change in production | a rigid bank with the blue Issue docked in one of its front units. It is separate from the manual package Release worker |
| The measure | a measurement: tokens, Project Health | a rigid bank of units, like stacked blanks. A gap stays empty for a metric that is not collected |
| The name | the name of an entity | one line of mono text centred under the body, with a small square at the lowest edge of the body. In a timeline row, names alternate under and over the bodies, and a name over a body marks its highest edge. No box and no leader line. It follows its entity on screen |
| The command line | where the talk is | one line of mono text in the top left, the current beat, ending in a blue block cursor |
| Maturity level | a set of team practices in the assessment | five assemblies with increasing structure: one unit, loose units, a frame, repeated banks, and a frame with measured banks. Their names stay fixed. They do not represent a measured Platform score |
| Convention set | one set of Foundations conventions: backend, frontend, or branding | a small rigid bank, fed by a thin link from the Foundations wall |
| Harness held agent | the agent the Harness contains | a small loose cluster resting on the inner ring of the Harness, part of the Harness form everywhere it appears |
| Harness part | a part that agent-harness installs: OpenSpec, plugins, skills, guardrails | OpenSpec is a short stack of offset slabs, a plugin is a block with two prongs, skills are the context bank, and guardrails are the wall. Thin links feed them from the Harness |
| AI evolution step | one step in the evolution of AI, from models to autonomous loops | nine assemblies in one straight row, joined in order by grey channels like a timeline. Names alternate under and over the line, with no year. Agents is the core with the Issue. Skills, Guardrails, and Harnesses are the context bank, the wall, and the Harness. A model is one large solid unit, a black box, so it reads apart from the loose working mass of an agent; a prompt is one line of slabs with a cursor, loops and graphs are one upright ring, Agentic Workflows are two linked rings, and the future is a loose handful that never assembles |
| Safe output | a permitted write from a worker | a compact rigid bank after validation. It is separate from the merge gate |

## Rules

- **Units never fuse.** An entity is held by proximity and thin struts, so it can split and rejoin.
- **Rigidity is determinism.** Aligned units stay aligned during idle drift. Only units in a reasoning body shift independently.
- **Only the active reasoning core stays fluid.** Refine uses a smaller instance of the same core geometry. When it reasons, the background core holds its units still. Work solidifies as it moves outward.
- **Blue is the one accent.** It marks the Issue, the route and the links between bodies, the agent boxes in worker flows, the square under each name, and the command line cursor. The forms themselves stay monochrome except for the Issue unit. No other hue is used. A colour study on 2026-10-06 tried status colours, pillar tints and a blue cast on all forms; the presenter rejected all of them.
- **Idle gives the field life.** Whole bodies float and turn slowly. Units are flat-faced. The world has no balls and no orbits.
- **Connections are events.** Traveling units show the active route and its next handoff. Curved channels show feedback. Channels follow ports on real units. In a row of steps, such as the maturity levels or the evolution of AI, a thin grey link runs from the edge of one body to the edge of the next. It never passes behind a body. A return in a row, such as project-health feeding the other three pillars, is a thin arc from the top of one body to the top of another, so it never crosses the row or its names.
- **Every element enters and leaves the same way:** it assembles from scattered marks, and it scatters back to dust. Use the assembly pose in `src/show/pictures.ts` and the sampled surfaces in `src/art/points.ts`.
- **People are not drawn.** There are no figures. The team is a small entity, the requester is a single unit that arrives from the edge, the reviewer is a wall of units that stops a flow.
- **The camera is isometric and fixed.** One orthographic angle. It steps between regions, it does not swing.
- **Names live in the panels and the command line.** No floating label web, no HUD ring.

The closing view has one main route: Triage, the reasoning core, CI, Merge Gate, and the deployed application.
Foundations, Harness, workflow configuration, and Health sit below it as supporting assemblies.
Compact labels sit outside the silhouettes. The five maturity names use one text line, without five more panels over the world.
The main flow is blue and the evidence return is grey. It retains the same meanings as the earlier close views.

## Do and do not

| Do | Do not |
|---|---|
| Show a body of work as an aggregate of units | Draw a solid mesh, a person, or an icon |
| Show work moving as a stream of units along a channel | Draw a permanent line or a dotted web between entities |
| Show a guardrail as a rigid wall of units | Show a padlock, a shield, or a checkbox |
| Show a missing metric as a gap in the bank of units | Show a grey bar, a red cross, or a chart |
| Mark the issue with the one blue unit | Use a second colour, or light the blue with a glow |
| Let the core lose units as work leaves it | Shrink the core with nothing leaving it |
| Keep past entities in the field, quieter and sparser | Delete them to make room |
| Name an entity in a panel or the command line | Float a long label in the empty space |
