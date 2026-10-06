/**
 * A worker flow drawn in stage units over the dimmed world.
 * Nodes and edges appear in order as `--flow-reveal` goes from 0 to 1, so the picture comes from progress.
 * Six columns and rows 0 to 3.6 fit between the heading and the caption of a wide frame.
 */
import { useT } from '@/i18n'
import { FLOWS, type FlowDef, type FlowEdge, type FlowId, type FlowNode } from './flows'

const STAGE_W = 177.78
const STAGE_H = 100
const NODE_W = 24.5
const NODE_H = 7.5
const COL_X = 9
const COL_PITCH = 27.2
const ROW_Y = 28
const ROW_PITCH = 12.6
const LABEL_LINE = 1.9

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

function Node({ node, box, index, total }: { node: FlowNode; box: Box; index: number; total: number }) {
  const style = { '--i': index, '--n': total } as React.CSSProperties
  const t = useT()
  const titleY = node.sub ? box.cy - 0.9 : box.cy + 0.7
  return (
    <g className={`flow-node flow-node--${node.kind}`} style={style}>
      <rect x={box.x} y={box.y} width={NODE_W} height={NODE_H} rx={0.6} />
      <text x={box.cx} y={titleY} className="flow-title" data-i18n={node.title}>{t(node.title)}</text>
      {node.sub ? <text x={box.cx} y={box.cy + 2.4} className="flow-sub" data-i18n={node.sub}>{t(node.sub)}</text> : null}
    </g>
  )
}

export function Flow({ id }: { id: FlowId }) {
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
      {def.nodes.map((node) => <Node key={node.id} node={node} box={boxes.get(node.id)!} index={rank.get(node.id) ?? 0} total={total} />)}
    </svg>
  )
}
