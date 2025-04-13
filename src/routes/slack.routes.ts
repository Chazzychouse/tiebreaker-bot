// create router with prefix of '/slack'
import { Router, Express } from "express";
import { App, ExpressReceiver } from "@slack/bolt";

export class SlackRoutes {
  private router: Router;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/events", async (req, res) => {
      try {
        if (req.body.type === "url_verification") {
          return res.status(200).send(req.body.challenge);
        }
        await this.app.processEvent(req.body.event);
        res.status(200).send();
      } catch (error) {
        console.error("Error processing Slack event:", error);
        res.status(500).send();
      }
    });
  }

  public attachRouter(receiver: ExpressReceiver): void {
    receiver.router.use("/slack", this.router);
  }
}
