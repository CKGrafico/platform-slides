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
      "command": "talk.platform.pillars.command",
      "picture": "platform",
      "step": 0,
      "labels": [
        {
          "target": "wall",
          "name": "talk.label.foundations",
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
          "target": "automation",
          "name": "talk.label.workflows",
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
  before: picture('assessment', 0),
}
export const platform = makePart(part)
