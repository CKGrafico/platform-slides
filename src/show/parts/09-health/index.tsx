import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "09-health",
  "scene": "feedback",
  "title": "Project Health measures and improves the system",
  "beats": [
    {
      "heading": "talk.health.engineering.title",
      "line": "talk.health.engineering.body",
      "command": "talk.health.engineering.command",
      "picture": "feedback",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://probable-fiesta-2y6w5gw.pages.github.io/projects/numa/",
        "label": "talk.link.healthLive"
      },
      "dim": true,
      "board": "engineering",
      "cloud": true
    },
    {
      "heading": "talk.health.delivery.title",
      "line": "talk.health.delivery.body",
      "command": "talk.health.delivery.command",
      "picture": "feedback",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://probable-fiesta-2y6w5gw.pages.github.io/projects/numa/#delivery",
        "label": "talk.link.healthLive"
      },
      "dim": true,
      "board": "delivery",
      "cloud": true
    },
    {
      "heading": "talk.health.agentic.title",
      "line": "talk.health.agentic.body",
      "command": "talk.health.agentic.command",
      "picture": "feedback",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://probable-fiesta-2y6w5gw.pages.github.io/projects/numa/#agentic",
        "label": "talk.link.healthLive"
      },
      "dim": true,
      "board": "agentic",
      "cloud": true
    },
    {
      "heading": "talk.health.roadmap.title",
      "line": "talk.health.roadmap.body",
      "command": "talk.health.roadmap.command",
      "picture": "feedback",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "link": {
        "href": "https://probable-fiesta-2y6w5gw.pages.github.io/projects/numa/#roadmap/750",
        "label": "talk.link.health750"
      },
      "dim": true,
      "board": "roadmap",
      "cloud": true
    }
  ]
},
  before: picture('workflow', 5),
}
export const health = makePart(part)
