# Platform method

Read in the presenter's browser on 2026-10-05.
These facts supplement [platform.md](platform.md) and [workflow-routes.md](workflow-routes.md).
Use the published pages for the method and the route diagrams for worker behavior.

## Method and conventions

[How we work](https://platform.plainconcepts.com/docs/how-we-work) defines Discovery, Foundations, and Maintenance mode.
The phases change who can start a change.
They can overlap within an application, but each capability needs its guardrails before maintenance begins.

The presenter clarified the shift in effort on 2026-10-05.
Early agent work establishes the technical and agent base. As it settles, more effort goes into defining the product.
This shift does not remove Discovery. Product decisions continue alongside delivery.

[Foundations](https://platform.plainconcepts.com/docs/how-we-work/foundations) defines guardrails as constraints that fail the build.
Examples include dependency boundaries, specification changes, test assertions, and an audit trail without a bypass.
Authentication, migrations, external integrations, CI configuration, and design tokens need owner checkpoints.

[Discovery](https://platform.plainconcepts.com/docs/how-we-work/discovery) fixes product outcomes, integrations, and constraints.
Its outputs include proposals, designs, structural decision records, and observable specifications.
Oversized work returns to this track.

## Harness and execution

[AI x SDLC](https://platform.plainconcepts.com/docs/ai) describes the installed Harness and the workflow contract.
The Harness includes commands, pc-* skills, agents, plugins, OpenSpec, and repository documents.
OpenCode runs the agents and Forge supplies model access.
The published default runner is ubuntu-latest; self-hosted runners remain supported.
Older notes about Azure runners do not establish the current default.

The router owns triggers and authorizes events in shell code.
Workers have workflow_call entry points.
Precomputed facts, agent reasoning, validated outputs, and fixed writes are separate stages.
Issue labels show state; the router concurrency group supplies the lock.

The AI page contains both current event-driven text and an older cascade diagram in its Refine section.
The current route diagram sends small work to Implement and large work to Split.
Do not copy the older polling diagram into the keynote.

[Adopt](https://platform.plainconcepts.com/docs/adopt) puts theme, Harness, workflows, and measurement in that order.
Workers use commands and skills that the Harness installs.
The keynote explains this dependency with existing components in one world.

## Maintenance and measurement

[Maintenance](https://platform.plainconcepts.com/docs/how-we-work/maintenance) separates product outcomes from technical means.
Repository write access permits direct intake.
Other users pass through Triage, where eligibility matters even for small changes.
People close to the product can file small eligible Issues and bugs without engineering skills.
They define the desired outcome and supply reproduction steps or acceptance criteria.
After the required base is in place, the route can implement, check, merge, and ship without human supervision.
The presenter confirmed production delivery as the closing outcome of the talk on 2026-10-05.
The manually dispatched package Release worker remains a separate route from application deployment.

[Analytics](https://platform.plainconcepts.com/docs/analytics) collects deployment frequency, change lead time, and marked rework.
Production incident facts are unavailable from GitHub alone.
Agent totals show measured runs and token usage, including gaps in coverage.
Human attention has its own view, with bot pull requests counted separately.
Read-only audits file work through the ordinary Issue pipeline.

The homepage dashboard is a theme demonstration.
Its application and team counts are illustrative, so they stay off the keynote.
