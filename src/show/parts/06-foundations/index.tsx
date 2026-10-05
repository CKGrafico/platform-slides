import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "06-foundations",
  "scene": "constraints",
  "title": "Foundations: conventions enforced in code",
  "beats": [
    {
      "heading": "talk.foundations.stack.title",
      "line": "talk.foundations.stack.body",
      "command": "talk.foundations.stack.command",
      "picture": "baseline",
      "step": 0,
      "labels": [
        {
          "target": "context",
          "name": "talk.label.foundations",
          "dx": -10,
          "dy": -20,
          "width": 30
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.foundations.build.title",
      "line": "talk.foundations.build.body",
      "command": "talk.foundations.build.command",
      "picture": "baseline",
      "step": 1,
      "labels": [
        {
          "target": "wall",
          "name": "map.walls",
          "dx": -10,
          "dy": -20,
          "width": 30
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.foundations.behavior.title",
      "line": "talk.foundations.behavior.body",
      "command": "talk.foundations.behavior.command",
      "picture": "baseline",
      "step": 2,
      "labels": [
        {
          "target": "context",
          "name": "talk.label.specs",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "wall",
          "name": "map.walls",
          "dx": -10,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.foundations.owners.title",
      "line": "talk.foundations.owners.body",
      "command": "talk.foundations.owners.command",
      "picture": "baseline",
      "step": 3,
      "labels": [
        {
          "target": "gate",
          "name": "talk.label.gate",
          "dx": -12,
          "dy": -20,
          "width": 30
        },
        {
          "target": "review",
          "name": "show.review.label",
          "dx": -12,
          "dy": 18,
          "width": 30
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('platform', 1),
}
export const foundations = makePart(part)
