import "dotenv/config";

export const hashValidChannels = ["#finance", "#support"];
export const atValidChannels = ["@finance", "@support"];

export const getChannelIds = (text) => {
  const hashChannels = getHashChannels(text);
  const atChannels = getAtChannels(text);

  const channels = hashChannels.concat(atChannels);
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

export const getHashChannels = (text) => {
  return [...text.matchAll(/#([\w-]+)/g)].map((match) => match[1]);
};

export const getAtChannels = (text) => {
  return [...text.matchAll(/@([\w-]+)/g)].map((match) => match[1]);
};

export const isContainChannel = (text) => {
  const hashContainsChannel = hashValidChannels.some((channel) =>
    text.includes(channel)
  );

  const atContainsChannel = atValidChannels.some((channel) =>
    text.includes(channel)
  );

  // console.log("containsChannel", containsChannel);
  return hashContainsChannel || atContainsChannel;
};
