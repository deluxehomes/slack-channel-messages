import { convertUserFromText } from "../../helpers/users.js";
import { getChannelId } from "../../helpers/channels.js";
import { recordMessageFromCommand } from "../../helpers/message-helper.js";
import { Issue } from "../../database/model/issue-model.js";

export const hashMessage = async (
  messageToSend,
  client,
  senderChannelId,
  senderUserId
) => {
  console.log("processing hash channel");
  const channelIds = getChannelId(messageToSend);
  console.log(channelIds);
  if (channelIds === null || channelIds.length === 0) return;

  messageToSend = convertUserFromText(messageToSend);
  console.log("messageToSend", messageToSend);

  const userInfo = await client.users.info({
    user: senderUserId,
  });

  const userIcon = userInfo.user.profile.image_original;
  let displayName = userInfo.user.profile.display_name;
  if (displayName === "") displayName = userInfo.user.profile.real_name;

  const receiverMessage = `${displayName}: ${messageToSend}`;
  const receiverIds = [];
  const involvedMessageIds = [];
  for (let channelId of channelIds) {
    if (senderChannelId === channelId) continue;
    console.log("channelId", channelId);

    const postedMessageToAdminChannel = await client.chat.postMessage({
      channel: channelId,
      text: receiverMessage,
    });

    const recordFromReceiver = await recordMessageFromCommand(
      postedMessageToAdminChannel,
      senderUserId,
      senderChannelId,
      "RECEIVER"
    );
    receiverIds.push(recordFromReceiver.id);
    involvedMessageIds.push(recordFromReceiver.id);
  }

  const postedMessageToSenderChannel = await client.chat.postMessage({
    channel: senderChannelId,
    text: messageToSend,
    icon_url: userIcon,
    username: displayName,
  });

  const recordFromSender = await recordMessageFromCommand(
    postedMessageToSenderChannel,
    senderUserId,
    senderChannelId,
    "SENDER"
  );

  involvedMessageIds.push(recordFromSender.id);

  await Issue.create({
    sender_message_id: recordFromSender.id,
    receiver_message_id: receiverIds,
    involve_message_id: involvedMessageIds,
  });
};
