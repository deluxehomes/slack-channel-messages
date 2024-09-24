// import { issueCommand } from "./issue-command.js";

// import { adminChannelCommand } from "./admin-channel-command.js";
import { financeChannelCommand } from "./finance-channel-command.js";
import { supportChannelCommand } from "./support-channel-command.js";

export const commandRegister = (app) => {
  // app.command("/issue", issueCommand);

  // app.command("/bot-admin", adminChannelCommand);
  app.command("/finance-bot", financeChannelCommand);
  app.command("/support-bot", supportChannelCommand);
  // app.command("/bot-finance", issueCommand);
  // app.command("/bot-support", issueCommand);
  // app.command("/bot-website", issueCommand);
};
