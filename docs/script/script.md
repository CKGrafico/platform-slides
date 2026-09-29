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
| 2 | About me | 1 | needs content |
| 3 | The state of AI | 3 | draft |
| 4 | AI maturity levels | 2 | needs level descriptions |
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
- **On screen:** the title, the speaker's name, Plain Concepts. Nothing else.
- **Say:** nothing, or one sentence while people sit down.
- **Bridge:** the cover holds until the speaker starts.
- **Open:**
  - Keep "From issue to production with GitHub Agentic Workflows", or a shorter title? The title could also be a question.
  - Is the talk in Spanish, English, or both at different events? The web supports both.

## 2. About me

### 2.1 Who is speaking

- **Goal:** give the audience a reason to trust the speaker on this topic, in under a minute.
- **On screen:** to decide.
- **Say:** to decide.
- **Bridge:** from "who I am" to "where AI is today".
- **Open:**
  - Name, role, and team at Plain Concepts.
  - Two or three facts that make you credible on agents and platform work.
  - One human or funny detail, if you want one.
  - Does this beat mention the Platform team already, or keep it for part 7?

## 3. The state of AI

The source is the speaker's earlier slide "The Evolution of AI", with **Prompts** added between Copilots and Skills.

### 3.1 The timeline

- **Goal:** everyone in the room shares the same map of how we got here.
- **On screen:** a timeline that grows one step at a time.

| When | Step | Line |
|---|---|---|
| Late 2022 | Models | Conversational AI goes mainstream |
| Early 2023 | Copilots | AI enters everyday workflows |
| 2023 | **Prompts** (new) | to write |
| Early 2024 | Skills | Capabilities become reusable blocks |
| Mid 2024 | Agents | AI plans, uses tools, and acts |
| Late 2025 | Guardrails | Safety and reliability become essential |
| Early 2026 | Harnesses | Systems orchestrate models, tools, and memory |
| Mid 2026 | Loop engineering | Autonomous work becomes continuous |
| Mid 2026 | Autonomous loops | Loops coordinate and improve together |
| Future | ? | The next paradigm is still unknown |

- **Say:** a few words per step, not a lecture. The pace speeds up as the dates get closer together: four years at the start, a few months at the end.
- **Bridge:** to 3.2.
- **Open:**
  - The line for Prompts. A proposal: "Prompting becomes a craft."
  - The dates. "Skills, early 2024" can be challenged: reusable skills as we use them now (packaged instructions plus tools) are closer to late 2025. Do you want dates that are exact, or dates that tell the story? If they tell the story, say so on stage, or drop the dates and keep only the order.

### 3.2 What the timeline really shows

- **Goal:** the timeline is not a list of products. It shows one direction.
- **On screen:** the timeline stays. The steps group into two halves.
- **Say:** a proposal for the reading:
  - The first half (Models, Copilots, Prompts, Skills, Agents) is about **making the model more capable**.
  - The second half (Guardrails, Harnesses, Loop engineering, Autonomous loops) is about **building a system around the model**.
  - That second half is what this talk is about.
- **Bridge:** "Where are we in that system? Where is your team?"
- **Open:** do you agree with this two-halves reading? It sets up the thesis of the talk from the start: "we engineer a system where AI is one component" and "more autonomy needs better structure".

### 3.3 Where this talk sits

- **Goal:** point at the part of the timeline the talk will cover.
- **On screen:** Guardrails, Harnesses, and Loops light up. The rest dims.
- **Say:** "Today I am going to talk about this part: what it takes, in practice, to go from agents to loops that work on their own."
- **Bridge:** to maturity levels.
- **Open:** keep this beat, or merge it into 3.2?

## 4. AI maturity levels

The source is the speaker's "Five levels of AI maturity" (an inverted pyramid) from the SDLC maturity app. The app needs a login, so the level descriptions are not in this file yet.

### 4.1 The five levels

- **Goal:** give the audience a way to place their own team.
- **On screen:** five levels, from the bottom up.

| Level | Name | What it means |
|---|---|---|
| 1 | No AI | to write |
| 2 | Exploratory | to write |
| 3 | Structured | to write |
| 4 | Scaled | to write |
| 5 | Governed & Optimized | to write |

- **Say:** one sentence per level. Ask the room where they are, by a show of hands.
- **Bridge:** to 4.2.
- **Open:**
  - The description, signals, and examples for each level. Paste them from the app, or tell me what each level means.
  - Why an inverted pyramid? One reading: each level is wider because it covers more of the organisation. If that is the meaning, say it on stage.

### 4.2 The link between the two maps

- **Goal:** join the timeline and the maturity levels, so they are one idea and not two slides.
- **Say:** a proposal: most teams use tools from the second half of the timeline (agents) with the maturity of level 2 (exploratory). The gap between the two is where things break. The rest of the talk is the path we took to close that gap on a real team.
- **Bridge:** to part 5, the empty screen with one GitHub Action.
- **Open:** is Platform at level 5 today, or at level 4 on the way to 5? The claim must match what the metrics show.

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
