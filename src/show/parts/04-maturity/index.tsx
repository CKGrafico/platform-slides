import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "04-maturity",
  "scene": "assessment",
  "title": "AI adoption and team maturity",
  "beats": [
    {
      "heading": "talk.maturity.levels.title",
      "line": "talk.maturity.levels.body",
      "command": "talk.maturity.levels.command",
      "picture": "assessment",
      "step": 0,
      "labels": [
        {
          "target": "level.0",
          "name": "talk.level.1",
          "width": 28,
          "under": true
        },
        {
          "target": "level.1",
          "name": "talk.level.2",
          "width": 28,
          "under": true
        },
        {
          "target": "level.2",
          "name": "talk.level.3",
          "width": 28,
          "under": true
        },
        {
          "target": "level.3",
          "name": "talk.level.4",
          "width": 28,
          "under": true
        },
        {
          "target": "level.4",
          "name": "talk.level.5",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('evolution', 0),
}
export const assessment = makePart(part)
