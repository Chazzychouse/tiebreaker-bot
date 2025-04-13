import { App, ExpressReceiver } from "@slack/bolt";
import { setupAppMentionHandler } from "./actions/app_mention";

export function init_slack() {
  const express = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET || "",
  });

  const slack = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: express,
  });
  setupAppMentionHandler(slack);
  return { expressReceiever: express, slack };
}
