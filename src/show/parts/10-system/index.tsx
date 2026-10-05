import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "10-system",
  "scene": "whole",
  "title": "The whole Platform system",
  "beats": [
    {
      "heading": "talk.system.title",
      "line": "talk.system.body",
      "command": "talk.system.command",
      "picture": "system",
      "step": 0,
      "labels": [
        {
          "target": "context",
          "name": "talk.label.foundations",
          "dx": -15,
          "dy": 4,
          "width": 30
        },
        {
          "target": "harness",
          "name": "talk.label.harness",
          "dx": -15,
          "dy": -14,
          "width": 30
        },
        {
          "target": "intake",
          "name": "talk.label.workflows",
          "dx": -15,
          "dy": 18,
          "width": 30
        },
        {
          "target": "measure",
          "name": "talk.label.health",
          "dx": -15,
          "dy": -15,
          "width": 30
        },
        {
          "target": "level.0",
          "name": "talk.level.1",
          "dx": -15,
          "dy": -5,
          "width": 30
        },
        {
          "target": "level.1",
          "name": "talk.level.2",
          "dx": -15,
          "dy": -5,
          "width": 30
        },
        {
          "target": "level.2",
          "name": "talk.level.3",
          "dx": -15,
          "dy": -5,
          "width": 30
        },
        {
          "target": "level.3",
          "name": "talk.level.4",
          "dx": -15,
          "dy": -5,
          "width": 30
        },
        {
          "target": "level.4",
          "name": "talk.level.5",
          "dx": -15,
          "dy": -5,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    }
  ]
},
  before: picture('feedback', 3),
}
export const system = makePart(part)
