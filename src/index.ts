import { config } from "dotenv";
import express from "express";
import { SlackRoutes } from "./routes/slack.routes";
import { init_slack } from "./slack/init";
import { setupAppMentionHandler } from "./slack/actions/app_mention";

config();

// initializations
const { expressReceiever, slack } = init_slack();

// router configurations
const slackRouter = new SlackRoutes(slack);
const app = expressReceiever.app;

// initialize express app

// Middlewares
app.use(express.json());

// attach apps
slackRouter.attachRouter(expressReceiever);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
