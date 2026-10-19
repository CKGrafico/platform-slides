/**
 * The worker flows, drawn as step-by-step diagrams over the dimmed world.
 * The facts come from the Agentic Workflows diagrams (docs/knowledge/workflow-routes.md).
 * Positions are grid cells: six columns across the stage, up to four rows.
 */
import type { MessageKey } from '@/i18n'

export type FlowId = 'ghaw' | 'router' | 'triage' | 'refine' | 'implement' | 'gate'
/** shell: a deterministic job. agent: the model runs. gate: a decision. end: where the work lands. human: a person. stop: nothing happens. */
export type NodeKind = 'event' | 'shell' | 'agent' | 'gate' | 'end' | 'human' | 'stop'
export interface FlowNode { id: string; kind: NodeKind; col: number; row: number; title: MessageKey; sub?: MessageKey }
export interface FlowEdge { from: string; to: string; kind?: 'main' | 'branch' | 'return'; label?: MessageKey }
export interface FlowDef { nodes: FlowNode[]; edges: FlowEdge[] }

const n = (id: string, kind: NodeKind, col: number, row: number, title: MessageKey, sub?: MessageKey): FlowNode => ({ id, kind, col, row, title, sub })
const e = (from: string, to: string, kind: FlowEdge['kind'] = 'branch', label?: MessageKey): FlowEdge => ({ from, to, kind, label })

/** Rows of the router's worker column: six workers stacked from the top row to the last. */
const W = [0, 0.72, 1.44, 2.16, 2.88, 3.6]
/** Rows of the refine flow, which has the most steps. */
const R = [0, 0.85, 1.7, 2.55, 3.4]

export const FLOWS: Record<FlowId, FlowDef> = {
  // GitHub Agentic Workflows in one line: what any repo gets from gh-aw, before our own layer.
  ghaw: {
    nodes: [
      n('issue', 'event', 0, 1, 'flow.ghaw.issue', 'flow.ghaw.issue.sub'),
      n('md', 'shell', 1, 1, 'flow.ghaw.md', 'flow.ghaw.md.sub'),
      n('compile', 'shell', 2, 1, 'flow.ghaw.compile', 'flow.ghaw.compile.sub'),
      n('actions', 'shell', 3, 1, 'flow.ghaw.actions', 'flow.ghaw.actions.sub'),
      n('agent', 'agent', 4, 1, 'flow.ghaw.agent', 'flow.ghaw.agent.sub'),
      n('safe', 'gate', 5, 1, 'flow.ghaw.safe', 'flow.ghaw.safe.sub'),
      n('pr', 'end', 5, 2.5, 'flow.ghaw.pr', 'flow.ghaw.pr.sub'),
    ],
    edges: [
      e('issue', 'md', 'main'), e('md', 'compile', 'main'), e('compile', 'actions', 'main'), e('actions', 'agent', 'main'),
      e('agent', 'safe', 'main', 'flow.edge.proposes'), e('safe', 'pr', 'main', 'flow.edge.opens'),
    ],
  },
  router: {
    nodes: [
      n('event', 'event', 0, W[2]!, 'flow.router.event', 'flow.router.event.sub'),
      n('classify', 'shell', 1, W[2]!, 'flow.router.classify', 'flow.router.classify.sub'),
      n('authorize', 'gate', 2, W[2]!, 'flow.router.authorize', 'flow.router.authorize.sub'),
      n('route', 'gate', 3, W[2]!, 'flow.router.route', 'flow.router.route.sub'),
      n('idle', 'stop', 1, 3.2, 'flow.router.idle', 'flow.router.idle.sub'),
      n('deterministic', 'shell', 2, 3.2, 'flow.router.deterministic', 'flow.router.deterministic.sub'),
      n('triage', 'end', 3, 3.2, 'flow.router.triage'),
      n('refine', 'end', 4, W[0]!, 'flow.router.refine'),
      n('implement', 'end', 4, W[1]!, 'flow.router.implement'),
      n('review', 'end', 4, W[2]!, 'flow.router.review'),
      n('gate', 'end', 4, W[3]!, 'flow.router.gate'),
      n('audit', 'end', 4, W[4]!, 'flow.router.audit'),
      n('release', 'end', 4, W[5]!, 'flow.router.release'),
    ],
    edges: [
      e('event', 'classify', 'main'), e('classify', 'authorize', 'main'), e('authorize', 'route', 'main', 'flow.edge.trusted'),
      e('classify', 'idle', 'return', 'flow.edge.noPermission'), e('classify', 'deterministic', 'return', 'flow.edge.cron'),
      e('authorize', 'triage', 'branch', 'flow.edge.outside'),
      e('route', 'refine', 'main'), e('route', 'implement', 'branch'), e('route', 'review', 'branch'),
      e('route', 'gate', 'branch'), e('route', 'audit', 'branch'), e('route', 'release', 'branch'),
    ],
  },
  triage: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.triage.route'),
      n('outside', 'gate', 1, 1, 'flow.triage.outside'),
      n('idle', 'stop', 1, 0, 'flow.triage.idle', 'flow.triage.idle.sub'),
      n('reserve', 'shell', 2, 0, 'flow.triage.reserve', 'flow.triage.reserve.sub'),
      n('facts', 'shell', 2, 1, 'flow.triage.facts', 'flow.triage.facts.sub'),
      n('round', 'shell', 2, 2, 'flow.triage.round'),
      n('agent', 'agent', 3, 1, 'flow.triage.agent', 'flow.triage.agent.sub'),
      n('valid', 'gate', 4, 1, 'flow.triage.valid'),
      n('incomplete', 'stop', 4, 2.5, 'flow.triage.incomplete', 'flow.triage.incomplete.sub'),
      n('passed', 'end', 5, 0, 'flow.triage.passed', 'flow.triage.passed.sub'),
      n('info', 'human', 5, 1, 'flow.triage.info', 'flow.triage.info.sub'),
      n('maintainer', 'human', 5, 2, 'flow.triage.maintainer', 'flow.triage.maintainer.sub'),
      n('blocked', 'stop', 5, 3, 'flow.triage.blocked', 'flow.triage.blocked.sub'),
    ],
    edges: [
      e('route', 'outside', 'main'), e('outside', 'idle', 'return', 'flow.edge.noWrite'), e('outside', 'reserve', 'main', 'flow.edge.yes'),
      e('reserve', 'facts', 'main'), e('facts', 'round', 'main'), e('round', 'agent', 'main'), e('agent', 'valid', 'main'),
      e('valid', 'incomplete', 'return', 'flow.edge.no'),
      e('valid', 'passed', 'main', 'flow.edge.pass'), e('valid', 'info', 'branch', 'flow.edge.needsInfo'),
      e('valid', 'maintainer', 'branch', 'flow.edge.maintainer'), e('valid', 'blocked', 'branch', 'flow.edge.block'),
    ],
  },
  refine: {
    nodes: [
      n('reserve', 'shell', 0, R[0]!, 'flow.refine.reserve', 'flow.refine.reserve.sub'),
      n('facts', 'shell', 1, R[0]!, 'flow.refine.facts', 'flow.refine.facts.sub'),
      n('explore', 'agent', 2, R[0]!, 'flow.refine.explore', 'flow.refine.explore.sub'),
      n('trivial', 'gate', 3, R[0]!, 'flow.refine.trivial'),
      n('plan', 'agent', 4, R[0]!, 'flow.refine.plan', 'flow.refine.plan.sub'),
      n('story', 'agent', 3, R[1]!, 'flow.refine.story', 'flow.refine.story.sub'),
      n('wrap', 'agent', 4, R[1]!, 'flow.refine.wrap', 'flow.refine.wrap.sub'),
      n('prose', 'agent', 5, R[1]!, 'flow.refine.prose', 'flow.refine.prose.sub'),
      n('incomplete', 'stop', 3, R[2]!, 'flow.refine.incomplete', 'flow.refine.incomplete.sub'),
      n('estimate', 'gate', 5, R[2]!, 'flow.refine.estimate', 'flow.refine.estimate.sub'),
      n('refined', 'end', 3, R[3]!, 'flow.refine.refined', 'flow.refine.refined.sub'),
      n('questions', 'gate', 4, R[3]!, 'flow.refine.questions'),
      n('eight', 'gate', 5, R[3]!, 'flow.refine.eight'),
      n('asked', 'human', 4, R[4]!, 'flow.refine.asked', 'flow.refine.asked.sub'),
      n('split', 'shell', 5, R[4]!, 'flow.refine.split', 'flow.refine.split.sub'),
    ],
    edges: [
      e('reserve', 'facts', 'main'), e('facts', 'explore', 'main'), e('explore', 'trivial', 'main'),
      e('trivial', 'plan', 'branch', 'flow.edge.yes'), e('trivial', 'story', 'main', 'flow.edge.no'),
      e('story', 'wrap', 'main'), e('wrap', 'prose', 'main'), e('prose', 'estimate', 'main'), e('plan', 'estimate', 'return'),
      e('story', 'incomplete', 'return', 'flow.edge.noBasis'),
      e('estimate', 'eight', 'main'), e('eight', 'split', 'branch', 'flow.edge.yesSplits'), e('eight', 'questions', 'main'),
      e('questions', 'asked', 'branch', 'flow.edge.yes'), e('questions', 'refined', 'main', 'flow.edge.no'),
    ],
  },
  implement: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.implement.route'),
      n('eligible', 'gate', 1, 1, 'flow.implement.eligible', 'flow.implement.eligible.sub'),
      n('idle', 'stop', 1, 0, 'flow.implement.idle', 'flow.implement.idle.sub'),
      n('reserve', 'shell', 2, 1, 'flow.implement.reserve', 'flow.implement.reserve.sub'),
      n('facts', 'shell', 3, 1, 'flow.implement.facts', 'flow.implement.facts.sub'),
      n('marker', 'gate', 4, 1, 'flow.implement.marker'),
      n('direct', 'agent', 4, 0, 'flow.implement.direct', 'flow.implement.direct.sub'),
      n('standard', 'agent', 5, 1, 'flow.implement.standard', 'flow.implement.standard.sub'),
      n('verify', 'gate', 5, 2, 'flow.implement.verify', 'flow.implement.verify.sub'),
      n('pr', 'shell', 4, 2, 'flow.implement.pr', 'flow.implement.pr.sub'),
      n('handed', 'end', 3, 2, 'flow.implement.handed', 'flow.implement.handed.sub'),
      n('died', 'gate', 4, 3, 'flow.implement.died'),
      n('retry', 'shell', 5, 3, 'flow.implement.retry', 'flow.implement.retry.sub'),
      n('parked', 'human', 3, 3, 'flow.implement.parked', 'flow.implement.parked.sub'),
    ],
    edges: [
      e('route', 'eligible', 'main'), e('eligible', 'idle', 'return', 'flow.edge.no'), e('eligible', 'reserve', 'main', 'flow.edge.yes'),
      e('reserve', 'facts', 'main'), e('facts', 'marker', 'main'), e('marker', 'direct', 'branch', 'flow.edge.yes'), e('marker', 'standard', 'main', 'flow.edge.no'),
      e('standard', 'verify', 'main'), e('direct', 'verify', 'branch'), e('verify', 'standard', 'return', 'flow.edge.fails'),
      e('verify', 'pr', 'main', 'flow.edge.passes'), e('pr', 'handed', 'main'),
      e('pr', 'died', 'return', 'flow.edge.runDied'), e('died', 'retry', 'branch', 'flow.edge.outage'), e('died', 'parked', 'branch', 'flow.edge.wrong'),
    ],
  },
  gate: {
    nodes: [
      n('route', 'event', 0, 1, 'flow.gate.route', 'flow.gate.route.sub'),
      n('subject', 'gate', 1, 1, 'flow.gate.subject', 'flow.gate.subject.sub'),
      n('idle', 'stop', 1, 0, 'flow.gate.idle', 'flow.gate.idle.sub'),
      n('checkout', 'shell', 2, 1, 'flow.gate.checkout', 'flow.gate.checkout.sub'),
      n('facts', 'shell', 3, 1, 'flow.gate.facts', 'flow.gate.facts.sub'),
      n('ci', 'gate', 4, 1, 'flow.gate.ci'),
      n('repair', 'agent', 4, 0, 'flow.gate.repair', 'flow.gate.repair.sub'),
      n('pushed', 'shell', 3, 0, 'flow.gate.pushed', 'flow.gate.pushed.sub'),
      n('protected', 'gate', 5, 1, 'flow.gate.protected', 'flow.gate.protected.sub'),
      n('owner', 'human', 5, 0, 'flow.gate.owner', 'flow.gate.owner.sub'),
      n('agent', 'agent', 5, 2, 'flow.gate.agent', 'flow.gate.agent.sub'),
      n('disposition', 'gate', 4, 2, 'flow.gate.disposition', 'flow.gate.disposition.sub'),
      n('automerge', 'end', 3, 2, 'flow.gate.automerge', 'flow.gate.automerge.sub'),
      n('human', 'human', 4, 3, 'flow.gate.human'),
      n('blocked', 'stop', 5, 3, 'flow.gate.blocked', 'flow.gate.blocked.sub'),
    ],
    edges: [
      e('route', 'subject', 'main'), e('subject', 'idle', 'return', 'flow.edge.no'), e('subject', 'checkout', 'main', 'flow.edge.yes'),
      e('checkout', 'facts', 'main'), e('facts', 'ci', 'main'), e('ci', 'repair', 'return', 'flow.edge.failure'), e('repair', 'pushed', 'return', 'flow.edge.fixed'),
      e('ci', 'protected', 'main', 'flow.edge.success'), e('protected', 'owner', 'branch', 'flow.edge.protected'), e('protected', 'agent', 'main', 'flow.edge.measured'),
      e('agent', 'disposition', 'main'), e('disposition', 'automerge', 'main', 'flow.edge.autoMerge'),
      e('disposition', 'human', 'branch', 'flow.edge.fragile'), e('disposition', 'blocked', 'branch', 'flow.edge.ciRed'),
    ],
  },
}
