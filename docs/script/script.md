# Talk script

Draft 8, 2026-10-05. 24 stops, including the cover and four chapter cards. Each stop changes the picture. A chapter card shows only its title while the world fades behind it. The presenter approved ten story blocks. The order runs from local AI use through maturity, capability growth, and Platform to autonomous product changes. The cover and PC share one chapter.

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

### 5. From prompts to a Harness.

On screen: evolution, state 0. Panels name pc-* skills, plugins, agent-harness, OpenCode · agent.

Slide: A skill keeps the procedure. An agent uses tools. Plugins limit those tools. The Harness installs all of this in the repo.

Speaker notes: This is a capability path, not a maturity score. A prompt states the task once. A skill keeps the procedure, so the next session can reuse it. The agent can inspect code, edit files, and run checks. It needs both instructions and enforcement. Plugins reject forbidden tool calls, and guardrails constrain the code. The Harness gathers context, commands, skills, plugins, and the repo rules in one place, so each session finds them. The original work item remains part of the same body.

### 6. The next step is asynchronous.

On screen: evolution, state 1. Panels name Router · shell, agent-harness.

Slide: A repository event starts the work. The process continues after you leave the PC.

Speaker notes: Move the same work item into an event-driven environment. Work can continue without an engineer watching the terminal. This needs a route, repeatable context, bounded permissions, and a visible outcome.

## How we built Platform

Source: [reference](../knowledge/website-reading.md).

### 7. Chapter: How we built Platform

On screen: the title over the dimmed world.

Speaker notes: Pause. The talk moves from your PC to the Platform department and its four repositories.

### 8. Four repositories carry the method.

On screen: platform, state 0. Panels name Foundations, agent-harness, agentic-workflows, project-health.

Slide: Foundations sets conventions. agent-harness installs them for agents. agentic-workflows runs the agents. project-health measures the result.

Speaker notes: Platform is a Plain Concepts department that builds and maintains applications. Foundations defines conventions. agent-harness installs the agent environment. agentic-workflows runs workers on events. project-health measures delivery and agent work. Each repository supplies an input the next one needs.

### 9. Discovery → Foundations → Maintenance

On screen: platform, state 1. Panels name Foundations, Router · shell.

Slide: Early work builds the technical and agent base. With that in place, more effort goes into defining the product.

Speaker notes: Discovery defines product outcomes and constraints. Foundations turns those decisions into working software and enforced guardrails. Early agent work needs substantial effort on technology, tools, context, and the agent environment. As that base settles, more effort goes into defining product behavior and acceptance criteria. Discovery continues alongside delivery. Maintenance opens small eligible changes to people close to the product who do not need engineering skills. They describe the outcome, supply bug reproduction steps, and answer product questions. The existing route can then implement, check, merge, and ship without human supervision. Technical means and protected changes remain engineering decisions. The phases overlap by capability.

## Foundations: conventions enforced in code

Source: [reference](../knowledge/website-reading.md).

### 10. Chapter: Foundations

On screen: the title over the dimmed world.

Speaker notes: Pause. The first pillar: conventions that code enforces.

### 11. A guardrail fails the build.

On screen: baseline, state 0. Panels name Foundations, map.walls.

Slide: One stack for people and agents. The linter blocks cross-layer code. A behavior change needs a spec. A test must assert behavior.

Speaker notes: Give engineers and agents a defined stack. The frontend uses Next.js, strict TypeScript, and shared tokens. The backend uses .NET, one-way layer dependencies, and vertical slices. Foundations is a thin shared base. Application behavior stays in the application. A convention becomes a guardrail when code enforces it. A layer violation fails the build, and an agent must not make the test green by allowing the forbidden dependency. Widening the boundary rule needs its own control. CI links a behavior change to a specification, proposal, or decision record. Trivial refactors have an explicit opt-out. Test quality requires assertions about observable behavior, not code execution alone. Where the domain needs an audit trail, every state change must use the append path.

### 12. Protected paths need an owner.

On screen: baseline, state 1. Panels name Merge Gate, show.review.label.

Slide: Authentication, migrations, integrations and CI configuration stop for an owner. Green tests do not override that.

Speaker notes: Protected paths have owner checkpoints. Authentication, authorization, migrations, integrations, CI, and design tokens are examples. Passing tests does not override ownership. The guardrails decide the scope that can proceed unattended.

## What agent-harness installs

Source: [reference](../knowledge/platform.md).

### 13. agent-harness sets up the environment.

On screen: environment, state 0. Panels name agent-harness, ARCHITECTURE + DESIGN.

Slide: One command installs pc-* skills, commands, agents, plugins and OpenSpec. The bootstrap writes ARCHITECTURE.md and DESIGN.md from the code.

Speaker notes: One npx command runs the installer wizard. It copies commands, skills, agents, plugins, and OpenSpec into the repository. The bootstrap reads the codebase and generates ARCHITECTURE.md and DESIGN.md for an existing project. A new project starts with placeholders. Saved configuration records the backlog, repository, and model tiers. Update preserves hand edits. OpenSpec separates intent, design, specifications, and tasks. The command /plan-propose writes the proposal, specs, and tasks. The command /plan-apply runs waves of engineers. Verification runs lint, types, tests, and build. The command /ops-ship opens the pull request. Planning and execution model tiers are configurable.

### 14. One Harness on PC and CI.

On screen: environment, state 1. Panels name plugins, agent-harness, map.forge, OpenCode · agent.

Slide: Plugins reject unsafe tool calls before they run. OpenCode reads the same repo rules on both. Forge supplies the model.

Speaker notes: The pc-system-reminders plugin denies unsafe Git actions and enforces supported repository access at the tool call, before the model acts. Skills explain a procedure. Plugins can prevent a tool action. The Harness also supplies codegraph for code intelligence, agentmemory for retained context, and browser tooling for verification. The local agent and the unattended worker use the same repository environment. OpenCode is the runtime and Forge is the model gateway. This keeps repository rules separate from model choice. The published default runner is GitHub-hosted ubuntu-latest. Self-hosted runners remain an option, with their own operating costs.

## Agentic Workflows: jobs, reasoning, validated writes

Source: [reference](../knowledge/workflow-routes.md).

### 15. Chapter: Agentic Workflows

On screen: the title over the dimmed world.

Speaker notes: Pause. The work leaves the PC. Events start bounded runs in the cloud.

### 16. One router for every event.

On screen: workflow, state 0. Panels name agentic-workflows, Router · shell, Refine.

Slide: A Markdown file compiles to a GitHub Actions workflow. Shell code classifies the event and calls at most one worker, or none.

Speaker notes: GitHub Agentic Workflows supplies the compiler and execution infrastructure. Platform supplies the router, worker catalog, installer, shared defaults, and repository Harness. Frontmatter sets the runner, engine, model, permissions, and allowed outputs. The Markdown body contains the agent task. Compiling adds framework jobs, and Actions runs the lock file. The router owns all triggers. A pure shell classifier reads the event and selects one route without a model call. Requests from people without write access enter through Triage before Refine. Workers accept workflow_call inputs and declare no public triggers. Router concurrency prevents competing workers on an Issue. Labels describe state for people. They are not the lock. Bot comments must not retrigger their own worker.

### 17. Jobs → agent → jobs → Safe Outputs

On screen: workflow, state 1. Panels name facts · jobs, OpenCode · agent, validate · jobs, safe-outputs.

Slide: Jobs collect facts. The agent decides with read-only access. Validators check its result. Safe Outputs applies only allowed writes.

Speaker notes: Read the whole chain from left to right. Normal jobs authorize, select, and collect facts. The agent receives those facts and performs the work that needs judgment. Deterministic validators enforce the result contract. Fixed jobs apply allowed writes. Safe Outputs defines the permitted verbs. The agent itself has read-only repository permissions. Neither a label check nor a fixed comment needs a model.

### 18. Refine: from Issue to story.

On screen: workflow, state 2. Panels name facts · jobs, Refine, Split · child Issues, safe-outputs.

Slide: It reads the code and writes testable criteria with an estimate. It asks the author when intent is missing. Large Issues split into children.

Speaker notes: Fixed jobs authorize and collect the Issue and comments before the agent starts. Refine uses the real codebase to produce an implementable story with acceptance criteria and an estimate. A single result must be applied through the permitted output contract. Issue text is data inside a marked boundary, not a new instruction source. Two branches have different causes. Missing intent returns to the author. Oversized work splits into bounded children that follow the route on their own. Replies re-enter refinement. They do not restart an implementation with stale assumptions. The current route sends small work to Implement. The older polling cascade on the website is not the current router.

### 19. Implement: code, checks and PR.

On screen: workflow, state 3. Panels name facts · jobs, OpenCode · agent, validate · jobs, safe-outputs.

Slide: Prepare the Issue → /plan-goal → validate the patch → open PR. The worker stops there.

Speaker notes: Normal jobs read the Issue, reserve it, and supply facts. OpenCode runs the scoped implementation with the Harness. It writes code and verifies the change. Fixed output steps replay the validated patch and open the pull request. Implement stops at that handoff. It does not own merge, and it must not hold a runner while waiting for CI. A feature chain can accumulate stories on one branch before its final pull request.

### 20. CI supplies evidence. Merge Gate decides.

On screen: workflow, state 4. Panels name CI, Merge Gate, show.review.label, Implement.

Slide: Code computes risk. The agent looks for defects. A validator sets the verdict. Fixes and reviews return through CI to the same gate.

Speaker notes: CI dispatches its conclusion to the router, and the gate runs as its own bounded run. The gate reads the diff and the evidence and checks for defects. It can repair failed CI by pushing a patch, which starts CI again. A deterministic calculation supplies risk. A shell validator computes the disposition after the agent reports its findings. Protected paths require their owner. Only this worker merges. A review invokes Apply Review, which reads the whole conversation before it applies justified changes. Ambiguous or unsafe feedback needs a person. Both returns pass through CI and the same gate. A reconciler catches lost handoffs, and housekeeping retries machine failures within a budget. A question or an owner review is a decision, not a crash to retry. Release is a separate manual route. The agent writes the notes, and code sets the version, the tag, and the publishing.

## Project Health measures and improves the system

Source: [reference](../knowledge/website-reading.md).

### 21. Chapter: Project Health

On screen: the title over the dimmed world.

Speaker notes: Pause. The last pillar measures the system and feeds the other three.

### 22. Health measures what GitHub knows.

On screen: feedback, state 0. Panels name project-health, p12.notCollected, waits for a person.

Slide: Deployment frequency, lead time and rework. Tokens per run, as a floor. Work that waits for a person. A missing value stays empty.

Speaker notes: Project Health collects GitHub facts and publishes a static site. Deployment frequency and commit-to-production lead time describe delivery. Rework needs an explicit hotfix marker. Change fail rate and recovery time need production incident evidence. A red pipeline is not that evidence, so those values stay absent with a reason. Agent usage comes from run artifacts and from the actual agent step. A declared agent job that was skipped is not an agent run. Token totals can be incomplete when artifacts are absent, so show measured N of M. Costs stay in tokens. Human attention is its own measure: pending review and blocked Issues for each project, with bot pull requests counted apart. More PRs do not establish less work for people. This view shows where the automated route repeatedly stops.

### 23. Audit sends work back to Refine.

On screen: feedback, state 1. Panels name Audit · read-only, Refine, project-health.

Slide: A read-only audit files an Issue through the same route. Health measures the result of the change.

Speaker notes: Audit reads the repository against its guardrails and files a finding. It does not edit code. The Issue enters Refine, then the ordinary pipeline. Repeated findings and attention patterns can lead to changes in Foundations, Harness, or worker logic. Measurement follows the revised system. This is the improvement loop in the assessment.

## The whole Platform system

Source: [reference](../knowledge/maturity.md).

### 24. From Issue to production with GitHub Agentic Workflows.

On screen: system, state 0. Panels name Triage, Refine · Implement, CI, Merge Gate, Production.

Slide: Product experts who do not code file small eligible Issues or bugs. They reach production without human supervision.

Speaker notes: Return to the person at the PC from the opening. The completed system now lets someone close to the product create a small eligible Issue or bug. That person does not need to code or supervise the agent. Trace their Issue through Triage, Refine, Implement, CI, Merge Gate, the application deployment, and Health. They define the intended behavior and answer product questions when needed. The system owns execution and its checks. This autonomy depends on the technical and agent base established in Foundations, with the Harness and workflow controls in place. Protected technical changes still need their owner. People with write access label an Issue straight into the route. Everyone else enters through Triage. Application deployment follows the project configuration. The manually dispatched package Release worker is a separate route. The five maturity forms remain in the field without claiming an assessment score. Health feeds evidence into the three earlier pillars. End on the product change in production and the measured improvement loop.
