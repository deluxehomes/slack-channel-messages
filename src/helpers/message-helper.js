import { Message } from "../database/model/message-model.js";
import { Issue } from "../database/model/issue-model.js";

export const recordMessage = async (
  postedMessage,
  senderUserId,
  senderChannelId,
  messageType,
  parentId = null
) => {
  return await Message.create({
    channel: postedMessage.channel,
    ts: postedMessage.ts,
    message_data: {
      user: postedMessage.message.user,
      type: postedMessage.message.type,
      ts: postedMessage.message.ts,
      text: postedMessage.message.text,
    },
    senderUserId: senderUserId, // the user who execute the command
    senderChannelId: senderChannelId, // where the command is executed
    message_type: messageType, //command type(/issue)
    parent_id: parentId,
  });
};

export const recordIssue = async () => {
  return await Issue.create({});
};

export const updateIssueMessageId = async (documentId, messageId) => {
  return await Issue.updateOne({ _id: documentId }, { message_id: messageId });
};

export const updateIssueAcknowledgeId = async (documentId, ackDecId) => {
  return await Issue.updateOne(
    { _id: documentId },
    { acknowledge_message_id: ackDecId }
  );
};

export const findIssueRecordByMessageId = async (messageRecord) => {
  const messageType = messageRecord.message_type;
  if (messageType === "ACKNOWLEDGED")
    return await Issue.findOne({ acknowledge_message_id: messageRecord.id });

  return await Issue.findOne({ message_id: messageRecord.id });
};
