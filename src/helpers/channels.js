import "dotenv/config";
export const getChannelId = (text) => {
  const channels = getChannel(text);
  if (channels === null || channels.length === 0) return null;

  const returnChannel = [];
  for (let channel of channels) {
    if (channel === "finance")
      returnChannel.push(process.env.FINANCE_CHANNEL_ID);
    else if (channel === "support")
      returnChannel.push(process.env.SUPPORT_CHANNEL_ID);
  }

  return returnChannel;
};

const getChannel = (text) => {
  return [...text.matchAll(/#([\w-]+)/g)].map((match) => match[1]);
};

export const isContainChannel = (text) => {
  const channels = ["#finance", "#support"];

  const containsChannel = channels.some((channel) => text.includes(channel));
  console.log("containsChannel", containsChannel);
  return containsChannel;
};
