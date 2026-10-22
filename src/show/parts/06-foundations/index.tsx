import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "06-foundations",
  "scene": "constraints",
  "title": "Foundations: technology conventions",
  "beats": [
    {
      "heading": "talk.foundations.conventions.title",
      "line": "talk.foundations.conventions.body",
      "command": "talk.foundations.conventions.command",
      "picture": "baseline",
      "step": 0,
      "labels": [
        {
          "target": "wall",
          "name": "talk.label.foundations",
          "width": 28,
          "under": true
        },
        {
          "target": "parcel.0",
          "name": "talk.label.backend",
          "width": 28,
          "under": true
        },
        {
          "target": "parcel.1",
          "name": "talk.label.frontend",
          "width": 28,
          "under": true
        },
        {
          "target": "parcel.2",
          "name": "talk.label.branding",
          "width": 28,
          "under": true
        }
      ],
      "layout": "wide",
      "link": {
        "href": "https://platform.plainconcepts.dev",
        "label": "talk.link.site"
      },
      "board": "site",
      "cloud": true
    }
  ]
},
  before: picture('platform', 0),
}
export const foundations = makePart(part)
