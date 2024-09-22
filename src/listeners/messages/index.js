import { messageThread } from "./message-thread.js";

const noBotMessages = async ({ message, next }) => {
  console.log("message", message);

  const threadTs = message.thread_ts;
  //   console.log("threadts", threadTs);
  if (
    (message.bot_id === undefined || message.text.startsWith("<!channel>")) &&
    message.previous_message?.bot_id === undefined &&
    threadTs != null &&
    threadTs !== undefined
  ) {
    await next();
  }
};

export const messageRegister = (app) => {
  app.message(noBotMessages, messageThread);
};
