import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "07-harness",
  "scene": "environment",
  "title": "What agent-harness installs",
  "beats": [
    {
      "heading": "talk.harness.contents.title",
      "line": "talk.harness.contents.body",
      "command": "talk.harness.contents.command",
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
          "target": "context",
          "name": "talk.label.docs",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.harness.runtime.title",
      "line": "talk.harness.runtime.body",
      "command": "talk.harness.runtime.command",
      "picture": "environment",
      "step": 1,
      "labels": [
        {
          "target": "automation",
          "name": "talk.label.plugins",
          "width": 28,
          "under": true
        },
        {
          "target": "harness",
          "name": "talk.label.harness",
          "width": 28,
          "under": true
        },
        {
          "target": "forge",
          "name": "map.forge",
          "width": 28,
          "under": true
        },
        {
          "target": "core",
          "name": "talk.label.agent",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('baseline', 1),
}
export const harness = makePart(part)
