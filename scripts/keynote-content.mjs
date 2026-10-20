import { flowCopy } from './flow-copy.mjs'

// The presenter approved this order on 2026-10-05. Each beat has a distinct purpose.
/** A name centred under its body. The label sits just below the lowest edge of the body on screen. */
const U = (target, name, width = 28) => ({ target, name, width, under: true })
/** A name centred over its body, for rows where names alternate above and below a line. */
const O = (target, name, width = 28) => ({ target, name, width, over: true })
const B = (key, title, body, picture, step, labels, notes, command, layout = 'wide') => ({ key, title, body, picture, step, labels, notes, command: command ?? title, layout })
/** A flow beat: a worker diagram drawn step by step over the dimmed world. */
const F = (key, title, body, flow, picture, step, notes, command) => ({ key, title, body, picture, step, labels: [], notes, command: command ?? title, layout: 'wide', flow, dim: true })

export const sharedCopy = {
  ...flowCopy,
  'show.cover': ['From Issue\nto production with\nGitHub Agentic Workflows.', 'De una Issue\na producción con\nGitHub Agentic Workflows.'],
  'show.subtitle': ['The Plain Concepts Platform', 'La Plataforma de Plain Concepts'],
  'show.prompt': ['pc@studio:~/local$', 'pc@studio:~/local$'],
  'show.cloudPrompt': ['pc@studio:~/cloud$', 'pc@studio:~/cloud$'],
  'show.active.label': ['the active Issue', 'el Issue activo'],
  'talk.level.1': ['1 · No AI', '1 · No AI'],
  'talk.level.2': ['2 · Exploratory', '2 · Exploratory'],
  'talk.level.3': ['3 · Structured', '3 · Structured'],
  'talk.level.4': ['4 · Scaled', '4 · Scaled'],
  'talk.level.5': ['5 · Governed & Optimized', '5 · Governed & Optimized'],
  'talk.label.backend': ['Backend · .NET', 'Backend · .NET'],
  'talk.label.frontend': ['Frontend · Next.js', 'Frontend · Next.js'],
  'talk.label.branding': ['Branding · ui-theme', 'Branding · ui-theme'],
  'talk.label.skillsProject': ['Skills per project', 'Skills por proyecto'],
  'talk.label.guardrails': ['Guardrails', 'Guardrails'],
  'talk.label.issueEvent': ['Issue event', 'Evento: Issue'],
  'talk.label.agentForge': ['OpenCode · Forge', 'OpenCode · Forge'],
  'talk.link.example750': ['↗ Real example: Issue #750', '↗ Ejemplo real: Issue #750'],
  'talk.link.health750': ['↗ Issue #750 on the roadmap', '↗ Issue #750 en el roadmap'],
  'talk.link.healthLive': ['↗ Live dashboard', '↗ Panel en vivo'],
  'talk.health.dora': ['DORA: DevOps Research and Assessment, a Google Cloud program.', 'DORA: DevOps Research and Assessment, un programa de Google Cloud.'],
  'talk.closing.talk': ['Questions? Let\'s talk.', '¿Preguntas? Hablemos.'],
  'talk.label.applyReview': ['Apply Review', 'Apply Review'],
  'talk.label.visualVerify': ['Visual Verify', 'Visual Verify'],
  'talk.label.workflowsOnGhAw': ['gh-aw + agentic-workflows', 'gh-aw + agentic-workflows'],
  'talk.label.safeOutputs': ['Safe Outputs · PR', 'Safe Outputs · PR'],
  'talk.era.models': ['Models', 'Modelos'],
  'talk.era.prompts': ['Prompts', 'Prompts'],
  'talk.era.skills': ['Skills', 'Skills'],
  'talk.era.agents': ['Agents', 'Agentes'],
  'talk.era.guardrails': ['Guardrails', 'Guardrails'],
  'talk.era.harnesses': ['Harnesses', 'Harness'],
  'talk.era.loops': ['Loops and graphs', 'Loops y Graphs'],
  'talk.era.autonomous': ['Agentic Workflows', 'Agentic Workflows'],
  'talk.era.future': ['Future', 'Futuro'],
  'talk.label.skills': ['pc-* skills', 'skills pc-*'],
  'talk.label.plugins': ['plugins', 'plugins'],
  'talk.label.specs': ['OpenSpec', 'OpenSpec'],
  'talk.label.docs': ['ARCHITECTURE + DESIGN', 'ARCHITECTURE + DESIGN'],
  'talk.label.foundations': ['Foundations', 'Foundations'],
  'talk.label.harness': ['agent-harness', 'agent-harness'],
  'talk.label.workflows': ['agentic-workflows', 'agentic-workflows'],
  'talk.label.health': ['project-health', 'project-health'],
  'talk.label.facts': ['facts · jobs', 'hechos · jobs'],
  'talk.label.agent': ['OpenCode · agent', 'OpenCode · agente'],
  'talk.label.validate': ['validate · jobs', 'validar · jobs'],
  'talk.label.outputs': ['safe-outputs', 'safe-outputs'],
  'talk.label.refine': ['Refine', 'Refine'],
  'talk.label.implement': ['Implement', 'Implement'],
  'talk.label.ci': ['CI', 'CI'],
  'talk.label.gate': ['Merge Gate', 'Merge Gate'],
  'talk.label.review': ['Apply Review', 'Apply Review'],
  'talk.label.router': ['Router · shell', 'Router · shell'],
  'talk.label.author': ['Issue author', 'autor del Issue'],
  'talk.label.split': ['Split · child Issues', 'Split · Issues hijos'],
  'talk.label.audit': ['Audit · read-only', 'Audit · solo lectura'],
  'talk.label.release': ['Release · manual', 'Release · manual'],
  'talk.label.triage': ['Triage', 'Triage'],
  'talk.label.route': ['Refine · Implement', 'Refine · Implement'],
  'talk.label.production': ['Production', 'Producción'],
  'talk.maturity.line': ['No AI → Exploratory → Structured → Scaled → Governed & Optimized', 'No AI → Exploratory → Structured → Scaled → Governed & Optimized'],
}

const levels = Array.from({ length: 5 }, (_, i) => U(`level.${i}`, `talk.level.${i + 1}`))

export const sections = [
  { id: '01-cover', scene: 'local', title: 'Cover and work on your PC', name: 'opening', source: '../knowledge/talk-notes.md',
    intro: { heading: 'show.cover', command: 'show.subtitle', picture: 'cover', step: 0, labels: [], layout: 'cover' },
    beats: [Object.assign(B('sponsors', ['Thank you to our sponsors.', 'Gracias a los patrocinadores.'], ['', ''], 'cover', 1, [],
      'Required by the event, NetCoreConf Madrid 2026. Thank the sponsors. Platinum: Inkoova, Intelequia, NTT DATA, Tokiota and V-Valley. Gold: Axazure by Avvale and Plain Concepts. Supported by Sessionize. Positions and sizes copy the official sponsor slide, because each tier pays for its place.', ['sponsors', 'sponsors']), { board: 'sponsors', dim: true }),
      Object.assign(B('ghaw', ['GitHub Agentic Workflows\nin 5 minutes.', 'GitHub Agentic Workflows\nen 5 minutos.'],
        ['A workflow is a Markdown file. You compile it to Actions. The agent only reads and proposes. gh-aw checks the proposal and opens the PR.', 'Un workflow es un Markdown. Lo compilas a Actions. El agente solo lee y propone. gh-aw valida la propuesta y abre el PR.'], 'cover', 1, [],
        'Start with the tool the title names, before our own story. In GitHub Agentic Workflows, gh-aw, a workflow is one Markdown file in the repo. The frontmatter on top is the wiring: when it runs, here when an Issue gets a label; the permissions, here read only; the engine, here Claude; and the safe outputs it may produce, here one pull request. The body is the prompt, in plain words. This is a minimal example, not one of ours: our workers use the same keys and run to several hundred lines. On the right is what happens. gh aw compile turns the Markdown into a GitHub Actions workflow, a lock file you commit. When the event fires, Actions runs it. The agent runs with your AI API key and read-only permissions, so it cannot push or comment by itself. It writes its result as a safe output. A job after the agent validates that output and only then performs the write, here opening one pull request. The legend is the same on every diagram of the talk: white outline for a normal job, solid blue for the agent, blue outline for a job after the agent.', ['gh aw compile', 'gh aw compile']), { board: 'ghaw', dim: true }),
      B('local', ['Understanding it takes 5 minutes.\nGetting the bases and the way of\nworking right took us months.', 'Entenderlo bien son 5 minutos.\nPreparar las bases y la forma\nde trabajar nos ha llevado meses.'],
      ['So let\'s talk about it: how we built Platform.', 'Hablemos de ello: cómo construimos Plataforma.'], 'local', 0, [],
      'This is the turn of the talk. Anyone can make the demo work in an afternoon. Making it safe on real repositories, with real teams, is where the months went: conventions the agent can follow, an environment that holds it, routes with gates that decide, runners that cost little, and numbers that show what works. The rest of the talk is those bases, in the order we built them. First, where AI is going, and where teams are.', ['the hard part', 'lo difícil'], 'statement')] },
  { id: '03-evolution', scene: 'layers', title: 'The evolution of AI', name: 'evolution', source: '../knowledge/talk-notes.md', beats: [
    B('evolution.timeline', ['The evolution of AI.', 'La evolución de la IA.'],
      ['', ''], 'evolution', 0,
      [U('era.model', 'talk.era.models'), O('era.prompt', 'talk.era.prompts'), U('context', 'talk.era.skills'), O('core', 'talk.era.agents'), U('wall', 'talk.era.guardrails'), O('harness', 'talk.era.harnesses'), U('era.loop', 'talk.era.loops', 32), O('era.loops', 'talk.era.autonomous', 30), U('era.future', 'talk.era.future')],
      'Walk the line from left to right. Models made chat AI common. Then we wrote prompts: you ask, review the change and ask again, with the engineer always present. Skills keep a procedure, so the next session can reuse it. Agents plan, use tools and edit code. That needs guardrails, because instructions alone do not stop a bad tool call. A Harness puts the model, the tools, the skills and the repo rules in one place. Loops and graphs let the work continue after you leave the PC: a repo event starts it. Agentic Workflows run those loops on Platform. This talk covers the last three steps. Nobody knows the next one yet.', ['models → prompts → skills → agents → loops', 'modelos → prompts → skills → agentes → loops']),
  ] },
  { id: '04-maturity', scene: 'assessment', title: 'AI adoption and team maturity', name: 'assessment', source: '../knowledge/maturity.md', beats: [
    B('maturity.levels', ['We measure different\nlevels of maturity.', 'Medimos diferentes\nniveles de madurez.'],
      ['Different teams and companies are at different points in adopting AI across the software development lifecycle.', 'Diferentes equipos y empresas presentan diferentes momentos en la adopción de la IA en el ciclo de vida de software.'], 'assessment', 0, levels,
      'Use the five assessment levels, with their exact names. No AI is manual work. Exploratory is individual use. Structured adds approved tools and review guidance. Scaled makes practice consistent across teams. Governed & Optimized puts governance and improvement into the workflow. Do not equate a tool upgrade with organizational maturity.', ['AI SDLC assessment', 'assessment AI SDLC']),
  ] },
  { id: '05-platform', scene: 'method', title: 'How we built Platform', name: 'platform', source: '../knowledge/website-reading.md', cloud: true, beats: [
    B('platform.pillars', ['The 4 pillars\nof Platform.', 'Los 4 pilares\nde Plataforma.'],
      ['', ''], 'platform', 0,
      [U('wall', 'talk.label.foundations'), U('harness', 'talk.label.harness'), U('automation', 'talk.label.workflows'), U('measure', 'talk.label.health')],
      'Platform is a Plain Concepts department that builds and maintains applications. Foundations defines conventions. agent-harness installs the agent environment. agentic-workflows runs workers on events. project-health measures delivery and agent work. Each repository supplies an input the next one needs.', ['Plain Concepts Platform', 'Plain Concepts Platform']),
  ] },
  { id: '06-foundations', scene: 'constraints', title: 'Foundations: technology conventions', name: 'foundations', source: '../knowledge/platform.md', cloud: true, beats: [
    B('foundations.conventions', ['Foundations:\ntechnology conventions.', 'Foundations:\nconvenciones tecnológicas.'],
      ['A thin base for many apps: a .NET backend, a Next.js frontend and one shared brand. People and agents follow the same rules.', 'Una base fina para muchas apps: backend .NET, frontend Next.js y una marca común. Personas y agentes siguen las mismas reglas.'], 'baseline', 0,
      [U('wall', 'talk.label.foundations'), U('parcel.0', 'talk.label.backend'), U('parcel.1', 'talk.label.frontend'), U('parcel.2', 'talk.label.branding')],
      'Foundations is the thin shared layer that keeps many Platform apps consistent for people and agents. It is not a framework: two packages, not eight. The backend reference is .NET with Clean Architecture, vertical slices and EF Core, composed by Aspire. The frontend reference is Next.js with strict TypeScript, shadcn/ui and Tailwind. Branding is the ui-theme package: one brand blue, one typeface, tokens only.', ['Foundations · backend · frontend · branding', 'Foundations · backend · frontend · branding']),
  ] },
  { id: '07-harness', scene: 'environment', title: 'agent-harness: agentic conventions', name: 'harness', source: '../knowledge/platform.md', cloud: true, beats: [
    Object.assign(B('harness.conventions', ['agent-harness:\nagentic conventions.', 'agent-harness:\nconvenciones agénticas.'],
      ['One command installs it in each repo: OpenSpec for changes, plugins that block unsafe actions, the skills each project needs, and guardrails.', 'Un comando lo instala en cada repo: OpenSpec para los cambios, plugins que bloquean acciones inseguras, las skills que necesita cada proyecto y guardrails.'], 'environment', 0, [],
      'This is what lands in your repo. One npx command runs a wizard once and saves the answers in .opencode/harness.json. Update replays those answers, asks nothing, and keeps the files you edited. AGENTS.md is always in context. ARCHITECTURE.md and DESIGN.md are generated from the code. OpenSpec manages each change as a proposal, specs and tasks. The pc-* skills hold the procedures: the guardrails every agent loads, your own project rules, and pc-plan-goal, which explores, proposes, applies and archives with no questions. A project gets only the skills it needs, for example the user story skill for its backlog. The blue lines are the guardrails. Plugins act at the tool call: pc-system-reminders denies about twelve unsafe actions, such as a forced push. check-diff refuses the comments and tests agents tend to add. The same harness runs on a PC and in CI.', ['npx @plainconceptsplatform/agent-harness', 'npx @plainconceptsplatform/agent-harness']), { board: 'tree', dim: true }),
  ] },
  { id: '08-workflows', scene: 'pipeline', title: 'Agentic Workflows: jobs, reasoning, validated writes', name: 'workflows', source: '../knowledge/workflow-routes.md', cloud: true, beats: [
    B('workflows.intro', ['agentic-workflows: asynchronous\ndevelopment in the cloud.', 'agentic-workflows: desarrollo\nasíncrono en la nube.'],
      ['Our layer on top of GitHub Agentic Workflows: one router, workers that use the agent-harness skills, OpenCode through Forge, and writes only through Safe Outputs.', 'Nuestra capa sobre GitHub Agentic Workflows: un router, workers que usan las skills de agent-harness, OpenCode vía Forge y escrituras solo por Safe Outputs.'], 'workflow', 0,
      [U('intake', 'talk.label.issueEvent'), U('automation', 'talk.label.workflowsOnGhAw'), U('core', 'talk.label.agentForge'), U('outputs', 'talk.label.safeOutputs')],
      'Now the work leaves the PC. agentic-workflows is our layer on top of GitHub Agentic Workflows, gh-aw. Each worker is a gh-aw markdown file. We never call gh aw compile directly: our wrapper runs it and rewrites the lock files for our runners and for OpenCode as the engine. One command, npx @plainconceptsplatform/workflows, installs it in a repo, and update keeps it current. On top of gh-aw we add our practices: one router owns every event, OpenCode reasons through Forge, our AI gateway, with read-only access, and every write goes through allowlisted Safe Outputs. The workers call the agent-harness skills, for example pc-plan-goal in Implement, so a repo needs agent-harness first. The next slides follow each worker.', ['npx @plainconceptsplatform/workflows', 'npx @plainconceptsplatform/workflows']),
    F('workflows.router', ['One router for every event.', 'Un router para cada evento.'],
      ['One event, one run, at most one worker. Classification is pure shell with no network calls. An idle run costs about ten seconds.', 'Un evento, una ejecución, un worker como máximo. Clasificar es shell puro, sin red. Una ejecución vacía cuesta unos diez segundos.'],
      'router', 'workflow', 1,
      'A Markdown file compiles to a GitHub Actions workflow with gh aw compile. GitHub Agentic Workflows supplies the compiler and the runtime. Platform supplies the router, the worker catalog, the installer, shared defaults, and the repository Harness. The router owns every trigger. Rung 1 classifies the event in pure shell, with no network call and no model. Then it authorizes: write access and organization membership, or the bot-working label for bots. Then it dispatches one worker through workflow_call, or none. Requests from people without write access enter through Triage. Cron and manual dispatch go to deterministic jobs that never run a model. Router concurrency prevents two workers on one Issue. Labels describe state for people. They are not the lock. An idle run still appears for every matching event and costs about ten seconds with every job skipped.',
      ['gh aw compile → work-router.lock.yml', 'gh aw compile → work-router.lock.yml']),
    F('workflows.triage', ['Triage: the front door.', 'Triage: la entrada.'],
      ['Four outcomes: pass, needs info, needs a maintainer, block. Three rounds at most. In round three, needs info is no longer allowed.', 'Cuatro salidas: pasa, falta información, pide mantenedor, bloqueo. Tres rondas como máximo. En la tercera ya no vale pedir información.'],
      'triage', 'workflow', 1,
      'Triage runs only for outside collaborators. A user with write access skips it. The worker reserves the Issue with the bot-working label, collects the Issue and its comments, and the agent runs ten checks. Four valid outcomes. Pass adds the refine label with no human in the loop. Needs info posts questions, and an author reply re-runs the worker. Needs maintainer keeps the Issue open with a review label. Block closes it only on a genuine rejection. The round counter comes from markers already on the Issue. In round three, needs info is no longer allowed, so the loop ends. An invalid outcome is retried.',
      ['agent-triage.md', 'agent-triage.md']),
    F('workflows.refine', ['Refine: size and split the work.', 'Refine: dimensiona y divide.'],
      ['Explore the code one unit at a time. Write the story as Given, When, Then. Estimate in Fibonacci. Eight or more splits into 2 to 6 children.', 'Explora el código unidad a unidad. Escribe la historia en Given, When, Then. Estima en Fibonacci. Ocho o más se divide en 2 a 6 hijos.'],
      'refine', 'workflow', 1,
      'Reserve, collect facts, then the agent explores the real codebase one unit at a time. A trivial change gets a plan without Gherkin. Everything else becomes a story in Given, When, Then, wrapped into the Issue form and passed through the humanizer. The estimate is Fibonacci against the estimate bands. Eight or more splits into two to six children of five or less, and each child walks the pipeline alone. Open questions go to the author in one batched comment. When nothing is open, the Issue is refined and the implement label is added. If the agent cannot ground the story in the code, the run is incomplete and retried.',
      ['agent-refine.md', 'agent-refine.md']),
    F('workflows.implement', ['Implement: one PR, then stop.', 'Implement: un PR, y para.'],
      ['Eligible? Reserve, collect facts. Trivial marker takes the direct path, the rest runs plan-goal. Verify the scoped files. One PR. The gate decides.', '¿Elegible? Reserva, reúne hechos. La marca trivial va directa, el resto por plan-goal. Verifica el alcance. Un PR. Decide el gate.'],
      'implement', 'workflow', 1,
      'Rung 4 checks eligibility: the Issue is open and not marked future. Reserve it. Rung 3 collects facts. A trivial marker takes the direct path, one todo per item. Everything else runs the plan-goal pipeline from the Harness. Verify checks the scoped files, and a failure goes back to the agent. Create PR is the one safe output. Then the worker hands off: the merge decision belongs to the gate. If the run died in under six minutes, that is an outage, and the worker retries up to five times. If it died later, something is wrong, and the Issue is parked with a review label.',
      ['agent-implement.md', 'agent-implement.md']),
    F('workflows.gate', ['Merge Gate: the only one that merges.', 'Merge Gate: el único que fusiona.'],
      ['CI red? Repair, push, CI again. CI green? Measure the blast radius, the agent hunts defects, shell computes the verdict: merge, human, owner or blocked.', '¿CI roja? Repara, sube, CI otra vez. ¿CI verde? Mide el radio de impacto, el agente busca defectos y shell calcula: merge, humano, owner o bloqueo.'],
      'gate', 'workflow', 1,
      'CI reports its conclusion to the router, or the reconciler finds a pull request that was missed. Rung 4 checks the subject: our open pull request. Checkout is fast-forward only. Rung 3 collects the diff, the pull request shape, and the CI logs. If CI failed, the agent repairs and verifies, pushes, and CI runs again. If CI passed, rung 4b measures the protected paths and the blast radius. The agent finds and verifies defects and reports them. The disposition is computed in shell from that report and the blast radius: auto-merge with squash and the Issue closed, human review when the change is fragile or the radius is high, owner review from CODEOWNERS for protected paths, or blocked when CI stays red at attempt six. Only this worker merges.',
      ['agent-merge-gate.md', 'agent-merge-gate.md']),
    B('workflows.others', ['And four more workers.', 'Y cuatro workers más.'],
      ['Apply Review applies review comments on bot PRs. Audit reads the repo weekly and files one Issue. Release writes the notes. Visual Verify takes screenshots after an auto-merge.', 'Apply Review aplica los comentarios de review en PRs del bot. Audit lee el repo cada semana y abre un Issue. Release escribe las notas. Visual Verify hace capturas tras un auto-merge.'], 'workflow', 5,
      [U('review', 'talk.label.applyReview'), U('audit', 'talk.label.audit'), U('release', 'talk.label.release'), U('deployment', 'talk.label.visualVerify')],
      'The other four workers follow the same pattern, so we only name them. Apply Review reads every review thread first and applies only what the feedback justifies. If a comment is ambiguous or unsafe, it asks for a person. Audit runs weekly and read-only: it scores each finding, removes duplicates, and files one Issue with the top three findings into Refine. Release lets the agent write only the release notes. The version bump, the tag and the GitHub Release are shell. Visual Verify runs after an auto-merge, starts the app and posts screenshots. It never blocks the merge.', ['agent-apply-review · agent-audit · agent-release · agent-visual-verify', 'agent-apply-review · agent-audit · agent-release · agent-visual-verify']),
  ] },
  { id: '09-health', scene: 'feedback', title: 'Project Health measures and improves the system', name: 'health', source: '../knowledge/platform.md', cloud: true, beats: [
    B('health.intro', ['project-health:\nmeasure the system.', 'project-health:\nmedir el sistema.'],
      ['It reads GitHub every night and changes nothing. Each project has four tabs: Engineering, Delivery, Agentic and Roadmap.', 'Lee GitHub cada noche y no cambia nada. Cada proyecto tiene cuatro pestañas: Engineering, Delivery, Agentic y Roadmap.'], 'feedback', 0,
      [U('measure', 'talk.label.health')],
      'Project Health is the fourth pillar. It closes the loop: Foundations sets the conventions, the harness puts them in a repo, the workflows run the agents, and Health reads the result back from GitHub to show whether each of those really happened. It runs once a night, stores JSON, and publishes a private static site. No database and no service. Where GitHub cannot answer, it says so instead of guessing. Each project has four tabs. The next four slides show them for one real project, without its name.', ['project-health', 'project-health']),
    Object.assign(B('health.engineering', ['Engineering: the quality\nof our code.', 'Engineering: la calidad\nde nuestro código.'],
      ['The practices Platform asks for on the default branch: tests, mutation, security, complexity and code hygiene. In which mode, and if they last passed.', 'Las prácticas que pide Plataforma en la rama principal: tests, mutación, seguridad, complejidad e higiene del código. En qué modo y si pasaron.'], 'feedback', 0, [],
      'Engineering shows which practices guard this project on its default branch, in which mode, and whether they last passed. These are the practices we consider in Platform to judge engineering quality: the complexity of the code, its patterns, its tests and its security. The overview opens on this tab, not on Delivery: when agents write most of the code, the first question is whether anything would stop a bad change. This is one real project, without its name, as of 19 October. Level L3, the top one. Score 100. All ten gates that apply are present and passed: Gherkin specs, tests and coverage, mutation, secrets, vulnerabilities, SAST, SBOM, complexity, and code hygiene on every build, then DAST after the deploy to test. Performance does not apply to this project. AI usage is 4 of 5: 82 of 147 commits this month came from an assistant or an agent. The two numbers only mean something together. If AI usage is 4 or more and the level is L1 or less, Health raises the alert "High AI usage, low engineering". The same tab scans comments and tests every day: comment lines stay under the 10% the harness sets, here 5.8%.', ['project-health · Engineering', 'project-health · Engineering']), { board: 'engineering', dim: true }),
    Object.assign(B('health.delivery', ['Delivery: DORA metrics.', 'Delivery: métricas DORA.'],
      ['How often we ship, how long a change takes to reach production, and how much is rework. GitHub gives three of the five metrics.', 'Cada cuánto desplegamos, cuánto tarda un cambio en llegar a producción y cuánto es retrabajo. GitHub da tres de las cinco métricas.'], 'feedback', 0, [],
      'DORA is DevOps Research and Assessment, a research program now part of Google Cloud. For more than ten years it has studied how teams deliver software, and its metrics are the common language for delivery: how often you ship, how long a change takes, and how often a release goes wrong. Delivery comes second on purpose. When agents open most pull requests, throughput says less than it used to. Health keeps the real DORA metrics only. Deployment frequency, change lead time and rework rate come from GitHub deployments and releases. Change fail rate and failed deployment recovery time need to know that a release caused a problem in production. A repository cannot know that. A red pipeline is not the same thing: no production deployment collected so far is recorded as failed, so that number would read zero forever. Two lead times stay apart. Change lead time runs from the commit to production. Issue to staging starts earlier and ends earlier, so it looks better. They are never mixed. For this project: 2.31 releases a week, change lead time p50 6.2 hours, Issue to staging p50 2 days, rework 0% by the bug label.', ['project-health · Delivery', 'project-health · Delivery']), { board: 'delivery', dim: true, footnote: 'talk.health.dora' }),
    Object.assign(B('health.agentic', ['Agentic: how far this project\nadopts our agents.', 'Agentic: cuánto adopta este\nproyecto nuestros agentes.'],
      ['Measured against our Platform standard: versions, installed workers, and how much merges with no person. Not every project needs the same level.', 'Medido contra nuestro estándar de Plataforma: versiones, workers instalados y cuánto se fusiona sin nadie. No todo proyecto necesita el mismo nivel.'], 'feedback', 0, [],
      'Agentic measures how far this project runs agents the Platform way. Not every Platform project has to be equally mature here, so this tab says where each one is. First: is the machinery installed and current? Health reads the harness and workflow versions from the default branch and compares them with npm. This project runs the current releases and all seven workers. A repo two minors behind runs failure modes that are already fixed. Second: how much merges on its own? Every PR from Implement has a bot title, so Health splits them into three groups. The gate merged 5 of 9 with no person. 1 was parked and a person merged it. 3 were merged by hand. Merged by the gate is the closest number to the autonomy we promise. Those PRs added 547 lines of code, 69 of comments and 2,402 of tests. Cost is in tokens, not money: 202.69 million tokens and 10 hours 27 minutes of agent time in 76 runs. Only 69 runs reported usage, so the totals are a floor and the page says so. Per measured run, Triage needs about 94 thousand tokens and Implement about 8.5 million.', ['project-health · Agentic', 'project-health · Agentic']), { board: 'agentic', dim: true }),
    Object.assign(B('health.roadmap', ['Roadmap: from opened\nto merged.', 'Roadmap: de abierta\na fusionada.'],
      ['How each Issue moved from opened to merged, what happened on the way, and how long it took. Here an agent worked 4% of the open time.', 'Cómo se movió cada Issue desde que se abrió hasta que se fusionó, qué pasó por el camino y cuánto tardó. Aquí el agente trabajó el 4%.'], 'feedback', 0, [],
      'The Roadmap tab shows how each Issue moved from opened to merged, what happened on the way, and the times. It plans nothing. It reads the labels the workflows write, and it splits the open time of every Issue into five states: agent working, waiting on a person, a PR waiting to merge, queued with nobody on it, and work by hand. This month the Issues of this project were open 36 days and 6 hours in total. An agent worked 4% of that time. A third waited on a person, and almost another third waited for nobody. The agent is not the bottleneck. We are. Open the link: Issue 750 was estimated at sp-3, about three human days. It was open 34 hours, the agent worked 2 hours 32 minutes, and the gate merged it. The same Issue went through Triage, Refine, Implement and Merge Gate in the previous slides.', ['project-health · Roadmap', 'project-health · Roadmap']), { board: 'roadmap', dim: true }),
  ] },
  { id: '10-system', scene: 'whole', title: 'The whole Platform system', name: 'system', source: '../knowledge/maturity.md', cloud: true, beats: [
    Object.assign(B('closing.question', ['What exactly are software engineers supposed to do?', '¿Qué se supone exactamente que deben hacer los ingenieros de software?'],
      ['', ''], 'system', 0, [],
      'Ask the question and let it sit. If an Issue can reach production on its own, what is left for us? Answer with Uncle Bob Martin, on X on 5 October 2026: the job does not change. We still make sure the structure of the system is robust and maintainable, and that its behavior serves our users. That takes engineering discipline. It does not take reading every line of the code, just as using a compiler does not take reading the binary. That is what the whole talk built: conventions in Foundations, a Harness for the agents, workflows with gates, and Health to measure. Source: https://x.com/unclebobmartin/status/2107069060420637178', ['what do engineers do?', '¿qué hace un ingeniero?']), { board: 'quote', dim: true }),
    Object.assign(B('system', ['From Issue to production\nwith GitHub Agentic Workflows.', 'De una Issue a producción\ncon GitHub Agentic Workflows.'],
      ['Product experts who do not code file small eligible Issues or bugs. They reach production without human supervision.', 'Personas no técnicas de producto crean Issues o bugs pequeños y elegibles. Llegan a producción sin supervisión humana.'], 'system', 0,
      [U('triage', 'talk.label.triage'), U('core', 'talk.label.route'), U('wall', 'talk.label.ci'), U('gate', 'talk.label.gate'), U('deployment', 'talk.label.production')],
      'Return to the person at the PC from the opening. The completed system now lets someone close to the product create a small eligible Issue or bug. That person does not need to code or supervise the agent. Trace their Issue through Triage, Refine, Implement, CI, Merge Gate, the application deployment, and Health. They define the intended behavior and answer product questions when needed. The system owns execution and its checks. This autonomy depends on the technical and agent base established in Foundations, with the Harness and workflow controls in place. Protected technical changes still need their owner. People with write access label an Issue straight into the route. Everyone else enters through Triage. Application deployment follows the project configuration. The manually dispatched package Release worker is a separate route. The five maturity forms remain in the field without claiming an assessment score. Health feeds evidence into the three earlier pillars. End on the product change in production and the measured improvement loop. This is the last slide: open the floor for questions.', ['Maintenance · Issue → production → Health', 'Maintenance · Issue → producción → Health']), { footnote: 'talk.closing.talk' }),
  ] },
]

// One real Issue went through Triage, Refine, Implement and Merge Gate. The presenter opens it live from those slides.
// The repository is private, so the audience cannot open it. The visible label names no client project.
// The private Health site. IT will move it to a Plain Concepts domain, something like pulse.plainconcepts.com.
// Change it here only, then run node scripts/rebuild-show.mjs.
const HEALTH_SITE = 'https://probable-fiesta-2y6w5gw.pages.github.io'
const EXAMPLE_750 = { href: 'https://github.com/PlainConceptsPlatform/Numa/issues/750', label: 'talk.link.example750' }
for (const section of sections) for (const beat of section.beats) {
  if (['workflows.triage', 'workflows.refine', 'workflows.implement', 'workflows.gate'].includes(beat.key)) beat.link = EXAMPLE_750
  // The Health slides open the same project's live dashboard, and Roadmap opens the same Issue.
  const tab = { 'health.engineering': '', 'health.delivery': '#delivery', 'health.agentic': '#agentic' }[beat.key]
  if (tab !== undefined) beat.link = { href: `${HEALTH_SITE}/projects/numa/${tab}`, label: 'talk.link.healthLive' }
  if (beat.key === 'health.roadmap') beat.link = { href: `${HEALTH_SITE}/projects/numa/#roadmap/750`, label: 'talk.link.health750' }
}
