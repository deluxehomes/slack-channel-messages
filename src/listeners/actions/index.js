import { selectChannelAction } from "./select-channel.js";
import { actionFileUpload } from "./action-file-upload.js";
import { actionAcknowledge } from "./action-acknowledge.js";
import { actionUpdateIssueStatus } from "./action-update-issue-status.js";

export const actionRegister = (app) => {
  app.action("selectChannelId", selectChannelAction);
  app.action("actionFileUploadId", actionFileUpload);
  app.action("actionAcknowledge", actionAcknowledge);
  app.action("actionUpdateIssueStatus", actionUpdateIssueStatus);
};
