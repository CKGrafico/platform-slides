# Talk script

Draft 9, 2026-10-06. 26 stops, including the cover and 1 chapter card. Each stop changes the picture. A chapter card shows only its title while the world fades behind it. The presenter approved ten story blocks. The order runs from local AI use through maturity, capability growth, and Platform to autonomous product changes. The cover and PC share one chapter.

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

### 2. Thank you to our sponsors.

On screen: the sponsor logos, in the agreed order and sizes, over the dimmed world. The composition holds the current subject.

Slide: no caption. The names under the bodies carry the content.

Speaker notes: Required by the event, NetCoreConf Madrid 2026. Thank the sponsors. Platinum: Inkoova, Intelequia, NTT DATA, Tokiota and V-Valley. Gold: Axazure by Avvale and Plain Concepts. Supported by Sessionize. Positions and sizes copy the official sponsor slide, because each tier pays for its place.

### 3. GitHub Agentic Workflows in 5 minutes.

On screen: a minimal gh-aw workflow as a source card over the dimmed world. The composition holds the current subject.

Slide: A workflow is a Markdown file: settings on top, the prompt below. GitHub supplies the actions and the setup.

Speaker notes: Start with the tool the title names, before our own story. In GitHub Agentic Workflows, gh-aw, a workflow is one Markdown file in the repo. The frontmatter on top is the wiring: when it runs, here when an Issue gets a label; the permissions, here read only; the engine, here Claude; and the safe outputs it may produce, here one pull request. The body is the prompt, in plain words. GitHub supplies the predefined actions and settings around it. This is a minimal example, not one of ours: our workers use the same keys and run to several hundred lines.

### 4. From Issue to PR with one API key.

On screen: the ghaw flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: You compile the Markdown into an Actions workflow. The agent reads with no write access and proposes. gh-aw checks the proposal and opens the PR.

Speaker notes: gh aw compile turns the Markdown into a GitHub Actions workflow, a lock file you commit. When the event fires, Actions runs it. The agent runs with your AI API key and read-only permissions, so it cannot push or comment by itself. It writes its result as a safe output. gh-aw validates that output and only then performs the write, here opening one pull request. With one API key, an Issue becomes a pull request. Everything after this slide is what it takes to run that in production.

### 5. Understanding it takes 5 minutes. Getting it right takes months.

On screen: cover, state 1. The composition holds the current subject.

Slide: The demo works on day one. Running it on real repos took us months: conventions, an agent environment, routes with gates, runners and measurement.

Speaker notes: This is the turn of the talk. Anyone can make the demo work in an afternoon. Making it safe on real repositories, with real teams, is where the months went: conventions the agent can follow, an environment that holds it, routes with gates that decide, runners that cost little, and numbers that show what works. The rest of the talk is those bases, in the order we built them.

### 6. At the start, we worked with AI synchronously.

On screen: local, state 0. Panels name OpenCode · agent.

Slide: You supply context, review the change and give the next instruction.

Speaker notes: Start with the audience experience. The engineer asks for a change, supplies files, inspects the patch, and redirects the agent. The feedback loop depends on the person being present.

## AI adoption and team maturity

Source: [reference](../knowledge/maturity.md).

### 7. Different levels of maturity.

On screen: assessment, state 0. Panels name 1 · No AI, 2 · Exploratory, 3 · Structured, 4 · Scaled, 5 · Governed & Optimized.

Slide: Different teams and companies are at different points in adopting AI across the software development lifecycle.

Speaker notes: Use the five assessment levels, with their exact names. No AI is manual work. Exploratory is individual use. Structured adds approved tools and review guidance. Scaled makes practice consistent across teams. Governed & Optimized puts governance and improvement into the workflow. Do not equate a tool upgrade with organizational maturity.

## The evolution of AI

Source: [reference](../knowledge/talk-notes.md).

### 8. The evolution of AI.

On screen: evolution, state 0. Panels name Models, Prompts, Skills, Agents, Guardrails, Harnesses, Loops and graphs, Agentic Workflows, Future.

Slide: no caption. The names under the bodies carry the content.

Speaker notes: Walk the line from left to right. Models made chat AI common. Then we wrote prompts: you ask, review the change and ask again, with the engineer always present. Skills keep a procedure, so the next session can reuse it. Agents plan, use tools and edit code. That needs guardrails, because instructions alone do not stop a bad tool call. A Harness puts the model, the tools, the skills and the repo rules in one place. Loops and graphs let the work continue after you leave the PC: a repo event starts it. Agentic Workflows run those loops on Platform. This talk covers the last three steps. Nobody knows the next one yet.

## How we built Platform

Source: [reference](../knowledge/website-reading.md).

### 9. Chapter: How we built the Platform

On screen: the title over the dimmed world.

Speaker notes: Pause. The talk moves from your PC to the Platform department and its four repositories.

### 10. The 4 pillars of Platform.

On screen: platform, state 0. Panels name Foundations, agent-harness, agentic-workflows, project-health.

Slide: no caption. The names under the bodies carry the content.

Speaker notes: Platform is a Plain Concepts department that builds and maintains applications. Foundations defines conventions. agent-harness installs the agent environment. agentic-workflows runs workers on events. project-health measures delivery and agent work. Each repository supplies an input the next one needs.

## Foundations: technology conventions

Source: [reference](../knowledge/platform.md).

### 11. Foundations: technology conventions.

On screen: baseline, state 0. Panels name Foundations, Backend · .NET, Frontend · Next.js, Branding · ui-theme.

Slide: A thin base for many apps: a .NET backend, a Next.js frontend and one shared brand. People and agents follow the same rules.

Speaker notes: Foundations is the thin shared layer that keeps many Platform apps consistent for people and agents. It is not a framework: two packages, not eight. The backend reference is .NET with Clean Architecture, vertical slices and EF Core, composed by Aspire. The frontend reference is Next.js with strict TypeScript, shadcn/ui and Tailwind. Branding is the ui-theme package: one brand blue, one typeface, tokens only.

## agent-harness: agentic conventions

Source: [reference](../knowledge/platform.md).

### 12. agent-harness: agentic conventions.

On screen: the files agent-harness installs in a repo, as a tree on a source card over the dimmed world. The guardrail lines are blue. The composition holds the current subject.

Slide: One command installs it in each repo: OpenSpec for changes, plugins that block unsafe actions, the skills each project needs, and guardrails.

Speaker notes: This is what lands in your repo. One npx command runs a wizard once and saves the answers in .opencode/harness.json. Update replays those answers, asks nothing, and keeps the files you edited. AGENTS.md is always in context. ARCHITECTURE.md and DESIGN.md are generated from the code. OpenSpec manages each change as a proposal, specs and tasks. The pc-* skills hold the procedures: the guardrails every agent loads, your own project rules, and pc-plan-goal, which explores, proposes, applies and archives with no questions. A project gets only the skills it needs, for example the user story skill for its backlog. The blue lines are the guardrails. Plugins act at the tool call: pc-system-reminders denies about twelve unsafe actions, such as a forced push. check-diff refuses the comments and tests agents tend to add. The same harness runs on a PC and in CI.

## Agentic Workflows: jobs, reasoning, validated writes

Source: [reference](../knowledge/workflow-routes.md).

### 13. agentic-workflows: asynchronous development in the cloud.

On screen: workflow, state 0. Panels name Issue event, gh-aw + agentic-workflows, OpenCode · Forge, Safe Outputs · PR.

Slide: Our layer on top of GitHub Agentic Workflows: one router, workers that use the agent-harness skills, OpenCode through Forge, and writes only through Safe Outputs.

Speaker notes: Now the work leaves the PC. agentic-workflows is our layer on top of GitHub Agentic Workflows, gh-aw. Each worker is a gh-aw markdown file. We never call gh aw compile directly: our wrapper runs it and rewrites the lock files for our runners and for OpenCode as the engine. One command, npx @plainconceptsplatform/workflows, installs it in a repo, and update keeps it current. On top of gh-aw we add our practices: one router owns every event, OpenCode reasons through Forge, our AI gateway, with read-only access, and every write goes through allowlisted Safe Outputs. The workers call the agent-harness skills, for example pc-plan-goal in Implement, so a repo needs agent-harness first. The next slides follow each worker.

### 14. One router for every event.

On screen: the router flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: One event, one run, at most one worker. Classification is pure shell with no network calls. An idle run costs about ten seconds.

Speaker notes: A Markdown file compiles to a GitHub Actions workflow with gh aw compile. GitHub Agentic Workflows supplies the compiler and the runtime. Platform supplies the router, the worker catalog, the installer, shared defaults, and the repository Harness. The router owns every trigger. Rung 1 classifies the event in pure shell, with no network call and no model. Then it authorizes: write access and organization membership, or the bot-working label for bots. Then it dispatches one worker through workflow_call, or none. Requests from people without write access enter through Triage. Cron and manual dispatch go to deterministic jobs that never run a model. Router concurrency prevents two workers on one Issue. Labels describe state for people. They are not the lock. An idle run still appears for every matching event and costs about ten seconds with every job skipped.

### 15. Jobs → agent → jobs → Safe Outputs

On screen: workflow, state 1. Panels name facts · jobs, OpenCode · agent, validate · jobs, safe-outputs.

Slide: Jobs collect facts. OpenCode decides through Forge, our AI gateway, with read-only access. Validators check the result. Safe Outputs applies allowed writes.

Speaker notes: Every worker climbs the same ladder. Rung 1 classifies in shell. Rung 3 collects facts. Rung 4 reserves the Issue and checks eligibility. Rung 5 is the agent. Rung 6 concludes in shell. The agent is OpenCode, and it never talks to a model provider itself. It talks to Forge, the Plain Concepts AI gateway. Forge chooses the provider and the model, and each project has its own key, so we control cost and access for each project. The model, the provider, and the runtime can change. The architecture around them stays. Deterministic validators enforce the result contract. Fixed jobs apply allowed writes. Safe Outputs defines the permitted verbs. The agent itself has read-only repository permissions. Neither a label check nor a fixed comment needs a model.

### 16. Triage: the front door.

On screen: the triage flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Four outcomes: pass, needs info, needs a maintainer, block. Three rounds at most. In round three, needs info is no longer allowed.

Speaker notes: Triage runs only for outside collaborators. A user with write access skips it. The worker reserves the Issue with the bot-working label, collects the Issue and its comments, and the agent runs ten checks. Four valid outcomes. Pass adds the refine label with no human in the loop. Needs info posts questions, and an author reply re-runs the worker. Needs maintainer keeps the Issue open with a review label. Block closes it only on a genuine rejection. The round counter comes from markers already on the Issue. In round three, needs info is no longer allowed, so the loop ends. An invalid outcome is retried.

### 17. Refine: size and split the work.

On screen: the refine flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Explore the code one unit at a time. Write the story as Given, When, Then. Estimate in Fibonacci. Eight or more splits into 2 to 6 children.

Speaker notes: Reserve, collect facts, then the agent explores the real codebase one unit at a time. A trivial change gets a plan without Gherkin. Everything else becomes a story in Given, When, Then, wrapped into the Issue form and passed through the humanizer. The estimate is Fibonacci against the estimate bands. Eight or more splits into two to six children of five or less, and each child walks the pipeline alone. Open questions go to the author in one batched comment. When nothing is open, the Issue is refined and the implement label is added. If the agent cannot ground the story in the code, the run is incomplete and retried.

### 18. Implement: one PR, then stop.

On screen: the implement flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: Eligible? Reserve, collect facts. Trivial marker takes the direct path, the rest runs plan-goal. Verify the scoped files. One PR. The gate decides.

Speaker notes: Rung 4 checks eligibility: the Issue is open and not marked future. Reserve it. Rung 3 collects facts. A trivial marker takes the direct path, one todo per item. Everything else runs the plan-goal pipeline from the Harness. Verify checks the scoped files, and a failure goes back to the agent. Create PR is the one safe output. Then the worker hands off: the merge decision belongs to the gate. If the run died in under six minutes, that is an outage, and the worker retries up to five times. If it died later, something is wrong, and the Issue is parked with a review label.

### 19. Merge Gate: the only one that merges.

On screen: the gate flow, drawn step by step over the dimmed world. The composition holds the current subject.

Slide: CI red? Repair, push, CI again. CI green? Measure the blast radius, the agent hunts defects, shell computes the verdict: merge, human, owner or blocked.

Speaker notes: CI reports its conclusion to the router, or the reconciler finds a pull request that was missed. Rung 4 checks the subject: our open pull request. Checkout is fast-forward only. Rung 3 collects the diff, the pull request shape, and the CI logs. If CI failed, the agent repairs and verifies, pushes, and CI runs again. If CI passed, rung 4b measures the protected paths and the blast radius. The agent finds and verifies defects and reports them. The disposition is computed in shell from that report and the blast radius: auto-merge with squash and the Issue closed, human review when the change is fragile or the radius is high, owner review from CODEOWNERS for protected paths, or blocked when CI stays red at attempt six. Only this worker merges.

### 20. And four more workers.

On screen: workflow, state 5. Panels name Apply Review, Audit · read-only, Release · manual, Visual Verify.

Slide: Apply Review applies review comments on bot PRs. Audit reads the repo weekly and files one Issue. Release writes the notes. Visual Verify takes screenshots after an auto-merge.

Speaker notes: The other four workers follow the same pattern, so we only name them. Apply Review reads every review thread first and applies only what the feedback justifies. If a comment is ambiguous or unsafe, it asks for a person. Audit runs weekly and read-only: it scores each finding, removes duplicates, and files one Issue with the top three findings into Refine. Release lets the agent write only the release notes. The version bump, the tag and the GitHub Release are shell. Visual Verify runs after an auto-merge, starts the app and posts screenshots. It never blocks the merge.

## Project Health measures and improves the system

Source: [reference](../knowledge/platform.md).

### 21. Engineering: would anything stop a bad change?

On screen: the engineering tab of one real Project Health dashboard, without the project name, over the dimmed world. The composition holds the current subject.

Slide: Health starts with the gates, not with speed. Agents write most of the code, so this question comes first. A lot of AI and few gates raise an alert.

Speaker notes: Project Health is the fourth pillar. It reads GitHub every night and changes nothing in the repos. A project has four tabs, and each tab answers one question. The overview opens on Engineering, not on Delivery. When agents write most of the code, the first question is whether anything would stop a bad change. This is one real project, without its name, as of 19 October. Level L3, the top one. Score 100. All ten gates that apply are present and passed: Gherkin specs, tests and coverage, mutation, secrets, vulnerabilities, SAST, SBOM, complexity, and code hygiene on every build, then DAST after the deploy to test. Performance does not apply to this project. AI usage is 4 of 5: 82 of 147 commits this month came from an assistant or an agent. The two numbers only mean something together. If AI usage is 4 or more and the level is L1 or less, Health raises the alert "High AI usage, low engineering". The same tab scans comments and tests every day: comment lines stay under the 10% the harness sets, here 5.8%.

### 22. Delivery: three DORA metrics, two refused.

On screen: the delivery tab of one real Project Health dashboard, without the project name, over the dimmed world. The composition holds the current subject.

Slide: Change fail rate and recovery time need production incidents, and GitHub does not have them. So Health shows no number, not a guess.

Speaker notes: Delivery comes second on purpose. When agents open most pull requests, throughput says less than it used to. Health keeps the real DORA metrics only. Deployment frequency, change lead time and rework rate come from GitHub deployments and releases. Change fail rate and failed deployment recovery time need to know that a release caused a problem in production. A repository cannot know that. A red pipeline is not the same thing: no production deployment collected so far is recorded as failed, so that number would read zero forever. Two lead times stay apart. Change lead time runs from the commit to production. Issue to staging starts earlier and ends earlier, so it looks better. They are never mixed. For this project: 2.31 releases a week, change lead time p50 6.2 hours, Issue to staging p50 2 days, rework 0% by the bug label.

### 23. Agentic: how much merges on its own?

On screen: the agentic tab of one real Project Health dashboard, without the project name, over the dimmed world. The composition holds the current subject.

Slide: This month the gate merged 5 of 9 bot PRs with no person. Cost is in tokens, and the totals are a floor: not every run reports its usage.

Speaker notes: First: is the machinery installed and current? Health reads the harness and workflow versions from the default branch and compares them with npm. This project runs the current releases and all seven workers. A repo two minors behind runs failure modes that are already fixed. Second: how much merges on its own? Every PR from Implement has a bot title, so Health splits them into three groups. The gate merged 5 of 9 with no person. 1 was parked and a person merged it. 3 were merged by hand. Merged by the gate is the closest number to the autonomy we promise. Those PRs added 547 lines of code, 69 of comments and 2,402 of tests. Cost is in tokens, not money: 202.69 million tokens and 10 hours 27 minutes of agent time in 76 runs. Only 69 runs reported usage, so the totals are a floor and the page says so. Per measured run, Triage needs about 94 thousand tokens and Implement about 8.5 million.

### 24. Roadmap: where did the time go?

On screen: the roadmap tab of one real Project Health dashboard, without the project name, over the dimmed world. The composition holds the current subject.

Slide: An agent worked 4% of the time the Issues were open. The rest was waiting: for a person, for a merge, or for nobody.

Speaker notes: The Roadmap tab plans nothing. It reads the labels the workflows write, and it splits the open time of every Issue into five states: agent working, waiting on a person, a PR waiting to merge, queued with nobody on it, and work by hand. This month the Issues of this project were open 36 days and 6 hours in total. An agent worked 4% of that time. A third waited on a person, and almost another third waited for nobody. The agent is not the bottleneck. We are. Open the link: Issue 750 was estimated at sp-3, about three human days. It was open 34 hours, the agent worked 2 hours 32 minutes, and the gate merged it. The same Issue went through Triage, Refine, Implement and Merge Gate in the previous slides.

## The whole Platform system

Source: [reference](../knowledge/maturity.md).

### 25. From Issue to production with GitHub Agentic Workflows.

On screen: system, state 0. Panels name Triage, Refine · Implement, CI, Merge Gate, Production.

Slide: Product experts who do not code file small eligible Issues or bugs. They reach production without human supervision.

Speaker notes: Return to the person at the PC from the opening. The completed system now lets someone close to the product create a small eligible Issue or bug. That person does not need to code or supervise the agent. Trace their Issue through Triage, Refine, Implement, CI, Merge Gate, the application deployment, and Health. They define the intended behavior and answer product questions when needed. The system owns execution and its checks. This autonomy depends on the technical and agent base established in Foundations, with the Harness and workflow controls in place. Protected technical changes still need their owner. People with write access label an Issue straight into the route. Everyone else enters through Triage. Application deployment follows the project configuration. The manually dispatched package Release worker is a separate route. The five maturity forms remain in the field without claiming an assessment score. Health feeds evidence into the three earlier pillars. End on the product change in production and the measured improvement loop.

### 26. What exactly are software engineers supposed to do?

On screen: an attributed quote card over the dimmed world. The composition holds the current subject.

Slide: no caption. The names under the bodies carry the content.

Speaker notes: Ask the question and let it sit. If an Issue can reach production on its own, what is left for us? Answer with Uncle Bob Martin, on X on 5 October 2026: the job does not change. We still make sure the structure of the system is robust and maintainable, and that its behavior serves our users. That takes engineering discipline. It does not take reading every line of the code, just as using a compiler does not take reading the binary. That is what the whole talk built: conventions in Foundations, a Harness for the agents, workflows with gates, and Health to measure. Source: https://x.com/unclebobmartin/status/2107069060420637178
