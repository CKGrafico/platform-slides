# Element grammar

The keynote uses a small set of elements. Each element has one meaning for the whole talk. The audience learns the meaning once and reads it everywhere after that. So an agent that builds a scene must never give an element a new meaning, and must never invent a new element without adding it here first.

The look of each element follows [art-direction.md](art-direction.md). The system is an abstract world of geometric entities drawn as point clouds. The reason for the direction is in [art-direction.md](art-direction.md).

## The three laws

1. **The picture is material, not objects.** A form is an aggregate of many small units. It forms and unforms. Nothing is a solid object with a fixed shape.
2. **Rigidity is determinism.** A rigid entity, aligned and still, is work that repeats. A fluid entity, loose and deforming, is work that reasons. The core stays fluid. Work solidifies as it moves away from the core.
3. **One accent, one meaning.** The world is monochrome. Exactly one colour, the blue, marks the work we follow at this moment.

A story rule sits under the three: nothing appears without a reason the beat before it showed.

## The elements

| Element | Means | Look |
|---|---|---|
| Unit | the smallest piece of the world | one small flat-faced polyhedron: a rhombic dodecahedron, a truncated octahedron, a cuboctahedron, a low-poly icosahedron, a hexagonal prism or a beveled slab. Never a perfect sphere, never a plain sharp cube |
| Entity | a body of work | an aggregate of units, packed in a cluster. Units hold together by proximity, never by fusion. An entity can be dense or sparse |
| The core | the agent: the model and its runtime, OpenCode | the largest entity, the densest, and the only one that stays fluid. Its units slowly reshuffle. It loses units as work leaves it |
| Deterministic work | a step that repeats | a rigid entity: units aligned, gaps closed, motion stopped, grey |
| Reasoning work | a step that needs the model | a fluid entity near the core: units loose, drifting, deforming |
| The flow | work that travels | a stream of loose units moving along a channel, like a material caught mid-motion |
| The guardrail | a constraint that fails the build | a rigid wall of aligned units that stops a flow |
| The gate | the merge gate | a rigid wall with one opening where a single blue unit passes |
| The issue | the one work item we follow | one blue unit. It changes state as it travels: fluid when it needs thought, rigid when it is understood |
| The measure | a measurement: tokens, Project Health | a rigid bank of units, like stacked blanks. A gap stays empty for a metric that is not collected |
| The panel | the name of an entity | a terminal panel: a thin rounded rectangle, a name, and a short role line. It follows its entity on screen |
| The command line | where the talk is | one line of mono text in the top left, the current beat, ending in a blue block cursor |

## Rules

- **Units never fuse.** An entity is held by proximity and thin struts, so it can split and rejoin.
- **Rigidity is determinism.** Colour stays monochrome. Rigidity is shown by alignment and stillness, not by colour.
- **Only the core reasons, and only the core stays fluid.** Work solidifies as it moves outward.
- **Only the issue is blue**, with two exceptions: the element that is active right now, and the command line cursor. Nothing else uses the accent.
- **Nothing floats without a reason and nothing is a sphere.** Units are flat-faced. The world has no balls and no orbits.
- **Connections are events.** The world draws no web of lines between entities. When work moves from one entity to another, a short beam of units travels the path and fades. A visible connection means a transfer in that instant.
- **Every element enters and leaves the same way:** it assembles from scattered units, and it scatters back to dust. Use the helpers in `src/art/motion.ts` and `src/art/points.ts`.
- **People are not drawn.** There are no figures. The team is a small entity, the requester is a single unit that arrives from the edge, the reviewer is a wall of units that stops a flow.
- **The camera is isometric and fixed.** One orthographic angle. It steps between regions, it does not swing.
- **Names live in the panels and the command line.** No floating label web, no HUD ring.

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
