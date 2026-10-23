import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "08-workflows",
  "scene": "pipeline",
  "title": "Agentic Workflows: jobs, reasoning, validated writes",
  "beats": [
    {
      "heading": "talk.workflows.intro.title",
      "line": "talk.workflows.intro.body",
      "command": "talk.workflows.intro.command",
      "picture": "workflow",
      "step": 0,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.issueEvent",
          "width": 28,
          "under": true
        },
        {
          "target": "automation",
          "name": "talk.label.workflowsOnGhAw",
          "width": 28,
          "under": true
        },
        {
          "target": "core",
          "name": "talk.label.agentForge",
          "width": 28,
          "under": true
        },
        {
          "target": "outputs",
          "name": "talk.label.safeOutputs",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "link": {
        "href": "https://workflows.platform.plainconcepts.dev",
        "label": "talk.link.workflows"
      },
      "cloud": true
    },
    {
      "heading": "talk.workflows.engine.title",
      "line": "talk.workflows.engine.body",
      "command": "talk.workflows.engine.command",
      "picture": "workflow",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://workflows.platform.plainconcepts.dev",
        "label": "talk.link.workflows"
      },
      "dim": true,
      "flow": "engine",
      "cloud": true
    },
    {
      "heading": "talk.workflows.router.title",
      "line": "talk.workflows.router.body",
      "command": "talk.workflows.router.command",
      "picture": "workflow",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "footnote": "talk.workflows.ladder",
      "link": {
        "href": "https://workflows.platform.plainconcepts.dev/#router",
        "label": "talk.link.workflows"
      },
      "dim": true,
      "flow": "router",
      "cloud": true
    },
    {
      "heading": "talk.workflows.triage.title",
      "line": "talk.workflows.triage.body",
      "command": "talk.workflows.triage.command",
      "picture": "workflow",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://github.com/PlainConceptsPlatform/Numa/issues/750",
        "label": "talk.link.example750"
      },
      "dim": true,
      "flow": "triage",
      "cloud": true
    },
    {
      "heading": "talk.workflows.refine.title",
      "line": "talk.workflows.refine.body",
      "command": "talk.workflows.refine.command",
      "picture": "workflow",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://github.com/PlainConceptsPlatform/Numa/issues/750",
        "label": "talk.link.example750"
      },
      "dim": true,
      "flow": "refine",
      "cloud": true
    },
    {
      "heading": "talk.workflows.implement.title",
      "line": "talk.workflows.implement.body",
      "command": "talk.workflows.implement.command",
      "picture": "workflow",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://github.com/PlainConceptsPlatform/Numa/issues/750",
        "label": "talk.link.example750"
      },
      "dim": true,
      "flow": "implement",
      "cloud": true
    },
    {
      "heading": "talk.workflows.gate.title",
      "line": "talk.workflows.gate.body",
      "command": "talk.workflows.gate.command",
      "picture": "workflow",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://github.com/PlainConceptsPlatform/Numa/issues/750",
        "label": "talk.link.example750"
      },
      "dim": true,
      "flow": "gate",
      "cloud": true
    },
    {
      "heading": "talk.workflows.others.title",
      "line": "talk.workflows.others.body",
      "command": "talk.workflows.others.command",
      "picture": "workflow",
      "step": 5,
      "labels": [
        {
          "target": "review",
          "name": "talk.label.applyReview",
          "width": 28,
          "under": true
        },
        {
          "target": "audit",
          "name": "talk.label.audit",
          "width": 28,
          "under": true
        },
        {
          "target": "release",
          "name": "talk.label.release",
          "width": 28,
          "under": true
        },
        {
          "target": "deployment",
          "name": "talk.label.visualVerify",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "link": {
        "href": "https://workflows.platform.plainconcepts.dev/#workers",
        "label": "talk.link.workflows"
      },
      "cloud": true
    }
  ]
},
  before: picture('environment', 0, true),
}
export const workflows = makePart(part)
