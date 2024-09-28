import { messageThread } from "./message-thread.js";
import { Issue } from "../../database/model/issue-model.js";
import { Message } from "../../database/model/message-model.js";
import { constructClickUpNotification } from "../../helpers/message-constructor.js";
import { isContainChannel } from "../../helpers/channels.js";
import { hashMessage } from "./process-hash-messages.js";
import { helpMessage } from "./help-message.js";
import "dotenv/config";

const noBotMessages = async ({ message, next, client }) => {
  // console.log("message", message);
  const threadTs = message.thread_ts;

  if (
    message.bot_id === undefined &&
    message.previous_message?.bot_id === undefined &&
    // message.type === "message" &&
    // message.text.indexOf("#") > -1 &&
    threadTs != null &&
    threadTs !== undefined
  ) {
    await next();
  }

  if (
    message.bot_id === undefined &&
    message.previous_message?.bot_id === undefined &&
    message.type === "message" &&
    // message.text.indexOf("#") > -1 &&
    (message.text.indexOf("#") > -1 || message.text.indexOf("@") > -1) &&
    (threadTs == null || threadTs === undefined)
  ) {
    if (isContainChannel(message.text)) {
      hashMessage(message, client);
      return;
    }
    return;
  }
};

const clickupMessage = async ({ message, next, client }) => {
  // console.log("message", message);
  if (message.bot_id === undefined) {
    await next();
    return;
  }

  // console.log("message", message);
  //check if bot_id is from clickUP
  const clickupBotId = process.env.CLICK_UP_BOT_ID;

  const botId = message.bot_id;
  if (botId !== clickupBotId) {
    await next();
    return;
  }
  // console.log("im here message from bot clickup");

  const blocks = message.attachments[0].blocks;
  // console.log("blocks", blocks[2].elements[0].url);

  const clickupURL = blocks[2].elements[0].url;
  // console.log(clickupURL);

  const EditActionJson = message.attachments[0].blocks[2].elements[1].value;
  // console.log("EditActionJson", EditActionJson);

  const taskID = JSON.parse(EditActionJson).taskID;
  const botMessage = message.text;

  const issueRecord = await Issue.findOne({ clickup_id: taskID });
  const issueMessageRecord = await Message.findById(issueRecord.message_id);
  const acknowledgeMessageRecord = await Message.findById(
    issueRecord.acknowledge_message_id
  );

  let clickUpMessage = constructClickUpNotification(
    issueMessageRecord.channel,
    issueMessageRecord.ts,
    botMessage,
    clickupURL
  );

  // reply to issue message
  await client.chat.postMessage(JSON.parse(clickUpMessage));

  clickUpMessage = constructClickUpNotification(
    acknowledgeMessageRecord.channel,
    acknowledgeMessageRecord.ts,
    botMessage,
    clickupURL
  );

  await client.chat.postMessage(JSON.parse(clickUpMessage));
};

const help = async ({ message, next, client, say }) => {
  if (message.text === "@help" || message.text === "#help") {
    helpMessage(message, say, client);
  }
};

export const messageRegister = (app) => {
  app.message(clickupMessage, noBotMessages, messageThread);
  app.message(help);
};
