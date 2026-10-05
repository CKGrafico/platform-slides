import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "04-evolution",
  "scene": "layers",
  "title": "Prompts to asynchronous work",
  "beats": [
    {
      "heading": "talk.evolution.instructions.title",
      "line": "talk.evolution.instructions.body",
      "command": "talk.evolution.instructions.command",
      "picture": "evolution",
      "step": 0,
      "labels": [
        {
          "target": "context",
          "name": "talk.label.skills",
          "dx": -12,
          "dy": 18,
          "width": 30
        },
        {
          "target": "core",
          "name": "node.core",
          "dx": 2,
          "dy": -20,
          "width": 30
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.evolution.environment.title",
      "line": "talk.evolution.environment.body",
      "command": "talk.evolution.environment.command",
      "picture": "evolution",
      "step": 1,
      "labels": [
        {
          "target": "automation",
          "name": "talk.label.plugins",
          "dx": -12,
          "dy": 18,
          "width": 30
        },
        {
          "target": "harness",
          "name": "talk.label.harness",
          "dx": -12,
          "dy": -20,
          "width": 30
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.evolution.async.title",
      "line": "talk.evolution.async.body",
      "command": "talk.evolution.async.command",
      "picture": "evolution",
      "step": 2,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.router",
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
    }
  ]
},
  before: picture('assessment', 1),
}
export const evolution = makePart(part)
