# Platform knowledge base

This file is the source of facts for the keynote. It summarizes five repositories and the site `platform.plainconcepts.com`, as researched on 2026-09-29. Each fact names the file it came from, relative to `C:\Projects\PlainConcepts\Platform\`.

Use these facts. Do not invent numbers. If a slide needs a number that is not here, read the source repo again and add it here first.

Before you use a fact on a slide, check the "Verify before you present" list at the end.

## The short version

Platform is a department at Plain Concepts. Its apps are maintained by AI agents, inside guardrails that make that safe. The method has three phases and four pillars.

The three phases differ in who is allowed to start a change:

1. **Discovery.** The departments and the engineers decide what to build: product, integrations, constraints. The output is a proposal, a design, decision records, and Given/When/Then specs.
2. **Foundations.** Engineers and agents build the app and its guardrails. The guardrails are the real deliverable. A guardrail is a constraint that fails the build, not a rule in a document.
3. **Maintenance mode.** Anyone in the business files a request. Agents implement, review, and merge it with no engineer in the loop.

Phase 2 exists to make phase 3 safe. The site cites the DORA 2025 finding that AI amplifies the practices a team already has. So a team cannot skip phase 2 and arrive at phase 3. (`Foundations/apps/docs/content/docs/how-we-work/index.mdx`)

The four pillars:

| Pillar | Role | Phase |
|---|---|---|
| Foundations | the theme, the conventions, the reference architecture, and the docs site | all three |
| agent-harness | installs the harness into a repo: skills, commands, an agent team, an OpenSpec workspace | 2 |
| agentic-workflows | the router and worker catalog that runs agents on GitHub events, plus its installer CLI | 2 and 3 |
| project-health | delivery and agent metrics, collected from GitHub and published as a site | 3 |

In one line: Foundations sets the conventions, agent-harness makes them usable by agents inside a repo, agentic-workflows runs the agents, and project-health measures the result. Removing any one pillar breaks the phase it carries. (`Foundations/apps/docs/app/(home)/page.tsx`)

## Vocabulary

| Term | Meaning |
|---|---|
| Guardrail | a constraint that fails the build. Examples: layering linters, spec checks in CI, test-quality grading, an audit trail, human checkpoints on auth, migrations, CI config, and tokens |
| Determinism ladder | seven rungs, from trigger to route classification, the `on.steps` gate, precompute steps, custom jobs, the agent, and safe outputs. The rule: the model is the last resort, not the engine |
| Outcomes vs means | the business may change outcomes (UX, workflows, wording, business rules). Engineering keeps the means (architecture, infra, auth, data models, APIs). The line is by category, not by size |
| Two intake doors | users with write access label an issue into the pipeline. Users with read access go through a triage agent |
| Router and worker | one router workflow owns every trigger and routes each event to at most one worker |
| Safe outputs | the agent runs read-only. Every write is a request that is validated against an allowlist, then applied by the framework |
| Label state machine | labels such as `refine`, `refined`, `implement`, `bot-working`, `review` move work between states |
| Merge belt | CI dispatches the merge gate when it finishes, with an hourly reconcile as the backstop |
| Green and dead | a run that reports success but did nothing |
| Harness | the files agents work from in a repo: slash commands, `pc-*` skills, an agent team, plugins, OpenSpec, `ARCHITECTURE.md`, `DESIGN.md` |
| Forge | the Plain Concepts model gateway at `forge.plainconcepts.com`. Models in use: GLM 5.2 and Quasar |
| OpenSpec | spec-driven change management: proposal, specs, tasks, then archive |

Taglines used by the site (short, reuse them freely): "The way Platform builds software", "the method written down", "The model is the last resort, not the engine", "Green and dead", "Facts before turns", "Profiles, not a grade", "A convention costs a paragraph", "Nobody publishes from a laptop". (`platform.plainconcepts.com`)

## Foundations

- **Repo:** `PlainConceptsPlatform/Foundations`. Homepage `https://platform.plainconcepts.com/`.
- **Purpose:** the thin shared layer that keeps many Platform apps consistent for developers and agents, without becoming an in-house framework. It says it is not a component library, an app framework, or a hand-maintained design system. (`Foundations/README.md`)
- **Packages:** `@plainconceptsplatform/ui-theme` (CSS tokens only, plus an `init` command) and `@plainconceptsplatform/ui-components` (`PlainLogo`, `DataTable`, `Changelog`, `AppSidebar`). `DataTable` and `AppSidebar` came from the Atlas app. (`Foundations/packages/*/package.json`, `packages/ui-components/CHANGELOG.md`)
- **Docs site:** Fumadocs on Next.js, 66 themed component pages, deployed to GitHub Pages. (`Foundations/.github/workflows/deploy.yml`)
- **Reference frontend:** Next.js App Router, strict TypeScript, shadcn/ui on Radix, Tailwind v4, inversify-hooks for DI, react-i18next ("zero magic strings"), Biome, Vitest and Playwright, pragmatic Feature-Sliced Design. (`Foundations/ai/ARCHITECTURE.md`)
- **Reference backend:** .NET with Clean Architecture, vertical slices and command/query separation, ErrorOr mapped to RFC 7807, EF Core, and Aspire AppHost as the only composition root. (`Foundations/ai/ARCHITECTURE.md`)
- **Restraint:** 2 packages, not 8. No Turborepo or Nx. A component is shared only after the same real need appears in several apps. (`Foundations/apps/docs/content/docs/principles.mdx`, `CONTRIBUTING.md`)
- **Release:** Changesets and npm publishing with provenance from CI. A token value change is a minor version, because it changes how every app looks. (`Foundations/apps/docs/content/docs/releases.mdx`)
- **Onboarding skill:** `platform-onboard` checks 6 domains in order (agentic infra, architecture docs, OpenSpec, frontend stack, agent automation, .NET guardrails) and opens one OpenSpec change for each failing domain. (`Foundations/skills/platform-onboard/SKILL.md`)

### Visual identity of the Platform

- One brand color, royal blue `#2f69ff`, on cool neutral greys. Dark mode background `#0d0e0f`.
- Status colors: red `#f33859`, amber `#fbc740`, teal `#3abaaf`, cyan `#00b5f1`. Five chart colors that clear 3:1 contrast in both modes.
- One typeface: Outfit, a geometric sans, bold for headings.
- No shadows anywhere, by construction. Elevation is a border plus a surface color. One radius, 0.375rem. Lucide line icons.
- Motion is 150 ms ease-out, only on state changes. WCAG 2.2 AA.
- Logo: two offset, overlapping square outlines in blue, with a wordmark.
- Tone: frank, engineering-first, candid about failures, no marketing language.

(`Foundations/ai/DESIGN.md`, `platform.plainconcepts.com/docs/tokens`)

The keynote may use or break from this identity. That is a design decision for later. The product UI rules (no motion beyond 150 ms) are for apps, not for this keynote.

## agent-harness

- **Repo:** `PlainConceptsPlatform/agent-harness`. Local folder `opencode-onboard`. MIT license. npm `@plainconceptsplatform/agent-harness`.
- **Problem:** most codebases have no `AGENTS.md`, no architecture doc an agent can read, and no defined way to pick up a task. So agents improvise and give a different answer every run. (`opencode-onboard/README.md`)
- **What it does:** one command, `npx @plainconceptsplatform/agent-harness@latest`, runs a 10-step wizard and installs the harness. `update` re-applies it with no questions and keeps hand edits.
- **Platforms:** backlog on GitHub, Azure DevOps, Jira, a browser tool, or none. Repository on GitHub, Azure DevOps, GitLab, or none. Mixed combinations work.
- **Agents:** two primaries a human picks, `plan` (the default, read-only) and `build`. Specialist `*-engineer` subagents run in parallel waves with a concurrency cap (consumers use 4).
- **Model tiers:** plan, build, and fast, chosen from more than 3000 models on models.dev.
- **Pipeline:** parse the work item, `/plan-propose` writes proposal, specs, and tasks, the user confirms, `/plan-apply` runs waves of engineers, verify (lint, typecheck, test, build), `/ops-ship` opens the PR. `/plan-goal` runs the whole chain unattended. (`opencode-onboard/skills/pc-plan-apply/SKILL.md`, `pc-plan-goal/SKILL.md`)
- **Size:** 22 slash commands and 29 skills. (`opencode-onboard/harness/.opencode/commands/`, `skills/`)
- **Differentiator: rules enforced in code.** The `pc-system-reminders` plugin denies about 12 unsafe actions at the tool call instead of asking the model to behave. Examples: `git add -A`, `git reset --hard`, `git push --force`, pushing the default branch, and fetching GitHub or Azure DevOps pages instead of using their CLIs. The comment in the plugin says prose is a weak enforcer when nobody is watching. (`opencode-onboard/harness/.opencode/plugins/pc-system-reminders.js`)
- **Pace:** 14 npm releases in 30 days, from 2.0.0 on 2026-08-21 to 2.9.0 on 2026-09-21. (npm registry)
- **Installed in:** Numa, Odyssey, Pliny-Bot, Lyceum, Agentic-Workflow-Dogfood, and loop-task. (`*/.opencode/harness.json`)
- **Dependency:** agentic-workflows requires it, because its workers call the `pc-*` skills. (`Agentic-Workflows/AGENTS.md`)

## agentic-workflows

- **Repo:** `PlainConceptsPlatform/agentic-workflows`. npm `@plainconceptsplatform/workflows`, 70 versions on npm in about a month. Installer: `npx @plainconceptsplatform/workflows`.
- **Purpose:** a Platform repo maintains itself on GitHub events. Issues are triaged, refined into sized stories, implemented as PRs, reviewed, merged by a risk gate, audited weekly, and released. No engineer is in the loop unless a worker asks for one. (`Agentic-Workflows/README.md`)
- **Built on:** GitHub Agentic Workflows (gh-aw), with OpenCode as the engine and Forge as the model gateway. A workflow is a markdown file. The frontmatter is the wiring and the body is the prompt.
- **One router:** `work-router.yml` owns every trigger. One event in, exactly one route out, and at most one worker call. An idle run costs about 10 seconds. The route classifier is a pure shell function. A 2,503-line route matrix tests the whole system. (`Agentic-Workflows/loops/workflows/work-router.yml`, `loops/actions/verify-route-matrix/`)

| Route | What the worker does |
|---|---|
| triage | for requests from outside the team: 10 checks over up to 3 rounds, then pass, ask for info, hand to a maintainer, or block |
| refine | writes a codebase-grounded story with a Fibonacci estimate. At 8 points or more it splits the story into at most 6 children |
| implement | one branch, one PR, then stops. It may not weaken tests or skip checks |
| merge-gate | computes risk from paths and diff size with no model, then the agent looks for defects. A validator decides auto-merge, human review, owner review, or blocked. It can fix red CI |
| apply-review | applies reviewer comments on bot PRs |
| audit | weekly and read-only: finds 5 to 7 problems and files one issue |
| release | the agent writes release notes. Version, tag, and release are deterministic |
| visual-verify | captures screenshots after an auto-merge. Never blocks the merge |

- **Safety:** agents run with read-only permissions. Every write goes through allowlisted safe outputs. Issue text is passed inside marked boundaries. In refine, only the author's answers count, so other commenters cannot steer the work. (`Foundations/apps/docs/content/docs/ai.mdx`, `maintenance.mdx`)
- **Housekeeping:** every 6 hours it retries stalled work, up to 3 times, and keeps one "Needs a human" issue with the gate's scoreboard: auto-merge share and later reverts.
- **Runners:** ephemeral Azure VM Scale Set runners, scaled by a small .NET 10 app from GitHub webhooks. Zero VMs at rest. At most 2 VMs, hard-coded. A pre-baked image cut VM create-to-ready from about 2.5 minutes to about 80 seconds. (`Agentic-Workflows/runners/README.md`)
- **Cost:** $0 at rest, about $10 to $25 per month normally, $187 per month worst case against a $200 budget. The only fixed cost is the AgentMemory server, about $13 per month. (`Agentic-Workflows/runners/README.md`, `runners/mcp.md`)
- **Publishing:** npm Trusted Publishing over OIDC. No npm token is stored. (`Agentic-Workflows/docs/release.md`)

### Lessons with numbers

- The README says 58 of 237 issues closed since 1 August were closed by the bot, with autonomy from 6% to 50% per repo. That range cannot be reproduced now: do not put it on a slide. The current figure is about 1 in 4 issues closed by the bot (19% to 40% per repo), and 82% of issues closed by a pull request were closed by one an agent wrote. See [our-numbers.md](our-numbers.md). The main problem was never bad decisions. It was silence: work that stopped and nobody noticed. (`Agentic-Workflows/README.md`)
- The first merge gate auto-merged 31% of terminal verdicts while it found zero defects. It was redesigned to decide on evidence. (`Agentic-Workflows/loops/workflows/agent-merge-gate.md`)
- The new owner-path rule, replayed on 18 gated PRs, caught exactly the 3 that needed an owner. The old rule caught none. (same file)
- One issue of 13,398 characters and 92 work units burned 17 minutes and 2.4M tokens twice, with no result. A size gate now refuses it in 10 seconds. (`Agentic-Workflows/loops/workflows/agent-refine.md`)
- Before host reuse, about 78% of billed VM time went to booting. (`Agentic-Workflows/runners/README.md`)

### What GitHub Agentic Workflows (gh-aw) says about itself

Source: the gh-aw documentation, `github.github.com/gh-aw` (home, architecture, safe outputs and threat detection pages), read on 2026-10-22. The site changed a lot, so use it for the "in 5 minutes" slide.

- A workflow is a Markdown file with frontmatter (when it runs, permissions, engine, safe outputs) and a prompt. `gh aw compile` turns it into a validated GitHub Actions YAML lock file with pinned actions. Engines include Copilot, Claude Code, Codex and OpenCode.
- It names the risk as private data, untrusted content and outbound access in one agent, and answers with six layers: compile-time validation (schema checks, expression allowlisting, pinned actions); a sandboxed agent (a container by default, read-only, with an optional microVM); credential isolation (an API proxy holds the tokens, so the agent never sees them); integrity filtering (untrusted GitHub content is filtered by author trust before the agent reads it); threat detection; and safe outputs.
- The agent job has read-only permissions. A network firewall (a Squid proxy with a domain allowlist, `network.allowed`) controls its outbound traffic.
- Safe outputs: the agent writes its intended actions as structured output, and separate jobs, each with its own scoped write permission, apply only what passes validation. Types include create-issue, create-pull-request, add-comment, add-labels and push-to-pull-request-branch. Each has a `max`, and `staged: true` previews without writing.
- Threat detection is on by default when safe outputs are configured. A separate job scans the proposed output for prompt injection, secret leaks and malicious patches before any write. Our workers set `threat-detection: false`.
- Cost controls: `max-turns`, `max-ai-credits` per run and `max-daily-ai-credits`. 1 AI credit is $0.01.
- Who owns what, from the presenter's review of the workflow files. gh-aw generates `pre_activation` (checks the actor's permissions, rung 2), `activation` (renders the prompt, applies the credit guardrail, rung 2), `agent` (checkout, then our `steps:`, then the model, rung 3 and 5), `detection` (off in every worker with `threat-detection: false`), `safe_outputs` (rung 6) and `conclusion` (its own reporting). We write these jobs: `still_open`, `eligibility`, `size_guard`, `refuse_big_issue`, `subject`, `protected_changes` (4b), `code_rules` (4c, runs the harness `check-diff.mjs`), `review_required`, `reserve`, `validate_output`, `conclude`, `incomplete`, and `empty_run` (audit only).
- Reserve is our job: it puts `bot-working` on the Issue, with `GITHUB_TOKEN` so the router does not start a second run, and removes `review` and `stalled`. Facts is not a job. It is the name the diagrams use for the `steps:` block of the frontmatter. The block is a gh-aw mechanism, the content is ours, and gh-aw runs it inside its own `agent` job before the model: it writes the Issue and comments, the diff, the failed CI logs, the review threads or the commit log to `/tmp/gh-aw/agent/`, so the model spends no turns on them.
- Merge Gate has `staged: true` on its safe outputs, so gh-aw writes nothing and our `conclude` applies the result with the App token, which makes CI run. Take care with the names: our `conclude` and gh-aw's `conclusion` are easy to mix up in logs and in `needs:`.
- The word "rung" in the official diagrams is a step on our determinism ladder: the lower the rung, the cheaper and more reproducible the step. Rung 5 is the agent.

## project-health and Project-Health-Platform

- **project-health** (`PlainConceptsPlatform/project-health`) is the reusable template. It collects DORA and agent metrics from the GitHub API, stores them as JSON, and publishes a static site. No database, no monitoring system, no service to run. Where GitHub cannot answer, the site says so instead of estimating. (`Project-Health/README.md`)
- **Project-Health-Platform** is the private instance. It owns the project list, config, and data. The code is copied from the template by a weekly sync PR. It is not a fork, because a fork of a public repo cannot be private, and delivery metrics name real people. (`Project-Health-Platform/README.md`)
- **DORA metrics:** it collects deployment frequency, change lead time, and deployment rework rate. It refuses to collect change fail rate and recovery time, because they need production incident facts that GitHub does not have.
- **Team profiles:** it places a project among the seven DORA 2025 profiles on throughput and stability only. Well-being is always "unknown", so it reports a set of candidates. It needs at least 5 releases in a 90-day window. (`Project-Health/config/dora.json`)
- **Honesty rules:** token totals are a floor ("measured N of M"). A missing value never sorts as zero. Partial months divide by elapsed days. Deployments are deduplicated by commit SHA. 140 agent runs that never ran an agent were removed from the count. (`Project-Health/README.md`, `collector/src/metrics/agents.ts`)
- **Measured projects:** 10, including Numa, Atlas, Capacity, Odyssey, Lyceum, and Pliny-Bot. (`Project-Health-Platform/projects.json`)

### Agent numbers (August to 22 September 2026)

From the Project-Health-Platform data snapshot of 2026-09-23 (`Project-Health-Platform/data/*/*.json`). Use aggregates only. The data files also hold contributor logins. Never put those on a slide.

| Figure | Value |
|---|---|
| Agent runs measured | 723 across 4 repos (Numa 279, Odyssey 218, Pliny-Bot 147, Lyceum 79) |
| Runs that succeeded | 506, about 70% |
| Tokens | about 2.09 billion (2.07B input, 15.1M output), a floor, since 500 runs reported usage |
| Agent execution time | about 107 hours |
| implement runs | 280 runs, 1.54B tokens, about 61.5 hours |
| merge-gate runs | 237 runs, 191 succeeded |
| refine runs | 125 runs, 176M tokens |
| triage runs | 36 runs, all succeeded |

Delivery examples:

- Numa, August: 11 production releases. Commit to production, median 51.3 hours. Issue to staging, median 8.8 hours.
- Numa, September (22 days): 10 releases, 3.16 per week. Issue to staging, median 6.6 hours.
- Atlas, July: 52 releases, 11.74 per week, lead time median 6.6 hours.

### Project Health in October 2026

Source: the Health docs on the site (`/docs/health`, `/docs/health/engineering`, `/docs/health/delivery`, `/docs/health/agentic`, `/docs/health/roadmap`), read on 2026-10-20.

- Health is the fourth pillar. It reads GitHub and changes nothing in the repos it measures. A project page has four tabs, and each answers one question:
  - **Engineering.** Are the gates that make autonomy safe in place, and do they pass?
  - **Delivery.** How often does it ship, how long does a change take, and how much is rework?
  - **Agentic.** Does the repo run agents the Platform way, on current versions, and how much of their work merges without a person?
  - **Roadmap.** Who had each Issue at each moment, and what waits on a person?
- The overview opens on Engineering, not on Delivery. When agents write most of the code, the first question is whether anything would stop a bad change.
- **Engineering scorecard.** Level L0 to L3, cumulative, and only green practices count. Score 0 to 100: green plus half of yellow, over the practices that apply. Gates: present over applicable. AI usage 1 to 5: the share of the month's default-branch commits made with an assistant or by an agent, in buckets at 10, 25, 50 and 75%.
- **Alert "High AI usage, low engineering".** It fires when AI usage is 4 or more and the level is L1 or below.
- **Comments and tests scan.** It runs daily on the default branch. Comment lines per code line have a ceiling of 10%, the one the harness sets. It also counts slop shapes and suspicious tests, such as a test with no assertion. These are the same shapes the harness `check-diff` gate refuses on a pull request.
- **Delivery.** It collects three of the five DORA metrics: deployment frequency, change lead time, and deployment rework rate. It refuses change fail rate and failed deployment recovery time. Change lead time (commit to production) and Issue to staging are shown apart and never mixed. The DORA team profiles panel was removed in October 2026.
- **Agentic.** It reads harness and workflow versions against npm, and which workers are installed. Bot PRs are split into three groups: merged by the gate, parked then merged by a person, and merged by a person. "Merged by the gate" is the closest single number to the autonomy that maintenance mode promises. Cost is in tokens, not money. Totals are a floor ("measured N of M").
- **Roadmap.** It splits each Issue's open time into five states, read from labels: agent working, waiting on a person, PR waiting to merge, queued with nobody on it, and by hand. In the docs' first real month, an agent was working 17% of the time Issues were open.
- **Site address.** The private site is on GitHub Pages at `probable-fiesta-2y6w5gw.pages.github.io`, and its address is `pulse.platform.plainconcepts.dev`. The keynote links to that address. It holds real project data, so it is private.

### One project, October 2026

From the Health dashboard of one consumer project, updated 2026-10-19 04:05 UTC, month to date. On slides, say "one project". Never show its name, or the People section with logins.

| Area | Figure | Value |
|---|---|---|
| Engineering | Level, score, gates | L3, 100, 10 of 10 applicable (Performance does not apply) |
| Engineering | AI usage | 4 of 5, 82 of 147 commits |
| Engineering | Comments per code line | 5.8%, 1,460 of 25,153 lines, 0 slop shapes |
| Engineering | Coverage, mutation | 81.2% lines, 82.2% mutation score |
| Delivery | Deployment frequency | 2.31 per week, 6 releases, median gap 28.1 h |
| Delivery | Change lead time | p50 6.2 h, p75 2 d, p90 5 d, 70 commits |
| Delivery | Issue to staging | p50 2 d, p75 3 d, p90 4 d, 8 Issues |
| Delivery | Rework rate | 0% of 6, marked by the bug label |
| Agentic | Tooling | Standard, up to date: agent-harness 3.4.0, agentic-workflows 1.6.23, 7 workers |
| Agentic | Bot PRs merged | 9 this month: 5 by the gate (55.6%), 1 parked for a person, 3 by hand |
| Agentic | What those PRs added | +547 code, +69 comment (12.6%), +2,402 test |
| Agentic | Agent runs | 76, 69 measured, 202.69M tokens, 10 h 27 m agent time |
| Agentic | Tokens per measured run | triage 93.7K, apply-review 1.14M, refine 1.66M, merge-gate 1.94M, audit 2.38M, implement 8.49M |
| Roadmap | Issues closed | 26, opened to merged median 22 h 3 m |
| Roadmap | Where the open time went (36 d 6 h) | agent working 4% (30 h 33 m), waiting on a person 32%, queued with nobody 31%, PR waiting to merge 17%, by hand 16% |
| Roadmap | Issue #750 | sp-3 (about 3 human days), open 34 h 20 m, agent 2 h 32 m, auto-merged by the gate |

The site `platform.plainconcepts.com/docs/analytics` also reports that one project's month went from 23 to 52 measured runs after a fix in how runs are found, and agent time from 4h 20m to 7h 31m.

## The site: platform.plainconcepts.com

- It is a documentation site called Platform Foundations (v1.3.2), not a product or marketing site. There is no pricing, blog, or case study page.
- Sections: How we work (the three phases), Domains (Frontend, Backend, AI x SDLC), Library (Tokens, Components), Reference (Architecture, Design guidelines, AI agents), Project (Principles, Contributing, Releases).
- The two home page calls to action are "How we work" and "Start a project".
- It says the method is public so that the claim "agents merge with no engineer involved" can be checked, not taken on faith.
- The home page demo dashboard (24 apps, 6 teams) is a theme showcase with illustrative data. Do not present those numbers as real.
- **loop-task** runs the same kind of agent work on a schedule, for repos without GitHub Actions.

## How the pieces connect

```
Foundations ── conventions, theme, docs ──────────────┐
      │                                                │ UI packages
      ▼                                                ▼
agent-harness ── installs skills and agents ──► each app repo ◄── project-health
      │                                                ▲           measures it
      │ workers call the pc-* skills                   │
      ▼                                                │
agentic-workflows ── router + workers on events ───────┘
      │
      └── runs on Azure VMSS runners, models through Forge
```

## Verify before you present

These points were unclear or contradictory on 2026-09-29. Check each one with the owner before it goes on a slide:

1. **Visibility.** The docs say the repos are public, and each repo's first commit is "Make the project public". But `gh` reported Foundations, agent-harness, project-health, and Project-Health-Platform as private, and agentic-workflows as internal. The npm packages are public.
2. **Consumer names in public places.** The agentic-workflows code comments name consumer repos. Decide which project names may appear on public slides.
3. **Visual checks and staged mode.** The older visual evidence step was removed from the agent path on 2026-08-26. The `visual-verify` route is a separate, later worker (added around 2026-09-17). Foundations still has a stale `visual-evidence.yml`. The site also still lists "staged approval", and staged mode was removed. Confirm what is current.
4. **Deploy target of the docs site.** `Foundations/ai/ARCHITECTURE.md` says Azure App Service with Entra ID login. `deploy.yml` deploys to GitHub Pages, and the site is public.
5. **Numbers age fast.** Agent and delivery figures come from snapshots of late September 2026. The Health slides use one project's dashboard of 2026-10-19. Refresh them before the talk.
6. **Platform domains.** The private Health dashboard, the instance with real project data (Project-Health-Platform), is `pulse.platform.plainconcepts.dev`. `health.platform.plainconcepts.dev` is for the public project-health template, which has demo data only. The same pattern gives `harness.platform.plainconcepts.dev` (agent-harness) and `workflows.platform.plainconcepts.dev` (agentic-workflows). Foundations is on `platform.plainconcepts.dev`. The older `platform.plainconcepts.com` is the address the research and the screen captures used. The Health slides link to `pulse.platform.plainconcepts.dev`. On 2026-10-22 none of the new domains resolved yet, so check that the Health link opens before the talk. The harness and workflows slides have no link yet.
