# ASCII form kit

`src/art/forms.ts` builds truncated octahedra and beveled blocks, prisms, and slabs. Assemblies include clusters, frames, stepped banks, walls, and gates.
Each aggregate uses one character draw and one invisible depth draw. Channels use only the character draw.

`src/art/ascii.ts` draws characters from a font atlas. Face brightness selects character density. One shared planar grid continues across coplanar triangles.
The depth pass hides characters behind nearer surfaces. It draws no visible mesh. Marks and depth geometry share the same unit motion.
The self-hosted font loads before the first frame. Materials release their atlas when the cast releases them.

Each point carries an edge value. A unit assembles from its edges first and fills its faces last, so a form draws its outline before its surface.
The core is a loose cluster. Repeatable work uses aligned units. A guardrail is a wall. The merge gate has one opening. The blue unit is the Issue. These meanings follow `elements.md`.

The Issue colors a real unit in its current assembly. A traveling packet appears only between ports during a handoff.
It follows the same depth rules as every other form. It never overlays a nearer face to simulate membership.

Actor poses define stage position, scale, opacity, assembly, focus, extraction, and the active work unit. GSAP interpolates them from the playhead.
The transfer track also records source, destination, and progress. Ports follow unit centers, including their idle offsets.
The runtime applies these states before screen anchors update.

Bounded sine functions add idle drift and slow turns. Fluid units move independently inside the core. Rigid assemblies keep their internal alignment.
Channels move units along the active route. Their shader wraps positions analytically. No timer or accumulated simulation state advances the story.

The cloud view removes four small units from the core. The surrounding rigid assemblies carry repeatable work outside the model.
Context, tools, and the Harness survive the cloud move. Refine and Implement follow the [verified route facts](../knowledge/workflow-routes.md).
Main paths, repair, review, manual release, and the Audit return use channels in `src/show/actors.ts`.

For reduced motion, the engine cuts to each stop and the runtime freezes surface movement. The atlas size follows the actual renderer DPR. The geometry stays constant while the presenter moves through the show.

The content ledger is `scripts/keynote-content.mjs`. `scripts/rebuild-show.mjs` writes the English script, both locale files, and the scene contracts.
It keeps 18 stops across nine chapters, with one chapter card, five worker flows (the router, Triage, Refine, Implement, and Merge Gate), and one Project Health board. One slide names the other four workers. Foundations, agent-harness, and agentic-workflows each have one slide that feeds their parts from the pillar with thin links. Only Agentic Workflows has many slides, because the talk is about it. The first chapter contains the cover and the PC introduction.
The five maturity assemblies retain their meanings in the final world.
Precomputed facts, reasoning, validation, and Safe Outputs occupy distinct positions in the worker close views.

The closing view puts Triage, the reasoning core, the guardrail wall, the gate, and the deployment bank on one row. The deployment bank is a rigid lattice, and its front unit holds the Issue.
Foundations, the Harness, the workflow configuration, and Health sit below the row at half opacity. The five maturity names are one line of text.
The accept, check, gate, and deploy channels are blue. The observe channel returns evidence from the deployed bank to Health in grey.

Each role has its own silhouette, so the audience can tell bodies apart without reading a name.
The units are chamfered blocks, prisms, slabs, beams, tiles, hexagonal prisms, cuboctahedra, and truncated octahedra. None is a sphere or a sharp cube.
The reasoning core is one mass of 26 varied units. Unit 2 holds the Issue on the face that looks at the camera. Units 4 to 7 sit on the visible rim and leave when work separates.
Banks are tight grids with a different footprint for each role. The guardrail is a tall wall one unit deep, with merlons. The merge gate has a door, a lintel, and a sill where the Issue docks.
Owner review is an upright hollow square. Triage is a ring with four posts. The Harness is a ring of blocks around a raised ring of hexagonal prisms, and it holds a small agent cluster on the inner ring. Forge is a flat plate of tiles.
All channels share one bead geometry in three lanes, drawn in the accent blue. The docked Issue uses the densest mark and a larger point, and its blue never darkens below 85 percent.

A form can have up to two other builds. `createForm` takes the `morph` option, with one box per unit for each build. Each mark moves onto the surface of its unit's box, so every shape becomes a clean block in another build.
The poses `morph` and `morph2` mix the builds. Each unit starts later than the one before and lifts out of the mass on the way, so the change reads as taking apart and building again. Forms without other builds ignore them.
On the cover, the 26 units of the core stand as an open laptop. The lid is a screen of fifteen tiles, and the Issue is the middle tile. While the laptop stands, the blue steps from tile to tile every 3 seconds in a fixed loop, as idle motion. With reduced motion it stays on the middle tile. On the next beat the laptop comes apart into the core.
On the maturity beat, the core comes apart again. Its units fly in five groups to the five maturity assemblies, which then form around them (`src/show/layout.ts`). The Issue unit lands on level 2, Exploratory.
The evolution of AI is one row of nine steps after the maturity levels, built like them. Both rows are joined by edge links: a connection with `edge` in `src/show/actors.ts` is a thin channel that starts at the near edge of one body and ends at the near edge of the next, with a small gap at each end, instead of running between the Issue ports.
A new body comes out of the core only while the core stays on screen. Otherwise it draws itself in place, outline first, from left to right.

## Worker flows

`src/show/flows.ts` holds the five worker flows as nodes and edges on a grid of six columns and rows 0 to 3.6. Rows can be fractional, and a backward edge in one row is a straight line, so the flows follow the Agentic Workflows diagrams without crossing lines. The text keys live in `scripts/flow-copy.mjs`.
`src/show/Flow.tsx` draws a flow as an SVG in stage units over the dimmed world. Shell jobs are outlined boxes, the agent is a filled box, a decision is a pill, the place where the work lands has a blue outline, a person is a dashed box, and a run that stops is grey.
The main path is blue. Branches are grey. Returns are dashed and loop under the rows, or over the top when both ends sit in the first row.
Nodes and edges appear in column order as `--flow-reveal` runs from 0 to 1, so the drawing comes from progress. The facts come from the Agentic Workflows diagrams listed in `docs/knowledge/workflow-routes.md`.
