# Art direction: Elements in orbit

This is the style bible of the keynote. Every visual decision follows it. The meaning of each element is in [elements.md](elements.md). The script is in [../script/script.md](../script/script.md).

Decided with the user on 2026-09-29, after four rounds: a technical drawing (rejected, the user wants The Monolith Project's art), four literal worlds (rejected, too literal), four abstract directions ("Elements in a void" chosen, "Orbits" also liked, so they were merged), and three palettes ("Lilac and sage" chosen).

## Design read

A live technical keynote for .NET and platform engineers, projected at 16:9, with a playful but precise language in the craft of The Monolith Project. One persistent real-time 3D world with toon shading, boiling outlines, and HTML captions.

Dials (design-taste-frontend): DESIGN_VARIANCE 6, MOTION_INTENSITY 7, VISUAL_DENSITY 3.

## Concept

The talk builds one abstract system in a soft void. At its center sits the model: a near-black core with slow noise moving inside. It is the only thing that moves by time and not by the presenter. Everything else is a simple element: moons, balls, rings, a disc. The system grows around the core until the core is one small part of it.

Why orbits: the timeline of part 3 ends in "Loop engineering" and "Autonomous loops". An orbit is a loop: the same path every time, with no one pushing it. Deterministic work lives on clean outer orbits. Near the core, orbits wobble. The talk is the story of pushing work outward, onto orbits that repeat.

## Palette: Lilac and sage

| Role | Color | Notes |
|---|---|---|
| Void, top | `#C8C1D6` lilac | vertical gradient to the bottom color, faint grain |
| Void, bottom | `#D9E0D7` pale sage | |
| Cubes and light surfaces | `#F2F1EE` | toon light band. The shadow band is derived from it, never a pure grey |
| Orbit and satellite A | `#9FB7A6` sage | |
| Orbit and satellite B | `#B7A7CC` deep lilac | |
| Outline | `#2E2A4A` deep indigo | the only line color |
| Text | `#1F1D33` | captions and titles |
| Accent | `#2F69FF` Platform blue | the blue ball, the active element, the lit path, the title burn edge. Nothing else |
| Core | `#16161E`, noise up to `#2C3246` | off-black, never pure black |

Rules:

- One accent only, locked for the whole talk.
- No pure black and no pure white.
- Captions must reach 7:1 contrast on the void.
- On the real projector, raise contrast and saturation by about 15% if needed. It is one theme token change, not a redesign.

## Typography

- **Outfit** (the Platform Foundations typeface) for titles and captions. Act titles in Outfit Black, tight tracking, with a thin indigo outline, in the spirit of Monolith's outlined titles.
- **JetBrains Mono** for labels, file names, and numbers.
- Both are self-hosted woff2 files in `public/assets/fonts`. The show waits for `document.fonts.ready` before the first frame, so text is measured with the real fonts. The show must work offline at the venue.
- Sizes in stage units (1 su is 1% of the stage height): minimum 1.8 su (about 19 px at 1080p), captions about 2.6 su, statements 7 su, act titles 10 to 14 su.
- The style frame compares Outfit Black with one chunky display face for act titles. We keep Outfit unless the other is clearly better.

## Look and material

- **Toon shading:** two light bands, one key light from the upper left, soft ambient light. No bloom and no glow.
- **Outlines:** thick indigo outlines, about 3 px at 1080p. They "boil": the line wobble changes at a stepped 4 fps. This is the main trait we take from Core, and it is also the silent metronome of the talk.
- **Grain:** one full-screen grain layer on top of everything, stepped at 4 fps. Stronger than Monolith's 0.2 opacity, so it survives the projector.
- **Void:** a soft vertical gradient with faint noise. Cheap blob shadows sit under elements, so nothing floats without a reason.
- **Core:** off-black, with noise that looks deep, as if you look into it. Its outline is the same indigo as everything else.
- **Shape lock:** sharp edges for moons, the core, walls, and columns. Round shapes only for balls, orbits, rings, and the disc.

## Motion grammar

- **Personality:** calm, with no overshoot, for the camera and large elements. Balls may land with a small settle as the secondary layer.
- **Signature easing:** `power3.inOut` for camera moves and most moves. Entrances use `power3.out`, exits use `power2.in`.
- **Beat grid:** 120 BPM, so one beat is 0.5 s. Durations: quick 0.25 s, standard 0.5 s, slow 1 s. Moves between stops take 1, 1.5, or 2 s. Staggers go in 0.125 s steps and stay under 0.5 s in total.
- **Entrance, "inking":** the outline appears first (a quarter beat), then the fill, then a small settle.
- **Exit:** the element shrinks to a point in a quarter beat, with three small dust balls as the secondary layer.
- **Camera:** a long lens (FOV 30 to 40). Dwell, then travel: the camera holds still while people read, and moves only between stops. Long moves arc: pull back, pan, push in. No move crosses more than a third of the screen without a change of direction. The FOV widens a little while the camera travels.
- **Three layers:** primary (the move the presenter triggered), secondary (labels settling, dust, satellites adjusting), ambient (boil, grain, core noise, a few degrees of orbital drift).
- **Determinism:** positions come from progress. Time drives only the ambient layer. At a stop, the composition is always the same.

## Silent rhythm

The talk has no sound, so rhythm is visual:

- The act title burns in on a beat, and burns out the same way.
- Under tension (part 6) the boil speeds up from 4 to 8 fps. On release it returns to 4 fps.
- Releases snap fast, in about 200 ms.
- Every new element lands on a beat, like a note.
- The blue ball opens and closes the talk: it orbits the core on the cover, and it escapes to production in part 13.

## Composition and text

- One subject per frame.
- Captions sit in the empty corner, inside a 6% safe area, never over the subject.
- Captions and labels are HTML in fixed boxes sized in su and marked `data-fit`, so both languages must fit the same space. Labels on elements follow them on screen through screen anchors.
- Product and technical names stay in English in both languages: GitHub Actions, Agentic Workflows, OpenCode, Forge, Harness, merge gate. Only sentences translate. This keeps the two languages close in length.
- Icons, when needed, come from Phosphor, drawn in the same outline weight. No hand-made icons.

## Exclusions

1. **Literal worlds and clip art:** no factories, trains, robots, or rows of stock icons.
2. **The generic AI look:** no neon, glow, bloom, purple gradients, or particle galaxies.
3. **The slide-deck look:** no bullet lists on screen, no centered title and subtitle templates, no section-number labels.

## What we take from The Monolith Project, and what we do not

We take its craft: toon shading, boiling outlines, grain, burning titles, one subject per frame, scale jumps, match cuts through objects, captions in empty corners, a declared list of scenes.

We do not take its illustrations, characters, textures, fonts, or colors. Our palette, element grammar, and type are our own.

## Part by part

| Part | What the system looks like |
|---|---|
| 1 Cover | The void. The core alone, turning slowly, with the blue ball on one orbit around it. The title burns in. Language buttons in a corner. |
| 2 About me | Name, role, and company in a caption. The system does not change. |
| 3 Timeline | Ten elements appear along an arc, each closer than the last. The first half are single objects. The second half are structures around the core. The last one is an empty dashed outline: "?". |
| 4 Maturity | Five rings of growing size, level 1 the smallest. The outermost ring, level 5, keeps four empty slots. They stay at the edge of the frame for the rest of the talk. |
| 5 Actions to Agentic Workflows | One moon alone, with no core. Balls fall into it. It unfolds into small moons on a straight line. Then the core arrives, and everything near it starts to curve. The Markdown file is a slab that passes through a capture ring and comes out with a shell of small moons (the compiler). Three clusters: one straight line (CI/CD) and two small orbits around small cores (triage, implementation). |
| 6 Problems | Three balls leave the core on three different wobbly paths. A column rises next to it as it does simple work (tokens). A capsule stands at the exit, and balls pile up in front of it. The boil speeds up. |
| 7 Change of mind | The capsule fades. Three capsules on one side, ten small orbital systems on the other (the apps). The four words land one by one. |
| 8 Runtime | A vertical axis through the system: the agentic moon, OpenCode as a ring around the core, Forge as a gate ring below, several cores behind it (the models). One shell moon detaches and fades (threat detection off). |
| 9 Harness | A frame closes around the core. The wobbly trails converge into a nearly clean orbit. Unsafe commands bounce off the frame. The frame duplicates: one copy on a small laptop plane, one in the cloud. Slot 1 fills. |
| 10 Agentic Workflows | The core grows large, with white task moons set in its surface. They pop out, one per beat, and settle on outer orbits as pastel satellites. The core shrinks. The satellites stack into a ladder with the core near the top. A capture ring at the entrance (the router). Orbit lanes for the workers, and a checkpoint ring on the way out (the merge gate). Slot 2 fills. |
| 11 Foundations | The disc forms under everything, with its grid. Low walls rise around the lanes. Each satellite shows a few small verb moons, and the missing verbs are hollow. Slot 3 fills. |
| 12 Project Health | Columns rise at the edge of the disc, and two stay hollow. A small panel counts what needs a human. Our numbers stand next to the industry's. One satellite circles and drops a ball back in (the audit loop). Slot 4 fills. |
| 13 Issue to production | The camera follows the blue ball: captured by the router, spiraling in to implement, out through the walls and the merge gate, and escaping to production. Each pillar lights as the ball passes. |
| 14 Closing | The camera pulls back over the whole system on its disc. The four slots on the outer ring are full. The core is small at the center. The timeline arc returns with its "?". The title burns in, then the last line. |

## Revision 2026-09-29: one shape family

The user disliked the black slab and found cubes next to balls confusing. Everything is now a sphere in orbit, inspired by the speaker's earlier orbit design. Deterministic pieces are small smooth moons. The model is the core: a deep indigo planet (`#28233F`, noise up to `#4E4679`) whose surface bubbles and never keeps its shape. The blue ball is the issue.

## Revision 2026-09-29: illustrated planets

The user disliked the craters. Moons and balls are now illustrated planets, after two references the user shared (flat illustrated planets in a row, and planet badges in a learning app):

- A flat pastel color with the two toon bands.
- Soft horizontal bands with wavy edges, or a few soft round spots. No craters and no rims.
- A small hard white highlight near the upper left edge, fixed in view space, so every planet shows it in the same place, like a drawing.
- A thin ring on some planets (GitHub Actions, the apps, audit).
- The outline is a deep shade of the planet's own color, pulled toward the indigo, not the indigo itself. Lines, orbits, and the core keep the indigo.
- Two warm pastels join the palette for planets only: peach `#EDC1A5` and butter `#E9D59E`.

The extraction in part 10 follows the user's note that the pieces must come out of the core: each task sits in the core's surface; the surface swells, stretches after the task like a drop, snaps back, and wobbles.
