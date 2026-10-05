import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "08-workflows",
  "scene": "pipeline",
  "title": "Agentic Workflows: jobs, reasoning, validated writes",
  "beats": [
    {
      "heading": "talk.workflows.compile.title",
      "line": "talk.workflows.compile.body",
      "command": "talk.workflows.compile.command",
      "picture": "workflow",
      "step": 0,
      "labels": [
        {
          "target": "automation",
          "name": "talk.label.workflows",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "harness",
          "name": "talk.label.harness",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.workflows.router.title",
      "line": "talk.workflows.router.body",
      "command": "talk.workflows.router.command",
      "picture": "workflow",
      "step": 1,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.router",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "refine",
          "name": "talk.label.refine",
          "dx": -12,
          "dy": 18,
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
      "heading": "talk.workflows.refineReturns.title",
      "line": "talk.workflows.refineReturns.body",
      "command": "talk.workflows.refineReturns.command",
      "picture": "workflow",
      "step": 4,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.author",
          "dx": -15,
          "dy": 19,
          "width": 30
        },
        {
          "target": "refine",
          "name": "talk.label.refine",
          "dx": -12,
          "dy": -18,
          "width": 30
        },
        {
          "target": "split",
          "name": "talk.label.split",
          "dx": -12,
          "dy": 18,
          "width": 30
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
      "step": 5,
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
      "step": 6,
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
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.workflows.returns.title",
      "line": "talk.workflows.returns.body",
      "command": "talk.workflows.returns.command",
      "picture": "workflow",
      "step": 7,
      "labels": [
        {
          "target": "core",
          "name": "talk.label.implement",
          "dx": 2,
          "dy": -20,
          "width": 30
        },
        {
          "target": "review",
          "name": "talk.label.review",
          "dx": -12,
          "dy": 9,
          "width": 30
        },
        {
          "target": "gate",
          "name": "talk.label.gate",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.workflows.handoff.title",
      "line": "talk.workflows.handoff.body",
      "command": "talk.workflows.handoff.command",
      "picture": "workflow",
      "step": 8,
      "labels": [
        {
          "target": "gate",
          "name": "talk.label.gate",
          "dx": -12,
          "dy": 18,
          "width": 30
        },
        {
          "target": "release",
          "name": "talk.label.release",
          "dx": -22,
          "dy": 8,
          "width": 30
        },
        {
          "target": "intake",
          "name": "talk.label.router",
          "dx": -15,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    }
  ]
},
  before: picture('environment', 3),
}
export const workflows = makePart(part)
