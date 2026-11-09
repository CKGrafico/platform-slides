// The speaker's bullets for the presenter window: the core message of each stop, in English and Spanish.
// The full speaker notes stay in docs/script/script.md. Keys are the beat keys of keynote-content.mjs, plus `cover`.
// Use only facts and numbers that the speaker notes already have.
export const speakerPoints = {
  cover: [
    ['One Issue, from a PC to production.', 'Through the Plain Concepts Platform.', 'Introduce yourself.'],
    ['Una Issue, de un PC a producción.', 'A través de Plain Concepts Platform.', 'Preséntate.'],
  ],
  local: [
    ['A demo works in an afternoon.', 'Safe on real repos and real teams took months.', 'The rest of the talk: those bases, in order.'],
    ['Una demo funciona en una tarde.', 'Seguro en repos y equipos reales: meses.', 'El resto de la charla: esas bases, en orden.'],
  ],
  'evolution.timeline': [
    ['Models → prompts → skills → agents.', 'Agents need guardrails: instructions do not stop a bad tool call.', 'A Harness puts model, tools, skills and rules in one place.', 'Loops run after you leave the PC. We cover the last three steps.'],
    ['Modelos → prompts → skills → agentes.', 'Los agentes necesitan guardrails: instrucciones no paran una mala tool call.', 'Un Harness junta modelo, tools, skills y reglas.', 'Los loops siguen sin ti. Cubrimos los tres últimos pasos.'],
  ],
  'maturity.levels': [
    ['Five levels: No AI, Exploratory, Structured, Scaled, Governed & Optimized.', 'Each team is at a different point.', 'A new tool is not maturity.'],
    ['Cinco niveles: No AI, Exploratory, Structured, Scaled, Governed & Optimized.', 'Cada equipo está en un punto distinto.', 'Una herramienta nueva no es madurez.'],
  ],
  'platform.pillars': [
    ['Platform: a Plain Concepts department that builds and maintains apps.', 'Foundations: conventions. agent-harness: the agent environment.', 'agentic-workflows: workers on events. project-health: measure.', 'Each pillar feeds the next.'],
    ['Platform: un departamento de Plain Concepts que crea y mantiene apps.', 'Foundations: convenciones. agent-harness: el entorno del agente.', 'agentic-workflows: workers por eventos. project-health: medir.', 'Cada pilar alimenta al siguiente.'],
  ],
  'foundations.conventions': [
    ['A thin shared base, not a framework: two packages.', '.NET with Clean Architecture. Next.js with strict TypeScript.', 'One brand: ui-theme, tokens only.', 'The site is the method written down. Open it live.'],
    ['Una base fina y compartida, no un framework: dos paquetes.', '.NET con Clean Architecture. Next.js con TypeScript estricto.', 'Una marca: ui-theme, solo tokens.', 'La web es el método por escrito. Ábrela en vivo.'],
  ],
  'harness.conventions': [
    ['One npx command. Update replays your answers.', 'AGENTS.md always in context. OpenSpec for each change.', 'Blue lines are guardrails: plugins block about 12 unsafe actions.', 'The same harness on a PC and in CI.'],
    ['Un comando npx. Update repite tus respuestas.', 'AGENTS.md siempre en contexto. OpenSpec en cada cambio.', 'En azul, guardrails: plugins bloquean unas 12 acciones inseguras.', 'El mismo harness en el PC y en CI.'],
  ],
  'harness.skills': [
    ['A real project: 58 skills. 27 from skills.sh, pinned by hash.', 'Guardrails: one global, one per project.', 'An agent is a Markdown file with the skills it loads.', 'A plugin blocks edits until every skill is loaded.'],
    ['Un proyecto real: 58 skills. 27 de skills.sh, fijadas por hash.', 'Guardrails: uno global y uno por proyecto.', 'Un agente es un Markdown con las skills que carga.', 'Un plugin bloquea editar hasta cargar todas las skills.'],
  ],
  'harness.tiers': [
    ['Three models per project: plan, build, fast.', '/plan-propose gives each task an agent and a tier.', '/plan-apply runs waves on separate files, four agents at most.', 'The task picks the model, not the agent.'],
    ['Tres modelos por proyecto: plan, build, fast.', '/plan-propose da a cada tarea un agente y un tier.', '/plan-apply ejecuta oleadas en ficheros distintos, cuatro como máximo.', 'La tarea elige el modelo, no el agente.'],
  ],
  'workflows.intro': [
    ['The work leaves the PC.', 'Pipeline: we use gh-aw. Any CI/CD would do. Only that layer would change.', 'On top: one router, workers with harness skills, Safe Outputs.', 'Each step has a rung: shell is 1, the agent is 5.'],
    ['El trabajo sale del PC.', 'Pipeline: usamos gh-aw. Valdría cualquier CI/CD. Solo cambiaría esa capa.', 'Encima: un router, workers con skills del harness, Safe Outputs.', 'Cada paso tiene un peldaño: shell es 1, el agente 5.'],
  ],
  'workflows.engine': [
    ['What we do not rent: the agent runtime.', 'Every worker runs OpenCode. OpenCode talks only to Forge.', 'Forge routes models, meters tokens, masks data, keeps security.', 'One key per project. One door we control.'],
    ['Lo que no alquilamos: el runtime del agente.', 'Cada worker corre OpenCode. OpenCode solo habla con Forge.', 'Forge enruta modelos, mide tokens, enmascara datos, guarda la seguridad.', 'Una clave por proyecto. Una puerta que controlamos.'],
  ],
  'workflows.router': [
    ['The router owns every trigger.', 'Rung 1: pure shell, no network, no model.', 'Authorize, then start one worker or none.', 'Labels are state for people, not the lock. An idle run: about 10 s.'],
    ['El router recibe todos los triggers.', 'Peldaño 1: shell puro, sin red, sin modelo.', 'Autoriza y lanza un worker o ninguno.', 'Las labels son estado para personas, no el lock. Run vacío: unos 10 s.'],
  ],
  'workflows.triage': [
    ['Only for outside collaborators.', 'Legend: white job, blue agent, blue outline after the agent, GitHub mark from gh-aw.', 'Ten checks, four outcomes: pass, needs info, maintainer, block.', 'Three rounds at most.'],
    ['Solo para colaboradores externos.', 'Leyenda: blanco job, azul agente, borde azul tras el agente, marca GitHub de gh-aw.', 'Diez checks, cuatro salidas: pasa, falta info, mantenedor, bloqueo.', 'Tres rondas como máximo.'],
  ],
  'workflows.refine': [
    ['Size guard first: too long goes back to the author.', 'The agent explores the real code, one unit at a time.', 'Given, When, Then. Fibonacci estimate.', '8 or more splits into 2 to 6 children.'],
    ['Primero el tamaño: si es largo, vuelve al autor.', 'El agente explora el código real, unidad a unidad.', 'Given, When, Then. Estimación Fibonacci.', '8 o más se divide en 2 a 6 hijas.'],
  ],
  'workflows.implement': [
    ['Eligibility check, then we cut the branch.', 'Trivial: direct path. The rest: plan-goal from the harness.', 'Verify the scoped files. One PR.', 'The gate decides the merge, not this worker.'],
    ['Control de elegibilidad, luego creamos la rama.', 'Trivial: camino directo. El resto: plan-goal del harness.', 'Verifica los ficheros del alcance. Un PR.', 'El gate decide el merge, no este worker.'],
  ],
  'workflows.gate': [
    ['CI red: repair, push, CI again.', 'CI green: measure the blast radius. The agent hunts defects.', 'Shell decides: merge, human, owner or blocked.', 'Only this worker merges.'],
    ['CI en rojo: repara, push, CI otra vez.', 'CI en verde: mide el radio de impacto. El agente busca defectos.', 'Decide shell: merge, persona, owner o bloqueo.', 'Solo este worker fusiona.'],
  ],
  'workflows.others': [
    ['Apply Review: applies only justified feedback.', 'Audit: weekly, one Issue with the top three findings.', 'Release: the agent writes only the notes.', 'Visual Verify: screenshots after a merge. Never blocks.'],
    ['Apply Review: aplica solo el feedback justificado.', 'Audit: semanal, una Issue con los tres hallazgos clave.', 'Release: el agente solo escribe las notas.', 'Visual Verify: capturas tras el merge. Nunca bloquea.'],
  ],
  'health.intro': [
    ['The fourth pillar closes the loop.', 'Reads GitHub every night. Changes nothing.', 'No database, no service: JSON and a static site.', 'Four tabs, one real project, no name.'],
    ['El cuarto pilar cierra el círculo.', 'Lee GitHub cada noche. No cambia nada.', 'Sin base de datos ni servicio: JSON y web estática.', 'Cuatro pestañas, un proyecto real, sin nombre.'],
  ],
  'health.engineering': [
    ['First question: would anything stop a bad change?', 'This project: L3, score 100, ten gates passed.', 'AI usage 4 of 5: 82 of 147 commits.', 'High AI usage with low engineering raises an alert.'],
    ['Primera pregunta: ¿algo pararía un mal cambio?', 'Este proyecto: L3, nota 100, diez gates en verde.', 'Uso de IA 4 de 5: 82 de 147 commits.', 'Mucha IA con poca ingeniería lanza una alerta.'],
  ],
  'health.delivery': [
    ['DORA: the common language for delivery.', 'GitHub gives three of five metrics. The others need production data.', '2.31 releases a week. Lead time p50: 6.2 h.', 'Issue to staging p50: 2 days. Rework: 0%.'],
    ['DORA: el idioma común de la entrega.', 'GitHub da tres de cinco métricas. Las otras piden datos de producción.', '2,31 releases a la semana. Lead time p50: 6,2 h.', 'De Issue a staging p50: 2 días. Rework: 0 %.'],
  ],
  'health.agentic': [
    ['Installed and current? Here: yes, seven workers.', 'The gate merged 5 of 9 PRs with no person.', '202.69 M tokens, 10 h 27 min of agent time, 76 runs.', 'Not every project needs the same level.'],
    ['¿Instalado y al día? Aquí sí, siete workers.', 'El gate fusionó 5 de 9 PRs sin personas.', '202,69 M tokens, 10 h 27 min de agente, 76 runs.', 'No todos los proyectos necesitan el mismo nivel.'],
  ],
  'health.roadmap': [
    ['Open time, split into five states.', 'An agent worked 4% of it.', 'A third waited on a person. The bottleneck is us, not the agent.', 'Issue 750: sp-3, open 34 h, agent 2 h 32 min.'],
    ['Tiempo abierto, en cinco estados.', 'Un agente trabajó el 4 %.', 'Un tercio esperó a una persona. El cuello de botella somos nosotros.', 'Issue 750: sp-3, abierta 34 h, agente 2 h 32 min.'],
  ],
  'closing.question': [
    ['Ask it and let it sit.', 'Uncle Bob: the job does not change.', 'A robust structure, and behavior that serves users.', 'Discipline, not reading every line.'],
    ['Pregunta y deja que se asiente.', 'Uncle Bob: el trabajo no cambia.', 'Estructura robusta y un comportamiento útil.', 'Disciplina, no leer cada línea.'],
  ],
  system: [
    ['Back to the person at the PC.', 'Someone close to the product files a small Issue. It reaches production.', 'The system runs the work and its checks.', 'platform.ckgrafico.com · all open source · questions.', 'Before the talk: check that the four repos are public.'],
    ['Volvemos a la persona del PC.', 'Alguien de producto crea una Issue pequeña. Llega a producción.', 'El sistema ejecuta el trabajo y sus checks.', 'platform.ckgrafico.com · todo open source · preguntas.', 'Antes de la charla: comprueba que los cuatro repos son públicos.'],
  ],
}
