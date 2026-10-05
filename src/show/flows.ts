/**
 * The worker flows, drawn as step-by-step diagrams over the dimmed world.
 * The facts come from the Agentic Workflows diagrams (docs/knowledge/workflow-routes.md).
 * Positions are grid cells: six columns across the stage, up to four rows.
 */
import type { MessageKey } from '@/i18n'

export type FlowId = 'router' | 'chain' | 'triage' | 'refine' | 'implement' | 'gate' | 'review' | 'audit' | 'release'
/** shell: a deterministic job. agent: the model runs. gate: a decision. end: where the work lands. human: a person. stop: nothing happens. */
export type NodeKind = 'event' | 'shell' | 'agent' | 'gate' | 'end' | 'human' | 'stop'
export interface FlowNode { id: string; kind: NodeKind; col: number; row: number; title: MessageKey; sub?: MessageKey }
export interface FlowEdge { from: string; to: string; kind?: 'main' | 'branch' | 'return'; label?: MessageKey }
export interface FlowDef { nodes: FlowNode[]; edges: FlowEdge[] }

const n = (id: string, kind: NodeKind, col: number, row: number, title: MessageKey, sub?: MessageKey): FlowNode => ({ id, kind, col, row, title, sub })
const e = (from: string, to: string, kind: FlowEdge['kind'] = 'branch', label?: MessageKey): FlowEdge => ({ from, to, kind, label })

export const FLOWS: Record<FlowId, FlowDef> = {
  router: {
    nodes: [
      n('event', 'event', 0, 1, 'flow.router.event', 'flow.router.event.sub'),
      n('classify', 'shell', 1, 1, 'flow.router.classify', 'flow.router.classify.sub'),
      n('authorize', 'shell', 2, 1, 'flow.router.authorize', 'flow.router.authorize.sub'),
      n('route', 'shell', 3, 1, 'flow.router.route', 'flow.router.route.sub'),
      n('idle', 'stop', 1, 3, 'flow.router.idle', 'flow.router.idle.sub'),
      n('deterministic', 'shell', 2, 3, 'flow.router.deterministic', 'flow.router.deterministic.sub'),
      n('triage', 'end', 4, 0, 'flow.router.triage'),
      n('refine', 'end', 4, 1, 'flow.router.refine'),
      n('implement', 'end', 4, 2, 'flow.router.implement'),
      n('gate', 'end', 4, 3, 'flow.router.gate'),
      n('review', 'end', 5, 0, 'flow.router.review'),
      n('audit', 'end', 5, 1, 'flow.router.audit'),
      n('release', 'end', 5, 2, 'flow.router.release'),
    ],
    edges: [
      e('event', 'classify', 'main'), e('classify', 'authorize', 'main'), e('authorize', 'route', 'main', 'flow.edge.trusted'),
      e('classify', 'idle', 'return', 'flow.edge.noPermission'), e('authorize', 'deterministic', 'branch', 'flow.edge.cron'),
      e('route', 'triage', 'branch', 'flow.edge.outside'), e('route', 'refine', 'main'), e('route', 'implement', 'branch'), e('route', 'gate', 'branch'),
      e('route', 'review', 'branch'), e('route', 'audit', 'branch'), e('route', 'release', 'branch'),
    ],
  },
  chain: {
    nodes: [
      n('issue', 'event', 0, 0, 'flow.chain.issue'),
      n('writer', 'event', 0, 1, 'flow.chain.writer', 'flow.chain.writer.sub'),
      n('split', 'shell', 0, 2, 'flow.chain.split', 'flow.chain.split.sub'),
      n('audit', 'agent', 0, 3, 'flow.chain.audit', 'flow.chain.audit.sub'),
      n('triage', 'agent', 1, 0, 'flow.chain.triage', 'flow.chain.triage.sub'),
      n('refine', 'agent', 1, 1, 'flow.chain.refine', 'flow.chain.refine.sub'),
      n('closed', 'stop', 2, 0, 'flow.chain.closed'),
      n('implement', 'agent', 2, 1, 'flow.chain.implement', 'flow.chain.implement.sub'),
      n('someone', 'human', 2, 2, 'flow.chain.someone'),
      n('author', 'human', 2, 3, 'flow.chain.author'),
      n('ci', 'shell', 3, 1, 'flow.chain.ci'),
      n('review', 'agent', 3, 2, 'flow.chain.review'),
      n('gate', 'agent', 4, 1, 'flow.chain.gate'),
      n('fix', 'shell', 4, 2, 'flow.chain.fix', 'flow.chain.fix.sub'),
      n('merged', 'end', 5, 0, 'flow.chain.merged'),
      n('human', 'human', 5, 1, 'flow.chain.human'),
    ],
    edges: [
      e('issue', 'triage', 'branch'), e('writer', 'refine', 'main'), e('triage', 'refine', 'branch', 'flow.edge.pass'), e('triage', 'closed', 'branch', 'flow.edge.block'),
      e('triage', 'author', 'return', 'flow.edge.needsInfo'), e('split', 'refine', 'branch'), e('audit', 'refine', 'branch', 'flow.edge.filesIssue'),
      e('refine', 'implement', 'main', 'flow.edge.five'), e('refine', 'split', 'return', 'flow.edge.eight'), e('refine', 'author', 'return', 'flow.edge.questions'),
      e('implement', 'ci', 'main'), e('someone', 'review', 'branch'), e('review', 'ci', 'branch'), e('ci', 'gate', 'main'),
      e('gate', 'merged', 'main', 'flow.edge.merge'), e('gate', 'human', 'branch', 'flow.edge.risk'), e('gate', 'fix', 'return', 'flow.edge.ciFailed'), e('fix', 'ci', 'return'),
    ],
  },
  triage: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.triage.route'),
      n('outside', 'gate', 1, 1, 'flow.triage.outside'),
      n('idle', 'stop', 1, 3, 'flow.triage.idle', 'flow.triage.idle.sub'),
      n('reserve', 'shell', 2, 1, 'flow.triage.reserve', 'flow.triage.reserve.sub'),
      n('facts', 'shell', 3, 1, 'flow.triage.facts', 'flow.triage.facts.sub'),
      n('agent', 'agent', 4, 1, 'flow.triage.agent', 'flow.triage.agent.sub'),
      n('incomplete', 'stop', 4, 3, 'flow.triage.incomplete', 'flow.triage.incomplete.sub'),
      n('passed', 'end', 5, 0, 'flow.triage.passed', 'flow.triage.passed.sub'),
      n('info', 'human', 5, 1, 'flow.triage.info', 'flow.triage.info.sub'),
      n('maintainer', 'human', 5, 2, 'flow.triage.maintainer', 'flow.triage.maintainer.sub'),
      n('blocked', 'stop', 5, 3, 'flow.triage.blocked', 'flow.triage.blocked.sub'),
    ],
    edges: [
      e('route', 'outside', 'main'), e('outside', 'idle', 'return', 'flow.edge.no'), e('outside', 'reserve', 'main', 'flow.edge.yes'),
      e('reserve', 'facts', 'main'), e('facts', 'agent', 'main'), e('agent', 'incomplete', 'return', 'flow.edge.invalid'),
      e('agent', 'passed', 'main', 'flow.edge.pass'), e('agent', 'info', 'branch', 'flow.edge.needsInfo'), e('agent', 'maintainer', 'branch', 'flow.edge.maintainer'), e('agent', 'blocked', 'branch', 'flow.edge.block'),
    ],
  },
  refine: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.refine.route'),
      n('reserve', 'shell', 1, 1, 'flow.refine.reserve', 'flow.refine.reserve.sub'),
      n('facts', 'shell', 2, 1, 'flow.refine.facts', 'flow.refine.facts.sub'),
      n('explore', 'agent', 3, 1, 'flow.refine.explore', 'flow.refine.explore.sub'),
      n('trivial', 'gate', 4, 1, 'flow.refine.trivial'),
      n('plan', 'agent', 4, 0, 'flow.refine.plan', 'flow.refine.plan.sub'),
      n('story', 'agent', 5, 1, 'flow.refine.story', 'flow.refine.story.sub'),
      n('incomplete', 'stop', 4, 3, 'flow.refine.incomplete', 'flow.refine.incomplete.sub'),
      n('estimate', 'agent', 5, 2, 'flow.refine.estimate', 'flow.refine.estimate.sub'),
      n('split', 'shell', 4, 2, 'flow.refine.split', 'flow.refine.split.sub'),
      n('questions', 'gate', 3, 2, 'flow.refine.questions'),
      n('asked', 'human', 3, 3, 'flow.refine.asked', 'flow.refine.asked.sub'),
      n('refined', 'end', 2, 2, 'flow.refine.refined', 'flow.refine.refined.sub'),
    ],
    edges: [
      e('route', 'reserve', 'main'), e('reserve', 'facts', 'main'), e('facts', 'explore', 'main'), e('explore', 'trivial', 'main'),
      e('trivial', 'plan', 'branch', 'flow.edge.yes'), e('trivial', 'story', 'main', 'flow.edge.no'), e('trivial', 'incomplete', 'return', 'flow.edge.noBasis'),
      e('story', 'estimate', 'main'), e('plan', 'estimate', 'branch'), e('estimate', 'split', 'return', 'flow.edge.eight'), e('split', 'questions', 'main', 'flow.edge.five'),
      e('questions', 'asked', 'branch', 'flow.edge.yes'), e('questions', 'refined', 'main', 'flow.edge.no'),
    ],
  },
  implement: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.implement.route'),
      n('eligible', 'gate', 1, 1, 'flow.implement.eligible', 'flow.implement.eligible.sub'),
      n('idle', 'stop', 1, 3, 'flow.implement.idle', 'flow.implement.idle.sub'),
      n('reserve', 'shell', 2, 1, 'flow.implement.reserve', 'flow.implement.reserve.sub'),
      n('facts', 'shell', 3, 1, 'flow.implement.facts', 'flow.implement.facts.sub'),
      n('marker', 'gate', 4, 1, 'flow.implement.marker'),
      n('direct', 'agent', 5, 0, 'flow.implement.direct', 'flow.implement.direct.sub'),
      n('standard', 'agent', 5, 1, 'flow.implement.standard', 'flow.implement.standard.sub'),
      n('verify', 'shell', 5, 2, 'flow.implement.verify', 'flow.implement.verify.sub'),
      n('pr', 'shell', 4, 2, 'flow.implement.pr', 'flow.implement.pr.sub'),
      n('handed', 'end', 3, 2, 'flow.implement.handed', 'flow.implement.handed.sub'),
      n('died', 'gate', 4, 3, 'flow.implement.died'),
      n('retry', 'shell', 5, 3, 'flow.implement.retry', 'flow.implement.retry.sub'),
      n('parked', 'human', 3, 3, 'flow.implement.parked', 'flow.implement.parked.sub'),
    ],
    edges: [
      e('route', 'eligible', 'main'), e('eligible', 'idle', 'return', 'flow.edge.no'), e('eligible', 'reserve', 'main', 'flow.edge.yes'),
      e('reserve', 'facts', 'main'), e('facts', 'marker', 'main'), e('marker', 'direct', 'branch', 'flow.edge.yes'), e('marker', 'standard', 'main', 'flow.edge.no'),
      e('direct', 'verify', 'branch'), e('standard', 'verify', 'main', 'flow.edge.passes'), e('verify', 'pr', 'main'), e('pr', 'handed', 'main'),
      e('pr', 'died', 'return', 'flow.edge.runDied'), e('died', 'retry', 'branch', 'flow.edge.outage'), e('died', 'parked', 'branch', 'flow.edge.wrong'),
    ],
  },
  gate: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.gate.route', 'flow.gate.route.sub'),
      n('subject', 'gate', 1, 1, 'flow.gate.subject', 'flow.gate.subject.sub'),
      n('idle', 'stop', 1, 3, 'flow.gate.idle', 'flow.gate.idle.sub'),
      n('checkout', 'shell', 2, 1, 'flow.gate.checkout', 'flow.gate.checkout.sub'),
      n('facts', 'shell', 3, 1, 'flow.gate.facts', 'flow.gate.facts.sub'),
      n('ci', 'gate', 4, 1, 'flow.gate.ci'),
      n('repair', 'agent', 4, 0, 'flow.gate.repair', 'flow.gate.repair.sub'),
      n('pushed', 'shell', 3, 0, 'flow.gate.pushed', 'flow.gate.pushed.sub'),
      n('protected', 'shell', 5, 1, 'flow.gate.protected', 'flow.gate.protected.sub'),
      n('agent', 'agent', 5, 2, 'flow.gate.agent', 'flow.gate.agent.sub'),
      n('disposition', 'shell', 4, 2, 'flow.gate.disposition', 'flow.gate.disposition.sub'),
      n('automerge', 'end', 3, 2, 'flow.gate.automerge', 'flow.gate.automerge.sub'),
      n('human', 'human', 2, 2, 'flow.gate.human'),
      n('owner', 'human', 5, 3, 'flow.gate.owner', 'flow.gate.owner.sub'),
      n('blocked', 'stop', 3, 3, 'flow.gate.blocked', 'flow.gate.blocked.sub'),
    ],
    edges: [
      e('route', 'subject', 'main'), e('subject', 'idle', 'return', 'flow.edge.no'), e('subject', 'checkout', 'main', 'flow.edge.yes'),
      e('checkout', 'facts', 'main'), e('facts', 'ci', 'main'), e('ci', 'repair', 'return', 'flow.edge.failure'), e('repair', 'pushed', 'return', 'flow.edge.fixed'),
      e('ci', 'protected', 'main', 'flow.edge.success'), e('protected', 'agent', 'main', 'flow.edge.measured'), e('protected', 'owner', 'branch', 'flow.edge.protected'),
      e('agent', 'disposition', 'main'), e('disposition', 'automerge', 'main', 'flow.edge.autoMerge'), e('disposition', 'human', 'branch', 'flow.edge.fragile'), e('disposition', 'blocked', 'branch', 'flow.edge.ciRed'),
    ],
  },
  review: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.review.route', 'flow.review.route.sub'),
      n('subject', 'gate', 1, 1, 'flow.review.subject', 'flow.review.subject.sub'),
      n('idle', 'stop', 1, 3, 'flow.review.idle'),
      n('facts', 'shell', 2, 1, 'flow.review.facts', 'flow.review.facts.sub'),
      n('actionable', 'gate', 3, 1, 'flow.review.actionable', 'flow.review.actionable.sub'),
      n('satisfied', 'stop', 3, 3, 'flow.review.satisfied', 'flow.review.satisfied.sub'),
      n('apply', 'agent', 4, 1, 'flow.review.apply', 'flow.review.apply.sub'),
      n('verify', 'shell', 5, 1, 'flow.review.verify', 'flow.review.verify.sub'),
      n('implemented', 'end', 5, 2, 'flow.review.implemented', 'flow.review.implemented.sub'),
      n('human', 'human', 4, 3, 'flow.review.human', 'flow.review.human.sub'),
    ],
    edges: [
      e('route', 'subject', 'main'), e('subject', 'idle', 'return', 'flow.edge.no'), e('subject', 'facts', 'main', 'flow.edge.yes'),
      e('facts', 'actionable', 'main'), e('actionable', 'satisfied', 'return', 'flow.edge.allAddressed'), e('actionable', 'apply', 'main', 'flow.edge.yes'),
      e('apply', 'verify', 'main'), e('verify', 'apply', 'return', 'flow.edge.fails'), e('verify', 'implemented', 'main', 'flow.edge.passes'), e('apply', 'human', 'return', 'flow.edge.ambiguous'),
    ],
  },
  audit: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.audit.route', 'flow.audit.route.sub'),
      n('backpressure', 'gate', 1, 1, 'flow.audit.backpressure', 'flow.audit.backpressure.sub'),
      n('idle', 'stop', 1, 3, 'flow.audit.idle', 'flow.audit.idle.sub'),
      n('facts', 'shell', 2, 1, 'flow.audit.facts', 'flow.audit.facts.sub'),
      n('audit', 'agent', 3, 1, 'flow.audit.audit', 'flow.audit.audit.sub'),
      n('filter', 'agent', 4, 1, 'flow.audit.filter', 'flow.audit.filter.sub'),
      n('score', 'agent', 5, 1, 'flow.audit.score', 'flow.audit.score.sub'),
      n('dedupe', 'gate', 5, 2, 'flow.audit.dedupe', 'flow.audit.dedupe.sub'),
      n('file', 'shell', 4, 2, 'flow.audit.file', 'flow.audit.file.sub'),
      n('filed', 'end', 3, 2, 'flow.audit.filed', 'flow.audit.filed.sub'),
      n('nothing', 'stop', 4, 3, 'flow.audit.nothing', 'flow.audit.nothing.sub'),
    ],
    edges: [
      e('route', 'backpressure', 'main'), e('backpressure', 'idle', 'return', 'flow.edge.no'), e('backpressure', 'facts', 'main', 'flow.edge.yes'),
      e('facts', 'audit', 'main'), e('audit', 'filter', 'main'), e('filter', 'score', 'main', 'flow.edge.keepsSome'), e('filter', 'nothing', 'return', 'flow.edge.keepsNone'),
      e('score', 'dedupe', 'main'), e('dedupe', 'file', 'main', 'flow.edge.someNew'), e('dedupe', 'nothing', 'return', 'flow.edge.allDupes'), e('file', 'filed', 'main'),
    ],
  },
  release: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.release.route', 'flow.release.route.sub'),
      n('facts', 'shell', 1, 1, 'flow.release.facts', 'flow.release.facts.sub'),
      n('agent', 'agent', 2, 1, 'flow.release.agent', 'flow.release.agent.sub'),
      n('conclude', 'shell', 3, 1, 'flow.release.conclude', 'flow.release.conclude.sub'),
      n('commit', 'shell', 4, 1, 'flow.release.commit', 'flow.release.commit.sub'),
      n('released', 'end', 5, 1, 'flow.release.released', 'flow.release.released.sub'),
      n('failed', 'stop', 4, 3, 'flow.release.failed', 'flow.release.failed.sub'),
    ],
    edges: [
      e('route', 'facts', 'main'), e('facts', 'agent', 'main'), e('agent', 'conclude', 'main'), e('conclude', 'commit', 'main', 'flow.edge.bumps'),
      e('commit', 'released', 'main'), e('commit', 'failed', 'return', 'flow.edge.fails'),
    ],
  },
}
