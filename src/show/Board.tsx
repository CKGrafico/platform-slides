/**
 * The boards, drawn in stage units over the dimmed world.
 * `engineering`, `delivery`, `agentic` and `roadmap` copy the four tabs of one real Project Health dashboard.
 * `quote`, `sponsors`, `ghaw`, `tree` and `site` are single cards.
 * Each card or row appears in order as `--flow-reveal` goes from 0 to 1.
 */
import { useState } from 'react'
import { useEnvironment } from '@/engine/environment'
import { useT, type MessageKey } from '@/i18n'
import { FlowLegend, GhMark, Tip } from './Flow'
import { FLOWS } from './flows'
import { EMU_PER_PT, SPONSOR_EVENT, SPONSOR_LABELS, SPONSOR_LINES, SPONSOR_LOGOS, SPONSOR_SLIDE } from './sponsors'

export type BoardId = 'engineering' | 'delivery' | 'agentic' | 'roadmap' | 'quote' | 'sponsors' | 'ghaw' | 'tree' | 'site'

const STAGE_W = 177.78
const STAGE_H = 100

/** The area the Health boards use, under the title and above the caption. */
const LEFT = 7
const RIGHT = STAGE_W - 7
const WIDTH = RIGHT - LEFT
const TOP = 27
const BOTTOM = 78

function reveal(index: number, total: number) {
  return { '--i': index, '--n': total } as React.CSSProperties
}

/** One message as SVG text. Keys are often built from a row id, so they come in as strings. */
function Txt({ k, x, y, className }: { k: string; x: number; y: number; className: string }) {
  const t = useT()
  return <text x={x} y={y} className={className} data-i18n={k}>{t(k as MessageKey)}</text>
}

/** A number with its label above and a short note below. */
function Tile({ x, y, w, h, k, accent }: { x: number; y: number; w: number; h: number; k: string; accent?: boolean }) {
  const key = (suffix: string) => `${k}${suffix}` as MessageKey
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={0.8} className="board-card-frame" />
      <Txt k={key('')} x={x + 2} y={y + 3.6} className="board-label" />
      <Txt k={key('.value')} x={x + 2} y={y + h - 4.2} className={`board-stat${accent ? ' board-stat--accent' : ''}`} />
      <Txt k={key('.sub')} x={x + 2} y={y + h - 1.5} className="board-sub" />
    </>
  )
}

/** The tag over every Health board: whose data, and how fresh. */
function HealthTag() {
  return <Txt k="board.health.tag" x={RIGHT} y={TOP - 1.6} className="board-tag" />
}

type Practice = { k: string; applies: boolean } | { group: MessageKey }
const PRACTICES: Practice[] = [
  { group: 'board.health.everyBuild' },
  { k: 'spec', applies: true }, { k: 'tests', applies: true }, { k: 'mutation', applies: true },
  { k: 'secrets', applies: true }, { k: 'vulns', applies: true }, { k: 'sast', applies: true },
  { k: 'sbom', applies: true }, { k: 'complexity', applies: true }, { k: 'hygiene', applies: true },
  { group: 'board.health.afterDeploy' },
  { k: 'dast', applies: true }, { k: 'perf', applies: false },
]

/** Engineering: the scorecard, the alert that reads AI usage against the level, and the gates one by one. */
function Engineering() {
  const tileW = 31
  const tileH = 15
  const listX = LEFT + tileW * 2 + 3 + 5
  const listW = RIGHT - listX
  const total = 4
  return (
    <>
      <HealthTag />
      <g className="board-card" style={reveal(0, total)}>
        <Tile x={LEFT} y={TOP} w={tileW} h={tileH} k="board.health.level" />
        <Tile x={LEFT + tileW + 3} y={TOP} w={tileW} h={tileH} k="board.health.score" />
        <Tile x={LEFT} y={TOP + tileH + 3} w={tileW} h={tileH} k="board.health.gates" />
        <Tile x={LEFT + tileW + 3} y={TOP + tileH + 3} w={tileW} h={tileH} k="board.health.ai" accent />
      </g>
      <g className="board-card" style={reveal(1, total)}>
        <rect x={LEFT} y={TOP + tileH * 2 + 6} width={tileW * 2 + 3} height={BOTTOM - TOP - tileH * 2 - 6} rx={0.8} className="board-card-frame board-card-frame--dashed" />
        <Txt k="board.health.alert" x={LEFT + 2} y={TOP + tileH * 2 + 9.6} className="board-label" />
        <Txt k="board.health.alert.name" x={LEFT + 2} y={TOP + tileH * 2 + 13.2} className="board-name board-name--bar" />
        <Txt k="board.health.alert.rule" x={LEFT + 2} y={TOP + tileH * 2 + 16} className="board-sub" />
        <Txt k="board.health.alert.now" x={LEFT + 2} y={TOP + tileH * 2 + 18.6} className="board-sub board-sub--dim" />
      </g>
      <g className="board-card" style={reveal(2, total)}>
        <rect x={listX} y={TOP} width={listW} height={BOTTOM - TOP} rx={0.8} className="board-card-frame" />
        <Txt k="board.health.practices" x={listX + 2.5} y={TOP + 3.6} className="board-label" />
        <Txt k="board.health.practices.mode" x={listX + listW - 2.5} y={TOP + 3.6} className="board-label board-label--end" />
      </g>
      <g className="board-card" style={reveal(3, total)}>
        {PRACTICES.map((row, i) => {
          const y = TOP + 8.6 + i * 3.3
          if ('group' in row) return <Txt key={row.group} k={row.group} x={listX + 2.5} y={y} className="board-label board-label--small" />
          const name = `board.health.p.${row.k}` as MessageKey
          return (
            <g key={row.k}>
              <rect x={listX + 2.5} y={y - 1.3} width={1.4} height={1.4} className={row.applies ? 'board-mark' : 'board-mark board-mark--off'} />
              <Txt k={name} x={listX + 5.4} y={y} className={row.applies ? 'board-row' : 'board-row board-row--off'} />
              <Txt k={`${name}.tool` as MessageKey} x={listX + listW - 2.5} y={y} className="board-sub board-sub--end" />
            </g>
          )
        })}
      </g>
    </>
  )
}

interface Dora { k: string; group: 'throughput' | 'instability'; collected: boolean }
const DORA: Dora[] = [
  { k: 'freq', group: 'throughput', collected: true },
  { k: 'lead', group: 'throughput', collected: true },
  { k: 'rework', group: 'instability', collected: true },
  { k: 'cfr', group: 'instability', collected: false },
  { k: 'mttr', group: 'throughput', collected: false },
]

/** Delivery: the five DORA metrics, three collected and two refused, then the two lead times side by side. */
function Delivery() {
  const tableH = 31
  const cols = [LEFT + 2.5, LEFT + 62, LEFT + 88] as const
  const total = DORA.length + 2
  const cardY = TOP + tableH + 5
  // The cards end above the footnote line, which explains DORA under the board.
  const cardH = 11
  const cardW = (WIDTH - 3) / 2
  return (
    <>
      <HealthTag />
      <g className="board-card" style={reveal(0, total)}>
        <rect x={LEFT} y={TOP} width={WIDTH} height={tableH} rx={0.8} className="board-card-frame" />
        <Txt k="board.health.metric" x={cols[0]} y={TOP + 4} className="board-label" />
        <Txt k="board.health.group" x={cols[1]} y={TOP + 4} className="board-label" />
        <Txt k="board.health.status" x={cols[2]} y={TOP + 4} className="board-label" />
        <Txt k="board.health.month" x={RIGHT - 2.5} y={TOP + 4} className="board-label board-label--end" />
      </g>
      {DORA.map((row, i) => {
        const y = TOP + 9.5 + i * 5
        const name = `board.health.d.${row.k}` as MessageKey
        return (
          <g key={row.k} className={`board-card${row.collected ? '' : ' board-card--refused'}`} style={reveal(i + 1, total)}>
            <line x1={LEFT + 2.5} x2={RIGHT - 2.5} y1={y - 3.6} y2={y - 3.6} className="board-rule" />
            <Txt k={name} x={cols[0]} y={y} className="board-row board-row--strong" />
            <Txt k={`board.health.${row.group}`} x={cols[1]} y={y} className="board-sub" />
            <rect x={cols[2]} y={y - 2.3} width={13} height={3.2} rx={1.6} className={row.collected ? 'board-chip board-chip--on' : 'board-chip board-chip--off'} />
            <Txt k={row.collected ? 'board.health.collected' : 'board.health.refused'} x={cols[2] + 6.5} y={y - 0.1} className="board-chip-text" />
            <Txt k={row.collected ? `${name}.value` as MessageKey : 'board.health.d.refused'} x={RIGHT - 2.5} y={y} className={row.collected ? 'board-row board-row--end' : 'board-sub board-sub--end'} />
          </g>
        )
      })}
      <g className="board-card" style={reveal(total - 1, total)}>
        <Txt k="board.health.leads" x={LEFT} y={cardY - 1.4} className="board-label" />
        {(['leadCommit', 'leadIssue'] as const).map((k, i) => {
          const x = LEFT + i * (cardW + 3)
          return (
            <g key={k}>
              <rect x={x} y={cardY} width={cardW} height={cardH} rx={0.8} className="board-card-frame" />
              <Txt k={`board.health.${k}`} x={x + 2.5} y={cardY + 4.4} className="board-label" />
              <Txt k={`board.health.${k}.sub`} x={x + 2.5} y={cardY + 7.6} className="board-sub" />
              <Txt k={`board.health.${k}.value`} x={x + cardW - 2.5} y={cardY + 7.2} className="board-value" />
            </g>
          )
        })}
      </g>
    </>
  )
}

const TOOLING: [string, MessageKey][] = [
  ['harness', 'board.health.t.harness.value'],
  ['workflows', 'board.health.t.workflows.value'],
  ['router', 'board.health.t.installed'],
  ['evidence', 'board.health.t.installed'],
  ['workers', 'board.health.t.workers.value'],
]
/** Bot pull requests of the month, one block each: the gate merged 5, 1 was parked for a person, 3 were merged by hand. */
const BOT_PRS = ['gate', 'gate', 'gate', 'gate', 'gate', 'parked', 'hand', 'hand', 'hand'] as const
const ADDED = [{ lines: 547, kind: 'code' }, { lines: 69, kind: 'comment' }, { lines: 2402, kind: 'test' }] as const
/** Tokens per measured run, in thousands, by kind of work. */
const KINDS = [
  { k: 'triage', tokens: 93.7 }, { k: 'review', tokens: 1140 }, { k: 'refine', tokens: 1660 },
  { k: 'gate', tokens: 1940 }, { k: 'audit', tokens: 2380 }, { k: 'implement', tokens: 8490 },
]

/** Agentic: is the machinery installed, how much merges on its own, and what each kind of run costs. */
function Agentic() {
  const colW = (WIDTH - 8) / 3
  const xs = [LEFT, LEFT + colW + 4, LEFT + (colW + 4) * 2] as const
  const h = BOTTOM - TOP
  const blockW = (colW - 4 - 0.9 * 8) / 9
  const addedTotal = ADDED.reduce((sum, item) => sum + item.lines, 0)
  const maxTokens = Math.max(...KINDS.map((kind) => kind.tokens))
  let addedX = xs[1] + 2
  return (
    <>
      <HealthTag />
      <g className="board-card" style={reveal(0, 3)}>
        <rect x={xs[0]} y={TOP} width={colW} height={h} rx={0.8} className="board-card-frame" />
        <Txt k="board.health.tooling" x={xs[0] + 2} y={TOP + 3.6} className="board-label" />
        <rect x={xs[0] + 2} y={TOP + 6} width={colW - 4} height={3.6} rx={1.8} className="board-chip board-chip--on" />
        <Txt k="board.health.tooling.verdict" x={xs[0] + colW / 2} y={TOP + 8.4} className="board-chip-text" />
        {TOOLING.map(([k, value], i) => {
          const y = TOP + 15 + i * 4.6
          return (
            <g key={k}>
              <Txt k={`board.health.t.${k}` as MessageKey} x={xs[0] + 2} y={y} className="board-row" />
              <Txt k={value} x={xs[0] + colW - 2} y={y} className="board-row board-row--end" />
            </g>
          )
        })}
        <line x1={xs[0] + 2} x2={xs[0] + colW - 2} y1={TOP + h - 6} y2={TOP + h - 6} className="board-rule" />
        <Txt k="board.health.tooling.npm" x={xs[0] + 2} y={TOP + h - 2.5} className="board-sub" />
      </g>
      <g className="board-card" style={reveal(1, 3)}>
        <rect x={xs[1]} y={TOP} width={colW} height={h} rx={0.8} className="board-card-frame" />
        <Txt k="board.health.bot" x={xs[1] + 2} y={TOP + 3.6} className="board-label" />
        <Txt k="board.health.bot.value" x={xs[1] + 2} y={TOP + 11.5} className="board-stat board-stat--accent" />
        <Txt k="board.health.bot.sub" x={xs[1] + 2} y={TOP + 14.8} className="board-sub" />
        {BOT_PRS.map((kind, i) => <rect key={i} x={xs[1] + 2 + i * (blockW + 0.9)} y={TOP + 17.5} width={blockW} height={blockW} className={`board-block board-block--${kind}`} />)}
        {(['gate', 'parked', 'hand'] as const).map((kind, i) => (
          <g key={kind}>
            <rect x={xs[1] + 2} y={TOP + 26.6 + i * 3.2} width={1.6} height={1.6} className={`board-block board-block--${kind}`} />
            <Txt k={`board.health.bot.${kind}`} x={xs[1] + 4.6} y={TOP + 28 + i * 3.2} className="board-sub" />
          </g>
        ))}
        <line x1={xs[1] + 2} x2={xs[1] + colW - 2} y1={TOP + 37.5} y2={TOP + 37.5} className="board-rule" />
        <Txt k="board.health.added" x={xs[1] + 2} y={TOP + 41.2} className="board-label" />
        {ADDED.map((item) => {
          const w = (item.lines / addedTotal) * (colW - 4)
          const rect = <rect key={item.kind} x={addedX} y={TOP + 42.8} width={w} height={1.8} className={`board-added board-added--${item.kind}`} />
          addedX += w
          return rect
        })}
        <Txt k="board.health.added.value" x={xs[1] + 2} y={TOP + 47.8} className="board-sub" />
      </g>
      <g className="board-card" style={reveal(2, 3)}>
        <rect x={xs[2]} y={TOP} width={colW} height={h} rx={0.8} className="board-card-frame" />
        <Txt k="board.health.tokens" x={xs[2] + 2} y={TOP + 3.6} className="board-label" />
        {KINDS.map((kind, i) => {
          const y = TOP + 8.6 + i * 5.4
          return (
            <g key={kind.k}>
              <Txt k={`board.health.k.${kind.k}` as MessageKey} x={xs[2] + 2} y={y} className="board-row" />
              <Txt k={`board.health.k.${kind.k}.value` as MessageKey} x={xs[2] + colW - 2} y={y} className="board-row board-row--end" />
              <rect x={xs[2] + 2} y={y + 0.9} width={Math.max(0.3, (kind.tokens / maxTokens) * (colW - 4))} height={1.6} className="board-bar" />
            </g>
          )
        })}
        <line x1={xs[2] + 2} x2={xs[2] + colW - 2} y1={TOP + h - 9} y2={TOP + h - 9} className="board-rule" />
        <Txt k="board.health.tokens.total" x={xs[2] + 2} y={TOP + h - 5.4} className="board-sub board-sub--light" />
        <Txt k="board.health.tokens.floor" x={xs[2] + 2} y={TOP + h - 2.5} className="board-sub" />
      </g>
    </>
  )
}

/** Where the open time of the month's Issues went, in the five states Roadmap reads from labels. */
const STATES = [
  { k: 'agent', share: 4 }, { k: 'person', share: 32 }, { k: 'queued', share: 31 }, { k: 'pr', share: 17 }, { k: 'hand', share: 16 },
] as const
/** Issue #750, in minutes: open from the first label to the merge, and the time an agent worked on it. */
const ISSUE_OPEN = 34 * 60 + 20
const ISSUE_AGENT = 2 * 60 + 32

/** Roadmap: four numbers, where the time went, and one Issue as a bar. */
function Roadmap() {
  const tileW = (WIDTH - 9) / 4
  const tileH = 14
  const barY = TOP + tileH + 7
  const issueY = barY + 14.5
  const issueH = BOTTOM - issueY
  const trackX = LEFT + 11
  const trackW = WIDTH - 11 - 16
  const colW = WIDTH / STATES.length
  let segX = LEFT
  return (
    <>
      <HealthTag />
      <g className="board-card" style={reveal(0, 3)}>
        {(['closed', 'merged', 'share', 'waiting'] as const).map((k, i) => (
          <Tile key={k} x={LEFT + i * (tileW + 3)} y={TOP} w={tileW} h={tileH} k={`board.health.${k}`} accent={k === 'share'} />
        ))}
      </g>
      <g className="board-card" style={reveal(1, 3)}>
        <Txt k="board.health.went" x={LEFT} y={barY - 1.4} className="board-label" />
        {STATES.map((state) => {
          const w = (state.share / 100) * WIDTH
          const rect = <rect key={state.k} x={segX} y={barY} width={w} height={4.4} className={`board-state board-state--${state.k}`} />
          segX += w
          return rect
        })}
        {STATES.map((state, i) => (
          <g key={state.k}>
            <rect x={LEFT + i * colW} y={barY + 6.4} width={1.6} height={1.6} className={`board-state board-state--${state.k}`} />
            <Txt k={`board.health.s.${state.k}`} x={LEFT + i * colW + 2.6} y={barY + 7.9} className="board-row" />
            <Txt k={`board.health.s.${state.k}.time`} x={LEFT + i * colW + 2.6} y={barY + 10.6} className="board-sub" />
          </g>
        ))}
      </g>
      <g className="board-card" style={reveal(2, 3)}>
        <rect x={LEFT} y={issueY} width={WIDTH} height={issueH} rx={0.8} className="board-card-frame" />
        <Txt k="board.health.i750" x={LEFT + 2.5} y={issueY + 4} className="board-name board-name--bar" />
        <Txt k="board.health.i750.sub" x={LEFT + 2.5} y={issueY + 6.9} className="board-sub" />
        <rect x={RIGHT - 2.5 - 24} y={issueY + 1.6} width={24} height={3.4} rx={1.7} className="board-chip board-chip--on" />
        <Txt k="board.health.i750.outcome" x={RIGHT - 2.5 - 12} y={issueY + 3.95} className="board-chip-text" />
        <Txt k="board.health.i750.open" x={LEFT + 2.5} y={issueY + 10.4} className="board-label board-label--small" />
        <rect x={trackX} y={issueY + 9.1} width={trackW} height={1.6} className="board-track" />
        <Txt k="board.health.i750.open.value" x={RIGHT - 2.5} y={issueY + 10.4} className="board-sub board-sub--end" />
        <Txt k="board.health.i750.agent" x={LEFT + 2.5} y={issueY + 13.4} className="board-label board-label--small" />
        <rect x={trackX} y={issueY + 12.1} width={(ISSUE_AGENT / ISSUE_OPEN) * trackW} height={1.6} className="board-state board-state--agent" />
        <Txt k="board.health.i750.agent.value" x={RIGHT - 2.5} y={issueY + 13.4} className="board-sub board-sub--end" />
      </g>
    </>
  )
}

/** Writes one line per `\n` in the message, starting at `y`. */
function Lines({ k, x, y, step, className }: { k: MessageKey; x: number; y: number; step: number; className: string }) {
  const t = useT()
  return (
    <text x={x} y={y} className={className} data-i18n={k}>
      {/* An empty line keeps its height, so a blank line separates paragraphs. */}
      {t(k).split('\n').map((line, i) => <tspan key={i} x={x} dy={i ? step : 0}>{line || ' '}</tspan>)}
    </text>
  )
}

/**
 * An attributed quote as a card: the author's avatar, the name and handle, the full quoted post, and the source.
 * It is our card, in the keynote's own style. It does not copy the look of the network the quote came from.
 */
/** Saved locally from the author's public profile, so the talk works offline. */
const QUOTE_AVATAR = '/assets/quotes/unclebobmartin.jpg'

function Quote() {
  const t = useT()
  const x = 24
  const y = 28
  const w = STAGE_W - x * 2
  const h = 59
  return (
    <>
      <g className="board-card" style={reveal(0, 3)}>
        <rect x={x} y={y} width={w} height={h} rx={1.2} className="board-card-frame" />
        <clipPath id="board-quote-avatar"><circle cx={x + 8} cy={y + 8} r={4} /></clipPath>
        <image href={QUOTE_AVATAR} x={x + 4} y={y + 4} width={8} height={8} clipPath="url(#board-quote-avatar)" preserveAspectRatio="xMidYMid slice" />
        <circle cx={x + 8} cy={y + 8} r={4} className="board-avatar-ring" />
        <text x={x + 15} y={y + 7.4} className="board-name" data-i18n="board.quote.name">{t('board.quote.name')}</text>
        <text x={x + 15} y={y + 10.8} className="board-repo" data-i18n="board.quote.handle">{t('board.quote.handle')}</text>
      </g>
      <g className="board-card" style={reveal(1, 3)}>
        <Lines k="board.quote.text" x={x + 8} y={y + 19.5} step={3.9} className="board-quote" />
      </g>
      <g className="board-card" style={reveal(2, 3)}>
        <text x={x + 8} y={y + h - 4} className="board-tag board-tag--start" data-i18n="board.quote.source">{t('board.quote.source')}</text>
      </g>
    </>
  )
}

/**
 * The sponsor slide, at the positions and sizes of the event's official slide (src/show/sponsors.ts).
 * Both slides are 16:9, so one scale maps the original to the stage. Logos appear in the official order.
 */
function Sponsors() {
  const t = useT()
  const k = STAGE_W / SPONSOR_SLIDE.width
  const total = SPONSOR_LOGOS.length + 1
  const { mascot, name, city } = SPONSOR_EVENT
  return (
    <>
      <g className="board-card" style={reveal(0, total)}>
        <image href={mascot.file} x={mascot.x * k} y={mascot.y * k} width={mascot.w * k} height={mascot.h * k} preserveAspectRatio="none" />
        <text x={(name.x + name.w / 2) * k} y={(name.y + name.h * 0.8) * k} className="board-event" style={{ fontSize: name.pt * EMU_PER_PT * k, textAnchor: 'middle' }} data-i18n={name.key}>{t(name.key)}</text>
        <text x={(city.x + city.w) * k} y={(city.y + city.h * 0.85) * k} className="board-event board-event--city" style={{ fontSize: city.pt * EMU_PER_PT * k, textAnchor: 'end' }} data-i18n={city.key}>{t(city.key)}</text>
        {SPONSOR_LINES.map((line, i) => <line key={i} x1={line.x * k} x2={(line.x + line.w) * k} y1={line.y * k} y2={line.y * k} className="board-rule board-rule--sponsors" />)}
        {SPONSOR_LABELS.map((label) => (
          <text key={label.key} x={label.x * k} y={(label.y + label.h * 0.62) * k} className="board-tier" data-i18n={label.key}>{t(label.key)}</text>
        ))}
      </g>
      {SPONSOR_LOGOS.map((logo, i) => (
        <g key={logo.name} className="board-card" style={reveal(i + 1, total)}>
          {/* Stretched to fill its box, as the original slide does (a:stretch, no crop). */}
          <image href={logo.file} x={logo.x * k} y={logo.y * k} width={logo.w * k} height={logo.h * k} preserveAspectRatio="none" />
        </g>
      ))}
    </>
  )
}

/** Picks a style per code line: the fence, a settings line, the line that acts, a heading, or prompt text. */
function codeClass(line: string, inSettings: boolean) {
  if (line === '---') return 'board-code board-code--fence'
  if (inSettings) return line.includes('create-pull-request') ? 'board-code board-code--act' : 'board-code board-code--key'
  if (line.startsWith('#')) return 'board-code board-code--title'
  return 'board-code'
}

/**
 * GitHub Agentic Workflows in one slide. On the left, a gh-aw workflow as a source card: the file path on top,
 * then the Markdown, line by line. Settings (the frontmatter) are quieter than the prompt, and the one line that
 * lets the agent act is blue. On the right, what happens when it runs, top to bottom, in the diagram legend's styles.
 */
function Ghaw() {
  const t = useT()
  const [hover, setHover] = useState<string | null>(null)
  const lines = t('board.markdown.code').split('\n')
  const x = LEFT
  const y = 26
  const w = 72
  const step = 2.6
  const h = 9 + lines.length * step + 2
  const chain = FLOWS.ghaw
  const total = chain.nodes.length + 1
  const nodeX = x + w + 9
  const nodeW = 36
  const nodeH = 4.8
  const pitch = (y + h - TOP - nodeH) / (chain.nodes.length - 1)
  const nodeY = (i: number) => TOP + 0.5 + i * pitch
  let fences = 0
  return (
    <>
      <defs>
        <marker id="board-arrow" className="flow-arrow flow-arrow--main" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="1.6" markerHeight="1.6" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" />
        </marker>
      </defs>
      <g className="board-card" style={reveal(0, total)}>
        <rect x={x} y={y} width={w} height={h} rx={1.2} className="board-card-frame" />
        <line x1={x} x2={x + w} y1={y + 6} y2={y + 6} className="board-rule" />
        <Txt k="board.markdown.file" x={x + 4} y={y + 4} className="board-repo" />
        <text data-i18n="board.markdown.code">
          {lines.map((line, i) => {
            const className = codeClass(line, fences === 1 && line !== '---')
            if (line === '---') fences++
            return <tspan key={i} x={x + 4} y={y + 11 + i * step} className={className}>{line || ' '}</tspan>
          })}
        </text>
      </g>
      <FlowLegend x={RIGHT} y={TOP - 2.6} />
      {chain.nodes.map((node, i) => {
        const ny = nodeY(i)
        const edge = chain.edges.find((item) => item.to === node.id)
        const style = { '--i': i + 1, '--n': total } as React.CSSProperties
        return (
          <g key={node.id}>
            {i > 0 ? (
              <g className="flow-edge flow-edge--main" style={style}>
                <path d={`M ${nodeX + nodeW / 2} ${nodeY(i - 1) + nodeH} V ${ny}`} pathLength={1} markerEnd="url(#board-arrow)" />
                {edge?.label ? <Txt k={edge.label} x={nodeX + nodeW / 2 + 1.2} y={(nodeY(i - 1) + nodeH + ny) / 2 + 0.6} className="flow-edge-label" /> : null}
              </g>
            ) : null}
            <g className={`flow-node flow-node--${node.kind}`} style={style} onPointerEnter={() => setHover(node.id)} onPointerLeave={() => setHover(null)}>
              <rect x={nodeX} y={ny} width={nodeW} height={nodeH} rx={node.decision ? nodeH / 2 : 0.6} />
              {node.gh ? <GhMark x={nodeX + nodeW - 3.6} y={ny + 1.2} /> : null}
              <Txt k={node.title} x={nodeX + nodeW / 2} y={ny + nodeH / 2 + 0.7} className="flow-title" />
            </g>
            {node.sub ? <g className="board-card" style={style}><Txt k={node.sub} x={nodeX + nodeW + 2.5} y={ny + nodeH / 2 + 0.6} className="board-sub board-sub--note" /></g> : null}
          </g>
        )
      })}
      {chain.nodes.map((node, i) => node.id === hover ? <Tip key={node.id} textKey={`${node.title}.tip` as MessageKey} x={nodeX - 20} y={nodeY(i)} below={nodeY(i) + nodeH} index={i + 1} total={total} /> : null)}
    </>
  )
}

/**
 * The Foundations site, in a browser window at the right of the stage. Captured from platform.plainconcepts.com
 * on 2026-10-20: the top of the home page (above its demo dashboard, whose numbers are illustrative), then the
 * Frontend and Backend pages. Each page scrolls down slowly and hands over to the next. The motion is a CSS loop,
 * a pure function of the clock, and reduced motion holds the home page still.
 */
const SITE_PAGES = [
  { file: '/assets/foundations/home.jpg', height: 1840 },
  { file: '/assets/foundations/frontend.jpg', height: 2400 },
  { file: '/assets/foundations/backend.jpg', height: 2400 },
]
const SITE_CAPTURE_W = 1280

function Site() {
  const { reducedMotion } = useEnvironment()
  const x = 97
  const y = 27
  const w = RIGHT - x
  const bar = 4.2
  const h = BOTTOM - 4 - y
  const viewH = h - bar
  return (
    <g className="board-card" style={reveal(0, 1)}>
      <rect x={x} y={y} width={w} height={h} rx={1} className="board-card-frame" />
      <clipPath id="board-site-view"><rect x={x} y={y + bar} width={w} height={viewH} /></clipPath>
      <g clipPath="url(#board-site-view)" className={reducedMotion ? 'board-site board-site--still' : 'board-site'}>
        {SITE_PAGES.map((page, i) => {
          const pageH = (page.height / SITE_CAPTURE_W) * w
          const style = { '--page': i, '--scroll': Math.max(0, pageH - viewH) } as React.CSSProperties
          return <image key={page.file} href={page.file} x={x} y={y + bar} width={w} height={pageH} preserveAspectRatio="none" className="board-site-page" style={style} />
        })}
      </g>
      <line x1={x} x2={x + w} y1={y + bar} y2={y + bar} className="board-rule" />
      {[0, 1, 2].map((i) => <circle key={i} cx={x + 2.2 + i * 1.8} cy={y + bar / 2} r={0.5} className="board-site-dot" />)}
      <Txt k="board.site.url" x={x + w / 2} y={y + bar / 2 + 0.55} className="board-site-url" />
    </g>
  )
}

/** A tree line is blue when it is one of the guardrails: the guardrail skills, the plugins that block calls, and the diff check. */
const GUARD = /guardrails|plugins\/|check-diff/

/**
 * What agent-harness installs in a repo, as a file tree on a source card.
 * Each line is a path and a note, split by a tab. Lines appear from top to bottom.
 */
function Tree() {
  const t = useT()
  const lines = t('board.tree.code').split('\n').map((line) => line.split('\t'))
  const x = 30
  const y = 25
  const w = STAGE_W - x * 2
  const step = 2.6
  const h = 9 + lines.length * step + 2
  const noteX = x + 46
  return (
    <>
      <g className="board-card" style={reveal(0, lines.length + 1)}>
        <rect x={x} y={y} width={w} height={h} rx={1.2} className="board-card-frame" />
        <line x1={x} x2={x + w} y1={y + 6} y2={y + 6} className="board-rule" />
        <Txt k="board.tree.file" x={x + 4} y={y + 4} className="board-repo" />
      </g>
      {lines.map(([path = '', note], i) => (
        <g key={i} className="board-card" style={reveal(i + 1, lines.length + 1)}>
          <text x={x + 4} y={y + 11 + i * step} className={GUARD.test(path) ? 'board-code board-code--act' : 'board-code'}>{path}</text>
          {note ? <text x={noteX} y={y + 11 + i * step} className="board-code board-code--fence">{note}</text> : null}
        </g>
      ))}
    </>
  )
}

const BOARDS: Record<BoardId, () => React.JSX.Element> = { engineering: Engineering, delivery: Delivery, agentic: Agentic, roadmap: Roadmap, quote: Quote, sponsors: Sponsors, ghaw: Ghaw, tree: Tree, site: Site }

export function Board({ id }: { id: BoardId }) {
  const View = BOARDS[id]
  return (
    <svg className="flow board" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <View />
    </svg>
  )
}
