import { issueModal } from "../../interface/issue-interface.js";

export const issueCommand = async ({
  command,
  ack,
  respond,
  say,
  payload,
  body,
  client,
}) => {
  await ack();

  console.log("body", body);

  // console.log("command", command);

  // console.log("payload", payload);

  await client.views.open({
    trigger_id: body.trigger_id,
    view: issueModal(body),
  });
};
