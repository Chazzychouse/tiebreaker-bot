import { App } from "@slack/bolt";
import { ThreadMessage } from "../../models/ThreadMessage";
import OpenAI from "openai";
import { settleDisagreement } from "../../openai/settleDisagreement";

export function setupAppMentionHandler(app: App, openAi: OpenAI) {
  app.event("app_mention", async (thing) => {
    const { event, say, client } = thing;
    try {
      // Get the message text without the bot mention
      const message = event.text.replace(/<@[^>]+>/g, "").trim();
      if (!event.thread_ts) {
        await say({
          text: "Please mention me in the thread you want me to respond to.",
          thread_ts: event.ts,
        });
        return;
      }

      const thread = await client.conversations.replies({
        channel: event.channel,
        ts: event.thread_ts,
      });

      const messages: ThreadMessage[] = (thread.messages || []).map((msg) => ({
        user: msg.user || "unknown",
        text: msg.text || "",
      }));

      const response = await settleDisagreement(openAi, messages);

      await say({
        text: response,
        thread_ts: event.thread_ts || event.ts,
      });
    } catch (error) {
      console.error("Error:", error);
      await say({
        text: "Sorry, I encountered an error processing your request.",
        thread_ts: event.thread_ts || event.ts,
      });
    }
  });
}
