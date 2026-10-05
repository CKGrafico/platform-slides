# Talk script

Draft 6, 2026-10-05. 31 stops, including the cover. The presenter approved ten story blocks. The order runs from local AI use through maturity, capability growth, and Platform to autonomous product changes. The cover and PC share one chapter.

The same Issue moves through the talk. Each new layer answers a practical need and stays in the field. Foundations supplies enforceable conventions. The Harness supplies the agent environment. Workflows give events bounded runs. Health supplies evidence and returns findings to the same route.

Early work establishes the technical and agent base. As it settles, more effort goes into product definition. In Maintenance, people close to the product can file small eligible Issues and bugs. The route can ship them without human supervision. The final world connects this outcome to the controls built throughout the talk.

Maturity describes team practices. The five levels are independent of tool choice. The final world shows the capabilities that support those practices. It does not claim a Platform assessment score.

Sources: [Platform facts](../knowledge/platform.md), [published method](../knowledge/website-reading.md), [current worker routes](../knowledge/workflow-routes.md), and [the supplied assessment](../knowledge/maturity.md). The assessment marketing figures remain off stage because their primary sources are absent.

The old script is in [the source archive](script-orbits-archive.md). Its visual directions are superseded. Each beat below defines the content before its scene is built.

## Cover and work on your PC

Source: [reference](../knowledge/talk-notes.md).

### 1. From your PC to Platform

On screen: a close view of the reasoning core. The blue Issue is one of its units. The cover introduces the speaker.

Say: This talk follows work from an engineer's PC into the Plain Concepts Platform.

### 2. You work with AI on your PC.

On screen: local, state 0. Panels name OpenCode · agent.

Slide: You supply context, review the change and give the next instruction.

Speaker notes: Start with the audience experience. The engineer asks for a change, supplies files, inspects the patch, and redirects the agent. The feedback loop depends on the person being present.

## AI adoption and team maturity

Source: [reference](../knowledge/maturity.md).

### 3. Adoption and maturity are different.

On screen: assessment, state 0. Panels name 1 · No AI, 2 · Exploratory, 3 · Structured, 4 · Scaled, 5 · Governed & Optimized.

Slide: A new agent does not change team practices. Maturity depends on standards, control and outcomes.

Speaker notes: Use the five assessment levels, with their exact names. No AI is manual work. Exploratory is individual use. Structured adds approved tools and review guidance. Scaled makes practice consistent across teams. Governed & Optimized puts governance and improvement into the workflow. Do not equate a tool upgrade with organizational maturity.

### 4. We assess four areas.

On screen: assessment, state 1. Panels name SDLC · 35%, Determinism · 25%, Control · 20%, Impact · 20%.

Slide: SDLC 35% · determinism 25% · control 20% · impact 20%. We assess team practices.

Speaker notes: The framework rates 21 dimensions from one to five. The four areas cover lifecycle reach, reusable and validated workflows, risk controls, and measured impact. A team can use agents heavily and still lack control or evidence. We have not computed a Platform assessment score.

## Prompts to asynchronous work

Source: [reference](../knowledge/talk-notes.md).

### 5. Prompts → skills → agents.

On screen: evolution, state 0. Panels name pc-* skills, node.core.

Slide: A prompt states the task. A skill keeps the procedure. An agent uses tools to carry it out.

Speaker notes: This is a capability path, not a maturity score. Instructions become reusable. The agent can inspect code, edit files, and run checks. The original work item remains part of the same body.

### 6. Plugins → guardrails → Harness.

On screen: evolution, state 1. Panels name plugins, agent-harness.

Slide: Plugins enforce tool limits. The Harness supplies context, commands and the rules of the repo.

Speaker notes: An agent needs both instructions and enforcement. Plugins reject forbidden tool calls. Guardrails constrain the code. The Harness gathers the working environment so each session can find it.

### 7. The next step is asynchronous.

On screen: evolution, state 2. Panels name Router · shell, agent-harness.

Slide: A repository event starts the work. The process continues after you leave the PC.

Speaker notes: Move the same work item into an event-driven environment. Work can continue without an engineer watching the terminal. This needs a route, repeatable context, bounded permissions, and a visible outcome.

## How we built Platform

Source: [reference](../knowledge/website-reading.md).

### 8. Four repositories carry the method.

On screen: platform, state 0. Panels name Foundations, agent-harness, agentic-workflows, project-health.

Slide: Foundations → agent-harness → agentic-workflows → project-health

Speaker notes: Platform is a Plain Concepts department that builds and maintains applications. Foundations defines conventions. agent-harness installs the agent environment. agentic-workflows runs workers on events. project-health measures delivery and agent work. Each repository supplies an input the next one needs.

### 9. Discovery → Foundations → Maintenance

On screen: platform, state 1. Panels name Foundations, Router · shell.

Slide: Early work builds the technical and agent base. With that in place, more effort goes into defining the product.

Speaker notes: Discovery defines product outcomes and constraints. Foundations turns those decisions into working software and enforced guardrails. Early agent work needs substantial effort on technology, tools, context, and the agent environment. As that base settles, more effort goes into defining product behavior and acceptance criteria. Discovery continues alongside delivery. Maintenance opens small eligible changes to people close to the product who do not need engineering skills. They describe the outcome, supply bug reproduction steps, and answer product questions. The existing route can then implement, check, merge, and ship without human supervision. Technical means and protected changes remain engineering decisions. The phases overlap by capability.

## Foundations: conventions enforced in code

Source: [reference](../knowledge/website-reading.md).

### 10. A shared technical baseline.

On screen: baseline, state 0. Panels name Foundations.

Slide: Frontend: Next.js, TypeScript, tokens. Backend: .NET, layers and slices.

Speaker notes: Give engineers and agents a defined stack. The frontend uses shared tokens, strict TypeScript, and feature boundaries. The backend uses .NET, one-way layer dependencies, and vertical slices. Foundations is a thin shared base. Application-specific behavior stays in the application.

### 11. A guardrail fails the build.

On screen: baseline, state 1. Panels name map.walls.

Slide: The linter blocks cross-layer dependencies. Widening the rule also needs a gate.

Speaker notes: A convention becomes a guardrail when code enforces it. A layer violation fails the build. An agent must not make the test green by allowing the forbidden dependency. Changes to the boundary rule need their own control.

### 12. Specs and tests pin observable behavior.

On screen: baseline, state 2. Panels name OpenSpec, map.walls.

Slide: Code changes need a spec update. A test must assert an observable result.

Speaker notes: CI links behavior changes to a specification, proposal, or decision record. Trivial refactors have an explicit opt-out. Test quality requires assertions about behavior, not code execution alone. Where the domain needs an audit trail, every state change must use the append path.

### 13. Auth, data and CI need an owner.

On screen: baseline, state 3. Panels name Merge Gate, show.review.label.

Slide: Authentication, migrations and integrations stop for review. Green tests do not suffice.

Speaker notes: Protected paths have owner checkpoints. Authentication, authorization, migrations, integrations, CI, and design tokens are examples. Passing tests does not override ownership. The guardrails decide the scope that can proceed unattended.

## What agent-harness installs

Source: [reference](../knowledge/platform.md).

### 14. agent-harness sets up the environment.

On screen: environment, state 0. Panels name agent-harness, ARCHITECTURE + DESIGN.

Slide: pc-* skills, commands, agents, plugins and OpenSpec in the repo.

Speaker notes: The installer copies commands, skills, agents, plugins, and OpenSpec into the repository. The bootstrap reads the codebase and generates ARCHITECTURE.md and DESIGN.md for an existing project. A new project starts with placeholders. Saved configuration records the backlog, repository, and model tiers. Update preserves hand edits.

### 15. Proposal → specs → tasks → PR.

On screen: environment, state 1. Panels name OpenSpec, pc-* skills.

Slide: /plan-propose → /plan-apply → verification → /ops-ship

Speaker notes: OpenSpec separates intent, design, specifications, and tasks. Commands call pc-* procedures. Build and specialist engineers execute tasks, with bounded subagent waves for larger plans. Verification runs lint, types, tests, and build. The shipping command creates the pull request. Planning and execution model tiers are configurable.

### 16. Plugins block unsafe tool calls.

On screen: environment, state 2. Panels name plugins, agent-harness.

Slide: Plugins reject forbidden actions before the tool runs. AGENTS.md carries the repo instructions.

Speaker notes: The tool-call plugin denies unsafe Git actions and enforces supported repository access. This is executable control around the agent. The Harness also supplies codegraph for code intelligence, agentmemory for retained context, and browser tooling for verification. Skills explain a procedure. Plugins can prevent a tool action.

### 17. The same Harness on PC and CI.

On screen: environment, state 3. Panels name agent-harness, map.forge.

Slide: OpenCode reads the repo context on both. Forge centralizes access to the model.

Speaker notes: The local agent and unattended worker use the repository environment. OpenCode is the runtime, and Forge is the model gateway. This keeps repository rules separate from model choice. The published default uses GitHub-hosted ubuntu-latest. Self-hosted runners remain an option, with their own operating costs.

## Agentic Workflows: jobs, reasoning, validated writes

Source: [reference](../knowledge/workflow-routes.md).

### 18. From Markdown to GitHub Actions.

On screen: workflow, state 0. Panels name agentic-workflows, agent-harness.

Slide: The prompt lives in .md. gh aw compile writes .lock.yml. Actions runs the result.

Speaker notes: GitHub Agentic Workflows supplies the compiler and execution infrastructure. Platform supplies the router, worker catalog, installer, shared defaults, and repository Harness. Frontmatter sets the runner, engine, model, permissions, and allowed outputs. The Markdown body contains the agent task. Compiling adds framework jobs; Actions runs the lock file.

### 19. One router for every event.

On screen: workflow, state 1. Panels name Router · shell, Refine.

Slide: Shell classifies and authorizes the event. It calls at most one worker, or none.

Speaker notes: The router owns all triggers. A pure shell classifier reads the event and selects one route without a model call. Workers accept workflow_call inputs and declare no public triggers. Router concurrency prevents competing workers on an Issue. Labels describe state for people; they are not the lock. Bot comments must not retrigger their own worker.

### 20. Jobs → agent → jobs.

On screen: workflow, state 2. Panels name facts · jobs, OpenCode · agent, validate · jobs, safe-outputs.

Slide: Jobs prepare facts and validate allowed outputs. The agent can take a different path on each run.

Speaker notes: Read the whole chain from left to right. Normal jobs authorize, select, and collect facts. The agent receives those facts and performs the work that needs judgment. Deterministic validators enforce the result contract. Fixed jobs apply allowed writes. Safe Outputs defines the permitted verbs. The agent itself has read-only repository permissions. Neither a label check nor a fixed comment needs a model.

### 21. Refine: from Issue to user story.

On screen: workflow, state 3. Panels name facts · jobs, Refine, validate · jobs, safe-outputs.

Slide: It reads code and context. It writes testable criteria and estimates the work.

Speaker notes: Fixed jobs authorize and collect the Issue and comments before the agent starts. Refine uses the real codebase to produce an implementable story and acceptance criteria. It estimates scope. A single result must be applied through the permitted output contract. Issue text is data inside a marked boundary, not a new instruction source.

### 22. Refine asks or splits.

On screen: workflow, state 4. Panels name Issue author, Refine, Split · child Issues.

Slide: The author's answers return to Refine. Large Issues split into smaller children.

Speaker notes: Two branches have different causes. Missing intent returns to the author. Oversized implementation splits into bounded work. Replies re-enter refinement rather than restarting an implementation with stale assumptions. The current route diagram sends small work to Implement. The older polling cascade in the website is not the current router.

### 23. Implement: code, checks and PR.

On screen: workflow, state 5. Panels name facts · jobs, OpenCode · agent, validate · jobs, safe-outputs.

Slide: Prepare the Issue → /plan-goal → validate the patch → open PR. The worker stops there.

Speaker notes: Normal jobs read the Issue, reserve it, and supply facts. OpenCode runs the scoped implementation with the Harness. It writes code and verifies the change. Fixed output steps replay the validated patch and open the pull request. Implement stops at that handoff. It does not own merge, and it must not hold a runner while waiting for CI. A feature chain can accumulate stories on one branch before its final pull request.

### 24. CI supplies evidence. Merge Gate decides.

On screen: workflow, state 6. Panels name CI, Merge Gate, show.review.label.

Slide: The agent finds defects. Code computes risk and validates the verdict. Only the gate merges.

Speaker notes: CI dispatches its conclusion to the router. The gate reads the diff and evidence, checks defects, and can repair failed CI. A deterministic calculation supplies risk and a validator computes the disposition. Protected paths require their owner. Only this worker merges. A shell validator enforces the contract after the agent reports its findings.

### 25. Fix or review → CI → gate.

On screen: workflow, state 7. Panels name Implement, Apply Review, Merge Gate.

Slide: A failure goes back for repair. Apply Review reads the full conversation. Each push reruns CI.

Speaker notes: Keep the forward path and draw both returns. A gate repair pushes another patch and waits for a new CI event. A review invokes Apply Review, which reads the whole conversation before applying justified changes. Ambiguous or unsafe feedback needs a person. Both branches return through CI and the same merge gate.

### 26. Each worker hands off and stops.

On screen: workflow, state 8. Panels name Merge Gate, Release · manual, Router · shell.

Slide: CI dispatches the gate when done. Release is manual. Reconcile recovers missed events.

Speaker notes: Asynchronous means separate bounded runs. The PR starts CI. The CI conclusion dispatches the gate. Release starts from a manual dispatch; the agent writes notes while code handles version, tag, and publishing. A reconciler catches lost handoffs. Housekeeping retries machine failures within a budget. A question or owner review is a decision, not a crash to retry.

## Project Health measures and improves the system

Source: [reference](../knowledge/website-reading.md).

### 27. DORA: delivery and rework.

On screen: feedback, state 0. Panels name project-health, p12.notCollected.

Slide: Deployment frequency, commit to production and rework. The collector has no production incident data.

Speaker notes: Project Health collects GitHub facts and publishes a static site. Deployment frequency and commit-to-production lead time describe delivery. Rework needs an explicit hotfix marker. Change fail rate and recovery time need production incident evidence. A red pipeline is not that evidence. Missing values stay absent with a reason.

### 28. Tokens and time for each run.

On screen: feedback, state 1. Panels name project-health.

Slide: Count runs that reached the model. Report how many supplied data. Totals are a floor.

Speaker notes: Read agent usage from artifacts and execution time from the actual agent step. A declared agent job that was skipped is not an agent run. Token totals can be incomplete when artifacts are absent, so show measured N of M. Model-request time and whole-step time are different measurements. Costs stay in tokens rather than stale currency estimates.

### 29. Work that still needs a person.

On screen: feedback, state 2. Panels name show.review.label, project-health.

Slide: Pending review and blocked Issues by project. Keep bot PRs separate to show the human workload.

Speaker notes: Show human attention as its own measure. The collector queries each configured attention label and open pull requests. Bot authorship stays separate. More PRs do not establish less work for people. This view directs review and reveals where the automated route repeatedly stops.

### 30. Audit sends work back to Refine.

On screen: feedback, state 3. Panels name Audit · read-only, Refine, project-health.

Slide: A read-only audit files an Issue through the same route. Health measures the result of the change.

Speaker notes: Audit reads the repository against its guardrails and files a finding. It does not edit code. The Issue enters Refine, then the ordinary pipeline. Repeated findings and attention patterns can lead to changes in Foundations, Harness, or worker logic. Measurement follows the revised system. This is the improvement loop in the assessment.

## The whole Platform system

Source: [reference](../knowledge/maturity.md).

### 31. From a product Issue to production.

On screen: system, state 0. Panels name Foundations, agent-harness, agentic-workflows, project-health, 1 · No AI, 2 · Exploratory, 3 · Structured, 4 · Scaled, 5 · Governed & Optimized.

Slide: Product experts who do not code file small eligible Issues or bugs. They reach production without human supervision.

Speaker notes: Return to the person at the PC from the opening. The completed system now lets someone close to the product create a small eligible Issue or bug. That person does not need to code or supervise the agent. Trace their Issue through Triage, Refine, Implement, CI, Merge Gate, the application deployment, and Health. They define the intended behavior and answer product questions when needed. The system owns execution and its checks. This autonomy depends on the technical and agent base established in Foundations, with the Harness and workflow controls in place. Protected technical changes still need their owner. Application deployment follows the project configuration. The manually dispatched package Release worker is a separate route. The five maturity forms remain in the field without claiming an assessment score. Health feeds evidence into the three earlier pillars. End on the product change in production and the measured improvement loop.
