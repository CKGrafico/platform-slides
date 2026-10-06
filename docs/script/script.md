# Talk script

Draft 8, 2026-10-05. 30 stops, including the cover and four chapter cards. Each stop changes the picture. A chapter card shows only its title while the world fades behind it. The presenter approved ten story blocks. The order runs from local AI use through maturity, capability growth, and Platform to autonomous product changes. The cover and PC share one chapter.

The same Issue moves through the talk. Each new layer answers a practical need and stays in the field. Foundations supplies enforceable conventions. The Harness supplies the agent environment. Workflows give events bounded runs. Health supplies evidence and returns findings to the same route.

Early work establishes the technical and agent base. As it settles, more effort goes into product definition. In Maintenance, people close to the product can file small eligible Issues and bugs. The route can ship them without human supervision. The final world connects this outcome to the controls built throughout the talk.

Maturity describes team practices. The five levels are independent of tool choice. The final world shows the capabilities that support those practices. It does not claim a Platform assessment score.

Sources: [Platform facts](../knowledge/platform.md), [published method](../knowledge/website-reading.md), [current worker routes](../knowledge/workflow-routes.md), and [the supplied assessment](../knowledge/maturity.md). The assessment marketing figures remain off stage because their primary sources are absent.

The old script is in [the source archive](script-orbits-archive.md). Its visual directions are superseded. Each beat below defines the content before its scene is built.

## Cover and work on your PC

Source: [reference](../knowledge/talk-notes.md).

### 1. From Issue to production with GitHub Agentic Workflows

On screen: an open laptop built from the units of the reasoning core. The blue Issue is the middle tile of its screen. On the next beat the laptop comes apart into the core. The cover introduces the speaker.

Say: This talk follows one Issue from an engineer's PC to production, through the Plain Concepts Platform.

### 2. At the start, we worked with AI synchronously.

On screen: local, state 0. Panels name OpenCode · agent.

Slide: You supply context, review the change and give the next instruction.

Speaker notes: Start with the audience experience. The engineer asks for a change, supplies files, inspects the patch, and redirects the agent. The feedback loop depends on the person being present.

## AI adoption and team maturity

Source: [reference](../knowledge/maturity.md).

### 3. Different levels of maturity.

On screen: assessment, state 0. Panels name 1 · No AI, 2 · Exploratory, 3 · Structured, 4 · Scaled, 5 · Governed & Optimized.

Slide: Different teams and companies are at different points in adopting AI across the software development lifecycle.

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

On screen: the router flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: One event, one run, at most one worker. Classification is pure shell with no network calls. An idle run costs about ten seconds.

Speaker notes: A Markdown file compiles to a GitHub Actions workflow with gh aw compile. GitHub Agentic Workflows supplies the compiler and the runtime. Platform supplies the router, the worker catalog, the installer, shared defaults, and the repository Harness. The router owns every trigger. Rung 1 classifies the event in pure shell, with no network call and no model. Then it authorizes: write access and organization membership, or the bot-working label for bots. Then it dispatches one worker through workflow_call, or none. Requests from people without write access enter through Triage. Cron and manual dispatch go to deterministic jobs that never run a model. Router concurrency prevents two workers on one Issue. Labels describe state for people. They are not the lock. An idle run still appears for every matching event and costs about ten seconds with every job skipped.

### 17. Jobs → agent → jobs → Safe Outputs

On screen: workflow, state 1. Panels name facts · jobs, OpenCode · agent, validate · jobs, safe-outputs.

Slide: Jobs collect facts. OpenCode decides through Forge, our AI gateway, with read-only access. Validators check the result. Safe Outputs applies allowed writes.

Speaker notes: Every worker climbs the same ladder. Rung 1 classifies in shell. Rung 3 collects facts. Rung 4 reserves the Issue and checks eligibility. Rung 5 is the agent. Rung 6 concludes in shell. The agent is OpenCode, and it never talks to a model provider itself. It talks to Forge, the Plain Concepts AI gateway. Forge chooses the provider and the model, and each project has its own key, so we control cost and access for each project. The model, the provider, and the runtime can change. The architecture around them stays. Deterministic validators enforce the result contract. Fixed jobs apply allowed writes. Safe Outputs defines the permitted verbs. The agent itself has read-only repository permissions. Neither a label check nor a fixed comment needs a model.

### 18. How the routes chain.

On screen: the chain flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Refine decides size: 5 or less goes to Implement, 8 or more splits. One PR, CI, the gate decides. Every return re-enters the same route.

Speaker notes: Read the map from left to right. A user with write access labels the Issue straight into Refine. Everyone else enters through Triage. Refine estimates in points. Five or less goes to Implement. Eight or more splits into two to six children, and each child walks the route alone. Implement opens one pull request that closes the Issue. CI runs. Merge Gate merges, or asks for a human when the risk is high or a protected path changed. Three feedback loops: a question returns to the author and the reply re-enters Refine, a failed CI returns to a fix and then to the gate again, and the weekly Audit files one Issue into Refine, never into Implement.

### 19. Triage: the front door.

On screen: the triage flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Four outcomes: pass, needs info, needs a maintainer, block. Three rounds at most. In round three, needs info is no longer allowed.

Speaker notes: Triage runs only for outside collaborators. A user with write access skips it. The worker reserves the Issue with the bot-working label, collects the Issue and its comments, and the agent runs ten checks. Four valid outcomes. Pass adds the refine label with no human in the loop. Needs info posts questions, and an author reply re-runs the worker. Needs maintainer keeps the Issue open with a review label. Block closes it only on a genuine rejection. The round counter comes from markers already on the Issue. In round three, needs info is no longer allowed, so the loop ends. An invalid outcome is retried.

### 20. Refine: size and split the work.

On screen: the refine flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Explore the code one unit at a time. Write the story as Given, When, Then. Estimate in Fibonacci. Eight or more splits into 2 to 6 children.

Speaker notes: Reserve, collect facts, then the agent explores the real codebase one unit at a time. A trivial change gets a plan without Gherkin. Everything else becomes a story in Given, When, Then, wrapped into the Issue form and passed through the humanizer. The estimate is Fibonacci against the estimate bands. Eight or more splits into two to six children of five or less, and each child walks the pipeline alone. Open questions go to the author in one batched comment. When nothing is open, the Issue is refined and the implement label is added. If the agent cannot ground the story in the code, the run is incomplete and retried.

### 21. Implement: one PR, then stop.

On screen: the implement flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Eligible? Reserve, collect facts. Trivial marker takes the direct path, the rest runs plan-goal. Verify the scoped files. One PR. The gate decides.

Speaker notes: Rung 4 checks eligibility: the Issue is open and not marked future. Reserve it. Rung 3 collects facts. A trivial marker takes the direct path, one todo per item. Everything else runs the plan-goal pipeline from the Harness. Verify checks the scoped files, and a failure goes back to the agent. Create PR is the one safe output. Then the worker hands off: the merge decision belongs to the gate. If the run died in under six minutes, that is an outage, and the worker retries up to five times. If it died later, something is wrong, and the Issue is parked with a review label.

### 22. Merge Gate: the only one that merges.

On screen: the gate flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: CI red? Repair, push, CI again. CI green? Measure the blast radius, the agent hunts defects, shell computes the verdict: merge, human, owner or blocked.

Speaker notes: CI reports its conclusion to the router, or the reconciler finds a pull request that was missed. Rung 4 checks the subject: our open pull request. Checkout is fast-forward only. Rung 3 collects the diff, the pull request shape, and the CI logs. If CI failed, the agent repairs and verifies, pushes, and CI runs again. If CI passed, rung 4b measures the protected paths and the blast radius. The agent finds and verifies defects and reports them. The disposition is computed in shell from that report and the blast radius: auto-merge with squash and the Issue closed, human review when the change is fragile or the radius is high, owner review from CODEOWNERS for protected paths, or blocked when CI stays red at attempt six. Only this worker merges.

### 23. Apply Review: the whole conversation.

On screen: the review flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Read every thread first. A reviewer makes one point across several comments. Apply only what the feedback justifies: a comment is not a licence to refactor.

Speaker notes: A review or a comment on a bot pull request starts this worker. Rung 4 checks that the pull request is ours and that the reviewer has write access. Rung 3 puts the whole conversation on disk: threads, comments, and the diff. A reviewer often makes one point across several comments, and applying them one at a time produces contradictory commits. The agent decides what is still actionable, by thread id, and applies only what the feedback justifies. Verify runs on the changed files. A push runs CI and re-enters the gate. If everything was already addressed, nothing is pushed. Ambiguous or unsafe feedback needs a human.

### 24. Release: the agent writes prose.

On screen: the release flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Its only output is a file on disk. The version bump, the tag and the Release are shell. A confused model cannot publish a release.

Speaker notes: Release starts from a manual dispatch. Rung 3 collects the commit log since the last tag. Rung 5 is the agent, and its only output is release-notes.md on disk. Rung 6 concludes in shell: a BREAKING change bumps the major version, a feat bumps the minor. Commit, tag, push, and create the GitHub Release. If anything fails, there is no tag and nothing partial. Package release is a separate route from application deployment, which follows the project configuration.

### 25. Audit: read-only, files one Issue.

On screen: the audit flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: The only worker that creates work. It reads the repo, scores each finding, drops duplicates and files one Issue into Refine. Fewer than three open reports.

Speaker notes: Audit runs weekly or on dispatch. Rung 1 applies backpressure: fewer than three open audit reports, or the run is idle because the backlog is full. Rung 3 collects the open Issues, titles, and labels. The agent audits the repository read-only against its guardrails with /repo-audit. It filters for findings that are specific, reproducible, and have impact. It scores them from one to ten on severity, likelihood, and blast radius, and drops anything already tracked or rejected. It records dispositions and reads them next time. It files one Issue with the top three findings refined as stories. That Issue enters Refine, gets sized and split, and follows the ordinary route. Repeated findings and attention patterns lead to changes in Foundations, the Harness, or the workers. Measurement follows the revised system. This is the improvement loop.

## Project Health measures and improves the system

Source: [reference](../knowledge/platform.md).

### 26. Chapter: Project Health

On screen: the title over the dimmed world.

Speaker notes: Pause. The last pillar measures every project and feeds the other three.

### 27. One dashboard for every project.

On screen: the portfolio board of Project Health over the dimmed world. The composition holds the current subject.

Slide: Three of five DORA metrics, from GitHub alone. Change fail rate and recovery time need incident data GitHub lacks, so they stay empty.

Speaker notes: Project Health is a template repository. It collects delivery and agent facts from the GitHub API, stores them as JSON, and publishes a static site. There is no database and no service to run. Each project gets a card: its status, production, pre-production or planned, then deployment frequency, change lead time at P50, and deployment rework rate, marked by a hotfix or bug label. If the project runs agents, the card adds runs, tokens and the OpenCode step time. The detail page adds P75 and P90, issue to staging, a monthly trend, who opened the work and who released it, and notes that change how a number should be read. Change fail rate and recovery time need to know that a release caused a production problem, which GitHub does not record, so they are not shown rather than estimated. The team profile places a project among the DORA 2025 profiles using throughput and stability only. Well-being needs a survey, so it stays unknown, and the result is a set of candidate profiles. The numbers on this slide are the template demo data, not our projects. Our private instance measures ten projects. Show the demo; never show real project names or the people columns.

### 28. What every agent run costs.

On screen: the agents board of Project Health over the dimmed world. The composition holds the current subject.

Slide: Tokens and OpenCode time for each run, by worker. Totals are a floor: a run counts only if it reached the model and uploaded its usage.

Speaker notes: These are the real Platform aggregates from the snapshot of 23 September 2026, for 1 August to 22 September, across the four repositories where the router really ran agents. 723 agent runs, about 70 percent succeeded. About 2.09 billion tokens, almost all input, and that is a floor: only 500 runs reported usage. About 107 hours of agent execution, measured as the wall clock of the OpenCode step, which also covers tool calls and file work. Implement is the expensive worker: 280 runs, 1.54 billion tokens, about 61 hours. Merge Gate ran 237 times, 191 succeeded. Refine ran 125 times for 176 million tokens. Triage ran 36 times and always succeeded. Costs stay in tokens, not in currency. A declared agent job that was skipped is not an agent run: 140 such runs were removed from the count. Refresh these numbers before the talk.

### 29. Measure, then change the system.

On screen: the improve flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: The numbers show where the route wastes or fails. People change a worker, a rule or the runners. The next collection shows if it worked.

Speaker notes: Three real changes came from measurement. Tokens per run: one Issue of 13,398 characters and 92 work units burned 17 minutes and 2.4 million tokens, twice, with no result. A size gate in Refine now refuses it in 10 seconds. Gate verdicts: the first Merge Gate auto-merged 31 percent of its verdicts while it found zero defects, so it was redesigned to decide on evidence, and the new owner-path rule, replayed on 18 gated pull requests, caught exactly the 3 that needed an owner. Runner time: before host reuse, about 78 percent of billed VM time went to booting, and a pre-baked image cut create-to-ready from about 2.5 minutes to about 80 seconds. Audit is the automated part of the loop: weekly and read-only, it files one Issue that enters Refine. Then the next collection measures the revised system. That is the improvement loop of the maturity assessment, working in practice. Refresh these numbers before the talk.

## The whole Platform system

Source: [reference](../knowledge/maturity.md).

### 30. From Issue to production with GitHub Agentic Workflows.

On screen: system, state 0. Panels name Triage, Refine · Implement, CI, Merge Gate, Production.

Slide: Product experts who do not code file small eligible Issues or bugs. They reach production without human supervision.

Speaker notes: Return to the person at the PC from the opening. The completed system now lets someone close to the product create a small eligible Issue or bug. That person does not need to code or supervise the agent. Trace their Issue through Triage, Refine, Implement, CI, Merge Gate, the application deployment, and Health. They define the intended behavior and answer product questions when needed. The system owns execution and its checks. This autonomy depends on the technical and agent base established in Foundations, with the Harness and workflow controls in place. Protected technical changes still need their owner. People with write access label an Issue straight into the route. Everyone else enters through Triage. Application deployment follows the project configuration. The manually dispatched package Release worker is a separate route. The five maturity forms remain in the field without claiming an assessment score. Health feeds evidence into the three earlier pillars. End on the product change in production and the measured improvement loop.
