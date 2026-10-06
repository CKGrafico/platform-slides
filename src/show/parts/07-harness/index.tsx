import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "07-harness",
  "scene": "environment",
  "title": "agent-harness: agentic conventions",
  "beats": [
    {
      "heading": "talk.harness.conventions.title",
      "line": "talk.harness.conventions.body",
      "command": "talk.harness.conventions.command",
      "picture": "environment",
      "step": 0,
      "labels": [
        {
          "target": "harness",
          "name": "talk.label.harness",
          "width": 28,
          "under": true
        },
        {
          "target": "kit.spec",
          "name": "talk.label.specs",
          "width": 28,
          "under": true
        },
        {
          "target": "kit.plugin",
          "name": "talk.label.plugins",
          "width": 28,
          "under": true
        },
        {
          "target": "context",
          "name": "talk.label.skillsProject",
          "width": 28,
          "under": true
        },
        {
          "target": "wall",
          "name": "talk.label.guardrails",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "cloud": true
    }
  ]
},
  before: picture('baseline', 0),
}
export const harness = makePart(part)
