import { Message } from "../../database/model/message-model.js";
import { Issue } from "../../database/model/issue-model.js";
export const reactionRemovedEvent = async ({
  event,
  client,
  body,
  payload,
  message,
}) => {
  console.log("event", event);

  const threadTs = event.item.ts;

  const channel = event.item.channel;

  const reaction = event.reaction;

  const messageRecord = await Message.findOne({
    ts: threadTs,
    channel: channel,
  });
  if (messageRecord === undefined || messageRecord == null) return;

  const messageType = messageRecord.message_type; //RECEIVER | SENDER

  let issueRecord;
  let recordToSend;
  let involveMessageIds;
  if (messageType === "RECEIVER") {
    issueRecord = await Issue.findOne({
      receiver_message_id: { $in: [messageRecord.id] },
    });

    involveMessageIds = issueRecord.involve_message_id;
  } else {
    issueRecord = await Issue.findOne({
      sender_message_id: messageRecord.id,
    });

    involveMessageIds = issueRecord.involve_message_id;
  }

  for (let messageId of involveMessageIds) {
    if (messageId.equals(messageRecord.id)) continue;

    recordToSend = await Message.findById(messageId);

    await client.reactions.remove({
      name: reaction,
      channel: recordToSend.channel,
      timestamp: recordToSend.ts,
    });
  }
};
