import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "09-health",
  "scene": "feedback",
  "title": "Project Health measures and improves the system",
  "beats": [
    {
      "heading": "talk.health.portfolio.title",
      "line": "talk.health.portfolio.body",
      "command": "talk.health.portfolio.command",
      "picture": "feedback",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "dim": true,
      "board": "portfolio",
      "cloud": true
    }
  ]
},
  before: picture('feedback', 0, true),
}
export const health = makePart(part)
