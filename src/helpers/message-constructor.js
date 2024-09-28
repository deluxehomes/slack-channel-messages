import {
  Message,
  Blocks,
  Elements,
  Md,
  Option,
  Bits,
} from "slack-block-builder";
import { IssueStatus } from "../database/model/issue-model.js";

export const constructAcknowledge = (
  channelId,
  senderUserId,
  originalMessage
) => {
  return Message({
    channel: channelId,
    text: `${originalMessage}`,
  })
    .blocks(
      Blocks.Section({
        text: `<@${senderUserId}> This issue has been Acknowledged.`,
      }),
      // Blocks.Divider(),
      Blocks.Context({
        blockId: "context-id",
      }).elements(Md.blockquote(`${originalMessage}`))
    )
    .buildToJSON();
};

export const constructUpdateIssueMessage = (message, channelId, threadTs) => {
  const messagePayload = {
    channel: channelId,
    text: `${message}`,
    ts: threadTs,
  };

  const status = IssueStatus;

  //this should be same with constructPostIssueMessage
  return Message(messagePayload)
    .blocks(
      Blocks.Section({
        text: `An issue has been raised!`,
      }),
      Blocks.Context({
        blockId: "content-id",
      }).elements(Md.blockquote(message)),
      Blocks.Divider(),
      Blocks.Context({
        blockId: "context-id",
      }).elements(Md.quote("ACKNOWLEDGED"))
    )
    .buildToJSON();
};

export const constructPostIssueMessage = (
  messageTitle,
  messageDescription,
  channelId,
  issueRecordId,
  threadTs = null
) => {
  messageDescription = `*${messageTitle}*\n${messageDescription}`;
  const messagePayload = {
    channel: channelId,
    text: `${messageDescription}`,
  };

  if (threadTs && threadTs != null) {
    messagePayload.threadTs = threadTs;
  }

  return Message(messagePayload)
    .blocks(
      Blocks.Section({
        text: `An issue has been raised!`,
      }),
      Blocks.Context({
        blockId: "content-id",
      }).elements(Md.blockquote(messageDescription)),
      Blocks.Divider(),
      Blocks.Actions().elements(
        Elements.Button({
          text: "Acknowledge",
          actionId: "actionAcknowledge",
          value: `${issueRecordId}`,
        }).primary()
      ),
      Blocks.Context({
        blockId: "context-id",
      }).elements(
        Md.quote("Your replies will not be posted if not Acknowledged.")
      )
    )
    .buildToJSON();
};

export const constructClickUpNotification = (
  channelId,
  threadTs,
  message,
  url
) => {
  return Message({
    channel: channelId,
    text: message,
    // ts: threadTs,
    threadTs,
  })
    .blocks(
      Blocks.Section({
        text: message,
      }),
      Blocks.Actions().elements(
        Elements.Button({
          text: "View Task",
          actionId: "actionViewTask",
          url: url,
        })
      )
    )
    .buildToJSON();
};

export const constructMessageToSend = (text, channelId, channelName) => {
  // const channelName = Md.channel(senderChannelId);

  // console.log(channelName);
  // console.log(senderChannelId);

  return Message({
    channel: channelId,
    text: text,
  })
    .blocks(
      Blocks.Section({
        text: text,
      }),
      Blocks.Context({
        blockId: "context-id",
      }).elements(channelName)
    )
    .buildToJSON();
};
