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

## No sound

Do not use sound anywhere in this project. This includes audio files, music, sound effects, transition sounds, voice-over, and video with an audio track. If a skill or template suggests sound, do not add it.
