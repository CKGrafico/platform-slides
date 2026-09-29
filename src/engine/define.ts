import type { ChapterDef, SceneDef, ShowDef } from './types'

/** Typed identity helpers. They exist so scene files read the same everywhere. */
export const defineScene = (def: SceneDef): SceneDef => def
export const defineChapter = (def: ChapterDef): ChapterDef => def
export const defineShow = (def: ShowDef): ShowDef => def
