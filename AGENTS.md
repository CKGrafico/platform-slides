# AGENTS.md

These rules apply to every agent that works in this repository. They are not optional.

## Language

Write everything in English: slide text, speaker notes, file names, comments, commit messages, pull requests, and chat replies. If the user writes in another language, reply in English. If source material is in another language, translate it to English before you use it.

## Required skills

This repository ships two writing skills in `.claude/skills/`:

- `simple-english` (`.claude/skills/simple-english/SKILL.md`): plain English based on ASD-STE100.
- `humanizer` (`.claude/skills/humanizer/SKILL.md`): removes the patterns that make text read as AI-generated.

You must use both skills for all text that you write in this repository. Apply them in this order:

1. Write or rewrite the text with `simple-english`.
2. Pass the result through `humanizer`.
3. Run the self-check of each skill before you deliver.

If your agent cannot load skills by name, read both `SKILL.md` files before you write any text, and follow them.

Do not skip either skill because the text is short, a draft, or "only a title". Keep code, commands, file paths, and product names unchanged, as both skills require.

## Required design skill

This repository also ships `design-taste-frontend` (`.claude/skills/design-taste-frontend/SKILL.md`), which is taste-skill v2 from `Leonxlnx/taste-skill`.

You must use this skill for all visual work in this repository: slide layout, styles, colors, type, images, and any HTML or CSS. Read it before you design or change a slide. If your agent cannot load skills by name, read the `SKILL.md` file directly.

The inspiration sites are in `docs/references.md`. The Monolith Project is the main art reference.

## Motion and 3D skills

These skills are in `.claude/skills/`. Use each one when the work matches it:

- `build-threejs-scroll-worlds`: Three.js scenes that the reader moves through by scrolling.
- `scroll-world-storytelling`: tell a story across chapters that change as the reader scrolls.
- `gsap-web`: GSAP timelines and ScrollTrigger.
- `shadertoy`: GLSL shaders in the style of Shadertoy.
- `motion-design`: timing, easing, and how elements move together.
- `optimize-web-animations`: make animations smooth, and profile them in the browser.

Before you add or change any motion, read `motion-design`. After the motion works, read `optimize-web-animations`. Also make sure that every animation respects `prefers-reduced-motion`.

The scroll skills talk about scroll progress. In this project, scroll is not the source of truth. Where a skill says "scroll progress", use the scene's local progress from the presentation playhead. Do not add Lenis, ScrollTrigger, or native page scroll.

## No sound

Do not use sound anywhere in this project. This includes audio files, music, sound effects, transition sounds, voice-over, and video with an audio track. If a skill or template suggests sound, do not add it.

## Engine rules

This repository is a keynote engine plus a show. Read `docs/README.md` before you change code. Read `docs/scenes.md` before you add a scene.

- Add chapters, scenes, and actors only under `src/show/`. Add assets only under `public/assets/`.
- Do not change `src/engine/` or `src/world/` to make one scene work. If a scene needs a new primitive, add it to the right `src/` folder, keep it general, and document it in `docs/`.
- Every visual state must come from progress. Do not use timers, animation callbacks, or accumulated state to change what is on screen.
- GSAP is the only animation library. Import it from `@/animation/gsap`.
- Do not write z-index. Stacking order lives in `src/engine/layers.ts`.
- Before you commit, `npm run typecheck`, `npm run lint`, and `npm run build` must pass. This project has no test suite. Check scenes in the browser with the debug panel.
- The scenes in `src/show/sandbox/` are architecture tests. Delete them when the real show starts.

## Knowledge

`docs/knowledge/platform.md` holds the facts about the Plain Concepts Platform: the repos, the site, the vocabulary, and the numbers. Use it as the source for keynote content. Do not invent numbers. Check its "Verify before you present" list before a fact goes on a slide. Never put personal data, such as contributor logins, on a slide.
