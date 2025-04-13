# tiebreaker-bot

- a slack bot to resolve disagreements within a thread

## Contributors

- [Jordan Upperman](https://github.com/Jupperman)
- [Chase Cartwright](https://github.com/Chazzychouse)

## Required Env Variables

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
OPENAI_API_KEY=your-openai-api-key
```

- _Note: see package.json for required dependencies_

## Functionality

- Integrates a slack bot that captures a list of messages within a slack thread.
- Passes an array of messages to OpenAI with `instructions` context
- Slack bot will state it's "opinion" generated from OpenAI

## Purpose

- To explore the functionality of the OpenAI api, and revisit integration of slack bots
