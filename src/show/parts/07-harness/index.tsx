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
          "dx": -15,
          "dy": -22,
          "width": 30
        },
        {
          "target": "context",
          "name": "talk.label.docs",
          "dx": -15,
          "dy": 18,
          "width": 30
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
        },
        {
          "target": "forge",
          "name": "map.forge",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "core",
          "name": "talk.label.agent",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('baseline', 1),
}
export const harness = makePart(part)
