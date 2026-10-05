import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "06-foundations",
  "scene": "constraints",
  "title": "Foundations: conventions enforced in code",
  "beats": [
    {
      "heading": "talk.foundations.chapter.title",
      "command": "talk.foundations.chapter.command",
      "picture": "platform",
      "step": 1,
      "labels": [],
      "layout": "chapter",
      "dim": true
    },
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
          "width": 28,
          "under": true
        },
        {
          "target": "wall",
          "name": "map.walls",
          "width": 28,
          "under": true
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
          "width": 28,
          "under": true
        },
        {
          "target": "review",
          "name": "show.review.label",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('platform', 1),
}
export const foundations = makePart(part)
