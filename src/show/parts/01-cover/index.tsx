import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "01-cover",
  "scene": "local",
  "title": "Cover and work on your PC",
  "beats": [
    {
      "heading": "talk.sponsors.title",
      "command": "talk.sponsors.command",
      "picture": "cover",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "dim": true,
      "board": "sponsors"
    },
    {
      "heading": "talk.ghaw.markdown.title",
      "line": "talk.ghaw.markdown.body",
      "command": "talk.ghaw.markdown.command",
      "picture": "cover",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "dim": true,
      "board": "markdown"
    },
    {
      "heading": "talk.ghaw.flow.title",
      "line": "talk.ghaw.flow.body",
      "command": "talk.ghaw.flow.command",
      "picture": "cover",
      "step": 1,
      "labels": [],
      "layout": "wide",
      "dim": true,
      "flow": "ghaw"
    },
    {
      "heading": "talk.local.title",
      "line": "talk.local.body",
      "command": "talk.local.command",
      "picture": "local",
      "step": 0,
      "labels": [
        {
          "target": "core",
          "name": "talk.label.agent",
          "width": 28,
          "under": true
        }
      ],
      "layout": "statement"
    }
  ],
  "intro": {
    "heading": "show.cover",
    "command": "show.subtitle",
    "picture": "cover",
    "step": 0,
    "labels": [],
    "layout": "cover"
  }
},
  before: picture('cover', 0),
}
export const opening = makePart(part)
