import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "03-maturity",
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
          "dx": -15,
          "dy": -19,
          "width": 30
        },
        {
          "target": "level.1",
          "name": "talk.level.2",
          "dx": -15,
          "dy": 19,
          "width": 30
        },
        {
          "target": "level.2",
          "name": "talk.level.3",
          "dx": -15,
          "dy": -19,
          "width": 30
        },
        {
          "target": "level.3",
          "name": "talk.level.4",
          "dx": -15,
          "dy": 19,
          "width": 30
        },
        {
          "target": "level.4",
          "name": "talk.level.5",
          "dx": -15,
          "dy": -19,
          "width": 30
        }
      ],
      "layout": "wide"
    },
    {
      "heading": "talk.maturity.areas.title",
      "line": "talk.maturity.areas.body",
      "command": "talk.maturity.areas.command",
      "picture": "assessment",
      "step": 1,
      "labels": [
        {
          "target": "parcel.0",
          "name": "talk.area.sdlc",
          "dx": -15,
          "dy": -19,
          "width": 30
        },
        {
          "target": "parcel.1",
          "name": "talk.area.determinism",
          "dx": -15,
          "dy": 19,
          "width": 30
        },
        {
          "target": "parcel.2",
          "name": "talk.area.control",
          "dx": -15,
          "dy": -19,
          "width": 30
        },
        {
          "target": "parcel.3",
          "name": "talk.area.impact",
          "dx": -15,
          "dy": 19,
          "width": 30
        }
      ],
      "layout": "wide"
    }
  ]
},
  before: picture('local', 0),
}
export const assessment = makePart(part)
