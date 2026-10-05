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
      "heading": "talk.harness.change.title",
      "line": "talk.harness.change.body",
      "command": "talk.harness.change.command",
      "picture": "environment",
      "step": 1,
      "labels": [
        {
          "target": "context",
          "name": "talk.label.specs",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "automation",
          "name": "talk.label.skills",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.harness.plugins.title",
      "line": "talk.harness.plugins.body",
      "command": "talk.harness.plugins.command",
      "picture": "environment",
      "step": 2,
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
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.harness.shared.title",
      "line": "talk.harness.shared.body",
      "command": "talk.harness.shared.command",
      "picture": "environment",
      "step": 3,
      "labels": [
        {
          "target": "harness",
          "name": "talk.label.harness",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "forge",
          "name": "map.forge",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('baseline', 3),
}
export const harness = makePart(part)
