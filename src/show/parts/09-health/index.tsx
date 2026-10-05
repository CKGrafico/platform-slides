import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "09-health",
  "scene": "feedback",
  "title": "Project Health measures and improves the system",
  "beats": [
    {
      "heading": "talk.health.dora.title",
      "line": "talk.health.dora.body",
      "command": "talk.health.dora.command",
      "picture": "feedback",
      "step": 0,
      "labels": [
        {
          "target": "measure",
          "name": "talk.label.health",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "missing",
          "name": "p12.notCollected",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.health.agent.title",
      "line": "talk.health.agent.body",
      "command": "talk.health.agent.command",
      "picture": "feedback",
      "step": 1,
      "labels": [
        {
          "target": "measure",
          "name": "talk.label.health",
          "dx": -12,
          "dy": -20,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.health.people.title",
      "line": "talk.health.people.body",
      "command": "talk.health.people.command",
      "picture": "feedback",
      "step": 2,
      "labels": [
        {
          "target": "review",
          "name": "show.review.label",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "measure",
          "name": "talk.label.health",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.health.improve.title",
      "line": "talk.health.improve.body",
      "command": "talk.health.improve.command",
      "picture": "feedback",
      "step": 3,
      "labels": [
        {
          "target": "audit",
          "name": "talk.label.audit",
          "dx": 3,
          "dy": -20,
          "width": 30
        },
        {
          "target": "refine",
          "name": "talk.label.refine",
          "dx": -12,
          "dy": 18,
          "width": 30
        },
        {
          "target": "measure",
          "name": "talk.label.health",
          "dx": -12,
          "dy": -20,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    }
  ]
},
  before: picture('workflow', 8),
}
export const health = makePart(part)
