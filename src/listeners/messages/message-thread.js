import { Message } from "../../database/model/message-model.js";
import { Issue } from "../../database/model/issue-model.js";
import { convertUserFromText } from "../../helpers/users.js";
// import { constructMessageToSend } from "../../helpers/message-constructor.js";

export const messageThread = async ({
  context,
  client,
  say,
  body,
  message,
  payload,
  event,
}) => {
  const threadTs = message.thread_ts;
  const senderChannelId = message.channel;

  const messageRecord = await Message.findOne({
    ts: threadTs,
    channel: senderChannelId,
  });
  if (messageRecord == null || messageRecord === undefined) return;

  let messageToSend = message.text;

  messageToSend = convertUserFromText(messageToSend);

  const messageType = messageRecord.message_type; //RECEIVER | SENDER

  let issueRecord;
  let recordToSend;
  let involveMessageIds;
  if (messageType === "RECEIVER") {
    issueRecord = await Issue.findOne({
      receiver_message_id: { $in: [messageRecord.id] },
    });

    involveMessageIds = issueRecord.involve_message_id;

    // recordToSend = await Message.findById(issueRecord.sender_message_id);
  } else {
    issueRecord = await Issue.findOne({
      sender_message_id: messageRecord.id,
    });

    involveMessageIds = issueRecord.involve_message_id;

    // recordToSend = await Message.findById(issueRecord.receiver_message_id);
  }
  // console.log("recordToSend", recordToSend);

  const senderUserId = message.user;

  const userInfo = await client.users.info({
    user: senderUserId,
  });

  const userIcon = userInfo.user.profile.image_original;
  const displayName = userInfo.user.profile.display_name;
  if (displayName === "") displayName = userInfo.user.profile.real_name;

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

  const receiverMessage = `${messageToSend}`;

  for (let messageId of involveMessageIds) {
    // console.log("messageId", messageId);

    if (messageId.equals(messageRecord.id)) continue;

    // console.log("passed messageId", messageId);

    recordToSend = await Message.findById(messageId);

    await client.chat.postMessage({
      channel: recordToSend.channel,
      text: receiverMessage,
      thread_ts: recordToSend.ts,
      icon_url: userIcon,
      username: displayName,
    });
  }
};
