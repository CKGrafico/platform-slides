import { defineChapter } from '@/engine/define'
import { domReveal } from './dom-reveal'
import { svgDraw } from './svg-draw'
import './sandbox.css'

export const sandboxDom = defineChapter({
  id: 'sandbox-dom',
  title: 'Sandbox: DOM and SVG',
  scenes: [domReveal, svgDraw],
})
