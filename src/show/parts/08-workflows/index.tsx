import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "08-workflows",
  "scene": "pipeline",
  "title": "Agentic Workflows: jobs, reasoning, validated writes",
  "beats": [
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
          "dx": -12,
          "dy": 17,
          "width": 30
        },
        {
          "target": "intake",
          "name": "talk.label.router",
          "dx": -12,
          "dy": 20,
          "width": 30
        },
        {
          "target": "refine",
          "name": "talk.label.refine",
          "dx": -12,
          "dy": -20,
          "width": 30
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
          "dx": -10,
          "dy": -18,
          "width": 22
        },
        {
          "target": "core",
          "name": "talk.label.agent",
          "dx": -10,
          "dy": 20,
          "width": 22
        },
        {
          "target": "wall",
          "name": "talk.label.validate",
          "dx": -10,
          "dy": -18,
          "width": 22
        },
        {
          "target": "outputs",
          "name": "talk.label.outputs",
          "dx": -10,
          "dy": 20,
          "width": 22
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
          "dx": -10,
          "dy": -18,
          "width": 22
        },
        {
          "target": "refine",
          "name": "talk.label.refine",
          "dx": -10,
          "dy": 20,
          "width": 22
        },
        {
          "target": "wall",
          "name": "talk.label.validate",
          "dx": -10,
          "dy": -18,
          "width": 22
        },
        {
          "target": "outputs",
          "name": "talk.label.outputs",
          "dx": -10,
          "dy": 20,
          "width": 22
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
          "dx": -10,
          "dy": -18,
          "width": 22
        },
        {
          "target": "core",
          "name": "talk.label.agent",
          "dx": -10,
          "dy": 20,
          "width": 22
        },
        {
          "target": "wall",
          "name": "talk.label.validate",
          "dx": -10,
          "dy": -18,
          "width": 22
        },
        {
          "target": "outputs",
          "name": "talk.label.outputs",
          "dx": -10,
          "dy": 20,
          "width": 22
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
          "dx": -12,
          "dy": -18,
          "width": 30
        },
        {
          "target": "gate",
          "name": "talk.label.gate",
          "dx": -12,
          "dy": 18,
          "width": 30
        },
        {
          "target": "review",
          "name": "show.review.label",
          "dx": -12,
          "dy": -18,
          "width": 30
        },
        {
          "target": "core",
          "name": "talk.label.implement",
          "dx": -12,
          "dy": 10,
          "width": 30
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
