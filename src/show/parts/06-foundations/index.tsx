import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "06-foundations",
  "scene": "constraints",
  "title": "Foundations: conventions enforced in code",
  "beats": [
    {
      "heading": "talk.foundations.guardrails.title",
      "line": "talk.foundations.guardrails.body",
      "command": "talk.foundations.guardrails.command",
      "picture": "baseline",
      "step": 0,
      "labels": [
        {
          "target": "context",
          "name": "talk.label.foundations",
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
      "step": 1,
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
