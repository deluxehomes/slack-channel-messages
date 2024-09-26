import pkg from "@slack/bolt";
const { App, SocketModeReceiver, AwsLambdaReceiver } = pkg;
import { registerListeners } from "./listeners/index.js";
import { connect, isDbConnected } from "./database/db-connect.js";

const socketReceiver = new SocketModeReceiver({
  appToken: process.env.SLACK_APP_TOKEN,
  installerOptions: {
    port: process.env.PORT,
  },
});

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // appToken: process.env.SLACK_APP_TOKEN,
});

// const app = new App({
//   receiver: receiver,
//   token: process.env.SLACK_BOT_TOKEN,
// });

const app = new App({
  // signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: awsLambdaReceiver,
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
});

registerListeners(app);

// comment this if running aws lambda
// (async () => {
//   await connect().then((result) => {
//     console.log("Database is connected");
//     app.start();

//     console.log("⚡️ Bolt app is running!");
//   });
// })();

const initDb = async () => {
  if (!isDbConnected()) {
    await connect(); // Assuming connect is an async function
    console.log("DB connected");
  }
};

export const handler = async (event, context, callback) => {
  // Ensure the DB is connected
  await initDb();

  // Handle Slack events via the AWS Lambda Receiver
  const slackHandler = awsLambdaReceiver.toHandler();
  return slackHandler(event, context, callback);
};
