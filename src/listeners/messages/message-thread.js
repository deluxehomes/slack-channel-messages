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
  let messageToSend = message.text;

  const threadTs = message.thread_ts;

  const messageRecord = await Message.findOne({ ts: threadTs });
  const messageType = messageRecord.message_type; //RECEIVER | SENDER

  let issueRecord;
  let recordToSend;
  if (messageType === "RECEIVER") {
    issueRecord = await Issue.findOne({
      receiver_message_id: messageRecord.id,
    });

    recordToSend = await Message.findById(issueRecord.sender_message_id);
  } else {
    issueRecord = await Issue.findOne({
      sender_message_id: messageRecord.id,
    });
    recordToSend = await Message.findById(issueRecord.receiver_message_id);
  }
  // console.log("recordToSend", recordToSend);

  const senderUserId = message.user;

  const userInfo = await client.users.info({
    user: senderUserId,
  });

  const userIcon = userInfo.user.profile.image_original;
  const displayName = userInfo.user.profile.display_name;

  const fileUploads = message.files;

  if (fileUploads && fileUploads.length > 0) {
    // console.log("fileUploads.length", fileUploads.length);
    const permalinks = [];
    for (const file of fileUploads) {
      // console.log("url_private", file.permalink);
      permalinks.push(file.permalink);
    }

    const images = permalinks.map((permalink) => `<${permalink}| >`).join("");

    messageToSend = messageToSend + `${images}`;
  }

  const receiverMessage = `${displayName}: ${messageToSend}`;
  await client.chat.postMessage({
    channel: recordToSend.channel,
    text: receiverMessage,
    thread_ts: recordToSend.ts,

    // icon_url: userIcon,
    // username: displayName,
  });
};
