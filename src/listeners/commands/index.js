import { issueCommand } from "./issue-command.js";

export const commandRegister = (app) => {
  app.command("/issue", issueCommand);
};
