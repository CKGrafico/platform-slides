import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "07-harness",
  "scene": "environment",
  "title": "agent-harness: agentic conventions",
  "beats": [
    {
      "heading": "talk.harness.conventions.title",
      "line": "talk.harness.conventions.body",
      "command": "talk.harness.conventions.command",
      "picture": "environment",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://harness.platform.plainconcepts.dev",
        "label": "talk.link.harness"
      },
      "dim": true,
      "board": "tree",
      "cloud": true
    },
    {
      "heading": "talk.harness.skills.title",
      "line": "talk.harness.skills.body",
      "command": "talk.harness.skills.command",
      "picture": "environment",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://harness.platform.plainconcepts.dev",
        "label": "talk.link.harness"
      },
      "dim": true,
      "board": "skills",
      "cloud": true
    },
    {
      "heading": "talk.harness.tiers.title",
      "line": "talk.harness.tiers.body",
      "command": "talk.harness.tiers.command",
      "picture": "environment",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://harness.platform.plainconcepts.dev",
        "label": "talk.link.harness"
      },
      "dim": true,
      "board": "tiers",
      "cloud": true
    }
  ]
},
  before: picture('baseline', 0),
}
export const harness = makePart(part)
