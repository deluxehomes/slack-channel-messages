// import { issueCommand } from "./issue-command.js";

import { adminChannelCommand } from "./admin-channel-command.js";

export const commandRegister = (app) => {
  // app.command("/issue", issueCommand);

  app.command("/bot-admin", adminChannelCommand);
  // app.command("/bot-finance", issueCommand);
  // app.command("/bot-support", issueCommand);
  // app.command("/bot-website", issueCommand);
};
