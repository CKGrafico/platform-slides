import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "05-platform",
  "scene": "method",
  "title": "How we built Platform",
  "beats": [
    {
      "heading": "talk.platform.pillars.title",
      "line": "talk.platform.pillars.body",
      "command": "talk.platform.pillars.command",
      "picture": "platform",
      "step": 0,
      "labels": [
        {
          "target": "wall",
          "name": "talk.label.foundations",
          "dx": -15,
          "dy": -20,
          "width": 30
        },
        {
          "target": "harness",
          "name": "talk.label.harness",
          "dx": -15,
          "dy": 20,
          "width": 30
        },
        {
          "target": "automation",
          "name": "talk.label.workflows",
          "dx": -15,
          "dy": -20,
          "width": 30
        },
        {
          "target": "measure",
          "name": "talk.label.health",
          "dx": -15,
          "dy": 20,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    },
    {
      "heading": "talk.platform.phases.title",
      "line": "talk.platform.phases.body",
      "command": "talk.platform.phases.command",
      "picture": "platform",
      "step": 1,
      "labels": [
        {
          "target": "wall",
          "name": "talk.label.foundations",
          "dx": -10,
          "dy": -20,
          "width": 30
        },
        {
          "target": "intake",
          "name": "talk.label.router",
          "dx": -15,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide",
      "cloud": true
    }
  ]
},
  before: picture('evolution', 2),
}
export const platform = makePart(part)
