import { postIssueCommand } from "./post-issue-command.js";

export const viewRegister = (app) => {
  app.view("view-post-issue", postIssueCommand);
};
