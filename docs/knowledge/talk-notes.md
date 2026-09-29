# Talk notes (draft, non-binding)

These notes come from an earlier working session with another AI. The user wrote them in Spanish. This is an English translation. They are a draft: they are not binding, and the content can change. Use them as the current direction of the story, and check facts against [platform.md](platform.md).

## Working title

**From issue to production with GitHub Agentic Workflows**

The talk is about the move from GitHub Actions and agents as separate pieces to a system that works in a way that is agentic, autonomous, asynchronous, and in the cloud. Human work goes down to a minimum. AI is used only where reasoning is necessary.

It is not a theory talk about agents. It tells a real evolution: what Plain Concepts built, mainly around the Platform team.

The presentation must be very visual, progressive, and dynamic. No classic sequence of slides full of text. The content is a living system that appears, grows, splits, and changes in front of the audience. It can be an interactive web instead of a slide deck.

## Story so far

### 1. Introduction

Two or three intro slides come first. Their content is not defined yet. The part that is clear starts when the first visual system appears on screen.

### 2. Start from GitHub Actions

The first important screen is almost empty. In the centre, one box, node, or module represents a GitHub Actions workflow. Almost everyone in the audience knows it.

Explain it simply: GitHub Actions reacts to events in GitHub and runs a series of operations.

- Events: an issue is created, a pull request opens, a push to a branch, a label is added, a merge, a release.
- Events trigger workflows that run on runners: GitHub-hosted runners, self-hosted runners, or our own infrastructure.
- Inside a workflow we can run: marketplace actions, our own actions, scripts, CLIs, code, external tools, APIs.

Visually, the first box starts to unfold, and several paths grow out of one node:

```
                GitHub Event
                     |
                     v
              GitHub Actions
             /      |       \
          Action  Script  Custom Action
```

The goal of this part: GitHub is already a strong automation system before any AI arrives.

### 3. From GitHub Actions to Agentic Workflows

When the audience understands the first piece, something new appears: a different kind of module, or a different group of modules. It represents GitHub Agentic Workflows.

Until now, workflows were deterministic: "when X happens, run Y, then run Z". Agentic Workflows add natural-language instructions and agent behaviour. Instead of a rigid list of steps, we state an intent or a goal. The agent reasons about the goal and decides which steps it needs.

### 4. Agentic Workflows are Markdown

These workflows are written as Markdown files. Show `workflow.yml` first, then `workflow.md` appears. An agentic workflow mixes two worlds: traditional deterministic parts, and natural-language instructions for an agent.

```
Markdown workflow
  +-- configuration
  +-- traditional actions
  +-- instructions for the agent
  +-- available tools
```

The Markdown does not run directly. It compiles to a YAML workflow that GitHub Actions can run:

```
Agentic Workflow (.md) -> Compiler -> GitHub Actions Workflow (.yml)
```

### 5. Compilation adds infrastructure

Compilation is not a literal Markdown-to-YAML conversion. It adds pieces around the workflow: security controls, checks, telemetry, runtime infrastructure for the agent, extra configuration, helper jobs, permission mechanisms, and execution protections. Some are configurable. Others are part of the generated behaviour.

```
workflow.md -> [ COMPILER ] -> Security + Telemetry + Runtime -> workflow.yml
```

### 6. Changes after compilation

We needed one more level of customisation. We generate the YAML, then change parts of it with a small CLI of our own:

```
workflow.md -> GitHub compiler -> generated.yml -> our customisation -> final workflow.yml
```

Keep this short. It is not the centre of the talk, but it introduces an idea that comes back several times: we do not use the system exactly as it ships. We adapt it to our environment.

### 7. The first complete scenario

The system grows. Three large workflows:

- **CI/CD:** build, test, deploy.
- **Issue triage:** an issue is created, an agent analyses it, classifies it, adds labels, assigns it.
- **Implementation:** an agent understands the task, changes code, runs tests, creates a PR.

```
                 GitHub
       +-----------+-----------+
       v           v           v
     CI/CD      Triage     Implementation
    Actions     Agentic       Agentic
```

Then the question: we could stop here. We have CI/CD, agents, automation, issues, PRs, generated code, workflows in the cloud. It looks like an AI-based development system. This is exactly where the important part of the story starts.

### 8. The problem: AI is not deterministic

An agent is not a deterministic function. The same prompt run several times does not give the same result. That affects how it reads the issue, which files it changes, which tools it uses, what it decides, how it implements, how long it takes, how many tokens it uses, and which path its reasoning takes. An agentic workflow can work in one run and behave differently in the next.

First lesson: **an agentic workflow is not a reliable process.**

### 9. The cost of agents

When an agent handles too much, it uses intelligence on problems that need none: check whether a label exists, add or remove a label, write a comment, assign a person, check a simple condition, read a known value, run a predictable operation.

An agent can do all of this. That does not mean it must. Each step it solves by reasoning costs more tokens, more time, more money, and more chances of unexpected behaviour. This becomes one of the main architecture principles later.

### 10. The human-in-the-loop problem

For a long time our position was conservative. We assumed a person would always be in the middle:

```
Issue -> Agent -> Pull Request -> Human Review -> Approve -> Production
```

The mindset was: AI can work, implement, propose, and prepare, but a human approves. It seemed reasonable, because for decades we built systems with explicit human checkpoints. And there was an obvious worry: what if the agent breaks something?

### 11. The change of mind

Between about May and June, this thinking changed. It was not an ideological decision. For a long time we tried to prove the opposite: that humans must always stay in the loop. We ran tests, experiments, research, different projects, different configurations, and different levels of autonomy.

Then something important happened. We had an application in production where we had not reviewed all the code. We had set up guardrails, conventions, rules, architecture, good practices, validation, and context, but not the traditional review. When we finally reviewed the result, it was not perfect. We do not claim AI makes perfect software. But it was surprisingly good. Good enough to change the question.

From: *how do we use agents and keep humans in the loop?*
To: **what would have to be true for this system to work without humans on the normal path?**

### 12. A real use case

Instead of more demos, we tested it on a real case: our own Platform team. The team is very small (fewer than three people) and it runs more than ten applications: some SaaS, some internal, some to speed up specific initiatives. Many clients have the same situation: a small team that must maintain many products. So we treated the Platform team exactly as we would treat a client.

### 13. The goal of the experiment

An aggressive goal. A system that works in a way that is:

**Agentic. Autonomous. Asynchronous. In the cloud.**

The four words look simple. Each one brings different problems.

### 14. Agentic

The system must reason, not only automate. The agent must understand an issue, investigate the repo, choose a strategy, change code, run tools, validate results, iterate, create pull requests, and fix errors.

### 15. Autonomous

The agent must not need a person after each step. It completes a task from start to end while it stays inside the defined limits.

```
From: Agent -> Human -> Agent -> Human -> Agent
To:   Agent -> Work -> Validate -> Iterate -> Complete
```

### 16. Asynchronous

We were already comfortable with AI on a laptop: developer, OpenCode, code changes, pull request. It works because the developer is there to watch, correct, and give another instruction. The new goal is different: start a job and forget it.

```
Issue -> Cloud agent (works 10, 20, 30 minutes) -> Pull Request
```

Nobody has to watch. This brings a whole new set of problems.

### 17. Cloud

The agent must not depend on a person's laptop. It runs on reproducible cloud infrastructure. We control the runtime, tools, dependencies, credentials, models, security, repo access, network, persistence, and observability. Here Agentic Workflows become interesting as base infrastructure.

### 18. Adapting GitHub Agentic Workflows to our environment

The standard system adds protections, jobs, and behaviours. Some make sense in a generic or public environment, but not in the same way in our private one. Some add steps, calls, processing, and tokens, or do things we already solve in another way. So we customise the generated workflows, with configuration or with the post-compile changes. The idea is not to remove security. The idea is to have the right security and controls for our context, instead of accepting every generic mechanism.

### 19. One runtime: OpenCode

We want one common runtime for the agent. Every agentic job runs OpenCode. This gives us our own layer between the workflow and the model.

```
GitHub Agentic Workflow -> OpenCode -> LLM
```

### 20. Forge as the AI gateway

We do not want each workflow to connect straight to model providers. Plain Concepts has an internal AI gateway called Forge. OpenCode uses Forge.

```
GitHub Agentic Workflow -> OpenCode -> Forge -> Models
```

This gives one point of control. No need for detail on Forge in this talk. The key idea: the agent does not talk to providers. It talks to OpenCode, OpenCode talks to Forge, and Forge manages access to the models.

### 21. One API key per project

Each project has its own Forge API key. This separates projects and gives more control over AI use per project. It is specific to our architecture, but it is part of how we make the agentic environment governable.

### 22. Result so far

```
GitHub -> Agentic Workflow -> OpenCode -> Forge -> Models
```

We can also customise how workflows are generated and run. But one problem remains: even with a controlled runtime, the agent can behave differently in each repository. Here the first pillar appears.

## Pillar 1: the Harness

### 23-24. What it is and what it holds

We made a Harness for Platform. It lives apart from the applications. It defines how we expect an agent to work in Platform, so each repo does not invent its own way to use AI.

It can hold rules, conventions, architecture, how to think about the project, patterns, how to change code, how to validate, how to deploy, available tools, skills (which to use and which not to use), rules for pull requests, testing, and documentation, restrictions, commands, CLIs, and expected behaviour.

The Harness becomes a kind of operating environment for the agent. The model still reasons, but it does not start from zero.

### 25. Reduce variability

The goal is not full determinism. That would be a false promise: an LLM is not deterministic. But we can make its decision space much smaller.

Instead of "Solve this issue", we give: "Solve this issue. This is how this project works. These are the rules, the tools, the skills, the architecture. This is how to test, how to make PRs, how to deploy. Do not do these things."

### 26-27. The same behaviour locally and in the cloud

The Harness also works locally. A developer opens the project with OpenCode, and the local agent uses the same rules.

```
               Platform Harness
              /                \
     Developer laptop        Cloud job
        OpenCode              OpenCode
```

We do not build two systems, one for developers and one for cloud agents. We use the same base. The model can decide differently, but the rules, tools, and context are the same. This closes the gap between "it works when I run it" and "it works when the agent runs it on its own".

### 28. Per-project configuration

One global Harness, with small project-specific configuration. Most behaviour stays common.

### 29. The real goal of the Harness

Candidate key lines:

- "We cannot make an agent deterministic, but we can make each run look much more like the last one."
- "We do not try to remove uncertainty. We try to shrink the space where it can appear."

## Pillar 2: deterministic vs agentic

### 30-32. Two kinds of operation

With the Harness in place, we looked at what the agent really does, and found that it did too much. An agent can run almost any tool, so it is tempting to give it everything: read the issue, analyse code, add and remove labels, comment, assign, change code, run tests, create the PR.

These are two different kinds of work:

- **Needs intelligence:** understand the issue, understand the architecture, find the relevant code, choose a strategy, change code, reason about failing tests, decide whether the work is complete.
- **Needs no intelligence:** check that a label exists, add or remove a label, assign a user, write a fixed comment, check status, move an issue, update metadata. Code can do these the same way every time.

### 33. Pull those operations out of the agent

This can be one of the best visual moments. Start with one huge AGENT box that holds everything. Then pull pieces out one by one (Label, then Assignment, and so on) until only what really needs AI is left: analyse, code, tests, validation.

### 34. Back to GitHub Actions

This closes a circle. The talk started with GitHub Actions, then added Agentic Workflows, and now returns to GitHub Actions, because Actions is still better for many things. The deterministic parts go back to actions, scripts, CLIs, code, and normal workflows. The architecture becomes hybrid.

### 35. The hybrid workflow

```
                 Workflow
         +----------+-----------+
         v                      v
   Deterministic             Agentic
   GitHub Actions            OpenCode
         v                      v
   Fixed operations          Reasoning
```

Both worlds can alternate inside one process:

```
Issue created
 -> Action: add metadata
 -> Agent: understand the issue
 -> Action: prepare the environment
 -> Agent: implement
 -> Action: run deterministic checks
 -> Agent: reason about the result
```

### 36-39. Why this design is better

- **Less behaviour complexity.** It looks more complex, but now we know exactly what can vary and what cannot. Labels, assignment, environment setup, and permissions always work the same way. Implementation strategy, code changes, and reasoning can vary. Uncertainty sits only where it adds value.
- **Fewer tokens.** Less agent work means less context, fewer tokens, lower cost.
- **Fewer errors.** No need to ask an agent "please add this label". Run an operation we know works. Fewer unnecessary decisions for the model means fewer places for surprises.
- **Fewer humans.** This looks like a paradox. We do not remove humans by adding more AI. We remove humans by giving each part of the system the right level of determinism: deterministic software for deterministic work, agents for work that needs intelligence. Together, the whole system becomes much easier to trust.

## Where the story stands (sections 40-46)

The path so far:

1. GitHub Actions.
2. Agentic Workflows.
3. Problems found: non-determinism, token use, human-in-the-loop.
4. Change of mind: maybe humans do not need to be in every loop.
5. Real case: Platform, fewer than 3 people, more than 10 apps.
6. The goal: agentic, autonomous, asynchronous, cloud.
7. Our runtime: GitHub Agentic Workflows, then OpenCode, then Forge, then models.
8. Pillar 1, **Harness**: a shared environment that defines how agents work and reduces variability between projects, runs, and environments.
9. Pillar 2, **Deterministic vs agentic**: everything that needs no intelligence leaves the agent and goes back to GitHub Actions or plain code.

The visual system has grown from one GitHub Action, to three workflows, to traditional and agentic branches with OpenCode, Forge, and models, then the Harness, then the deterministic pieces pulled out:

```
                     Workflow
          +-------------+-------------+
          v                           v
 Deterministic Actions             Agentic
                                      v
                                   OpenCode
                                      v
                                   Harness
                                      v
                                    Forge
                                      v
                                    Models
```

### The thesis that starts to appear

- Getting an agent to write code is relatively easy. The interesting problem starts when that agent must be part of a production system. For that we build around the model: runtime, harness, rules, tools, determinism, security, control, infrastructure, observability, context, limits.
- Autonomy does not appear because the model gets better. It appears because we build a system around the model that lets it work reliably.
- Not "AI writes software", but **"we engineer a system where AI is one component"**. The LLM stops being the system and becomes one part of it.
- **More autonomy does not need less structure. More autonomy needs better structure.** The more an agent works alone, the more we must define what it can do, how, with which tools, in which environment, what is automated outside it, what it must validate, and how we know it did well.
- This links to the Platform philosophy: the model, the provider, and the agent runtime can all change. The architecture around them stays relatively stable. Models change very fast. The infrastructure around them is what turns that capability into a usable engineering system.

### Where we stopped

Two of four pillars are defined. Two more are missing. After the four pillars, the story completes the path:

```
Issue -> Autonomous system -> Production
```

The ending can return visually to the title, "From issue to production with GitHub Agentic Workflows", and make clear that GitHub Agentic Workflows is the entry point and the enabling infrastructure, not the whole solution. The real solution is the whole system built around it.

## Links to what the repos show

These points from [platform.md](platform.md) fit the notes. Use them when the missing pillars are written:

- The two missing pillars are probably **agentic-workflows** (the router and workers that run the pipeline on events) and **project-health** (measuring the result). Together with Foundations and agent-harness, these are the "four pillars" on the Platform site. Check with the user: the notes number pillars by idea (Harness, deterministic vs agentic), and the site numbers them by repo.
- "Deterministic vs agentic" matches the site's **determinism ladder** and the line "The model is the last resort, not the engine".
- The router, safe outputs, the merge gate, and housekeeping are the concrete form of "autonomous and asynchronous".
- Numbers that support the story: about 1 in 4 issues closed by the bot and 82% of issues closed by an agent pull request (see [our-numbers.md](our-numbers.md), not the old "58 of 237" figure), the merge gate redesign after it auto-merged 31% of verdicts while it found zero defects, and the size gate that turned a 2.4M-token failure into a 10-second refusal.
