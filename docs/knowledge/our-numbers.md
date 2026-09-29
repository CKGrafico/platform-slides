# Our numbers (anonymised)

Aggregate numbers from the Project Health data and the GitHub API, prepared on 2026-09-29 for public slides. No project names, repo names, or people. Say "our apps" or "one of our apps".

Delivery data starts in July 2026. Agent runs can only be measured from 10 August 2026, so every agent number covers about seven weeks (10 August to 29 September 2026). "Agent repos" means the four repos where the router really ran agents. The comparison group is three production repos without agents.

Refresh these numbers the week before the talk.

## Safe for a slide

| Claim | Value | Basis | Confidence |
|---|---|---|---|
| Agent runs measured | about 1,070 runs, about 196 agent hours | 4 repos, 10 Aug to 29 Sep | solid |
| Workflow runs that succeeded | **71%** | same | solid |
| Runs where the agent step itself finished cleanly | **about 80%** | 491 runs with job details | solid |
| Issues closed by the bot itself | **about 1 in 4 (25%)**, per repo 19% to 40% | 368 closed issues, 1 Aug to 29 Sep | solid |
| Issues closed by a pull request that an agent wrote | **82%** | 157 issues closed by a pull request | solid |
| Merged agent pull requests that the bot merged with no human | **about 52%** | 196 merged agent pull requests, Jul to Sep | solid |
| Merge gate verdict: auto-merge | **about 51%** | 61 gated pull requests, 6 to 28 Sep | small sample |
| Merge gate verdict: sent to a human or a code owner | **about 30%** | same | small sample |
| Agent pull request, open to merged | **30 min** when the bot merges, **4.8 h** when a human merges (p90: 3.5 h vs 32 h) | 58 vs 83 pull requests, Aug to Sep | solid |
| Issue created to on staging, agent repos | **p50 12 h**, p90 about 4 days | 172 issues, Aug to Sep | solid |
| Merged pull requests later reverted | **0** | Jul to Sep, 4 repos. Only pull requests titled "Revert" are counted | solid, short window |

## By agent kind

| Kind | Runs | Success | Median minutes | Median tokens per run |
|---|---|---|---|---|
| implement | 400 | 68% | 11.8 | 6.8M |
| merge-gate | 377 | 72% | 3.9 | 0.5M |
| refine | 190 | 73% | 6.8 | 1.6M |
| triage | 54 | 93% | 2.2 | 0.17M |
| audit | 17 | 71% | 5.2 | 3.3M |
| apply-review | 11 | 36% | 7.2 | 9.5M |

Tokens come from the 73% of sampled runs that reported usage, so treat them as a floor. About 99% of tokens are input tokens.

## Useful for the story

- **The approval step:** after refinement, implementation started on its own in 120 of 127 issues. In the other 7, a person approved it (median wait 14 h, small sample).
- **Bot steps are fast:** from the `refine` label to a refined story, p50 30 min. From the `implement` label to an agent pull request, p50 1.1 h.
- **The merge gate fixes before it decides:** on its first verdict, about a third of agent pull requests needed the gate to push a CI fix before any decision.

## Do not claim

- **"6% to 50%" autonomy.** This range came from the agentic-workflows README on 9 Sep. It cannot be reproduced now, and the 50% came from a repo with only 4 closed issues. Use "about 1 in 4 issues closed by the bot" or "82% of issues closed by an agent pull request" instead.
- **That agents made teams faster.** No repo has production data from before its agents started, so there is no before and after.
- **A trend.** Success was 71% in August and 71% in September. Weekly values move between 59% and 83% with no clear direction.
- **The rework rate.** It uses the broad `bug` label and the platform itself flags it as too broad for stability.

## Comparisons with public numbers

See [benchmarks.md](benchmarks.md) for sources. The public numbers come from pull requests that a human reviewed and merged, so say out loud that they are not measured the same way as ours.

| Our number | Public number |
|---|---|
| about 52% of merged agent pull requests merged by the bot, no human | agent pull request merge rates of 38% to 83% on GitHub, where a human merges every one |
| 71% of agent runs succeed, about 80% at the agent step | dotnet/runtime: 68% of Copilot agent pull requests merged, about half needed human commits |
| bot merge 30 min vs human merge 4.8 h | dotnet/runtime median time to merge: 2 days |
| issue to staging p50 12 h | DORA 2025: 43.5% of respondents need more than a week for lead time |
