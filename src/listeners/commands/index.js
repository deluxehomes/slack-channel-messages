import { financeChannelCommand } from "./finance-channel-command.js";
import { supportChannelCommand } from "./support-channel-command.js";

export const commandRegister = (app) => {
  app.command("/finance-bot", financeChannelCommand);
  app.command("/support-bot", supportChannelCommand);
};
