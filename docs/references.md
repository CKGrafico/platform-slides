# Inspiration references

These sites set the level of ambition for the keynote. This file records what each one does and what we take from it. Study the sites for pacing, transitions, camera work, and art direction. Do not copy their assets, illustrations, text, fonts, or code.

Researched on 2026-09-29. Facts marked "(inferred)" come from reasoning, not from a source.

Most of these sites are driven by scroll, and many use sound. Our keynote is driven by the presenter, and it is silent. Take the visual ideas. Do not take the input model or the audio. Section "Carrying rhythm without sound" below says what replaces each sound.

## What we take, in short

1. **One number drives everything.** Every strong site keeps a private timeline value and never lets native scroll own the story. This is our playhead.
2. **A scene is a declared segment.** The Monolith Project and Why Zero both describe the show as data: length, background, titles, captions, transition, and hold points. This is our `defineScene`.
3. **A click starts a timed move.** Transitions are automatic moves of 0.8 to 3.5 seconds with an in-out ease. This is our stop tween.
4. **Dwell, then travel.** The camera holds still while text is read, and moves only between stops.
5. **Restraint.** One spectacle per act, very little text, one or two motif colours, a frame that is never empty.
6. **Idle life.** Grain, drift, particles, and boiling outlines keep a paused frame alive.
7. **Persistent objects.** One symbolic object crosses scenes, and the world changes around it. This is our actor.
8. **Heavy preparation.** Compressed assets, shaders compiled before the show, and a locked quality tier on stage.

## Main art reference: The Monolith Project

[themonolithproject.net](https://themonolithproject.net/) · [Codrops case study](https://tympanus.net/codrops/2025/11/29/building-the-monolith-composable-rendering-systems-for-a-13-scene-webgl-epic/)

**What it is.** A fable about tools and technology in 5 acts and 13 scenes. It starts in the solar system, where an ape touches a cyan monolith and throws a bone. The camera drifts down through history (stone tablets, a beige PC, a tablet). A white character with a red nose falls from the tablet into the sky and lands by a second monolith. Each touch rebuilds the world around it: desert, swamp, winter, forest, animals. The world becomes a framed painting, then the credits play. Influences: Moebius and *2001: A Space Odyssey*. Lead developer Ethan Chiu, creator Kehan Fan, creative director Nando Correa, illustrator Zao Yu Lin. Awwwards Site of the Day and Developer Award (Animations/Transitions 9.0), CSS Design Awards Website of the Day.

**Why it matters to us.** Its architecture is our architecture. The story is one declarative array of scenes. Each scene has a length, a background colour, a title that dissolves in, corner captions with start and end points, a transition with a named shader, hold points where the story waits, and snap rules. Scroll is only an input that feeds a private timeline value.

### Structure and pacing

The timeline runs 33.5 units. Each act follows the same beat: the title dissolves in and out over 1 to 1.5 units, one or two captions hold for 0.5 to 1 unit each, then a transition takes the last 10% to 25% of the scene.

| Act | Scenes | What happens | Transition out |
|---|---|---|---|
| 1 Cosmic Origins | Solar | toon sun, striped planets, sketchy orbit lines, the camera curves onto one planet | a black bar that tilts up to 12° as it wipes |
| 2 The Discovery | Monolith, Bone, History, Device | the ape touches the monolith (a hold point), throws the bone, the camera drifts down past objects from history to a beige PC and a tablet | zoom blur that matches the 2D bone to the 3D bone, then a mask through the tablet screen, then a mask shaped like the character |
| 3 The Descent | Fall | a skydive through clouds with speed lines, to an island (a hold point) | zoom blur |
| 4 New Horizons | Desert, Swamp, Winter, landscapes, Creatures | the monolith stays in the same place on screen while the world changes around it | a radial wipe that spreads from the monolith, then a glass sphere that grows and holds the next world |
| 5 Infinite Canvas | World, Ending | a top-down map, then the world pulls back into a picture frame, then credits | a frame mask, then a line wipe back to act 1 |

### Art direction

- Hand-drawn 2D illustration turned into 3D. Flat toon shading with 2 light bands, a thick outline drawn in post, pastel low-contrast colour. It reads as a bright comic book, not a dark cinematic film.
- Scene backgrounds: Solar `#AEB1B2` (space reads about `#9FB5AE`), Monolith and History `#B5A8BA`, Fall `#5E8AB6`, World `#A3B1C7`, Ending `#ECEAE5`.
- UI: beige `#FFF6DF`, dark beige `#FFEBBC`, accent red `#FF002F`. Burn edge on text: orange `#FF9100`.
- Materials: outline colours `#547694`, `#002764`, `#428385`. Monolith gradient `#71B3DD` to `#ACC9AD` to white.
- **The outline boils.** Noise displaces it, and it updates at 4 fps. This stepped wobble is the main reason the 3D looks drawn. It also works as a metronome.
- Grain is a separate full-screen layer, additive, at opacity 0.2. Chromatic aberration is faint (0.03).
- Fog uses height, depth, and FBM noise. It makes the pink desert haze.
- No depth of field. Depth comes from layers, haze, foreground plants at the frame edges, and a long lens (FOV 30 to 50).
- One subject per frame. The monolith is a thin vertical in the middle. Captions go in the empty corner facing the subject.
- The scale jumps on purpose: solar system, planet, bone, desk, character, landscape, map.
- About 70% 3D with painted textures and 30% 2D sprites. Everything passes through the same outline and grain, so it is one style.

### Typography

All story text is rendered in WebGL with troika-three-text, not in the DOM.

- Act titles: Bowlby One, uppercase, huge (85 to 214), two stacked lines, beige with a 1 px black outline.
- Kicker ("ACT 1"): Baloo 2 Medium, 16 px, very wide tracking.
- Captions: BR Cobane Black (a paid font), uppercase, 30 px, max width 380, in the four corners.
- One shader burns every title and caption in and out. A slow swirl noise is mixed with a diagonal gradient. Progress 0 to 1 burns the text in, and 1 to 2 burns it out the other way. The edge is a thin orange burnt-paper line. Each line has its own seed. Progress is tied to the timeline, so going back plays it backwards.

### Motion and transitions

- Each scene has a camera start pose and an end pose. The end can follow a moving object. Position lerps and rotation slerps with a power2 in-out over the scene. Rotation is then damped a little, which gives the camera weight. During the transition the camera pushes about 3 units forward.
- The transition system renders both scenes to buffers and mixes them in one full-screen shader. There are four kinds:
  - **Mask:** a greyscale mask made at runtime from a shape: a rising bar, a tablet screen, a character silhouette, a picture frame.
  - **Zoom:** a 10-sample radial blur plus fisheye. The swap happens at the peak of the blur.
  - **Radial by world position:** the next scene appears within a growing distance from a point, such as the monolith.
  - **Ray-marched sphere:** a glass sphere grows and shows the next world inside it.
- Easing is power1 to power3 in-out and expo out. Nothing is springy. The feel is smooth and a little floaty.
- GPU particles (dust, leaves, snow) gather toward the monolith during a hold.

### Technology

three.js r181 on WebGL, React Three Fiber and drei, GSAP 3.21 with CustomEase, Lenis, troika-three-text, zustand. Deferred rendering with three buffers (colour, normals, outline colour) and 34 composable GLSL material modules. About 38 MB of assets (37 Draco GLB files, 99 KTX2 textures). Every scene is rendered once before the story starts, so shaders compile early. `?sandbox=SceneX` loads one scene for development.

### Sound and the silent version

Nine music stems start together and crossfade to the active act, so the music stays in sync when you scrub. One-off sounds mark transitions, wind, and holds. For our silent version:

- Mark every act change with the title burn plus a background colour change.
- Replace the hold swell with a visible build: particles gather, glow rises, the outline boil speeds up from 4 to 8 or 12 fps, then a short flash and a zoom-blur release.
- Replace wind with speed lines, a small noise shake, and a radial blur that follows speed.
- Run every transition for a fixed 0.8 to 1.2 seconds from the key press, so it lands like a hit.

### What we take

1. Its show model, one to one. Its hold points are our stops. A stop must never land inside a transition window.
2. The title burn shader, tied to local progress, 0 to 1 in and 1 to 2 out.
3. The two-scene transition compositor with the four transition kinds. Shape masks give match cuts between objects.
4. One persistent actor at a fixed place on screen while the world changes around it.
5. The drawn post stack: toon bands, outline with a colour per object, 4 fps boil (`floor(time * 4) / 4`), saturation, then grain as its own layer. A cheaper path: `MeshToonMaterial` with a 2-step gradient map and an inverted-hull outline.
6. Gathering GPU particles during a hold.
7. The loader as a scene in the same art style, which also compiles shaders before the talk.

### What we do not take

- The scroll input, the speed cap, the snap timer, and every mouse or tap effect. The presenter drives the playhead.
- The 38 MB of assets and a ray-marched transition on an unknown GPU. Preload everything, cap the DPR, and test on the real laptop.
- Effects too faint for a projector: 0.2 grain, 1 px outlines, low-contrast pastels. At 1080p, outlines must be 2 to 3 px, and contrast and saturation must be 10% to 20% higher than theirs. Keep captions inside a 5% to 8% safe area, and larger than 30 px.
- Their art, characters, and fonts. Copy the system, not the images.

## Cinematic storytelling

### The Long Way Home

[Case study and live copy](https://buildsbyluke.com/work/cinematic-website/). The original domain `thelongwayhome.site` no longer resolves.

- **What:** a scroll film in six movements about a goodbye: a trip past the planets, into a nebula, and back to one light. A solo work by Luke (Builds By Luke), 2026. It is silent by design.
- **Pacing:** six beats, each with an eyebrow line, a headline, and one sub-line. Movement iii, "Past whole worlds", is 2.3 times longer on purpose, so the emptiness has room. The nebula in movement iv is the only spectacle (bloom 1.05 against a 0.35 to 0.7 baseline). A smootherstep curve eases the camera into every beat. In the finale, if the viewer holds still for 1.8 seconds, the last star swells.
- **Art:** near-black `#04050A`, not pure black, so bloom still reads. One motif colour, warm `#FFB36B`, is the porch light at the start and the last star at the end. Earth blue `#8FB8E0` appears once. The nebula uses violet `#C68BFF`, ember `#C2724A`, and one teal thread `#2FB9A6`. Headlines in Fraunces (variable serif, 7 to 8 rem), UI in grey Inter with 0.42 em tracking. CSS film grain and a vignette. Planets pass at the frame edges, never in the centre.
- **Motion:** one continuous camera, no cuts. The FOV narrows across the piece (72, 66, 60, 70, 56, 52), so the frame gets more intimate. A small sine "breath" on position and roll. Headlines rise out of masks: yPercent 110 to 0, `expo.out`, 1.05 s, stagger 0.024 s per character.
- **Tech:** three.js 0.160, GSAP with ScrollTrigger, Lenis. No images, no video. The nebula is domain-warped simplex noise on an inverted sphere. Stars are three `Points` layers, and a velocity uniform stretches them into warp streaks. Tone mapping is off, so the paths with and without post look the same. A real reduced-motion path and a CSS fallback.
- **We take:** a keyframe table per stop interpolated with smootherstep. One motif colour and object that open and close the talk. One deliberately long stop with a single line. Warp streaks driven by the speed of the playhead, not by scroll.

### Why Zero

[why.zero.university](https://why.zero.university/) · [Codrops write-up](https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/). The domain `whyzero.xyz` is now parked.

- **What:** an argument site for Zero University: AI-native learning instead of degrees. Design by Atul Khola's team, development by Sindhur Dutta / BUNQ LABS. Awwwards Site of the Day, CSSDA Website of the Day.
- **Pacing:** six stages joined by five gates. You draw a zero to unlock. You hold to shatter glass. Statistics appear on the shards. Money burns and certificates shred into a tunnel shaped like the logo. Above the clouds, a city of company buildings appears. Each gate plays on its own for about 3.5 seconds.
- **Art:** deep green gradients with accent `#01C654`. Baked-light hands, frost, glass shards. Story text is baked into a texture atlas and drawn as sprites.
- **Motion:** during a hold, the frame shifts slowly to dark red. When the glass breaks, the colour snaps back in about 200 ms. The developer tested 400 ms and found it weaker. Text sharpens from a blur as it arrives.
- **Tech:** no native scroll. Wheel input moves a virtual value. Each stage is a segment object with `enter`, `scrub(local)`, `update(dt)`, and `teardown`, plus its share of the timeline. A jump replays the lifecycle of every earlier segment. The URL deep-links to a stage. Camera paths are Blender clips. Text is composited after tone mapping, so it stays crisp. Textures upload during idle time in small tiles, and `compileAsync` warms the next stage's shaders at 15% progress. A rolling frame-time average moves the quality tier up or down.
- **Sound:** heavy. Ambient beds, effects for the shatter, and a hold sound whose pitch rises.
- **We take:** the segment lifecycle, which matches our stops. A "hold" gate for one hero moment. The fast 200 ms snap back after tension, with a one-frame flash and a small shake instead of the sound. Pre-warming the next scene's shaders and textures during the current scene.

### The Pendragon Cycle

[pendragoncycle.com](https://www.pendragoncycle.com/) · [Merlin Studio case](https://merlin.studio/work/pendragon-rise-of-the-merlin)

- **What:** a world site for the series *The Pendragon Cycle: Rise of the Merlin*. By Merlin Studio with Format-3. Awwwards Site of the Day.
- **Pacing:** a sword interaction ramps a value from 0 to 1 over 6 seconds, changing snow to fire. Letting go reverses it over 1 second. The story reads like title-card prose, with almost no text, because copy over a cinematic scene breaks the spell. Each section is treated as a shot with its own composition, cut like a title sequence.
- **Art:** `#262626` and taupe `#9C8E7D`, ember particles from `#ffead6` to `#d6904b`. Serif typefaces (Verdigris, Goudy Oldstyle). Painted 4K key art used as 2.5D plates, with fog layers and drifting snow and embers.
- **Tech:** Next.js, React Three Fiber, three r174, Lenis, Framer Motion. The backdrop is one full-screen plane with a flowmap distortion, a fog mask that packs three fog layers into the R, G, and B channels, and a cross-fade to a second plate. 1200 texture-driven particles with gravity and gust uniforms.
- **We take:** 2.5D painted or rendered plates with channel-packed fog. Rich and cheap. The "ignite" ramp (6 s up, 1 s down) as a state change the presenter triggers. Weather particles as a constant ambient layer.

### The Blue Desert

[thebluedesert.com](https://thebluedesert.com/) · [Awwwards](https://www.awwwards.com/sites/the-blue-desert)

- **What:** an R&D project by Adoratorio Studio that turns climate data (COP21 goals against progress) into a sci-fi story about a wanderer. About 8 months of work. Awwwards Site of the Day.
- **Pacing:** eight chapters with a chapter menu and an SVG progress path. Data "pins" sit inside the scenes as a second layer. Cloud passes are the transitions between chapters.
- **Art:** deep blue `#104F89` against sand gold `#BC9855`. Soft, brushed, sandy 3D with toon shading and painted clouds.
- **Tech:** Vue 3, three r159, GSAP, UnrealBloom. **The whole camera path is one Blender animation clip**, scrubbed with `mixer.setTime(clip.duration * progress)`. Each scene has a desktop GLB and a lighter GLB.
- **Sound:** an AI voiceover per chapter, ambient beds, and effects. The silent version turns the voiceover into large timed caption cards.
- **We take:** a camera authored in Blender as one clip and sampled by the playhead, with stops as timestamps on the clip. Full-frame cloud or fog passes that hide a scene swap. A lighter variant per scene.

### Active Theory: Mastered from Chaos

[Active Theory project page](https://v4.activetheory.net/work/mastered-from-chaos). The old domain `masteredfromchaos.com` now hosts spam. Do not link to it.

- **What:** a 2016 interactive film for Hennessy V.S.O.P, by Droga5 and Active Theory. Five chapters with roman numerals and locations: Cultivation, Distillation, Selection, Maturation, Blending.
- **Pacing:** each chapter runs the same loop: a title card over a point-cloud scene, an interaction, video and information, then an automatic advance.
- **Art:** black, white, and gold `#ECD06F`, with lidar point clouds of the real places. The title card: a 12 px roman numeral, a large serif title, an 11 px tracked location line, and thin hairlines that grow out to both sides. A tilt-shift pass.
- **Motion:** **letterbox bars** slide in over 600 to 1000 ms to crop the frame to about 2.35:1 on title cards, and slide out when the interaction starts. The page switches between "watch" and "play". A chapter change is a dip to black: fade in 500 ms, swap, wait 200 ms, fade out 1000 ms. Point clouds swirl and then resolve into a flat image.
- **We take:** letterbox bars as a mode signal. This is the strongest silent rhythm device in the whole set. The title card grammar for every chapter. A point cloud that resolves from chaos into an image, which fits a "from chaos to a system" story. The dip-to-black timing for hard chapter changes.

### Cinematic Scroll demo (now Web Design Studio)

[Repo](https://github.com/MustBeSimo/web-design-studio) · [Demo](https://mustbesimo.github.io/web-design-studio/). The old URL returns 404.

- **What:** an MIT-licensed agent skill by Simone (MustBeSimo) with craft rules, examples, and a small runtime. The flagship, "Aether: Four Movements", has four chapters that share one renderer.
- **Rules worth keeping:**
  - Every beat runs opening, transformation, a hold long enough to read, then exit.
  - Text stays still while people read it. The visual layer carries the change.
  - In the flagship, the camera stays still for the first 55% of each section, then travels.
  - Every animated property has one owner.
  - Damping is time-based, so it behaves the same at 60 and 120 Hz.
- **Motion:** the FOV widens by 6° while the camera travels and settles back when it stops. Dust reacts to speed.
- **We take:** dwell-then-travel inside each stop. The FOV kick and speed-reactive dust during moves. The quality governor, with a lock so the tier never changes during the talk.

## Real-time 3D

### Bruno Simon

[bruno-simon.com](https://bruno-simon.com/) · [folio-2025 source](https://github.com/brunosimon/folio-2025) (MIT)

- **What:** a portfolio you explore by driving a toy car on an island. The 2025 version won Awwwards Site of the Day. The source, including the Blender files, is open.
- **Art:** 2019 used no real lights: matcaps for shading and baked shadow images under moving objects. 2025 is a painted island coloured through one palette texture, with a day cycle that blends four presets (day, dusk, night, dawn). Bloom with threshold 1 and strength 0.25, plus a cheap depth of field.
- **Tech:** three r183 with `WebGPURenderer` and a WebGL2 fallback. Rapier physics. KTX2 textures and Draco meshes through gltf-transform. Blender object names drive behaviour: empties mark colliders and zones. DPR capped at 2, antialias only below DPR 2, manual draw order, instancing everywhere. A quality system sends a `change` event that every system listens to.
- **We take:**
  - **The Cycles pattern.** Keyframed presets on one 0 to 1 value, blended with smoothstep, with events when progress crosses a point or enters a range. It maps directly onto our stops, and costs almost nothing.
  - Matcaps, baked shadows, and a palette texture. Lighting for the price of one texture lookup, which suits a laptop on a projector.
  - Blender names as the authoring API: empties named `shot_03_cam` and `shot_03_target` become camera shots at load time.
  - Quality tiers as events, with bloom mip count as the main lever.

### Lusion experiments

Lusion is a studio known for pre-rendering wherever it can and keeping live effects as accents. Their open [WebGL-Scroll-Sync](https://github.com/lusionltd/WebGL-Scroll-Sync) note is about keeping DOM and WebGL in the same frame, which our engine does by design.

- **[Abduction](https://exp-abduction.lusion.co/):** a UFO mini-game that lifts a crowd of up to 262,144 people. A GPU crowd simulation where each person is one pixel of a state texture (inferred). The quality tiers are the simulation texture sizes. **We take:** a GPU swarm as a persistent actor with named attractor uniforms (`uAttractor`, `uSwirl`, `uDrop`), so particles can form a shape and scatter. Keep each agent to a quad.
- **[AKARI](https://akari.lusion.co/):** 2D light tracing on black, based on a jump-flood distance field and about 32 rays per pixel. **We take:** letters that cast light shadows as a light sweeps past, for one signature title moment only, at half or quarter resolution. The cheap version is a radial blur of an occlusion mask.
- **[Zero Tech](https://lusion.co/projects/zero_tech/):** a client site with real-time 3D sections, Awwwards Site of the Day and Developer Award. **We take:** each stop owns one 3D look, and DOM and uniforms update from the same value in the same frame.
- **[ION](https://exp-ion.lusion.co/):** a fake product launch for a smart speaker. One hero object re-framed shot by shot, Apple style, on black. A "change material" control. **We take:** one hero actor across scenes with camera shots per stop and a `uFinish` uniform that crossfades materials. Fake audio reactivity from a noise "spectrum" that drives a vertex wobble.
- **[Infinite Passerella](https://exp-infinite-passerella.lusion.co/):** an endless virtual fashion show with directed camera cuts and changeable LED walls. Lusion's habit is to bake cloth as vertex animation textures. **We take:** baked animation (VAT) for complex deformation, which scrubs both ways for free. An emissive LED wall whose colour uniform also tints the lights and fog, so one value changes the mood.

### What makes Lusion-level work feel premium

- Offline-quality light shown in real time: baked lighting and occlusion, matcaps, one or two live accents.
- Restraint: one hero object, one typeface, three or four colours, black negative space.
- Camera craft: slow eased moves and a small three-layer noise drift, so the frame is never dead.
- Material truth: good environment maps, and detail where the eye goes.
- Transitions through masks and persistent objects, never through a loading screen.

## Noomo Agency

[noomoagency.com](https://noomoagency.com/) · Nuxt, Three.js, GSAP, WebGL. The house style: glass materials, pixel accents, dark stages, one persistent 3D actor per site, animation authored and baked in Blender and driven by GSAP. Typefaces on the main site: Neue Haas Grotesk and Neue Machina.

- **[Storytelling](https://storytelling.noomoagency.com/):** the agency manifesto, told through a glass phoenix and six client cases. Two acts: a light act for feeling with almost no information, then a dark act for knowledge, where the cases appear as ice crystals and the phoenix pulls back so it does not compete. Big camera moves only at turning points, near stillness between them. Palette lavender `#E5DDF9` and near-black `#020612`. Blender animation mapped to progress. They removed a cursor-driven fire because it hurt depth. Case pages repeat one fixed template. **We take:** the two-act palette flip through one uniform and the `:root` CSS variables in the same timeline. The actor that recedes when content arrives. SVG icons extruded into glass "portals" that the camera pushes into.
- **[Labs](https://labs.noomoagency.com/):** the R&D hub. A glass sphere shatters, and the pieces follow you through the site. A glass jellyfish guides you. The camera hangs off two animated empties, one for position and one for the look target. They treated awkward reverse playback as a real bug. **We take:** one persistent actor at the canvas root. The two-empty camera rig. Decide, per stop, how going back behaves.
- **[Showcase](https://showcase.noomoagency.com/):** an interactive showreel. Huge, tight display type (ABC Favorit) against tiny mono labels (GT America Mono). Darkness used as a material, with background lightness drifting by a few percent. The preloader works as an overture. **We take:** the display and mono type system, with titles rising by line through masks (stagger about 0.06 s) and mono metadata arriving 150 to 250 ms later. The preloader as the cold open while shaders compile.
- **[Beat](https://beat.noomoagency.com/):** an AI music brand activation. Five questions build a generated track and a 3D fashion scene that reacts to it. Each answer adds light and detail to the scene. Spring secondary motion on clothing. **We take:** **a visual beat clock.** Pick a tempo, for example 100 BPM, so one beat is 0.6 s. Snap every text entry, cut, and light pulse to beats. Draw the beat as a light envelope (about 40 ms up, 300 to 500 ms down) and a small scale pulse on type. Change the tempo per chapter. Progressive reveal: each stop adds one light or removes some fog.
- **[Vibrant](https://vibrant.noomoagency.com/):** an installation for Vibrant Wellness on event screens. A glass human body, then six body systems, then single tests. 2D overlays explain what 3D explains badly. The same zoom model on every level. **We take:** DOM and SVG diagram overlays anchored to 3D points and drawn with the timeline. A three-level zoom grammar (overview, system, detail) that always pulls back the same way. An attract loop for the time before the talk.

Noomo's principles: the medium is the argument. Feeling before knowledge. One symbolic actor that makes room for content. Big moves only at turning points. Rhythm over speed. Remove what hurts legibility.

## Carrying rhythm without sound

Every sound cue in these sites has a visual replacement:

| Sound cue | Visual replacement |
|---|---|
| Music, act change | title burn, background colour change, letterbox bars, a new tempo for the beat clock |
| Whoosh | FOV kick of 4° to 6°, warp streaks, speed lines, radial blur that follows speed |
| Impact, shatter | 200 ms colour snap, a one-frame flash, a small camera shake |
| Swell, build-up | particles gather, glow rises, outline boil speeds up, then a release |
| Ambient bed | particle weather, grain, camera breath, 4 fps outline boil |
| Voiceover | large timed caption cards with a blur-to-sharp reveal |
| Chapter sting | title card with numeral and growing hairlines, dip to black |
| Beat | a fixed tempo grid for every cut and entry, with light pulses on the beat |

## Pacing principles

1. The wait is longer than the payoff. Build atmosphere for about 60% of a beat, reveal in the last 40%.
2. Dwell, then travel. The camera is still while text is read.
3. One deliberately long beat for weight.
4. One peak in the middle third. Quieter toward the end, with a narrower FOV and less on screen.
5. Snap back fast after tension (200 ms, not 400 ms).
6. A recurring motif opens and closes the talk.
7. Five to eight chapters. Each opens with the same title card and closes with a clear signal (letterbox, dip to black, fog pass).
8. Text arrives after the camera lands, never while it moves.

## Rules for the projector

These come from the research. They override anything the sites do:

- Render at 1920x1080 with DPR 1 to 1.5. Lock the quality tier after rehearsal.
- Lift the blacks (for example `#04050A`, not `#000`). Projectors crush dark detail.
- No 1 px hairlines. Outlines 2 to 3 px at 1080p.
- Grain and chromatic aberration must be visible at a distance but must not shimmer.
- Keep text inside a 5% to 8% safe area and larger than on the web.
- Preload every asset and compile every shader before the talk. The loader is the cold open.
