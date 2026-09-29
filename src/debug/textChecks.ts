/**
 * Layout checks for the text the audience can see. Debug only: they read
 * layout, so they never run in the talk.
 *
 * - findOverflows: boxes marked data-fit whose content does not fit, at any
 *   edge. Both languages must fit the same box, so an overflow is a layout bug.
 * - findOverlaps: pieces of visible text that cover each other (labels,
 *   captions, titles), or that go past the edge of the stage. Measured on the
 *   text itself with a Range, not on the box, because a label box is wider
 *   than its words.
 *
 * In development both are also on window.__checks, so a script can walk every
 * stop in both languages.
 */

function inActiveScene(el: Element): boolean {
  const scene = el.closest<HTMLElement>('.scene')
  return !scene || scene.dataset.state === 'active'
}

/** Visible, and not faded out: the opacity of the element and its parents multiplies. */
function isShown(el: HTMLElement): boolean {
  if (getComputedStyle(el).visibility === 'hidden') return false
  let opacity = 1
  let n: HTMLElement | null = el
  while (n) {
    const s = getComputedStyle(n)
    if (s.display === 'none') return false
    opacity *= Number(s.opacity)
    n = n.parentElement
  }
  return opacity > 0.3
}

/**
 * Words outside their box. The scroll size only sees overflow at the end
 * edges, so a caption held at the bottom (flex-end) that is too tall grows
 * upward and never scrolls: its first line is clipped with no warning.
 * A line counts when it sticks out by more than a fifth of its height, so the
 * font's ascent and descent on a tight line height do not count.
 */
function sticksOut(el: HTMLElement): boolean {
  const box = el.getBoundingClientRect()
  return textRects(el).some((r) => {
    const out = Math.max(box.top - r.top, r.bottom - box.bottom, box.left - r.left, r.right - box.right)
    return out > Math.max(2, r.height * 0.2)
  })
}

export function findOverflows(): string[] {
  const out: string[] = []
  document.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    const shown = inActiveScene(el) && getComputedStyle(el).visibility !== 'hidden'
    const over = shown && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1 || sticksOut(el))
    el.classList.toggle('i18n-overflow', over)
    if (over) out.push(el.dataset.fit || el.textContent?.slice(0, 24) || '?')
  })
  return out
}

interface TextBox {
  name: string
  rects: DOMRect[]
}

/** One rectangle per line of words inside an element (not the box around them). */
function textRects(el: HTMLElement): DOMRect[] {
  const range = document.createRange()
  range.selectNodeContents(el)
  return [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1)
}

/** Words that are on screen now: labels, captions, titles, statements. */
function visibleText(): TextBox[] {
  const boxes: TextBox[] = []
  const add = (el: HTMLElement, name: string) => {
    if (!inActiveScene(el) || !isShown(el)) return
    const rects = textRects(el)
    if (rects.length) boxes.push({ name, rects })
  }
  document.querySelectorAll<HTMLElement>('.art-label, .art-card').forEach((el) => add(el, el.dataset.fit ?? 'label'))
  // The map of the talk in its corner.
  document.querySelectorAll<HTMLElement>('.hud-name').forEach((el) => add(el, 'hud'))
  // Burned text: each .art-burn that shows is one block of words.
  document.querySelectorAll<HTMLElement>('.art-burn').forEach((el) => {
    const owner = el.closest<HTMLElement>('[data-fit]')
    add(el, owner?.dataset.fit ?? 'text')
  })
  return boxes
}

const MIN_AREA = 6

/** The part of the page the audience sees. */
function stageRect(): DOMRect {
  return document.querySelector('.stage')?.getBoundingClientRect() ?? new DOMRect(0, 0, innerWidth, innerHeight)
}

export function findOverlaps(): string[] {
  const boxes = visibleText()
  const out: string[] = []
  // Words cut by the edge of the stage count too: "name x edge". Words fully
  // outside it do not, as nobody sees them.
  const edge = stageRect()
  const cut = (r: DOMRect) => {
    const inside = r.left >= edge.left - 1 && r.right <= edge.right + 1 && r.top >= edge.top - 1 && r.bottom <= edge.bottom + 1
    const outside = r.right <= edge.left || r.left >= edge.right || r.bottom <= edge.top || r.top >= edge.bottom
    return !inside && !outside
  }
  for (const A of boxes) if (A.rects.some(cut)) out.push(`${A.name} x edge`)
  const hit = (a: DOMRect, b: DOMRect) => {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left)
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
    return w > 0 && h > 0 && w * h > MIN_AREA
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const A = boxes[i]!
      const B = boxes[j]!
      if (A.name === B.name) continue
      if (A.rects.some((a) => B.rects.some((b) => hit(a, b)))) out.push(`${A.name} x ${B.name}`)
    }
  }
  return [...new Set(out)]
}

if (import.meta.env.DEV) {
  ;(window as unknown as { __checks?: unknown }).__checks = { findOverflows, findOverlaps }
}
