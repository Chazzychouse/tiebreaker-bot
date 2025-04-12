import { App } from '@slack/bolt';
import { config } from 'dotenv';
import express from 'express';
import { OpenAI } from 'openai';

// Load environment variables
config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Express
const expressApp = express();
expressApp.use(express.json());

// Slack event endpoint
expressApp.post('/slack/events', async (req, res) => {
  try {
    await app.processEvent(req);
    res.status(200).send();
  } catch (error) {
    console.error('Error processing Slack event:', error);
    res.status(500).send();
  }
});

// Handle mentions in channels
app.event('app_mention', async ({ event, say }) => {
  try {
    // Get the message text without the bot mention
    const message = event.text.replace(/<@[^>]+>/g, '').trim();
    
    // Get OpenAI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    // Reply in the same thread
    await say({
      text: completion.choices[0].message.content,
      thread_ts: event.thread_ts || event.ts,
    });
  } catch (error) {
    console.error('Error:', error);
    await say({
      text: "Sorry, I encountered an error processing your request.",
      thread_ts: event.thread_ts || event.ts,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
expressApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 