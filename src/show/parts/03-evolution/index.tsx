import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "03-evolution",
  "scene": "layers",
  "title": "The evolution of AI",
  "beats": [
    {
      "heading": "talk.evolution.timeline.title",
      "command": "talk.evolution.timeline.command",
      "picture": "evolution",
      "step": 0,
      "labels": [
        {
          "target": "era.model",
          "name": "talk.era.models",
          "width": 28,
          "under": true
        },
        {
          "target": "era.prompt",
          "name": "talk.era.prompts",
          "width": 28,
          "over": true
        },
        {
          "target": "context",
          "name": "talk.era.skills",
          "width": 28,
          "under": true
        },
        {
          "target": "core",
          "name": "talk.era.agents",
          "width": 28,
          "over": true
        },
        {
          "target": "wall",
          "name": "talk.era.guardrails",
          "width": 28,
          "under": true
        },
        {
          "target": "harness",
          "name": "talk.era.harnesses",
          "width": 28,
          "over": true
        },
        {
          "target": "era.loop",
          "name": "talk.era.loops",
          "width": 32,
          "under": true
        },
        {
          "target": "era.loops",
          "name": "talk.era.autonomous",
          "width": 30,
          "over": true
        },
        {
          "target": "era.future",
          "name": "talk.era.future",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('local', 0),
}
export const evolution = makePart(part)
