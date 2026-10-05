# Agentic Workflows routes

These facts come from the [interactive diagrams](https://didactic-spoon-5wogzwe.pages.github.io/), read in the signed-in browser on 2026-10-05.
The diagrams describe the loop system in `loops/docs/diagrams.md`.
This file records the route facts used by the keynote.

The [Router](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/router.html) classifies an event in shell code, authorizes it, and dispatches at most one worker.
Classification makes no network calls and runs no model.
An idle event can finish without dispatching a worker.

The [route chain](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/route-chain.html) has a main path and several returns.
Refine sizes the Issue before Implement starts.
Implement opens a pull request, CI runs, and Merge Gate evaluates the change.
An audit enters through Refine.
Repairs and review changes return through CI.

## Entry and refinement

[Triage](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-triage.html) handles outside collaborators.
Write access skips this worker.
Triage can pass the Issue, request information, ask for a maintainer, or reject it.
An author reply can restart a request for information.

[Refine](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-refine.html) explores and estimates the work.
Large Issues split into smaller children, and each child follows the pipeline independently.
Questions return to the author before implementation starts.
The keynote uses these conditions without presenting the size thresholds.

## Implementation and merge

[Implement](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-implement.html) writes code, verifies the scoped files, and opens one pull request.
It stops after that handoff.
It does not own the merge decision.

[Merge Gate](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-merge-gate.html) reads the diff, pull request facts, and CI logs.
It can repair failed CI and push a change that starts CI again.
The agent reports findings and evidence.
A shell validator computes the disposition from the report and the blast radius.
Protected paths need owner review.
Only this worker merges.

[Apply Review](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-apply-review.html) reads the whole review conversation before applying justified changes.
A push runs CI and returns to Merge Gate.
Ambiguous or unsafe feedback needs a person.

[Visual Verify](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-visual-verify.html) prepares a screenshot plan after an automatic merge verdict.
Shell code captures the images.
A capture warning does not block the merge.

## Release and returns

[Release](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-release.html) starts from a manual dispatch.
The agent writes release notes.
Deterministic code sets the version, creates the tag, and publishes the release.
The keynote must keep merge and release as distinct steps.

[Audit](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agent-audit.html) reads the repository and files one Issue without changing code.
Its findings enter Refine for sizing and splitting.
Backpressure limits new reports when the backlog is full.

[Housekeeping](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/housekeeping.html) distinguishes a machine failure from a decision.
A crash, timeout, or empty output can be retried within its budget.
Questions and requests for human review are decisions.
Repeating those decisions does not remove their cause.

[App Errors](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agentics-app-errors.html) groups application exceptions and scrubs them before scanning for leaks.
It uses deterministic code and sends new defects to Refine.
[Error Report](https://didactic-spoon-5wogzwe.pages.github.io/diagrams/agentics-error-report.html) classifies failures owned by the package.
Only the permitted structured facts cross the upstream boundary.

The ownership Markdown link did not render in the browser.
The route facts above come from the diagrams.
