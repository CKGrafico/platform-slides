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
It keeps 23 stops across nine chapters, with no chapter card, five worker flows (the router, Triage, Refine, Implement, and Merge Gate), one slide for GitHub Agentic Workflows, an intro slide for Project Health and four Project Health boards, one for each tab of the dashboard. One slide names the other four workers. The evolution of AI comes before the maturity levels. Near the end, a question, what software engineers are supposed to do, is answered with a quote card over the dimmed system: an initials avatar, name, handle and date, and a short attributed excerpt from Uncle Bob Martin (`src/show/Board.tsx`, board `quote`). It is our card in the keynote style, not a copy of the network's interface. Foundations, agent-harness, agentic-workflows and project-health each have one slide of their own. The last slide is the whole system, the summary of the talk, with a line that opens the questions. Only Agentic Workflows has many slides, because the talk is about it. The first chapter contains the cover and the PC introduction.
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

`src/show/flows.ts` holds the worker flows as nodes and edges on a grid of six columns and rows 0 to 3.6. Rows can be fractional, and a backward edge in one row is a straight line, so the flows follow the Agentic Workflows diagrams without crossing lines. The text keys live in `scripts/flow-copy.mjs`.
`src/show/Flow.tsx` draws a flow as an SVG in stage units over the dimmed world. Every step has one of three kinds, and a legend at the top right names them. A normal GitHub Actions job is black with a white outline. The agent is solid blue. A job after the agent, such as validation, the conclusion, or a write that Safe Outputs allows, is black with a blue outline. A decision is a pill in the colours of its kind. The kind of each step comes from the worker's own workflow file in agentic-workflows (`loops/workflows/agent-*.md`): the jobs and context steps before the agent, the agent's prompt, and the `validate_output`, `conclude`, `incomplete` and safe output jobs after it. The official diagrams do not mark this, so check the workflow file when a flow changes.
The main path is blue. Branches are grey. Returns are dashed and loop under the rows, or over the top when both ends sit in the first row.
Nodes and edges appear in column order as `--flow-reveal` runs from 0 to 1, so the drawing comes from progress. The facts come from the Agentic Workflows diagrams listed in `docs/knowledge/workflow-routes.md`.

Every box has one line of help that shows when the presenter hovers it (`Tip` in `Flow.tsx`; the key is the title key plus `.tip`, in `scripts/flow-copy.mjs`). Where the workflow files confirm it, the line ends with the box's rung, a step on the determinism ladder we use to design the workers: the lower the rung, the cheaper and more repeatable the step, with shell at 1 and the agent at 5. A small line on the first workers slide explains the word. The GitHub mark in the corner of a box means gh-aw provides it: its activation job and its safe outputs. The other boxes are ours. The blue boxes are our prompts, which gh-aw runs inside its agent job, so they carry no mark.

The text in the diagrams stays in English in both languages, because the names match the code and the labels on GitHub. `scripts/flow-copy.mjs` copies the English text of every `flow.*` key into Spanish. Titles and captions are still translated.

The Triage, Refine, Implement, and Merge Gate slides have a link at the top right to one real Issue that went through all four workers. The presenter opens it during the talk. The repository is private, so the label does not name the project. The Project Health slide links to the same Issue on the roadmap.

## Project Health boards

Project Health has four slides, one for each tab of its dashboard: Engineering, Delivery, Agentic, and Roadmap. Each one copies the tab of one real project, as of 19 October 2026, without the project name and without the People section. `src/show/Board.tsx` draws them as the boards `engineering`, `delivery`, `agentic`, and `roadmap`. The numbers and their source are in `docs/knowledge/platform.md`.

- Engineering: the level, score, gates, and AI usage, the alert that reads AI usage against the level, and the practices one by one.
- Delivery: the five DORA metrics, three collected and two refused, and the two lead times side by side.
- Agentic: the installed tooling, the bot pull requests the gate merged with no person, and tokens per measured run by kind of work.
- Roadmap: four numbers, where the open time of the Issues went, and Issue #750 as a bar.

The text in the boards stays in English in both languages, like the diagrams and like the dashboard the presenter opens live. The first three link to the live dashboard and Roadmap links to Issue #750 on it. They open the private dashboard at `pulse.platform.plainconcepts.dev`.

## Sponsor slide

The event, NetCoreConf Madrid 2026, requires a sponsor slide right after the cover. Sponsors pay for their tier, so the slide copies the official sponsor slide exactly: `src/show/sponsors.ts` holds every logo box, tier name and rule in the original slide units (EMU, from netcoreconfMadrid2026.pptx, slide 2), and the board scales them to the stage, which is also 16:9. Each logo is stretched to fill its box, as in the original. The logo files are the white versions from that deck, in `public/assets/sponsors/`, with three exceptions. The updated official slide of 2026-10-22 adds Lidl and SCRM International Hub to the Gold row, and the deck's Plain Concepts logo was the old one. So `lidl.png` and `scrm.png` are the two halves of the lockup on scrm.lidl, and `plain-concepts.png` is the current logo (June 2026) from plainconcepts.com, white, without its tagline, centred in the original square box. Those boxes were measured on the updated slide, using its rules and labels as reference points. The third tier is called "Colabora" in the official slide, in both languages. Check these logos again if the event sends a newer slide. The event header, top right, keeps its mascot and its two lines, <NetCoreConf/> and Madrid '26, at their original boxes; Outfit replaces Poppins, sized so each line takes the original width. Our heading replaces the event's "Sponsors" title and the background. On this slide the cover laptop waits off stage to the right; the next beat brings it in and takes it apart into the core.

## Foundations slide

Foundations and its three convention sets sit in the left half. The right half shows the site itself in a browser window (`Board.tsx`, board `site`). The pages are captures of platform.plainconcepts.com from 2026-10-20, in `public/assets/foundations/`: the top of the home page, cut above its demo dashboard because those numbers are illustrative, then Frontend and Backend. Each page scrolls to its end in nine seconds and the next fades in. That loop is CSS and a pure function of the clock, so it is idle motion, not narrative. Reduced motion holds the home page at its top. A link at the top right opens the live site at `platform.plainconcepts.dev`, and the same address is in the window bar. The captures were taken from the older `platform.plainconcepts.com` address, which serves the same pages. To refresh the captures, run headless Edge at 1280 by 2400 on each page and save JPEGs under the same names.

## agent-harness slide

The agent-harness slide shows what the install leaves in a repo, as a file tree on a source card (`src/show/Board.tsx`, board `tree`). Each line is a path and a short note. The lines appear from top to bottom. The guardrails are blue: the two guardrail skills, the plugins, and `check-diff.mjs`. The tree was checked against the `harness/` and `skills/` folders of the agent-harness repo. The copy is `board.tree.code` in `scripts/flow-copy.mjs`, and it stays in English in both languages.

## GitHub Agentic Workflows in five minutes

Right after the sponsors, one stop introduces gh-aw before our own story, and the next turns the talk: understanding it takes five minutes, getting the bases and the way of working right took months. That turn is a statement over the core, and its caption opens the Platform part. The gh-aw stop (`Board.tsx`, board `ghaw`) has a source card on the left with a minimal workflow: the frontmatter in grey, the prompt in white, and the one line that lets the agent act, `create-pull-request`, in the accent blue. It is an example, not one of our workers, and it uses only real gh-aw keys: `on`, `permissions`, `engine`, and `safe-outputs`. On the right, the same slide draws what happens when it runs, top to bottom, in the legend's three kinds (`flows.ts`, flow `ghaw`): Issue, the workflow Markdown, `gh aw compile`, GitHub Actions, the agent with an API key and read-only access, the safe output, and the pull request.
