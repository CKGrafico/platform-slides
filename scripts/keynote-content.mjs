import { flowCopy } from './flow-copy.mjs'

// The presenter approved this order on 2026-10-05. Each beat has a distinct purpose.
/** A name centred under its body. The label sits just below the lowest edge of the body on screen. */
const U = (target, name, width = 28) => ({ target, name, width, under: true })
/** A name centred over its body, for rows where names alternate above and below a line. */
const O = (target, name, width = 28) => ({ target, name, width, over: true })
const B = (key, title, body, picture, step, labels, notes, command, layout = 'wide') => ({ key, title, body, picture, step, labels, notes, command: command ?? title, layout })
/** A flow beat: a worker diagram drawn step by step over the dimmed world. */
const F = (key, title, body, flow, picture, step, notes, command) => ({ key, title, body, picture, step, labels: [], notes, command: command ?? title, layout: 'wide', flow, dim: true })
/** A chapter card: only a title, while the picture of the beat before fades to a trace. */
const C = (key, title, picture, step, notes) => ({ key, title, body: ['', ''], picture, step, labels: [], notes, command: title, layout: 'chapter', dim: true })

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
const pipeline = [U('intake', 'talk.label.facts'), U('core', 'talk.label.agent'), U('wall', 'talk.label.validate'), U('outputs', 'talk.label.outputs')]

export const sections = [
  { id: '01-cover', scene: 'local', title: 'Cover and work on your PC', name: 'opening', source: '../knowledge/talk-notes.md',
    intro: { heading: 'show.cover', command: 'show.subtitle', picture: 'cover', step: 0, labels: [], layout: 'cover' },
    beats: [Object.assign(B('sponsors', ['Thank you to our sponsors.', 'Gracias a los patrocinadores.'], ['', ''], 'cover', 1, [],
      'Required by the event, NetCoreConf Madrid 2026. Thank the sponsors. Platinum: Inkoova, Intelequia, NTT DATA, Tokiota and V-Valley. Gold: Axazure by Avvale and Plain Concepts. Supported by Sessionize. Positions and sizes copy the official sponsor slide, because each tier pays for its place.', ['sponsors', 'sponsors']), { board: 'sponsors', dim: true }),
      Object.assign(B('ghaw.markdown', ['GitHub Agentic Workflows\nin 5 minutes.', 'GitHub Agentic Workflows\nen 5 minutos.'],
        ['A workflow is a Markdown file: settings on top, the prompt below. GitHub supplies the actions and the setup.', 'Un workflow es un Markdown: arriba la configuración, abajo el prompt. GitHub pone las acciones y los ajustes.'], 'cover', 1, [],
        'Start with the tool the title names, before our own story. In GitHub Agentic Workflows, gh-aw, a workflow is one Markdown file in the repo. The frontmatter on top is the wiring: when it runs, here when an Issue gets a label; the permissions, here read only; the engine, here Claude; and the safe outputs it may produce, here one pull request. The body is the prompt, in plain words. GitHub supplies the predefined actions and settings around it. This is a minimal example, not one of ours: our workers use the same keys and run to several hundred lines.', ['cat .github/workflows/implement-issue.md', 'cat .github/workflows/implement-issue.md']), { board: 'markdown', dim: true }),
      F('ghaw.flow', ['From Issue to PR\nwith one API key.', 'De una Issue a un PR\ncon una API key.'],
        ['You compile the Markdown into an Actions workflow. The agent reads with no write access and proposes. gh-aw checks the proposal and opens the PR.', 'Compilas el Markdown a un workflow de Actions. El agente lee sin permiso de escritura y propone. gh-aw valida la propuesta y abre el PR.'],
        'ghaw', 'cover', 1,
        'gh aw compile turns the Markdown into a GitHub Actions workflow, a lock file you commit. When the event fires, Actions runs it. The agent runs with your AI API key and read-only permissions, so it cannot push or comment by itself. It writes its result as a safe output. gh-aw validates that output and only then performs the write, here opening one pull request. With one API key, an Issue becomes a pull request. Everything after this slide is what it takes to run that in production.', ['gh aw compile', 'gh aw compile']),
      B('ghaw.months', ['Understanding it takes 5 minutes.\nGetting it right takes months.', 'Entenderlo lleva 5 minutos.\nPreparar bien las bases, meses.'],
        ['The demo works on day one. Running it on real repos took us months: conventions, an agent environment, routes with gates, runners and measurement.', 'La demo funciona el primer día. Llevarlo a repos reales nos ha costado meses: convenciones, entorno para agentes, rutas con gates, runners y medición.'], 'cover', 1, [],
        'This is the turn of the talk. Anyone can make the demo work in an afternoon. Making it safe on real repositories, with real teams, is where the months went: conventions the agent can follow, an environment that holds it, routes with gates that decide, runners that cost little, and numbers that show what works. The rest of the talk is those bases, in the order we built them.', ['the hard part', 'lo difícil']),
      B('local', ['At the start,\nwe worked with AI\nsynchronously.', 'Al inicio\ntrabajábamos con IA\nde forma síncrona.'],
      ['You supply context, review the change and give the next instruction.', 'Das contexto, revisas el cambio y das la siguiente instrucción.'], 'local', 0, [U('core', 'talk.label.agent')],
      'Start with the audience experience. The engineer asks for a change, supplies files, inspects the patch, and redirects the agent. The feedback loop depends on the person being present.', ['interactive work', 'trabajo interactivo'], 'statement')] },
  { id: '03-maturity', scene: 'assessment', title: 'AI adoption and team maturity', name: 'assessment', source: '../knowledge/maturity.md', beats: [
    B('maturity.levels', ['Different levels\nof maturity.', 'Diferentes niveles\nde madurez.'],
      ['Different teams and companies are at different points in adopting AI across the software development lifecycle.', 'Diferentes equipos y empresas presentan diferentes momentos en la adopción de la IA en el ciclo de vida de software.'], 'assessment', 0, levels,
      'Use the five assessment levels, with their exact names. No AI is manual work. Exploratory is individual use. Structured adds approved tools and review guidance. Scaled makes practice consistent across teams. Governed & Optimized puts governance and improvement into the workflow. Do not equate a tool upgrade with organizational maturity.', ['AI SDLC assessment', 'assessment AI SDLC']),
  ] },
  { id: '04-evolution', scene: 'layers', title: 'The evolution of AI', name: 'evolution', source: '../knowledge/talk-notes.md', beats: [
    B('evolution.timeline', ['The evolution of AI.', 'La evolución de la IA.'],
      ['', ''], 'evolution', 0,
      [U('era.model', 'talk.era.models'), O('era.prompt', 'talk.era.prompts'), U('context', 'talk.era.skills'), O('core', 'talk.era.agents'), U('wall', 'talk.era.guardrails'), O('harness', 'talk.era.harnesses'), U('era.loop', 'talk.era.loops', 32), O('era.loops', 'talk.era.autonomous', 30), U('era.future', 'talk.era.future')],
      'Walk the line from left to right. Models made chat AI common. Then we wrote prompts: you ask, review the change and ask again, with the engineer always present. Skills keep a procedure, so the next session can reuse it. Agents plan, use tools and edit code. That needs guardrails, because instructions alone do not stop a bad tool call. A Harness puts the model, the tools, the skills and the repo rules in one place. Loops and graphs let the work continue after you leave the PC: a repo event starts it. Agentic Workflows run those loops on Platform. This talk covers the last three steps. Nobody knows the next one yet.', ['models → prompts → skills → agents → loops', 'modelos → prompts → skills → agentes → loops']),
  ] },
  { id: '05-platform', scene: 'method', title: 'How we built Platform', name: 'platform', source: '../knowledge/website-reading.md', cloud: true, beats: [
    C('platform.chapter', ['How we built the Platform', 'Cómo construimos Plataforma'], 'evolution', 0, 'Pause. The talk moves from your PC to the Platform department and its four repositories.'),
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
    B('harness.conventions', ['agent-harness:\nagentic conventions.', 'agent-harness:\nconvenciones agénticas.'],
      ['One command installs it in each repo: OpenSpec for changes, plugins that block unsafe actions, the skills each project needs, and guardrails.', 'Un comando lo instala en cada repo: OpenSpec para los cambios, plugins que bloquean acciones inseguras, las skills que necesita cada proyecto y guardrails.'], 'environment', 0,
      [U('harness', 'talk.label.harness'), U('kit.spec', 'talk.label.specs'), U('kit.plugin', 'talk.label.plugins'), U('context', 'talk.label.skillsProject'), U('wall', 'talk.label.guardrails')],
      'One npx command runs a wizard and installs the harness in a repo. OpenSpec manages each change as a proposal, specs and tasks. Plugins enforce rules at the tool call: pc-system-reminders denies about twelve unsafe actions, such as a forced push. Each project loads only the pc-* skills it needs. Guardrails such as linters and spec checks fail the build. The same harness runs on a PC and in CI.', ['npx @plainconceptsplatform/agent-harness', 'npx @plainconceptsplatform/agent-harness']),
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
    B('workflows.hybrid', ['Jobs → agent → jobs\n→ Safe Outputs', 'Jobs → agente → jobs\n→ Safe Outputs'],
      ['Jobs collect facts. OpenCode decides through Forge, our AI gateway, with read-only access. Validators check the result. Safe Outputs applies allowed writes.', 'Los jobs reúnen hechos. OpenCode decide a través de Forge, nuestro gateway de IA, en solo lectura. Validadores revisan el resultado. Safe Outputs aplica escrituras permitidas.'], 'workflow', 1, pipeline,
      'Every worker climbs the same ladder. Rung 1 classifies in shell. Rung 3 collects facts. Rung 4 reserves the Issue and checks eligibility. Rung 5 is the agent. Rung 6 concludes in shell. The agent is OpenCode, and it never talks to a model provider itself. It talks to Forge, the Plain Concepts AI gateway. Forge chooses the provider and the model, and each project has its own key, so we control cost and access for each project. The model, the provider, and the runtime can change. The architecture around them stays. Deterministic validators enforce the result contract. Fixed jobs apply allowed writes. Safe Outputs defines the permitted verbs. The agent itself has read-only repository permissions. Neither a label check nor a fixed comment needs a model.', ['OpenCode → Forge → model · Safe Outputs', 'OpenCode → Forge → modelo · Safe Outputs']),
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
    Object.assign(B('health.portfolio', ['One dashboard for every project.', 'Un panel para cada proyecto.'],
      ['Three of five DORA metrics, from GitHub alone. Change fail rate and recovery time need incident data GitHub lacks, so they stay empty.', 'Tres de cinco métricas DORA, solo desde GitHub. Fallos en cambios y recuperación piden incidentes que GitHub no guarda.'], 'feedback', 0, [],
      'Project Health is a template repository. It collects delivery and agent facts from the GitHub API, stores them as JSON, and publishes a static site. There is no database and no service to run. Each project gets a card: its status, production, pre-production or planned, then deployment frequency, change lead time at P50, and deployment rework rate, marked by a hotfix or bug label. If the project runs agents, the card adds runs, tokens and the OpenCode step time. The detail page adds P75 and P90, issue to staging, a monthly trend, who opened the work and who released it, and notes that change how a number should be read. Change fail rate and recovery time need to know that a release caused a production problem, which GitHub does not record, so they are not shown rather than estimated. The team profile places a project among the DORA 2025 profiles using throughput and stability only. Well-being needs a survey, so it stays unknown, and the result is a set of candidate profiles. The numbers on this slide are the template demo data, not our projects. Our private instance measures ten projects. Show the demo; never show real project names or the people columns.', ['project-health · DORA · agents', 'project-health · DORA · agentes']), { board: 'portfolio', dim: true }),
  ] },
  { id: '10-system', scene: 'whole', title: 'The whole Platform system', name: 'system', source: '../knowledge/maturity.md', cloud: true, beats: [
    Object.assign(B('system', ['From Issue to production\nwith GitHub Agentic Workflows.', 'De una Issue a producción\ncon GitHub Agentic Workflows.'],
      ['Product experts who do not code file small eligible Issues or bugs. They reach production without human supervision.', 'Personas no técnicas de producto crean Issues o bugs pequeños y elegibles. Llegan a producción sin supervisión humana.'], 'system', 0,
      [U('triage', 'talk.label.triage'), U('core', 'talk.label.route'), U('wall', 'talk.label.ci'), U('gate', 'talk.label.gate'), U('deployment', 'talk.label.production')],
      'Return to the person at the PC from the opening. The completed system now lets someone close to the product create a small eligible Issue or bug. That person does not need to code or supervise the agent. Trace their Issue through Triage, Refine, Implement, CI, Merge Gate, the application deployment, and Health. They define the intended behavior and answer product questions when needed. The system owns execution and its checks. This autonomy depends on the technical and agent base established in Foundations, with the Harness and workflow controls in place. Protected technical changes still need their owner. People with write access label an Issue straight into the route. Everyone else enters through Triage. Application deployment follows the project configuration. The manually dispatched package Release worker is a separate route. The five maturity forms remain in the field without claiming an assessment score. Health feeds evidence into the three earlier pillars. End on the product change in production and the measured improvement loop.', ['Maintenance · Issue → production → Health', 'Maintenance · Issue → producción → Health']), { footnote: 'talk.maturity.line' }),
    Object.assign(B('closing.question', ['What exactly are software engineers supposed to do?', '¿Qué se supone exactamente que deben hacer los ingenieros de software?'],
      ['', ''], 'system', 0, [],
      'Ask the question and let it sit. If an Issue can reach production on its own, what is left for us? Answer with Uncle Bob Martin, on X on 5 October 2026: the job does not change. We still make sure the structure of the system is robust and maintainable, and that its behavior serves our users. That takes engineering discipline. It does not take reading every line of the code, just as using a compiler does not take reading the binary. That is what the whole talk built: conventions in Foundations, a Harness for the agents, workflows with gates, and Health to measure. Source: https://x.com/unclebobmartin/status/2107069060420637178', ['what do engineers do?', '¿qué hace un ingeniero?']), { board: 'quote', dim: true }),
  ] },
]

// One real Issue went through Triage, Refine, Implement and Merge Gate. The presenter opens it live from those slides.
// The repository is private, so the audience cannot open it. The visible label names no client project.
const EXAMPLE_750 = { href: 'https://github.com/PlainConceptsPlatform/Numa/issues/750', label: 'talk.link.example750' }
for (const section of sections) for (const beat of section.beats) {
  if (['workflows.triage', 'workflows.refine', 'workflows.implement', 'workflows.gate'].includes(beat.key)) beat.link = EXAMPLE_750
  // The same Issue on the Project Health roadmap.
  if (beat.key === 'health.portfolio') beat.link = { href: 'https://probable-fiesta-2y6w5gw.pages.github.io/projects/numa/#roadmap/750', label: 'talk.link.health750' }
}
