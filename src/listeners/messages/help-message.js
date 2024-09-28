import { readFileSync } from "fs";

export const helpMessage = async (message, say, client) => {
  const threadTs = message.ts;
  const channelId = message.channel;
  try {
    const data = readFileSync("help.txt", "utf8");
    await client.chat.postMessage({
      channel: channelId,
      text: data,
      thread_ts: threadTs,
    });
  } catch (err) {
    console.error("Error reading the file:", err);
  }
};
