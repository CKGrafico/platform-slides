/**
 * The Project Health boards, drawn in stage units over the dimmed world.
 * `portfolio` recreates the template's project cards with its example data, labelled on screen.
 * `agents` shows the real agent aggregates of Platform for one period, by worker.
 * Each card or row appears in order as `--flow-reveal` goes from 0 to 1.
 */
import { useT, type MessageKey } from '@/i18n'

export type BoardId = 'portfolio' | 'agents' | 'quote'

const STAGE_W = 177.78
const STAGE_H = 100

type Status = 'production' | 'preproduction' | 'planned'
interface Metric { label: MessageKey; value: MessageKey; sub?: MessageKey }
interface Card {
  name: MessageKey
  repo: MessageKey
  status: Status
  metrics?: Metric[]
  agents?: Metric[]
  /** Text shown in the agent area when the project runs no agents. */
  noAgents?: boolean
  profile?: MessageKey[]
  empty?: [MessageKey, MessageKey]
}

const CARDS: Card[] = [
  {
    name: 'board.billing', repo: 'board.billing.repo', status: 'production',
    metrics: [
      { label: 'board.deploys', value: 'board.billing.deploys', sub: 'board.billing.deploys.sub' },
      { label: 'board.lead', value: 'board.billing.lead', sub: 'board.commitToProd' },
      { label: 'board.rework', value: 'board.billing.rework', sub: 'board.billing.rework.sub' },
    ],
    noAgents: true,
    profile: ['board.profile.harmonious', 'board.profile.pragmatic'],
  },
  {
    name: 'board.checkout', repo: 'board.checkout.repo', status: 'production',
    metrics: [
      { label: 'board.deploys', value: 'board.checkout.deploys', sub: 'board.checkout.deploys.sub' },
      { label: 'board.lead', value: 'board.checkout.lead', sub: 'board.commitToProd' },
      { label: 'board.rework', value: 'board.checkout.rework', sub: 'board.checkout.rework.sub' },
    ],
    agents: [
      { label: 'board.runs', value: 'board.checkout.runs' },
      { label: 'board.tokens', value: 'board.checkout.tokens', sub: 'board.checkout.tokens.sub' },
      { label: 'board.time', value: 'board.checkout.time', sub: 'board.checkout.time.sub' },
    ],
  },
  {
    name: 'board.mobile', repo: 'board.mobile.repo', status: 'preproduction',
    metrics: [
      { label: 'board.deploys', value: 'board.na', sub: 'board.mobile.noProd' },
      { label: 'board.lead', value: 'board.na', sub: 'board.mobile.noProd' },
      { label: 'board.rework', value: 'board.mobile.unmarked' },
    ],
    noAgents: true,
  },
  { name: 'board.ledger', repo: 'board.ledger.repo', status: 'planned', empty: ['board.ledger.na', 'board.ledger.na.sub'] },
]

const STATUS_LABEL: Record<Status, MessageKey> = { production: 'board.production', preproduction: 'board.preproduction', planned: 'board.planned' }

const CARD_W = 38.5
const CARD_H = 51
const GAP = 3
const LEFT = (STAGE_W - (CARD_W * 4 + GAP * 3)) / 2
const TOP = 27

function reveal(index: number, total: number) {
  return { '--i': index, '--n': total } as React.CSSProperties
}

function CardView({ card, index }: { card: Card; index: number }) {
  const t = useT()
  const x = LEFT + index * (CARD_W + GAP)
  const y = TOP
  const pad = 2
  return (
    <g className={`board-card board-card--${card.status}`} style={reveal(index + 1, CARDS.length + 1)}>
      <rect x={x} y={y} width={CARD_W} height={CARD_H} rx={0.8} className="board-card-frame" />
      <text x={x + pad} y={y + 5} className="board-name" data-i18n={card.name}>{t(card.name)}</text>
      <text x={x + pad} y={y + 8.2} className="board-repo" data-i18n={card.repo}>{t(card.repo)}</text>
      <rect x={x + CARD_W - pad - 13.5} y={y + 2.4} width={13.5} height={3.4} rx={1.7} className="board-chip" />
      <text x={x + CARD_W - pad - 6.75} y={y + 4.75} className="board-chip-text" data-i18n={STATUS_LABEL[card.status]}>{t(STATUS_LABEL[card.status])}</text>
      {card.empty ? (
        <>
          <text x={x + CARD_W / 2} y={y + 28} className="board-empty" data-i18n={card.empty[0]}>{t(card.empty[0])}</text>
          <text x={x + CARD_W / 2} y={y + 31.5} className="board-empty-sub" data-i18n={card.empty[1]}>{t(card.empty[1])}</text>
        </>
      ) : null}
      {card.metrics?.map((metric, row) => {
        const my = y + 13 + row * 7.6
        return (
          <g key={metric.label}>
            <text x={x + pad} y={my} className="board-label" data-i18n={metric.label}>{t(metric.label)}</text>
            {metric.sub ? <text x={x + pad} y={my + 2.6} className="board-sub" data-i18n={metric.sub}>{t(metric.sub)}</text> : null}
            <text x={x + CARD_W - pad} y={my + 1.6} className="board-value" data-i18n={metric.value}>{t(metric.value)}</text>
          </g>
        )
      })}
      {card.metrics ? <line x1={x + pad} x2={x + CARD_W - pad} y1={y + 35} y2={y + 35} className="board-rule" /> : null}
      {card.agents?.map((metric, col) => {
        const ax = x + pad + col * ((CARD_W - pad * 2) / 3)
        return (
          <g key={metric.label}>
            <text x={ax} y={y + 39} className="board-label board-label--small" data-i18n={metric.label}>{t(metric.label)}</text>
            <text x={ax} y={y + 43} className="board-value board-value--small" data-i18n={metric.value}>{t(metric.value)}</text>
            {metric.sub ? <text x={ax} y={y + 46} className="board-sub board-sub--small" data-i18n={metric.sub}>{t(metric.sub)}</text> : null}
          </g>
        )
      })}
      {card.noAgents ? <text x={x + pad} y={y + 39} className="board-sub" data-i18n="board.noAgents">{t('board.noAgents')}</text> : null}
      {card.profile ? (
        <>
          <text x={x + pad} y={y + 42.5} className="board-label board-label--small" data-i18n="board.profile">{t('board.profile')}</text>
          {card.profile.map((name, i) => (
            <text key={name} x={x + pad} y={y + 45.5 + i * 2.6} className="board-profile" data-i18n={name}>{t(name)}</text>
          ))}
        </>
      ) : null}
    </g>
  )
}

function Portfolio() {
  const t = useT()
  return (
    <>
      <text x={STAGE_W - LEFT} y={TOP - 1.6} className="board-tag" data-i18n="board.example">{t('board.example')}</text>
      {CARDS.map((card, i) => <CardView key={card.name} card={card} index={i} />)}
    </>
  )
}

interface Stat { value: MessageKey; label: MessageKey }
const STATS: Stat[] = [
  { value: 'board.agents.runs', label: 'board.agents.runs.label' },
  { value: 'board.agents.success', label: 'board.agents.success.label' },
  { value: 'board.agents.tokens', label: 'board.agents.tokens.label' },
  { value: 'board.agents.time', label: 'board.agents.time.label' },
]
interface Bar { name: MessageKey; sub: MessageKey; runs: number; ok?: number }
const BARS: Bar[] = [
  { name: 'board.agents.implement', sub: 'board.agents.implement.sub', runs: 280 },
  { name: 'board.agents.gate', sub: 'board.agents.gate.sub', runs: 237, ok: 191 },
  { name: 'board.agents.refine', sub: 'board.agents.refine.sub', runs: 125 },
  { name: 'board.agents.triage', sub: 'board.agents.triage.sub', runs: 36, ok: 36 },
]

function Agents() {
  const t = useT()
  const total = STATS.length + BARS.length + 1
  const statX = 8
  const statW = 27
  const barX = 72
  const barMax = 62
  const maxRuns = Math.max(...BARS.map((bar) => bar.runs))
  return (
    <>
      <text x={8} y={TOP - 1.6} className="board-tag board-tag--start" data-i18n="board.agents.period">{t('board.agents.period')}</text>
      {STATS.map((stat, i) => {
        const sx = statX + (i % 2) * (statW + 3)
        const sy = TOP + 2 + Math.floor(i / 2) * 22
        return (
          <g key={stat.value} className="board-card" style={reveal(i + 1, total)}>
            <rect x={sx} y={sy} width={statW} height={19} rx={0.8} className="board-card-frame" />
            <text x={sx + 2} y={sy + 10} className="board-stat" data-i18n={stat.value}>{t(stat.value)}</text>
            <text x={sx + 2} y={sy + 15} className="board-sub" data-i18n={stat.label}>{t(stat.label)}</text>
          </g>
        )
      })}
      {BARS.map((bar, i) => {
        const by = TOP + 3 + i * 11
        const width = (bar.runs / maxRuns) * barMax
        return (
          <g key={bar.name} className="board-card" style={reveal(STATS.length + i + 1, total)}>
            <text x={barX} y={by} className="board-name board-name--bar" data-i18n={bar.name}>{t(bar.name)}</text>
            <rect x={barX} y={by + 1.6} width={width} height={3} className="board-bar" />
            {bar.ok ? <rect x={barX} y={by + 1.6} width={(bar.ok / maxRuns) * barMax} height={3} className="board-bar board-bar--ok" /> : null}
            <text x={barX} y={by + 7.6} className="board-sub" data-i18n={bar.sub}>{t(bar.sub)}</text>
          </g>
        )
      })}
      <g className="board-card" style={reveal(total - 1, total)}>
        <rect x={barX} y={TOP + 46} width={3} height={2} className="board-bar" />
        <text x={barX + 4} y={TOP + 47.6} className="board-sub" data-i18n="board.agents.legend.runs">{t('board.agents.legend.runs')}</text>
        <rect x={barX + 14} y={TOP + 46} width={3} height={2} className="board-bar board-bar--ok" />
        <text x={barX + 18} y={TOP + 47.6} className="board-sub" data-i18n="board.agents.legend.success">{t('board.agents.legend.success')}</text>
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
      {t(k).split('\n').map((line, i) => <tspan key={i} x={x} dy={i ? step : 0}>{line || ' '}</tspan>)}
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

export function Board({ id }: { id: BoardId }) {
  return (
    <svg className="flow board" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {id === 'quote' ? <Quote /> : id === 'portfolio' ? <Portfolio /> : <Agents />}
    </svg>
  )
}
