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
          "target": "triage",
          "name": "talk.label.triage",
          "width": 28,
          "under": true
        },
        {
          "target": "core",
          "name": "talk.label.route",
          "width": 28,
          "under": true
        },
        {
          "target": "wall",
          "name": "talk.label.ci",
          "width": 28,
          "under": true
        },
        {
          "target": "gate",
          "name": "talk.label.gate",
          "width": 28,
          "under": true
        },
        {
          "target": "deployment",
          "name": "talk.label.production",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "footnote": "talk.maturity.line",
      "cloud": true
    },
    {
      "heading": "talk.closing.question.title",
      "line": "talk.closing.question.body",
      "command": "talk.closing.question.command",
      "picture": "system",
      "step": 0,
      "labels": [],
      "layout": "statement",
      "dim": true,
      "cloud": true
    }
  ]
},
  before: picture('feedback', 0, true),
}
export const system = makePart(part)
