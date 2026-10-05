import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "08-workflows",
  "scene": "pipeline",
  "title": "Agentic Workflows: jobs, reasoning, validated writes",
  "beats": [
    {
      "heading": "talk.workflows.chapter.title",
      "command": "talk.workflows.chapter.command",
      "picture": "environment",
      "step": 1,
      "labels": [],
      "layout": "chapter",
      "dim": true,
      "cloud": true
    },
    {
      "heading": "talk.workflows.router.title",
      "line": "talk.workflows.router.body",
      "command": "talk.workflows.router.command",
      "picture": "workflow",
      "step": 0,
      "labels": [
        {
          "target": "automation",
          "name": "talk.label.workflows",
          "width": 28,
          "under": true
        },
        {
          "target": "intake",
          "name": "talk.label.router",
          "width": 28,
          "under": true
        },
        {
          "target": "refine",
          "name": "talk.label.refine",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.workflows.hybrid.title",
      "line": "talk.workflows.hybrid.body",
      "command": "talk.workflows.hybrid.command",
      "picture": "workflow",
      "step": 1,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.facts",
          "width": 28,
          "under": true
        },
        {
          "target": "core",
          "name": "talk.label.agent",
          "width": 28,
          "under": true
        },
        {
          "target": "wall",
          "name": "talk.label.validate",
          "width": 28,
          "under": true
        },
        {
          "target": "outputs",
          "name": "talk.label.outputs",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.workflows.refine.title",
      "line": "talk.workflows.refine.body",
      "command": "talk.workflows.refine.command",
      "picture": "workflow",
      "step": 2,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.facts",
          "width": 28,
          "under": true
        },
        {
          "target": "refine",
          "name": "talk.label.refine",
          "width": 28,
          "under": true
        },
        {
          "target": "split",
          "name": "talk.label.split",
          "width": 28,
          "under": true
        },
        {
          "target": "outputs",
          "name": "talk.label.outputs",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.workflows.implement.title",
      "line": "talk.workflows.implement.body",
      "command": "talk.workflows.implement.command",
      "picture": "workflow",
      "step": 3,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.facts",
          "width": 28,
          "under": true
        },
        {
          "target": "core",
          "name": "talk.label.agent",
          "width": 28,
          "under": true
        },
        {
          "target": "wall",
          "name": "talk.label.validate",
          "width": 28,
          "under": true
        },
        {
          "target": "outputs",
          "name": "talk.label.outputs",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.workflows.gate.title",
      "line": "talk.workflows.gate.body",
      "command": "talk.workflows.gate.command",
      "picture": "workflow",
      "step": 4,
      "labels": [
        {
          "target": "wall",
          "name": "talk.label.ci",
          "width": 28,
          "under": true
        },
        {
          "target": "gate",
          "name": "talk.label.gate",
          "width": 28,
          "under": true
        },
        {
          "target": "review",
          "name": "show.review.label",
          "width": 28,
          "under": true
        },
        {
          "target": "core",
          "name": "talk.label.implement",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "cloud": true
    }
  ]
},
  before: picture('environment', 1),
}
export const workflows = makePart(part)
