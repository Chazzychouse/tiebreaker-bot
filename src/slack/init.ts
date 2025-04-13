import { App, ExpressReceiver } from "@slack/bolt";
import { setupAppMentionHandler } from "./actions/app_mention";
import OpenAI from "openai";

export function init_slack(ai: OpenAI) {
  const express = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET || "",
  });

  const slack = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: express,
  });
  setupAppMentionHandler(slack, ai);
  return { expressReceiever: express, slack };
}
