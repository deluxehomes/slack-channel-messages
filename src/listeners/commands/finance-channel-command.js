// import { issueModal } from "../../interface/issue-interface.js";

// import { channel } from "slack-block-builder";

// import { Message } from "../../database/model/message-model.js";
import { recordMessageFromCommand } from "../../helpers/message-helper.js";
import { Issue } from "../../database/model/issue-model.js";
import { convertUserFromText } from "../../helpers/users.js";
import { constructMessageToSend } from "../../helpers/message-constructor.js";
import "dotenv/config";
export const financeChannelCommand = async ({
  command,
  ack,
  respond,
  say,
  payload,
  body,
  client,
}) => {
  await ack();

  //   console.log("body", body);

  //   console.log("command", command);

  //   console.log("payload", payload);

  const adminChannelID = process.env.FINANCE_CHANNEL_ID;

  const senderChannelId = command.channel_id;

  if (adminChannelID === senderChannelId) {
    await respond(`Cannot send /finance-bot command in same channel!`);
    return;
  }

  let commandMessage = command.text;

  commandMessage = convertUserFromText(commandMessage);

  const senderUserId = command.user_id;

  const userInfo = await client.users.info({
    user: senderUserId,
  });

  const userIcon = userInfo.user.profile.image_original;
  let displayName = userInfo.user.profile.display_name;
  if (displayName === "") displayName = userInfo.user.profile.real_name;

  const receiverMessage = `*[${displayName}]:* ${commandMessage}`;

  const receiverMessageJson = constructMessageToSend(
    receiverMessage,
    adminChannelID,
    senderChannelId
  );

  // const postedMessageToAdminChannel = await client.chat.postMessage({
  //   channel: adminChannelID,
  //   text: receiverMessage,
  // });

  const postedMessageToAdminChannel = await client.chat.postMessage(
    JSON.parse(receiverMessageJson)
  );

  // const recordFromReceiver = await recordMessageFromCommand(
  //   postedMessageToAdminChannel,
  //   senderUserId,
  //   senderChannelId,
  //   "RECEIVER"
  // );

  // const postedMessageToSenderChannel = await client.chat.postMessage({
  //   channel: senderChannelId,
  //   text: commandMessage,
  //   icon_url: userIcon,
  //   username: displayName,
  // });

  // const recordFromSender = await recordMessageFromCommand(
  //   postedMessageToSenderChannel,
  //   senderUserId,
  //   senderChannelId,
  //   "SENDER"
  // );

  // // console.log(postedMessageToSenderChannel);
  // // await Issue.create({
  // //   sender_message_id: recordFromSender.id,
  // //   receiver_message_id: recordFromReceiver.id,
  // // });

  // await Issue.create({
  //   sender_message_id: recordFromSender.id,
  //   receiver_message_id: [recordFromReceiver.id],
  //   involve_message_id: [recordFromReceiver.id, recordFromSender.id],
  // });
};
