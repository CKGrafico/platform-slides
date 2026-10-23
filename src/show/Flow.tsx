/**
 * A worker flow drawn in stage units over the dimmed world.
 * Nodes and edges appear in order as `--flow-reveal` goes from 0 to 1, so the picture comes from progress.
 * Six columns and rows 0 to 3.6 fit between the heading and the caption of a wide frame.
 */
import { useState } from 'react'
import { useT, type MessageKey } from '@/i18n'
import { FLOWS, LEGEND, LEGEND_GH, type FlowDef, type FlowEdge, type FlowId, type FlowNode } from './flows'

const STAGE_W = 177.78
const STAGE_H = 100
const NODE_W = 24.5
const NODE_H = 7.5
const COL_X = 9
const COL_PITCH = 27.2
const ROW_Y = 28
const ROW_PITCH = 12.6
const LABEL_LINE = 1.9
/** The legend sits between the heading and the first row, at the right. */
const LEGEND_Y = 24.4

interface Box { x: number; y: number; cx: number; cy: number; right: number; bottom: number }

function boxOf(node: FlowNode): Box {
  const x = COL_X + node.col * COL_PITCH
  const y = ROW_Y + node.row * ROW_PITCH
  return { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2, right: x + NODE_W, bottom: y + NODE_H }
}

function order(def: FlowDef): Map<string, number> {
  const sorted = [...def.nodes].sort((a, b) => a.col - b.col || a.row - b.row)
  return new Map(sorted.map((node, i) => [node.id, i]))
}

interface Route { d: string; label: [number, number]; anchor: 'middle' | 'start' }

/**
 * Orthogonal routing. A forward edge elbows between columns, and its label sits in the row gap
 * above the target, one line per label that lands on the same target. A backward edge in the same
 * row is a straight line with its label above. Other backward edges loop over the top when both ends
 * sit in the first row, and under the rows otherwise. Rows can be fractional, for denser columns.
 */
function route(from: Box, to: Box, loopIndex: number, slot: number, highest: number, lowest: number): Route {
  if (to.x < from.x && Math.abs(to.cy - from.cy) < 0.01) {
    // The gap between neighbours is narrow, so the label sits just above the two boxes.
    return { d: `M ${from.x} ${from.cy} H ${to.right}`, label: [(from.x + to.right) / 2, Math.min(from.y, to.y) - 0.8], anchor: 'middle' }
  }
  if (to.x > from.x) {
    const midX = from.right + (to.x - from.right) / 2
    const label: [number, number] = [to.x + 1.0, to.y - 0.8 - slot * LABEL_LINE]
    if (Math.abs(to.cy - from.cy) < 0.01) return { d: `M ${from.right} ${from.cy} H ${to.x}`, label, anchor: 'start' }
    return { d: `M ${from.right} ${from.cy} H ${midX} V ${to.cy} H ${to.x}`, label, anchor: 'start' }
  }
  if (Math.abs(to.cx - from.cx) < 0.01) {
    if (to.y > from.y) return { d: `M ${from.cx} ${from.bottom} V ${to.y}`, label: [from.cx + 1.2, (from.bottom + to.y) / 2 + 0.5], anchor: 'start' }
    return { d: `M ${from.cx} ${from.y} V ${to.bottom}`, label: [from.cx + 1.2, (from.y + to.bottom) / 2 + 0.5], anchor: 'start' }
  }
  if (from.y < highest + 0.01 && to.y < highest + 0.01) {
    const over = highest - 2.2 - loopIndex * 2.2
    return { d: `M ${from.cx} ${from.y} V ${over} H ${to.cx} V ${to.y}`, label: [(from.cx + to.cx) / 2, over - 0.7], anchor: 'middle' }
  }
  const under = lowest + 2.2 + loopIndex * 2.2
  return { d: `M ${from.cx} ${from.bottom} V ${under} H ${to.cx} V ${to.bottom}`, label: [from.cx + 1.2, under - 0.6], anchor: 'start' }
}

interface EdgeProps { edge: FlowEdge; boxes: Map<string, Box>; index: number; total: number; loopIndex: number; slot: number; highest: number; lowest: number }

function Edge({ edge, boxes, index, total, loopIndex, slot, highest, lowest }: EdgeProps) {
  const from = boxes.get(edge.from)!
  const to = boxes.get(edge.to)!
  const { d, label, anchor } = route(from, to, loopIndex, slot, highest, lowest)
  const kind = edge.kind ?? 'branch'
  const t = useT()
  const style = { '--i': index, '--n': total } as React.CSSProperties
  return (
    <g className={`flow-edge flow-edge--${kind}`} style={style}>
      <path d={d} pathLength={1} markerEnd={`url(#flow-arrow-${kind})`} />
      {edge.label ? <text x={label[0]} y={label[1]} className="flow-edge-label" textAnchor={anchor} data-i18n={edge.label}>{t(edge.label)}</text> : null}
    </g>
  )
}

/** The GitHub mark, marking a step that GitHub Agentic Workflows provides. `x` and `y` are its top-left corner. */
export function GhMark({ x, y, size = 2.4 }: { x: number; y: number; size?: number }) {
  return <path className="flow-gh" transform={`translate(${x} ${y}) scale(${size / 24})`} d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
}

/**
 * One line of help for a box, drawn under it while the presenter hovers it, or above it when the box is low on the stage.
 * It fades in with its box, so a box that has not appeared yet shows no help.
 */
export function Tip({ textKey, x, y, below, index, total }: { textKey: MessageKey; x: number; y: number; below: number; index: number; total: number }) {
  const t = useT()
  const text = t(textKey)
  const width = 3 + text.length * 1.03
  const left = Math.min(Math.max(x, 3), STAGE_W - 3 - width)
  const top = below > 78 ? y - 5.4 : below + 0.8
  return (
    <g className="flow-tip" style={{ '--i': index, '--n': total } as React.CSSProperties}>
      <rect x={left} y={top} width={width} height={4.4} rx={0.6} />
      <text x={left + 1.5} y={top + 2.95} data-i18n={textKey}>{text}</text>
    </g>
  )
}

function Node({ node, box, index, total, onHover }: { node: FlowNode; box: Box; index: number; total: number; onHover: (id: string | null) => void }) {
  const style = { '--i': index, '--n': total } as React.CSSProperties
  const t = useT()
  const titleY = node.sub ? box.cy - 0.9 : box.cy + 0.7
  return (
    <g className={`flow-node flow-node--${node.kind}${node.decision ? ' flow-node--decision' : ''}`} style={style} onPointerEnter={() => onHover(node.id)} onPointerLeave={() => onHover(null)}>
      <rect x={box.x} y={box.y} width={NODE_W} height={NODE_H} rx={node.decision ? NODE_H / 2 : 0.6} />
      {node.gh ? <GhMark x={box.right - 3.6} y={box.y + 1} /> : null}
      <text x={box.cx} y={titleY} className="flow-title" data-i18n={node.title}>{t(node.title)}</text>
      {node.sub ? <text x={box.cx} y={box.cy + 2.4} className="flow-sub" data-i18n={node.sub}>{t(node.sub)}</text> : null}
    </g>
  )
}

/**
 * The three kinds of step, as swatches with names, and the GitHub mark. Every diagram uses them the same way:
 * a white outline is a normal job, solid blue is the agent, and a blue outline is a job after the agent.
 * The GitHub mark in a corner means GitHub Agentic Workflows provides that step.
 * `x` and `y` are the right end of the row's baseline.
 */
export function FlowLegend({ x, y }: { x: number; y: number }) {
  const t = useT()
  const swatch = 3.2
  const gap = 3
  const charW = 0.99
  const labels = [...LEGEND.map((item) => item.label), LEGEND_GH]
  const widths = labels.map((label) => swatch + 1 + t(label).length * charW)
  let left = x - widths.reduce((sum, w) => sum + w, 0) - gap * (labels.length - 1)
  return (
    <g className="flow-legend">
      {LEGEND.map((item, i) => {
        const at = left
        left += widths[i]! + gap
        return (
          <g key={item.kind} className={`flow-node flow-node--${item.kind}`}>
            <rect x={at} y={y - 1.5} width={swatch} height={1.8} rx={0.3} />
            <text x={at + swatch + 1} y={y} className="flow-legend-label" data-i18n={item.label}>{t(item.label)}</text>
          </g>
        )
      })}
      <g>
        <GhMark x={left + 0.4} y={y - 2.2} size={2.4} />
        <text x={left + swatch + 1} y={y} className="flow-legend-label" data-i18n={LEGEND_GH}>{t(LEGEND_GH)}</text>
      </g>
    </g>
  )
}

export function Flow({ id }: { id: FlowId }) {
  const [hover, setHover] = useState<string | null>(null)
  const def = FLOWS[id]
  const boxes = new Map(def.nodes.map((node) => [node.id, boxOf(node)]))
  const rank = order(def)
  const total = def.nodes.length + 1
  const lowest = Math.max(...[...boxes.values()].map((box) => box.bottom))
  const highest = Math.min(...[...boxes.values()].map((box) => box.y))
  let loops = 0
  const slots = new Map<string, number>()
  return (
    <svg className="flow" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        {(['main', 'branch', 'return'] as const).map((kind) => (
          <marker key={kind} id={`flow-arrow-${kind}`} className={`flow-arrow flow-arrow--${kind}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="1.6" markerHeight="1.6" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" />
          </marker>
        ))}
      </defs>
      {def.edges.map((edge, i) => {
        const from = boxes.get(edge.from)!
        const to = boxes.get(edge.to)!
        const index = Math.max(rank.get(edge.from) ?? 0, rank.get(edge.to) ?? 0)
        const loopIndex = to.x <= from.x && Math.abs(to.cx - from.cx) > 0.01 ? loops++ : 0
        const forwardLabel = edge.label && to.x > from.x
        const slot = forwardLabel ? slots.get(edge.to) ?? 0 : 0
        if (forwardLabel) slots.set(edge.to, slot + 1)
        return <Edge key={i} edge={edge} boxes={boxes} index={index} total={total} loopIndex={loopIndex} slot={slot} highest={highest} lowest={lowest} />
      })}
      {def.nodes.map((node) => <Node key={node.id} node={node} box={boxes.get(node.id)!} index={rank.get(node.id) ?? 0} total={total} onHover={setHover} />)}
      {def.legend === false ? null : <FlowLegend x={COL_X + 5 * COL_PITCH + NODE_W} y={LEGEND_Y} />}
      {def.nodes.filter((node) => node.id === hover).map((node) => {
        const box = boxes.get(node.id)!
        return <Tip key={node.id} textKey={`${node.title}.tip` as MessageKey} x={box.x} y={box.y} below={box.bottom} index={rank.get(node.id) ?? 0} total={total} />
      })}
    </svg>
  )
}
