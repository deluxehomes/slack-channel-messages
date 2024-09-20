import { Issue } from "../../database/model/issue-model.js";
import { Message } from "../../database/model/message-model.js";

export const actionUpdateIssueStatus = async ({
  action,
  ack,
  respond,
  say,
  payload,
  body,
  client,
}) => {
  await ack();

  // console.log("update status action", action);

  // console.log("payload", payload);

  // console.log("body", body);
  // console.log("message blocks", body.message.blocks);
  const senderUserId = body.user.id;

  const issueId = action.block_id;

  // this is issue._id
  const status = action.selected_option.value;

  const issueRecord = await Issue.findOneAndUpdate(
    { _id: issueId },
    { status },
    { new: true }
  );

  const messageRecord = await Message.findById(issueRecord.message_id);

  const acknowledgeMessage = await Message.findById(
    issueRecord.acknowledge_message_id
  );

  await client.chat.postMessage({
    channel: messageRecord.channel,
    text: `<@${senderUserId}> updated the status to ${status}.`,
    thread_ts: messageRecord.ts,
  });

  await client.chat.postMessage({
    channel: messageRecord.senderChannelId,
    text: `<@${messageRecord.senderUserId}> this issue has been updated to ${status}.`,
    thread_ts: acknowledgeMessage.ts,
  });
};
