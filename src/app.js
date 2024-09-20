import pkg from "@slack/bolt";
const { App, SocketModeReceiver } = pkg;
import { registerListeners } from "./listeners/index.js";
import { connect } from "./database/db-connect.js";

const receiver = new SocketModeReceiver({
  appToken: process.env.SLACK_APP_TOKEN,
  installerOptions: {
    port: process.env.PORT,
  },
});

// const app = new App({
//   receiver: receiver,
//   token: process.env.SLACK_BOT_TOKEN,
// });

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  port: process.env.PORT || 3000,
  token: process.env.SLACK_BOT_TOKEN,
  customRoutes: [
    {
      path: "/health",
      method: ["GET"],
      handler: (req, res) => {
        res.writeHead(200);
        res.end(`Things are going just fine at ${req.headers.host}!`);
      },
    },
  ],
  // scopes: [
  //   "channels:history",
  //   "channels:read",
  //   "chat:write",
  //   "chat:write.customize",
  //   "chat:write.public",
  //   "commands",
  //   "groups:history",
  //   "groups:read",
  //   "files:read",
  //   "files:write",
  // ],
});

registerListeners(app);

(async () => {
  await connect().then((result) => {
    console.log("Database is connected");
    app.start();

    console.log("⚡️ Bolt app is running!");
  });
})();
