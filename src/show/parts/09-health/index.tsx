import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "09-health",
  "scene": "feedback",
  "title": "Project Health measures and improves the system",
  "beats": [
    {
      "heading": "talk.health.chapter.title",
      "command": "talk.health.chapter.command",
      "picture": "workflow",
      "step": 4,
      "labels": [],
      "layout": "chapter",
      "dim": true,
      "cloud": true
    },
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
          "width": 28,
          "under": true
        },
        {
          "target": "missing",
          "name": "p12.notCollected",
          "width": 28,
          "under": true
        },
        {
          "target": "review",
          "name": "talk.label.attention",
          "width": 28,
          "under": true
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
          "target": "measure",
          "name": "talk.label.health",
          "width": 28,
          "under": true
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
