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
          "dx": 0,
          "dy": 9.4,
          "width": 20,
          "align": "center",
          "anchorY": -6
        },
        {
          "target": "core",
          "name": "talk.label.route",
          "dx": 0,
          "dy": 5.7,
          "width": 24,
          "align": "center",
          "anchorY": -8
        },
        {
          "target": "wall",
          "name": "talk.label.ci",
          "dx": 0,
          "dy": 10.4,
          "width": 20,
          "align": "center",
          "anchorY": -5.5
        },
        {
          "target": "gate",
          "name": "talk.label.gate",
          "dx": 0,
          "dy": 10.4,
          "width": 20,
          "align": "center",
          "anchorY": -5.5
        },
        {
          "target": "deployment",
          "name": "talk.label.production",
          "dx": 0,
          "dy": 15,
          "width": 20,
          "align": "center",
          "anchorY": -3
        }
      ],
      "layout": "wide",
      "footnote": "talk.maturity.line",
      "cloud": true
    }
  ]
},
  before: picture('feedback', 1),
}
export const system = makePart(part)
