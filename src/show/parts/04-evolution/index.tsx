import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "04-evolution",
  "scene": "layers",
  "title": "Prompts to asynchronous work",
  "beats": [
    {
      "heading": "talk.evolution.path.title",
      "line": "talk.evolution.path.body",
      "command": "talk.evolution.path.command",
      "picture": "evolution",
      "step": 0,
      "labels": [
        {
          "target": "context",
          "name": "talk.label.skills",
          "width": 28,
          "under": true
        },
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
          "target": "core",
          "name": "talk.label.agent",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.evolution.async.title",
      "line": "talk.evolution.async.body",
      "command": "talk.evolution.async.command",
      "picture": "evolution",
      "step": 1,
      "labels": [
        {
          "target": "intake",
          "name": "talk.label.router",
          "width": 28,
          "under": true
        },
        {
          "target": "harness",
          "name": "talk.label.harness",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('assessment', 0),
}
export const evolution = makePart(part)
