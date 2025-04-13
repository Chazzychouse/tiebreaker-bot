import { App } from "@slack/bolt";

export function setupAppMentionHandler(app: App) {
  app.event("app_mention", async ({ event, say }) => {
    try {
      // Get the message text without the bot mention
      const message = event.text.replace(/<@[^>]+>/g, "").trim();
      console.log("Message received:", message);

      await say({
        text: `You mentioned me with: "${message}"`,
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
