import "dotenv/config";

export const validChannels = ["#finance", "#support"];

export const getChannelIds = (text) => {
  const channels = getChannels(text);
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

export const getChannels = (text) => {
  return [...text.matchAll(/#([\w-]+)/g)].map((match) => match[1]);
};

export const isContainChannel = (text) => {
  const containsChannel = validChannels.some((channel) =>
    text.includes(channel)
  );
  console.log("containsChannel", containsChannel);
  return containsChannel;
};
