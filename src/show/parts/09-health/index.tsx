import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "09-health",
  "scene": "feedback",
  "title": "Project Health measures and improves the system",
  "beats": [
    {
      "heading": "talk.health.measure.title",
      "line": "talk.health.measure.body",
      "command": "talk.health.measure.command",
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
        },
        {
          "target": "review",
          "name": "talk.label.attention",
          "dx": -12,
          "dy": -20,
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
      "step": 1,
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
  before: picture('workflow', 4),
}
export const health = makePart(part)
