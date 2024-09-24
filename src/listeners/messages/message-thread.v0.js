import { Message } from "../../database/model/message-model.js";
import { Issue } from "../../database/model/issue-model.js";
import { findIssueRecordByMessageId } from "../../helpers/message-helper.js";

export const messageThread = async ({
  context,
  client,
  say,
  body,
  message,
  payload,
  event,
}) => {
  //   console.log("context", context);
  //   console.log("body", body);

  // console.log("message", message);

  // console.log("payload", payload);

  const threadTs = message.thread_ts;

  const messageRecord = await Message.findOne({ ts: threadTs });
  const messageType = messageRecord.message_type;

  // console.log("messageRecord", messageRecord);
  const issueRecord = await findIssueRecordByMessageId(messageRecord);
  // console.log("issueRecord", issueRecord);

  let record;
  if (messageType === "ACKNOWLEDGED") {
    record = await Message.findOne({ _id: issueRecord.message_id });
  } else {
    record = await Message.findOne({ _id: issueRecord.acknowledge_message_id });
  }

  // console.log("record", record);
  let textMessage = message.text;
  const fileUploads = message.files;

  if (fileUploads && fileUploads.length > 0) {
    // console.log("fileUploads.length", fileUploads.length);
    const permalinks = [];
    for (const file of fileUploads) {
      // console.log("url_private", file.permalink);
      permalinks.push(file.permalink);
    }

    const images = permalinks.map((permalink) => `<${permalink}| >`).join("");

    textMessage = textMessage + `${images}`;
  }

  await client.chat.postMessage({
    channel: record.channel,
    text: textMessage,
    thread_ts: record.ts,
  });
};
