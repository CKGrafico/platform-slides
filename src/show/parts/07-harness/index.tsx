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
      "dim": true,
      "board": "tree",
      "cloud": true
    }
  ]
},
  before: picture('baseline', 0),
}
export const harness = makePart(part)
