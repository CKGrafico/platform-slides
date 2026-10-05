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
It keeps 20 stops across nine chapters. The first chapter contains the cover and the PC introduction.
The five maturity assemblies and four assessment banks retain their meanings in the final world.
Precomputed facts, reasoning, validation, and Safe Outputs occupy distinct positions in the worker close views.

The closing view puts Triage, the reasoning core, the guardrail wall, the gate, and the deployment bank on one row. The deployment bank is a rigid lattice, and its front unit holds the Issue.
Foundations, the Harness, the workflow configuration, and Health sit below the row at half opacity. The five maturity names are one line of text.
The accept, check, gate, and deploy channels are blue. The observe channel returns evidence from the deployed bank to Health in grey.
