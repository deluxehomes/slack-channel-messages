import { messageThread } from "./message-thread.js";
import { Issue } from "../../database/model/issue-model.js";
import { Message } from "../../database/model/message-model.js";
import { constructClickUpNotification } from "../../helpers/message-constructor.js";
import "dotenv/config";
const noBotMessages = async ({ message, next }) => {
  // console.log("message", message);

  const threadTs = message.thread_ts;
  if (
    (message.bot_id === undefined || message.text.startsWith("<!channel>")) &&
    message.previous_message?.bot_id === undefined &&
    threadTs != null &&
    threadTs !== undefined
  ) {
    await next();
  }
};

const clickupMessage = async ({ message, next, client }) => {
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

export const messageRegister = (app) => {
  app.message(clickupMessage, noBotMessages, messageThread);
};
