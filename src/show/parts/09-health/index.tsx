import { makePart, type Part } from '../../narrative'
import { picture } from '../../pictures'

export const part: Part = {
  ...{
  "id": "09-health",
  "scene": "feedback",
  "title": "Project Health measures and improves the system",
  "beats": [
    {
      "heading": "talk.health.chapter.title",
      "command": "talk.health.chapter.command",
      "picture": "workflow",
      "step": 1,
      "labels": [],
      "layout": "chapter",
      "dim": true,
      "cloud": true
    },
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
    },
    {
      "heading": "talk.health.agents.title",
      "line": "talk.health.agents.body",
      "command": "talk.health.agents.command",
      "picture": "feedback",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "dim": true,
      "board": "agents",
      "cloud": true
    },
    {
      "heading": "talk.health.improve.title",
      "line": "talk.health.improve.body",
      "command": "talk.health.improve.command",
      "picture": "feedback",
      "step": 0,
      "labels": [],
      "layout": "wide",
      "dim": true,
      "flow": "improve",
      "cloud": true
    }
  ]
},
  before: picture('feedback', 0, true),
}
export const health = makePart(part)
