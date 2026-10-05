# Art direction: the point-cloud world

This is the style bible of the keynote. Every visual decision follows it. The meaning of each element is in [elements.md](elements.md). The script is in [../script/script.md](../script/script.md).

Decided with the user on 2026-10-04. The world is an abstract field of geometric entities drawn as matte point clouds. The history of the earlier directions is at the end.

## Design read

A live technical keynote for .NET and platform engineers, projected at 16:9. The world is an abstract, isometric field of geometric entities, drawn as monochrome point clouds with one flat blue accent. Matte, unlit, no glow. Almost no interface: a command line, a status label, and terminal panels. The story is a phase change: chaos becomes structure while one core stays fluid.

Dials (design-taste-frontend): DESIGN_VARIANCE 6, MOTION_INTENSITY 6, VISUAL_DENSITY 4.

## Concept

One body of geometric units does everything at first. Part by part, responsibilities separate from the body and solidify into rigid, repeating assemblies, and a perimeter forms. At the end the system is ordered and stable, and only the core stays fluid.

The system is the point. Only the core reasons. Deterministic work moves away from the core and becomes rigid. The thesis is visible: more autonomy does not need less structure, it needs better structure. The world shows it as a phase change from fluid to rigid, and the core is the one part that never freezes.

## The look

- **ASCII surfaces.** A form is a set of character marks on the surface of a faceted unit. A font atlas supplies each mark. The faces carry regular rows. Light changes the mark brightness. The surface stays matte.
- **Flat and matte.** One fixed key light from the upper left, baked into the point shader. No specular, no reflections, no environment map, no bloom, no glow, no neon.
- **Faceted units.** Small flat-faced polyhedra: rhombic dodecahedra, truncated octahedra, cuboctahedra, low-poly icosahedra, hexagonal prisms, beveled slabs. Units hold together by proximity and thin struts, never fused, so an entity can split and rejoin.
- **The field.** A near-black backdrop with a faint grid of dots. No horizon, no fog, no sky.
- **The flow.** Work travels as a stream of loose units along a channel. The stream is the connector. No permanent lines are drawn between entities.
- **No sound.** The show stays silent.

## Palette

| Role | Value | Notes |
|---|---|---|
| Backdrop | `#0A0A0B` | off-black, never pure black, with a faint dot grid |
| Point off-white | `#E8E9EC` | the lit side of a unit |
| Point grey | `#8A8F98` | the shadow side, and distant, cheap work |
| Accent | `#2F69FF` Platform blue | the work we follow, and the command line cursor. Lifted to `#5C8BFF` for the smallest dots |

Rules:

- One accent only, locked for the whole talk.
- The accent is flat. It never glows.
- No pure black and no pure white.
- Text must reach 7:1 contrast against the backdrop.
- On the real projector, raise contrast by about 15% if needed. It is one theme token change, not a redesign.

## Typography

- **JetBrains Mono** for everything: panels, the command line, labels, numbers. Mono is the voice of the world.
- Titles use the same mono face at weight 700 with tight tracking (-0.02em). There is no second typeface.
- Both are self-hosted through `@fontsource-variable`, so the show works offline at the venue. The show waits for `document.fonts.ready` before the first frame.
- Sizes in stage units (1 su is 1% of the stage height): labels and the command line 1.8 su, captions 2.8 su, titles 5.6 to 7.2 su, the cover title 9.6 su. Real text is crisp and large; the point cloud carries the machine.
- Product and technical names stay in English in both languages.

## Motion grammar

- **Personality:** calm and exact for the alignment of units; fluid and a little floaty for a reasoning entity. No bounce, no overshoot.
- **Signature easing:** `power3.inOut` for camera steps and most moves. Entrances use `power3.out`, exits use `power2.in`.
- **Beat grid:** 120 BPM, so one beat is 0.5 s. Durations: quick 0.25 s, standard 0.5 s, slow 1 s. Moves between stops take 1, 1.5 or 2 s.
- **Assemble and scatter:** an entity assembles from scattered units, edges first, and scatters back to dust on exit. The core never fully scatters.
- **The dial:** rigid units keep their alignment within an assembly. Fluid units shift within the core. Both assemblies float as whole bodies.
- **Holds:** bounded drift and slow turns keep the field alive while the speaker talks. The presenter controls every change in the story.
- **Determinism:** narrative positions, assembly, cuts, and transfers come from progress. Reversing a move restores its structure. Idle drift uses analytical clock functions without simulation state.
- **Reduced motion:** the engine cuts between stops. The runtime freezes all drift, turns, and channel movement.
- **Focus:** the active assembly grows in the frame. The isometric camera angle stays fixed. Previous layers remain visible at a smaller scale.

The user requested continuous idle motion on 2026-10-05. This is an exception to the progress-only rule for ambient motion.
Idle never advances the story or changes a worker outcome.
The command arrives first, followed by the heading, caption, and leader lines.

## Silent rhythm

- The command line names the current beat and ends with a blue block cursor. Its path changes from local to cloud.
- The title holds while the viewer reads. The shapes carry the change.
- The core loses four units as repeatable work separates. Each new bank grows from the core and settles into alignment.
- The blue Issue occupies a real unit in its current assembly. During a transfer, it leaves that unit and enters another assembly.
- Route channels contain traveling ASCII units. Return paths curve away from the main route. They appear when the beat explains their cause.
- Refine and Implement show fixed jobs around a reasoning core. Repair and review use curved returns through CI.

## Composition and text

- One subject per frame. The point cloud is the subject.
- Almost no interface. The only text is the act title, the command line, the status label, and the panels.
- A panel names one entity. It follows the entity on screen.
- Numbers are not panels. They are units in a bank, or a word in the command line, with a short engraved source.
- Icons, when needed, come from Phosphor, drawn in the same line weight. No hand-made icons.

## Exclusions

1. **No neon, no glow, no bloom, no emissive light, no halo, no rim light.** Matte, unlit, ink on paper. This is a hard rule.
2. **No organic forms.** No monsters, no lobes, no berry clusters, no coral, no sponge. Units are machined shapes.
3. **No literal objects.** No city, no circuit board, no factory, no train, no robot, no person. No spheres and no plain cubes as a subject.
4. **The slide-deck look is out.** No bullet lists, no centered title and subtitle templates, no section numbers, no data tables on the world.

## History

These directions are superseded. They are kept for reference only. Do not build from them.

- **2026-09-29, "Elements in orbit".** A core that deforms, moons and balls in orbit, illustrated planets, astronauts. The script's "On screen" lines were written for this world.
- **2026-09-30, "The town on a map".** A town on a paper map with toon shading and a boiling outline. It read as modules in a void.
- **2026-10-04, "The fortress that becomes a city".** A realistic historical maquette with PBR light. Beautiful but the metaphor was not the subject.
