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
      "link": {
        "href": "https://probable-fiesta-2y6w5gw.pages.github.io/projects/numa/#roadmap/750",
        "label": "talk.link.health750"
      },
      "dim": true,
      "board": "portfolio",
      "cloud": true
    }
  ]
},
  before: picture('workflow', 5),
}
export const health = makePart(part)
