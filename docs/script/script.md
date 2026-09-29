# Talk script

The script comes before the web. We work the content here first, beat by beat. Only when a part is solid does it become scenes in `src/show/`.

Status: **draft 1**, started 2026-09-29. Parts 1 to 4 are new. Part 5 onward comes from [talk-notes.md](../knowledge/talk-notes.md) and still needs work.

Working title: **From issue to production with GitHub Agentic Workflows**

## How to read this file

Each beat has the same fields:

- **Goal:** what the audience must take away.
- **On screen:** what they see. Content only, not final design.
- **Say:** the key points the speaker makes. Not a word-for-word text.
- **Bridge:** how this beat leads to the next.
- **Open:** questions to answer before the beat is done.

## Outline

| # | Part | Beats | Status |
|---|---|---|---|
| 1 | Cover | 1 | draft |
| 2 | About me | 1 | draft |
| 3 | The state of AI | 3 | draft |
| 4 | AI maturity levels | 2 | draft |
| 5 | From GitHub Actions to Agentic Workflows | 6 | from notes |
| 6 | The problems | 3 | from notes |
| 7 | The change of mind and the real case | 3 | from notes |
| 8 | Our runtime | 3 | from notes |
| 9 | Pillar 1: Agent Harness | 5 | draft |
| 10 | Pillar 2: Agentic Workflows | 7 | draft |
| 11 | Pillar 3: Foundations | 5 | draft |
| 12 | Pillar 4: Project Health | 4 | draft |
| 13 | From issue to production | 1 | draft |
| 14 | Closing | 1 | draft |

---

## 1. Cover

### 1.1 Title

- **Goal:** set the promise of the talk in one line.
- **On screen:** the title, "Quique Fdez Guerra", Plain Concepts. The language buttons (English, Español) sit in a corner while the room fills. They disappear on the first key press.
- **Say:** nothing, or one sentence while people sit down.
- **Bridge:** the cover holds until the speaker starts.
- **Open:** keep "From issue to production with GitHub Agentic Workflows", or a shorter title? The first known venue is NetCoreConf.

## 2. About me

### 2.1 Who is speaking

- **Goal:** give the audience a reason to trust the speaker on this topic, in under a minute.
- **On screen:** name and role, then a few facts that appear one by one.
- **Say:**
  - Quique Fdez Guerra, Director of Engineering and Operations at Plain Concepts, in Barcelona.
  - Works on helping technical organisations scale with AI and autonomous systems.
  - More than ten years on stage: NetCoreConf, DotNetSpain, Vue.js Amsterdam, Google DevFest, Agent Conf 2026 in Warsaw, and local meetups.
  - Google Developer Expert in Web Technologies from 2019 to 2023.
  - Today: agentic workflows and loop engineering in real teams.
- **Bridge:** from "who I am" to "where AI is today".
- **Open:**
  - Which two or three facts to keep. Too many facts slow the start.
  - One human or funny detail, if you want one.
  - Mention the Platform team here, or keep it for part 7?

## 3. The state of AI

The source is the speaker's earlier slide "The Evolution of AI", with **Prompts** added between Copilots and Skills. The screen shows no dates. The order tells the story, and exact dates would only start a debate.

### 3.1 The timeline

- **Goal:** everyone in the room shares the same map of how we got here.
- **On screen:** a line that grows one step at a time.

| # | Step | Line |
|---|---|---|
| 1 | Models | Conversational AI goes mainstream |
| 2 | Copilots | AI enters everyday workflows |
| 3 | **Prompts** (new) | Prompting becomes a craft |
| 4 | Skills | Capabilities become reusable blocks |
| 5 | Agents | AI plans, uses tools, and acts |
| 6 | Guardrails | Safety and reliability become essential |
| 7 | Harnesses | Systems orchestrate models, tools, and memory |
| 8 | Loop engineering | Autonomous work becomes continuous |
| 9 | Autonomous loops | Loops coordinate and improve together |
| 10 | ? | The next paradigm is still unknown |

- **Say:** a few words per step, not a lecture. The steps come faster and faster, the way they did in real life: years at the start, months at the end.
- **Bridge:** to 3.2.
- **Open:** the Spanish lines must take the same space as the English ones. Write both together when the text is final.

### 3.2 What the timeline really shows

- **Goal:** the timeline is not a list of products. It shows one direction.
- **On screen:** the line stays. The steps split into two halves.
- **Say:**
  - The first half, from Models to Agents, is about **making the model more capable**.
  - The second half, from Guardrails to Autonomous loops, is about **building a system around the model**.
  - That second half is what this talk is about.
- **Bridge:** "Where are we in that system? Where is your team?"
- **Open:** agree with this two-halves reading? It sets up the thesis early: "we engineer a system where AI is one component" and "more autonomy needs better structure".

### 3.3 Where this talk sits

- **Goal:** point at the part of the line the talk covers.
- **On screen:** Guardrails, Harnesses, and the two loop steps light up. The rest dims.
- **Say:** "Today I talk about this part: what it takes, in practice, to go from agents to loops that work on their own."
- **Bridge:** to maturity levels.
- **Open:** keep this beat, or merge it into 3.2?

## 4. AI maturity levels

The source is the speaker's "Five levels of AI maturity" from the Plain Concepts SDLC maturity app. The levels are an inverted pyramid: level 1 at the narrow bottom, level 5 at the wide top.

### 4.1 The five levels

- **Goal:** give the audience a way to place their own team.
- **On screen:** the pyramid builds from the bottom up, one level per step. Each level shows its name and one line. The full characteristics are too much text for a screen. Keep them for the speaker.

| Level | Name | One line on screen | What the speaker can add |
|---|---|---|---|
| 1 | No AI | No AI in the workflow yet | Everything is manual. The team may know the tools but does not use them. Risk: falling behind. |
| 2 | Exploratory | Individual, informal use | People use AI on their own, with no standards and no visibility. Risk: shadow AI, IP exposure, quality that depends on who prompts. |
| 3 | Structured | First rules and approved tools | Guidelines and review standards exist, with some logging. Risk: rules on paper, applied differently by each team. |
| 4 | Scaled | Consistent practice, measured | Same standards across teams, metrics for adoption, quality, and risk, AI in onboarding. Risk: metrics that count activity, not quality. |
| 5 | Governed & Optimized | A managed engineering capability | Governance inside the workflows, automated quality checks, improvement driven by measured outcomes, clear ownership. Risk: governance slows teams, or complacency. |

- **Say:** one sentence per level. Ask the room where they are, with a show of hands. Most rooms answer 2 or 3.
- **Bridge:** to 4.2.
- **Open:**
  - The app says "within the account vertical". On a public stage, say "across the organisation" or "across teams".
  - Why an inverted pyramid? One reading: each level covers more of the organisation, so it gets wider. Say it on stage if that is the meaning.

### 4.2 Level 5 is the map of this talk

- **Goal:** join the timeline and the maturity levels into one idea, and turn level 5 into the plan for the rest of the talk.
- **On screen:** the four characteristics of level 5 separate from the pyramid and stay on screen as four empty slots.
- **Say:**
  - Most teams use tools from the second half of the timeline, such as agents, with the maturity of level 2. That gap is where things break.
  - Level 5 has four characteristics. Each one is something we had to build:

| Level 5 characteristic | What we built | Part of the talk |
|---|---|---|
| Governance integrated into engineering workflows | rules and skills every agent runs inside, and one method for how we work | Agent Harness, Foundations |
| Automated compliance and quality checks for AI output | hard guardrails in CI, deterministic steps outside the agent, a merge gate that decides on evidence | Foundations, Agentic Workflows |
| Continuous improvement driven by measured outcomes | delivery and agent metrics from GitHub | Project Health |
| A managed capability with clear ownership | the Platform team runs it as a product | part 7 |

  - "The rest of this talk is how a team of fewer than three people got there."
- **Bridge:** to part 5, the empty screen with one GitHub Action.
- **Open:**
  - Can we say Platform is at level 5? The metrics support "on the way": about 70% of agent runs succeed, and bot autonomy is between 6% and 50% per repo. A safer line: "Platform works with level 5 practices, and measures how far it still has to go."

## 5. From GitHub Actions to Agentic Workflows

From the notes, sections 2 to 7. Beats to review:

- **5.1 One GitHub Action.** An almost empty screen. Events, runners, and what a workflow can run. GitHub is already a strong automation system before any AI.
- **5.2 Agentic Workflows appear.** From "when X, run Y, then Z" to an intent that an agent reasons about.
- **5.3 A workflow is Markdown.** `workflow.yml`, then `workflow.md`. Configuration, traditional actions, agent instructions, and tools in one file.
- **5.4 Compilation.** The Markdown compiles to YAML and adds security, telemetry, and runtime pieces.
- **5.5 Our changes after compilation.** Short. It introduces an idea that returns: we adapt the system to our environment.
- **5.6 The first full scenario.** CI/CD, triage, and implementation. "We could stop here." This is where the real story starts.

## 6. The problems

From the notes, sections 8 to 10.

- **6.1 AI is not deterministic.** The same prompt does not give the same result. An agentic workflow is not a reliable process.
- **6.2 The cost of agents.** Intelligence spent on work that needs none. Tokens, time, money, surprises.
- **6.3 Human in the loop.** Our first, conservative answer: a human approves before production.

## 7. The change of mind and the real case

From the notes, sections 11 to 17.

- **7.1 The change of mind.** An app in production whose code we had not fully reviewed. The result was surprisingly good. The question changes to: what would have to be true for this to work without humans on the normal path?
- **7.2 The Platform team as the client.** Fewer than three people, more than ten apps.
- **7.3 The goal in four words.** Agentic, autonomous, asynchronous, in the cloud. One short beat per word.

## 8. Our runtime

From the notes, sections 18 to 22.

- **8.1 Adapting Agentic Workflows.** The right controls for our context, not every generic one.
- **8.2 OpenCode as the one runtime.**
- **8.3 Forge as the AI gateway, with one key per project.**

## The four pillars

The four pillars are the four Platform repositories. Each one carries a part of the system:

| # | Pillar | What it is, in one line |
|---|---|---|
| 1 | **Agent Harness** | how an agent works inside a repo: rules, skills, commands, an agent team. The same locally and in the cloud |
| 2 | **Agentic Workflows** | how work runs on its own: one router, deterministic steps outside the agent, and the agent only where it must reason |
| 3 | **Foundations** | the way of working under all of it: a clear method for the use case, a clear stack, linting, testing, and hard guardrails |
| 4 | **Project Health** | how we know it works: delivery and agent metrics, measured honestly |

The earlier idea "deterministic vs agentic" is not a pillar of its own. It lives inside pillar 2.

**Why this order.** It follows the life of one change. First, how the agent thinks inside a repo (Harness). Then, how the work runs on its own (Agentic Workflows). Then, what stops a bad change before production (Foundations). Last, how we know the whole thing works (Project Health). Measurement last also closes the loop: it is the "continuous improvement driven by measured outcomes" of maturity level 5, and it leads straight into the final path from issue to production.

## 9. Pillar 1: Agent Harness

From the notes, sections 23 to 29, and `agent-harness` in [platform.md](../knowledge/platform.md).

- **9.1 The problem.** Even with a controlled runtime, the agent behaves differently in each repo. Most repos have no `AGENTS.md`, no architecture an agent can read, and no defined way to pick up a task. So agents improvise.
- **9.2 What the Harness holds.** Rules, conventions, architecture, skills (which to use and which not to use), commands, an agent team, how to test, how to make PRs, how to deploy. It installs with one command and updates without losing local edits.
- **9.3 Reduce the decision space.** "Solve this issue" against "Solve this issue, and here is how this project works."
- **9.4 Rules in code, not in prose.** About 12 unsafe actions are blocked at the tool call, such as `git push --force` or pushing to the default branch. The plugin's reasoning: prose is a weak enforcer when nobody is watching.
- **9.5 The same Harness locally and in the cloud.** The developer's OpenCode and the cloud job's OpenCode read the same Harness. Key line candidate: "We cannot make an agent deterministic, but we can make each run look much more like the last one."
- **Open:** keep 9.4? It is a strong fact, but it overlaps with Foundations (hard guardrails). One option: show it here as a teaser, and pay it off in pillar 4.

## 10. Pillar 2: Agentic Workflows

From the notes, sections 30 to 39, and `agentic-workflows` in [platform.md](../knowledge/platform.md).

- **10.1 Two kinds of work.** What needs intelligence (understand, decide, implement, reason about failures) and what does not (labels, assignment, fixed comments, status).
- **10.2 Pulling pieces out of the agent.** The huge AGENT box loses labels, assignment, and comments one by one, until only reasoning is left. A strong visual moment.
- **10.3 Back to GitHub Actions.** The circle closes: the talk started with GitHub Actions and comes back to it. The hybrid workflow alternates deterministic steps and agent steps. Fewer tokens, fewer errors, fewer humans.
- **10.4 One router.** One event in, exactly one route out, at most one worker. An idle run costs about 10 seconds. The site calls it the determinism ladder: "The model is the last resort, not the engine."
- **10.5 The agent cannot write.** It runs read-only. Every write is a request, checked against an allowlist, and applied by the framework.
- **10.6 The pipeline.** Triage, refine, implement, merge gate, release, plus a weekly audit and housekeeping. The merge gate decides on evidence. Its first version auto-merged 31% of verdicts while it found zero defects, so it was redesigned.
- **10.7 Silence was the real problem.** Not bad decisions: work that stopped and nobody noticed. Housekeeping retries stalled work and keeps one "Needs a human" issue.
- **Decided:** 10.2, 10.3, 10.4, and 10.6 are on-screen beats. 10.1, 10.5, and 10.7 are spoken only, inside the beats around them.

## 11. Pillar 3: Foundations

From `Foundations` in [platform.md](../knowledge/platform.md) and the site "How we work".

- **11.1 Agents amplify what a team already has.** The DORA 2025 finding. Good practice gets faster, bad practice gets faster too. So the method comes before the agents.
- **11.2 A clear method for the use case.** Three phases, split by who is allowed to start a change: discovery (decide what to build), foundations (build the app and its guardrails), maintenance mode (anyone in the business files a request, agents do the rest). Outcomes belong to the business, means belong to engineering.
- **11.3 A clear stack.** One reference architecture for frontend and backend, one theme, few shared packages. Agents do better when there is one obvious way to do each thing.
- **11.4 Hard guardrails.** A guardrail is a constraint that fails the build, not a rule in a document: linting, layering checks, tests, spec checks, human checkpoints on auth, migrations, CI config, and tokens.
- **11.5 You cannot skip to autonomy.** Phase 2 exists to make phase 3 safe.
- **Decided:** no wordplay on "Foundations" as both the pillar and phase 2 of the method. Name the three phases once, in 11.2, and move on.

## 12. Pillar 4: Project Health

From `project-health` in [platform.md](../knowledge/platform.md).

- **12.1 Autonomy you cannot measure is only a claim.** If no human reviews every change, the system needs another way to know that it works.
- **12.2 What it measures.** DORA delivery metrics from GitHub, plus agent runs, tokens, and time. No database and no service to run: JSON and a static site.
- **12.3 Honest numbers.** It collects 3 of the 5 DORA metrics and refuses to fake the other 2. Tokens are shown as a floor. A missing value never counts as zero. It removed 140 "agent runs" that never ran an agent. Site line: "a missing metric is a fact about the data".
- **12.4 What it shows today.** Our percentages next to the industry's: agent run success, the share of issues the bot closes, lead times. No project names and no exact counts. The numbers are being prepared.
- **Open:** which three numbers go on screen. Refresh them the week before the talk.

## 13. From issue to production

- **Goal:** one issue travels the whole system, and each pillar lights up as it takes part.
- **On screen:** the full system from the previous parts, with one issue moving through it.
- **Say:** a proposal for the path:
  1. Someone in the business files an issue. They have never opened the repo.
  2. Triage checks it. Refine turns it into a sized story. (Agentic Workflows)
  3. The implement worker opens OpenCode with the Harness and makes one PR. (Agent Harness)
  4. CI runs the linting, tests, and guardrails. (Foundations)
  5. The merge gate decides on evidence and merges. (Agentic Workflows)
  6. It reaches production. Project Health counts it. (Project Health)
- **Bridge:** to the closing.
- **Decided:** use a real issue with its real times, but show no project or repo names. Label it "a real issue from one of our apps".
- **Open:** pick the issue.

## 14. Closing

- **Goal:** the thesis, in one or two lines the audience remembers.
- **Say:** candidates from the notes:
  - "GitHub Agentic Workflows is the entry point, not the whole solution. The solution is the system around it."
  - "We engineer a system where AI is one component."
  - "More autonomy does not need less structure. It needs better structure."
  - "The model can change. The provider can change. The system around them stays."
- **On screen:** back to the title. Back to the timeline and its "?". Back to level 5, now with its four slots filled by the four pillars.
- **Open:** which single line closes the talk.

## Numbers we can use

Rules for numbers on stage:

- No project names, repo names, or people. Say "our apps" or "one of our apps".
- Prefer percentages, medians, and ratios over exact counts. Exact counts age fast and invite debate.
- Show each of our numbers next to a public number from the industry, with its source, so the audience can compare.

From [platform.md](../knowledge/platform.md). Check the "Verify before you present" list there first. The anonymised percentages and the public comparisons are in progress.

- 58 of 237 issues closed by the bot since 1 August, across four repos.
- 723 agent runs measured in August and September, about 70% succeeded.
- The merge gate auto-merged 31% of verdicts while it found zero defects, so it was redesigned.
- One oversized issue burned 2.4M tokens twice with no result. A size gate now refuses it in 10 seconds.
- The runner fleet costs about $10 to $25 per month, $0 at rest.

## Decisions log

| Date | Decision |
|---|---|
| 2026-09-29 | Script before web. Content first. |
| 2026-09-29 | Structure starts with cover, about me, state of AI, maturity levels. |
| 2026-09-29 | Prompts added to the AI timeline between Copilots and Skills. |
| 2026-09-29 | No dates on the AI timeline. The order tells the story. |
| 2026-09-29 | The four pillars are the four repos: Agent Harness, Agentic Workflows, Project Health, Foundations. "Deterministic vs agentic" lives inside Agentic Workflows. |
| 2026-09-29 | Pillar order: Agent Harness, Agentic Workflows, Foundations, Project Health. It follows the life of one change. |
| 2026-09-29 | Numbers on stage: no project names, percentages over exact counts, each one next to a public industry figure. |
| 2026-09-29 | The web runs in English and Spanish. Language buttons on the start screen, and the L key at any time. Both languages take the same space. |
