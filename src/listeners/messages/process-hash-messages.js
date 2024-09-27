import { convertUserFromText } from "../../helpers/users.js";
import {
  getChannelIds,
  validChannels,
  getChannels,
} from "../../helpers/channels.js";
import {
  recordMessageFromCommand,
  recordOriginalMessage,
} from "../../helpers/message-helper.js";
import { Issue } from "../../database/model/issue-model.js";

export const hashMessage = async (message, client) => {
  let messageToSend = message.text;
  let senderChannelId = message.channel;
  let senderUserId = message.user;

  console.log("processing hash channel");
  const channelIds = getChannelIds(messageToSend);
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

  // const postedMessageToSenderChannel = await client.chat.postMessage({
  //   channel: senderChannelId,
  //   text: messageToSend,
  //   icon_url: userIcon,
  //   username: displayName,
  // });

  const recordFromSender = await recordOriginalMessage(
    message,
    senderUserId,
    senderChannelId,
    "SENDER"
  );

  const tempChannel = getChannels(messageToSend);

  const validTempChannel = tempChannel.filter((channel) =>
    validChannels.includes(`#${channel.toLowerCase()}`)
  );

  const capitalize = (channel) =>
    channel.charAt(0).toUpperCase() + channel.slice(1);

  const formattedChannels = validTempChannel.map(capitalize);
  let confirmationMessageSent;
  if (formattedChannels.length > 1) {
    const lastChannel = formattedChannels.pop(); // Get the last channel for conjunction
    confirmationMessageSent = `Your message has been sent to ${formattedChannels.join(
      ", "
    )} and ${lastChannel} group.`;
  } else {
    confirmationMessageSent = `Your message has been sent to ${formattedChannels[0]} group.`;
  }

  await client.chat.postMessage({
    channel: message.channel,
    text: confirmationMessageSent,
    thread_ts: message.ts,
  });

  involvedMessageIds.push(recordFromSender.id);

  await Issue.create({
    sender_message_id: recordFromSender.id,
    receiver_message_id: receiverIds,
    involve_message_id: involvedMessageIds,
  });
};
