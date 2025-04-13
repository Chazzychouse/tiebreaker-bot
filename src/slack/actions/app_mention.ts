import { App } from "@slack/bolt";

export function setupAppMentionHandler(app: App) {
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

      const response = await say({
        text: "Processing your request...",
        thread_ts: event.thread_ts,
      });

      const replies = await client.conversations.replies({
        channel: event.channel,
        ts: event.thread_ts,
      });

      const messages = replies.messages || [];
      await say({
        text: `You mentioned me with: "${message}"\n Here are the messages in the thread:
        ${messages.map((msg) => `- ${msg.text}`).join("\n")}`,
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
