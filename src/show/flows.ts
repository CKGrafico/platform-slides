/**
 * The worker flows, drawn as step-by-step diagrams over the dimmed world.
 * The steps come from the Agentic Workflows diagrams (docs/knowledge/workflow-routes.md).
 * Each step's phase comes from the worker's own workflow file in agentic-workflows (loops/workflows/agent-*.md):
 * the jobs and steps that run before the agent, the agent's prompt, and the jobs that run after it.
 * A step with the GitHub mark in its corner is one GitHub Agentic Workflows (gh-aw) provides: its activation job
 * and its safe outputs. The other steps are ours, added in the workflow file. The blue boxes are our prompts, which
 * gh-aw runs inside its own agent job, so they carry no mark.
 * Positions are grid cells: six columns across the stage, up to four rows.
 */
import type { MessageKey } from '@/i18n'

export type FlowId = 'ghaw' | 'engine' | 'router' | 'triage' | 'refine' | 'implement' | 'gate'
/**
 * job: a normal GitHub Actions job or step, before the agent or with no agent at all.
 * agent: the agent does it, inside its run.
 * post: a job after the agent: validation, conclusion, and the writes Safe Outputs allows.
 */
export type NodeKind = 'job' | 'agent' | 'post'
export interface FlowNode { id: string; kind: NodeKind; col: number; row: number; title: MessageKey; sub?: MessageKey; decision?: boolean; gh?: boolean }
export interface FlowEdge { from: string; to: string; kind?: 'main' | 'branch' | 'return'; label?: MessageKey }
/** `legend: false` hides the legend, for a diagram that is not a worker run. */
export interface FlowDef { nodes: FlowNode[]; edges: FlowEdge[]; legend?: boolean }

/** A step. The last argument marks a step that gh-aw provides. */
const n = (id: string, kind: NodeKind, col: number, row: number, title: MessageKey, sub?: MessageKey, gh = false): FlowNode => ({ id, kind, col, row, title, sub, gh })
/** A decision: the same phase colours, drawn as a pill. */
const d = (id: string, kind: NodeKind, col: number, row: number, title: MessageKey, sub?: MessageKey, gh = false): FlowNode => ({ id, kind, col, row, title, sub, decision: true, gh })
const e = (from: string, to: string, kind: FlowEdge['kind'] = 'branch', label?: MessageKey): FlowEdge => ({ from, to, kind, label })

/** Rows of the router's worker column: six workers stacked from the top row to the last. */
const W = [0, 0.72, 1.44, 2.16, 2.88, 3.6]
/** Rows of the refine flow, which has the most steps. */
const R = [0, 0.85, 1.7, 2.55, 3.4]

export const FLOWS: Record<FlowId, FlowDef> = {
  // GitHub Agentic Workflows in one line: what any repo gets from gh-aw, before our own layer.
  ghaw: {
    nodes: [
      n('issue', 'job', 0, 1, 'flow.ghaw.issue', 'flow.ghaw.issue.sub'),
      n('md', 'job', 1, 1, 'flow.ghaw.md', 'flow.ghaw.md.sub', true),
      n('compile', 'job', 2, 1, 'flow.ghaw.compile', 'flow.ghaw.compile.sub', true),
      n('actions', 'job', 3, 1, 'flow.ghaw.actions', 'flow.ghaw.actions.sub'),
      n('agent', 'agent', 4, 1, 'flow.ghaw.agent', 'flow.ghaw.agent.sub'),
      d('safe', 'post', 5, 1, 'flow.ghaw.safe', 'flow.ghaw.safe.sub', true),
      n('pr', 'post', 5, 2.5, 'flow.ghaw.pr', 'flow.ghaw.pr.sub'),
    ],
    edges: [
      e('issue', 'md', 'main'), e('md', 'compile', 'main'), e('compile', 'actions', 'main'), e('actions', 'agent', 'main'),
      e('agent', 'safe', 'main', 'flow.edge.proposes'), e('safe', 'pr', 'main', 'flow.edge.opens'),
    ],
  },
  // The engine, in two rows. Above, gh-aw out of the box: an engine, the provider's key, one model.
  // Below, ours: OpenCode as the engine, Forge as the AI gateway, and a model for each tier.
  engine: {
    legend: false,
    nodes: [
      n('default', 'job', 0, 0.3, 'flow.engine.default'),
      n('dengine', 'agent', 1, 0.3, 'flow.engine.dengine', 'flow.engine.dengine.sub'),
      n('key', 'job', 2, 0.3, 'flow.engine.key', 'flow.engine.key.sub'),
      n('one', 'job', 3, 0.3, 'flow.engine.one'),
      n('ours', 'job', 0, 2.3, 'flow.engine.ours', 'flow.engine.ours.sub'),
      n('opencode', 'agent', 1, 2.3, 'flow.engine.opencode', 'flow.engine.opencode.sub'),
      n('forge', 'post', 2, 2.3, 'flow.engine.forge', 'flow.engine.forge.sub'),
      n('plan', 'job', 3, 1.5, 'flow.engine.plan', 'flow.engine.plan.sub'),
      n('build', 'job', 3, 2.3, 'flow.engine.build', 'flow.engine.build.sub'),
      n('fast', 'job', 3, 3.1, 'flow.engine.fast', 'flow.engine.fast.sub'),
    ],
    edges: [
      e('default', 'dengine', 'branch'), e('dengine', 'key', 'branch'), e('key', 'one', 'branch'),
      e('ours', 'opencode', 'main'), e('opencode', 'forge', 'main'),
      e('forge', 'plan', 'main'), e('forge', 'build', 'main'), e('forge', 'fast', 'main'),
    ],
  },
  // The router is shell only. The workers it dispatches each run an agent.
  router: {
    nodes: [
      n('event', 'job', 0, W[2]!, 'flow.router.event', 'flow.router.event.sub'),
      n('classify', 'job', 1, W[2]!, 'flow.router.classify', 'flow.router.classify.sub'),
      d('authorize', 'job', 2, W[2]!, 'flow.router.authorize', 'flow.router.authorize.sub'),
      d('route', 'job', 3, W[2]!, 'flow.router.route', 'flow.router.route.sub'),
      n('idle', 'job', 1, 3.2, 'flow.router.idle', 'flow.router.idle.sub'),
      n('deterministic', 'job', 2, 3.2, 'flow.router.deterministic', 'flow.router.deterministic.sub'),
      n('triage', 'agent', 3, 3.2, 'flow.router.triage'),
      n('refine', 'agent', 4, W[0]!, 'flow.router.refine'),
      n('implement', 'agent', 4, W[1]!, 'flow.router.implement'),
      n('review', 'agent', 4, W[2]!, 'flow.router.review'),
      n('gate', 'agent', 4, W[3]!, 'flow.router.gate'),
      n('audit', 'agent', 4, W[4]!, 'flow.router.audit'),
      n('release', 'agent', 4, W[5]!, 'flow.router.release'),
    ],
    edges: [
      e('event', 'classify', 'main'), e('classify', 'authorize', 'main'), e('authorize', 'route', 'main', 'flow.edge.trusted'),
      e('classify', 'idle', 'return', 'flow.edge.noPermission'), e('classify', 'deterministic', 'return', 'flow.edge.cron'),
      e('authorize', 'triage', 'branch', 'flow.edge.outside'),
      e('route', 'refine', 'main'), e('route', 'implement', 'branch'), e('route', 'review', 'branch'),
      e('route', 'gate', 'branch'), e('route', 'audit', 'branch'), e('route', 'release', 'branch'),
    ],
  },
  // Our jobs still_open and reserve run beside gh-aw's activation. The agent counts the round itself.
  // The safe output is staged, so it writes nothing. validate_output checks the verdict, then conclude or incomplete apply it.
  triage: {
    nodes: [
      d('outside', 'job', 0, 1, 'flow.triage.outside', 'flow.triage.outside.sub'),
      n('idle', 'job', 0, 0, 'flow.triage.idle', 'flow.triage.idle.sub'),
      d('open', 'job', 1, 1, 'flow.triage.open', 'flow.triage.open.sub'),
      n('activation', 'job', 2, 1, 'flow.common.activation', 'flow.common.activation.sub', true),
      n('agent', 'agent', 3, 1, 'flow.triage.agent', 'flow.triage.agent.sub'),
      n('safe', 'post', 4, 0, 'flow.triage.safe', 'flow.triage.safe.sub', true),
      d('valid', 'post', 4, 1, 'flow.triage.valid', 'flow.triage.valid.sub'),
      n('incomplete', 'post', 4, 2.5, 'flow.triage.incomplete', 'flow.triage.incomplete.sub'),
      n('passed', 'post', 5, 0, 'flow.triage.passed', 'flow.triage.passed.sub'),
      n('info', 'post', 5, 1, 'flow.triage.info', 'flow.triage.info.sub'),
      n('maintainer', 'post', 5, 2, 'flow.triage.maintainer', 'flow.triage.maintainer.sub'),
      n('blocked', 'post', 5, 3, 'flow.triage.blocked', 'flow.triage.blocked.sub'),
    ],
    edges: [
      e('outside', 'idle', 'return', 'flow.edge.noWrite'), e('outside', 'open', 'main', 'flow.edge.yes'),
      e('open', 'activation', 'main'), e('activation', 'agent', 'main'), e('agent', 'safe', 'main', 'flow.edge.proposes'),
      e('safe', 'valid', 'main'), e('valid', 'incomplete', 'return', 'flow.edge.no'),
      e('valid', 'passed', 'main', 'flow.edge.pass'), e('valid', 'info', 'branch', 'flow.edge.needsInfo'),
      e('valid', 'maintainer', 'branch', 'flow.edge.maintainer'), e('valid', 'blocked', 'branch', 'flow.edge.block'),
    ],
  },
  // Our size guard runs first. The agent explores, writes the story, estimates and decides a split or questions.
  // conclude turns the outcome into labels, the batched comment, and the child Issues.
  refine: {
    nodes: [
      d('guard', 'job', 0, R[0]!, 'flow.refine.guard', 'flow.refine.guard.sub'),
      n('toobig', 'post', 0, R[1]!, 'flow.refine.toobig', 'flow.refine.toobig.sub'),
      n('activation', 'job', 1, R[0]!, 'flow.common.activation', 'flow.common.activation.sub', true),
      n('explore', 'agent', 2, R[0]!, 'flow.refine.explore', 'flow.refine.explore.sub'),
      d('trivial', 'agent', 3, R[0]!, 'flow.refine.trivial'),
      n('plan', 'agent', 4, R[0]!, 'flow.refine.plan', 'flow.refine.plan.sub'),
      n('story', 'agent', 3, R[1]!, 'flow.refine.story', 'flow.refine.story.sub'),
      n('wrap', 'agent', 4, R[1]!, 'flow.refine.wrap', 'flow.refine.wrap.sub'),
      n('prose', 'agent', 5, R[1]!, 'flow.refine.prose', 'flow.refine.prose.sub'),
      n('incomplete', 'post', 3, R[2]!, 'flow.refine.incomplete', 'flow.refine.incomplete.sub'),
      d('estimate', 'agent', 5, R[2]!, 'flow.refine.estimate', 'flow.refine.estimate.sub'),
      n('refined', 'post', 3, R[3]!, 'flow.refine.refined', 'flow.refine.refined.sub'),
      d('questions', 'agent', 4, R[3]!, 'flow.refine.questions'),
      d('eight', 'agent', 5, R[3]!, 'flow.refine.eight'),
      n('asked', 'post', 4, R[4]!, 'flow.refine.asked', 'flow.refine.asked.sub'),
      n('split', 'post', 5, R[4]!, 'flow.refine.split', 'flow.refine.split.sub'),
    ],
    edges: [
      e('guard', 'activation', 'main'), e('guard', 'toobig', 'branch', 'flow.edge.tooBig'),
      e('activation', 'explore', 'main'), e('explore', 'trivial', 'main'),
      e('trivial', 'plan', 'branch', 'flow.edge.yes'), e('trivial', 'story', 'main', 'flow.edge.no'),
      e('story', 'wrap', 'main'), e('wrap', 'prose', 'main'), e('prose', 'estimate', 'main'), e('plan', 'estimate', 'return'),
      e('story', 'incomplete', 'return', 'flow.edge.noBasis'),
      e('estimate', 'eight', 'main'), e('eight', 'split', 'branch', 'flow.edge.yesSplits'), e('eight', 'questions', 'main'),
      e('questions', 'asked', 'branch', 'flow.edge.yes'), e('questions', 'refined', 'main', 'flow.edge.no'),
    ],
  },
  // Our eligibility check, gh-aw's activation, and our step that cuts the feature branch. The agent checks the trivial
  // marker, builds, and verifies. Create PR is gh-aw's safe output, and it is not staged here. conclude hands off,
  // or incomplete retries or parks.
  implement: {
    nodes: [
      n('route', 'job', 0, 1, 'flow.implement.route'),
      d('eligible', 'job', 1, 1, 'flow.implement.eligible', 'flow.implement.eligible.sub'),
      n('idle', 'job', 1, 0, 'flow.implement.idle', 'flow.implement.idle.sub'),
      n('activation', 'job', 2, 1, 'flow.common.activation', 'flow.common.activation.sub', true),
      n('branch', 'job', 3, 1, 'flow.implement.branch', 'flow.implement.branch.sub'),
      d('marker', 'agent', 4, 1, 'flow.implement.marker'),
      n('direct', 'agent', 4, 0, 'flow.implement.direct', 'flow.implement.direct.sub'),
      n('standard', 'agent', 5, 1, 'flow.implement.standard', 'flow.implement.standard.sub'),
      d('verify', 'agent', 5, 2, 'flow.implement.verify', 'flow.implement.verify.sub'),
      n('pr', 'post', 4, 2, 'flow.implement.pr', 'flow.implement.pr.sub', true),
      n('handed', 'post', 3, 2, 'flow.implement.handed', 'flow.implement.handed.sub'),
      d('died', 'post', 4, 3, 'flow.implement.died'),
      n('retry', 'post', 5, 3, 'flow.implement.retry', 'flow.implement.retry.sub'),
      n('parked', 'post', 3, 3, 'flow.implement.parked', 'flow.implement.parked.sub'),
    ],
    edges: [
      e('route', 'eligible', 'main'), e('eligible', 'idle', 'return', 'flow.edge.no'), e('eligible', 'activation', 'main', 'flow.edge.yes'),
      e('activation', 'branch', 'main'), e('branch', 'marker', 'main'), e('marker', 'direct', 'branch', 'flow.edge.yes'), e('marker', 'standard', 'main', 'flow.edge.no'),
      e('standard', 'verify', 'main'), e('direct', 'verify', 'branch'), e('verify', 'standard', 'return', 'flow.edge.fails'),
      e('verify', 'pr', 'main', 'flow.edge.passes'), e('pr', 'handed', 'main'),
      e('pr', 'died', 'return', 'flow.edge.runDied'), e('died', 'retry', 'branch', 'flow.edge.outage'), e('died', 'parked', 'branch', 'flow.edge.wrong'),
    ],
  },
  // Our jobs subject and protected_changes run around gh-aw's activation. The router passes the CI conclusion in.
  // The agent repairs a red CI or hunts defects. validate_output computes the disposition and conclude applies it.
  gate: {
    nodes: [
      n('route', 'job', 0, 1, 'flow.gate.route', 'flow.gate.route.sub'),
      d('subject', 'job', 1, 1, 'flow.gate.subject', 'flow.gate.subject.sub'),
      n('idle', 'job', 1, 0, 'flow.gate.idle', 'flow.gate.idle.sub'),
      n('checkout', 'job', 2, 1, 'flow.gate.checkout', 'flow.gate.checkout.sub'),
      n('activation', 'job', 3, 1, 'flow.common.activation', 'flow.common.activation.sub', true),
      d('ci', 'job', 4, 1, 'flow.gate.ci'),
      n('repair', 'agent', 4, 0, 'flow.gate.repair', 'flow.gate.repair.sub'),
      n('pushed', 'post', 3, 0, 'flow.gate.pushed', 'flow.gate.pushed.sub'),
      d('protected', 'job', 5, 1, 'flow.gate.protected', 'flow.gate.protected.sub'),
      n('owner', 'job', 5, 0, 'flow.gate.owner', 'flow.gate.owner.sub'),
      n('agent', 'agent', 5, 2, 'flow.gate.agent', 'flow.gate.agent.sub'),
      d('disposition', 'post', 4, 2, 'flow.gate.disposition', 'flow.gate.disposition.sub'),
      n('automerge', 'post', 3, 2, 'flow.gate.automerge', 'flow.gate.automerge.sub'),
      n('human', 'post', 4, 3, 'flow.gate.human'),
      n('blocked', 'post', 5, 3, 'flow.gate.blocked', 'flow.gate.blocked.sub'),
    ],
    edges: [
      e('route', 'subject', 'main'), e('subject', 'idle', 'return', 'flow.edge.no'), e('subject', 'checkout', 'main', 'flow.edge.yes'),
      e('checkout', 'activation', 'main'), e('activation', 'ci', 'main'), e('ci', 'repair', 'return', 'flow.edge.failure'), e('repair', 'pushed', 'return', 'flow.edge.fixed'),
      e('ci', 'protected', 'main', 'flow.edge.success'), e('protected', 'owner', 'branch', 'flow.edge.protected'), e('protected', 'agent', 'main', 'flow.edge.measured'),
      e('agent', 'disposition', 'main'), e('disposition', 'automerge', 'main', 'flow.edge.autoMerge'),
      e('disposition', 'human', 'branch', 'flow.edge.fragile'), e('disposition', 'blocked', 'branch', 'flow.edge.ciRed'),
    ],
  },
}

/** The three kinds of step, in the order the legend lists them. */
export const LEGEND: { kind: NodeKind; label: MessageKey }[] = [
  { kind: 'job', label: 'flow.legend.job' },
  { kind: 'agent', label: 'flow.legend.agent' },
  { kind: 'post', label: 'flow.legend.post' },
]
/** The fourth legend entry: the GitHub mark in a box's corner. */
export const LEGEND_GH: MessageKey = 'flow.legend.gh'
