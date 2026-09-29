# Public benchmarks to compare against

Public numbers (2024 to 2026) to put next to our own on stage. Researched on 2026-09-29. Several come from secondary sources. Before the talk, check these against the original PDFs: the DORA 2025 buckets, the DORA 2024 table, the Faros 2026 figures, the Artificial Analysis costs, the Stack Overflow agent split, and the Google 75%.

## The best twelve

| # | Metric | Public figure | Source | Solidity |
|---|---|---|---|---|
| 1 | Merge rate of agent PRs, all repos | Codex 65.3%, Claude Code 52.5%, Cursor 51.4%, Devin 48.9%, Copilot 38.2%. Human PRs 76.8% | Li, Zhang, Hassan, arXiv 2507.15003 (Jul 2025). 456,535 agent PRs, 61K repos | preprint, large dataset |
| 2 | Merge rate of agent PRs, repos with 100+ stars | 71.5% overall (Codex 82.6%, Copilot 43.0%) | Ehsani et al., arXiv 2601.15195, MSR '26. 33,596 PRs | peer-reviewed |
| 3 | Copilot coding agent in one large, strict repo | 67.9% merged in dotnet/runtime, up from 41.7% to about 71%. Humans there: 87.1% (Microsoft staff), 79.7% (community) | Stephen Toub, .NET Blog (23 Mar 2026). 878 PRs, May 2025 to Mar 2026 | vendor, published in detail |
| 4 | Merged agent PRs that needed human changes | about 52% had human commits pushed. 29.9% merged with no iteration. Median time to merge 2 days. Reverts 0.6% vs 0.8% for everyone else | same .NET post | vendor |
| 5 | Claude Code PRs, human-driven | 83.8% merged, 54.9% of those with no further changes | Watanabe et al., arXiv 2509.14745, ACM TOSEM. 567 PRs, 157 projects | peer-reviewed |
| 6 | Developer AI adoption | 90% use AI at work, median 2 hours a day | DORA 2025. About 5,000 people | survey, strong method |
| 7 | Trust in AI output | DORA: 24% trust it a lot, 30% little or not at all. Stack Overflow: 33% trust accuracy, 46% distrust, 3% highly trust | DORA 2025. Stack Overflow Survey 2025 (49,000+) | survey |
| 8 | AI and delivery | 2024: +25% AI adoption goes with −1.5% throughput and −7.2% stability. 2025: throughput now positive, instability still worse | DORA 2024 and 2025 | survey, correlation |
| 9 | Lead time for changes | 2025: under 1 hour 9.4%, 1 hour to 1 day about 15%, 1 day to 1 week 31.9%, over 1 week 43.5%. 2024 elite: under 1 day | DORA 2025 (via RDEL newsletter), DORA 2024 | self-reported. Check the PDF |
| 10 | Deployment frequency | 2025: on demand 16.2%, daily to weekly 21.9%, less than monthly 23.9% | same | self-reported. Check the PDF |
| 11 | Benchmarks vs real repos | SWE-bench Pro public set, best 61.5% (Sep 2026). SWE-bench Verified 80% to 95%, all vendor-reported. OpenAI stopped reporting Verified (Feb 2026), and Epoch rates it flawed | Scale leaderboard, OpenAI, Epoch | Pro independent, Verified vendor |
| 12 | Measured productivity | METR randomized trial: experienced developers 19% slower with AI, while they believed they were 20% faster | METR, arXiv 2507.09089 (Jul 2025). 16 developers, 246 tasks | randomized, small sample |

## Notes that matter for the talk

- **Merge rates depend on where you measure.** Task type matters more than the agent: chores 84%, docs 82%, features 66%, fixes 66%, performance 55% (Pinna et al., MSR '26).
- **The top reason agent PRs fail is that nobody reviews them** (38%), then duplicates (23%), then CI or test failures (17%). Each extra failed check cuts the odds of merging by about 15% (Ehsani et al.). This supports our point that the bottleneck is human attention.
- **Instructions help.** In dotnet/runtime, adding instruction files raised success from 38.1% to 69%. This supports the Harness pillar.
- **Small changes succeed.** 1 to 50 lines: 76% to 80% success (dotnet/runtime). This supports the refine size gate and "Small or Medium" intake.
- **Closest comparison to our setup:** GitHub's own gh-aw repo ("Peli's Agent Factory", Jan 2026) publishes merge rates per workflow, for example 67% of 761 PRs for one workflow and 96% of 59 for the docs updater. Humans review and merge every one of those. On a slide, say that difference out loud.
- **Productivity trials disagree in sign**, from −19% (METR) to +26% (Cui, Demirer et al., Management Science 2026, 4,867 developers). People overestimate their own speed-up.
- **Code quality signals** (vendor): GitClear reports copy/paste code up from 8.4% to 15.7% and moved (refactored) code down from 24.8% to 3.8% between 2021 and its 2026 report.
- **Share of code written by AI** (vendor claims, definitions differ): Google 75% of new code (Apr 2026), Microsoft 20% to 30% (Apr 2025), Anthropic over 80% of merged lines (May 2026).
- **Cost:** Claude Code docs, about $13 per developer per active day. Agent tasks use about 1,000 times more tokens than chat, and the same task can vary 30-fold between runs (Bai et al., arXiv 2604.22750). No credible public cost per merged PR exists, so our own figure would be new.
- **DORA 2024 bands**, for comparing medians: elite deploys on demand with lead time under 1 day, high daily to weekly with 1 day to 1 week, medium weekly to monthly with 1 week to 1 month, low monthly to every six months with 1 to 6 months. DORA dropped the tiers in 2025, so compare against the 2025 spreads above.

## Sources

- https://arxiv.org/html/2507.15003
- https://arxiv.org/html/2601.15195
- https://arxiv.org/abs/2509.14745v3
- https://devblogs.microsoft.com/dotnet/ten-months-with-cca-in-dotnet-runtime/
- https://github.github.com/gh-aw/blog/2026-01-12-welcome-to-pelis-agent-factory/
- https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
- https://rdel.substack.com/p/rdel-115-what-are-the-2025-benchmarks
- https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report
- https://survey.stackoverflow.co/2025/ai
- https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/
- https://labs.scale.com/leaderboard/swe_bench_pro_public
- https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
- https://epoch.ai/benchmarks/swe-bench-verified/review
- https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- https://metr.org/blog/2026-02-24-uplift-update/
- https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535
- https://www.gitclear.com/the_ai_code_quality_maintainability_gap
- https://code.claude.com/docs/en/costs
- https://arxiv.org/abs/2604.22750v1
