/**
 * The show. This is the only file that knows the chapter order.
 * Add a chapter: create src/show/<chapter>/index.ts, then add it to the list.
 */
import { defineShow } from '@/engine/define'
import { sandboxDom } from './sandbox/chapter-dom'
import { sandboxWorld } from './sandbox/chapter-world'

export const show = defineShow({
  chapters: [sandboxDom, sandboxWorld],
  mountWindow: 1,
})

export { actors } from './actors'
