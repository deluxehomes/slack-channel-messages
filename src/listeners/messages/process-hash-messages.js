import { convertUserFromText } from "../../helpers/users.js";
import {
  getChannelIds,
  hashValidChannels,
  atValidChannels,
  slashValidChannels,
  getHashChannels,
  getAtChannels,
  getSlashChannels,
} from "../../helpers/channels.js";
import {
  recordMessageFromCommand,
  recordOriginalMessage,
} from "../../helpers/message-helper.js";
import { Issue } from "../../database/model/issue-model.js";
import { constructMessageToSend } from "../../helpers/message-constructor.js";

export const hashMessage = async (message, client) => {
  let messageToSend = message.text;
  let senderChannelId = message.channel;
  let senderUserId = message.user;

  // console.log("processing hash channel");
  const channelIds = getChannelIds(messageToSend);
  // console.log(channelIds);
  if (channelIds === null || channelIds.length === 0) return;

  messageToSend = convertUserFromText(messageToSend);
  // console.log("messageToSend", messageToSend);

  const fileUploads = message.files;

  const channelInfo = await client.conversations.info({
    channel: senderChannelId,
  });

  const userInfo = await client.users.info({
    user: senderUserId,
  });

  const userIcon = userInfo.user.profile.image_original;
  let displayName = userInfo.user.profile.display_name;
  if (displayName === "") displayName = userInfo.user.profile.real_name;

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
  const receiverIds = [];
  const involvedMessageIds = [];
  let receiverMessageJson;
  for (let channelId of channelIds) {
    receiverMessageJson = JSON.parse(
      constructMessageToSend(
        receiverMessage,
        channelId,
        channelInfo.channel.name
      )
    );

    receiverMessageJson.username = displayName;
    receiverMessageJson.icon_url = userIcon;

    // console.log("receiverMessageJson", receiverMessageJson);

    if (senderChannelId === channelId) continue;
    // console.log("channelId", channelId);

    const postedMessageToAdminChannel = await client.chat.postMessage(
      receiverMessageJson
    );

    const recordFromReceiver = await recordMessageFromCommand(
      postedMessageToAdminChannel,
      senderUserId,
      senderChannelId,
      "RECEIVER"
    );
    receiverIds.push(recordFromReceiver.id);
    involvedMessageIds.push(recordFromReceiver.id);
  }

  const recordFromSender = await recordOriginalMessage(
    message,
    senderUserId,
    senderChannelId,
    "SENDER"
  );

  const hashTempChannel = getHashChannels(messageToSend);
  const atTempChannel = getAtChannels(messageToSend);
  const slashTempChannel = getSlashChannels(messageToSend);

  const hashValidTempChannel = hashTempChannel.filter((channel) =>
    hashValidChannels.includes(`#${channel.toLowerCase()}`)
  );

  const atValidTempChannel = atTempChannel.filter((channel) =>
    atValidChannels.includes(`@${channel.toLowerCase()}`)
  );

  const slashValidTempChannel = slashTempChannel.filter((channel) =>
    slashValidChannels.includes(`/${channel.toLowerCase()}`)
  );

  const validTempChannel = hashValidTempChannel
    .concat(atValidTempChannel)
    .concat(slashValidTempChannel);

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
    // icon_url: userIcon,
    // username: displayName,
  });

  involvedMessageIds.push(recordFromSender.id);

  await Issue.create({
    sender_message_id: recordFromSender.id,
    receiver_message_id: receiverIds,
    involve_message_id: involvedMessageIds,
  });
};
