import { Issue } from "../../database/model/issue-model.js";
import { Message } from "../../database/model/message-model.js";
import {
  constructAcknowledge,
  constructUpdateIssueMessage,
} from "../../helpers/message-constructor.js";
import {
  updateIssueAcknowledgeId,
  recordMessage,
} from "../../helpers/message-helper.js";
import { ClickUp } from "../../services/clickup.js";
import "dotenv/config";

export const actionAcknowledge = async ({
  action,
  ack,
  respond,
  say,
  payload,
  body,
  client,
}) => {
  await ack();

  // console.log("acknowledge action", action);

  // console.log("payload", payload);

  // console.log("body", body);
  const senderUserId = body.user.id;

  // this is issue._id
  const actionValue = action.value;
  // console.log("actionValue", actionValue);

  const issueRecord = await Issue.findById(actionValue);

  // console.log("issueRecord", issueRecord);
  const message_id = issueRecord.message_id;

  const messageRecord = await Message.findById(message_id);
  // console.log("messageRecord", messageRecord);

  const acknowledgeMessage = constructAcknowledge(
    messageRecord.senderChannelId,
    messageRecord.senderUserId,
    messageRecord.message_data.text
  );

  const postedMessage = await client.chat.postMessage(
    JSON.parse(acknowledgeMessage)
  );

  //TODO
  const clickup = new ClickUp(`${process.env.CLICK_UP_API_KEY}`);
  const clickupResponse = await clickup.newTask(
    process.env.CLICK_UP_SLACK_LIST_ID,
    {
      name: messageRecord.title,
      content: messageRecord.description,
      status: "to do",
    }
  );

  console.log("clickup response", clickupResponse);

  // console.log("Message", Message);

  const messageType = "ACKNOWLEDGED";
  const record = await recordMessage(
    messageRecord.title,
    messageRecord.description,
    postedMessage,
    senderUserId,
    messageRecord.channel,
    messageType
  );

  await updateIssueAcknowledgeId(actionValue, record.id, clickupResponse.id);

  const updateMessage = constructUpdateIssueMessage(
    messageRecord.message_data.text,
    messageRecord.channel,
    messageRecord.ts
  );

  //update the original issue message.
  await client.chat.update(JSON.parse(updateMessage));

  // reply to thread who acknowledge it
  await client.chat.postMessage({
    channel: messageRecord.channel,
    text: `<@${senderUserId}> acknowledged this issue.`,
    thread_ts: messageRecord.ts,
  });
};
