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
| 9 | Pillar 1: Harness | 3 | from notes |
| 10 | Pillar 2: Deterministic vs agentic | 3 | from notes |
| 11 | Pillar 3 | ? | missing |
| 12 | Pillar 4 | ? | missing |
| 13 | From issue to production | ? | missing |
| 14 | Closing | ? | missing |

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
| Governance integrated into engineering workflows | the Harness: rules, skills, and conventions that every agent runs inside | Pillar 1 |
| Automated compliance and quality checks for AI output | deterministic steps outside the agent, CI, and a merge gate that decides on evidence | Pillar 2, and probably pillar 3 |
| Continuous improvement driven by measured outcomes | Project Health: delivery and agent metrics from GitHub | probably pillar 4 |
| A managed capability with clear ownership | the Platform team runs it as a product | part 7 |

  - "The rest of this talk is how a team of fewer than three people got there."
- **Bridge:** to part 5, the empty screen with one GitHub Action.
- **Open:**
  - Does this mapping match how you see pillars 3 and 4? It would answer the question of the two missing pillars.
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

## 9. Pillar 1: Harness

From the notes, sections 23 to 29.

- **9.1 What the Harness is and what it holds.**
- **9.2 Reduce the decision space.** "Solve this issue" against "Solve this issue, and here is how this project works."
- **9.3 The same Harness locally and in the cloud.** Key line candidate: "We cannot make an agent deterministic, but we can make each run look much more like the last one."

## 10. Pillar 2: Deterministic vs agentic

From the notes, sections 30 to 39.

- **10.1 Two kinds of work.** What needs intelligence and what does not.
- **10.2 Pulling pieces out of the agent.** The huge AGENT box loses labels, assignment, and comments one by one. A strong visual moment.
- **10.3 Back to GitHub Actions.** The circle closes. The hybrid workflow. Fewer tokens, fewer errors, fewer humans.

## 11 to 14. Missing

- **Pillar 3** and **Pillar 4**: to define.
- **From issue to production:** the full path, end to end.
- **Closing:** back to the title, and the thesis: GitHub Agentic Workflows is the entry point, not the whole solution. The solution is the system built around it.

## Numbers we can use

From [platform.md](../knowledge/platform.md). Check the "Verify before you present" list there first.

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
| 2026-09-29 | The web runs in English and Spanish. Language buttons on the start screen, and the L key at any time. Both languages take the same space. |
