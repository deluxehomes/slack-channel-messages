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

export const constructUpdateIssueMessage = (
  message,
  channelId,
  threadTs,
  issueId
) => {
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
        text: `${message}`,
        blockId: issueId,
      }).accessory(
        Elements.StaticSelect({
          actionId: "actionUpdateIssueStatus",
          placeholder: "Select a status",
        }).options(
          status.map((s) =>
            Bits.Option({
              text: s,
              value: s,
            })
          )
        )
      ),
      Blocks.Divider(),
      Blocks.Context({
        blockId: "context-id",
      }).elements(Md.quote("ACKNOWLEDGED"))
    )
    .buildToJSON();
};

export const constructPostIssueMessage = (
  message,
  channelId,
  issueRecordId,
  threadTs = null
) => {
  const messagePayload = {
    channel: channelId,
    text: `${message}`,
  };

  if (threadTs && threadTs != null) {
    messagePayload.threadTs = threadTs;
  }

  return Message(messagePayload)
    .blocks(
      Blocks.Section({
        text: `${message}`,
      }),
      Blocks.Divider(),
      Blocks.Actions().elements(
        // Elements.Button({
        //   text: "Decline",
        //   actionId: "actionDecline",
        //   value: `${issueRecordId}`,
        // }).danger(),
        Elements.Button({
          text: "Acknowledge",
          actionId: "actionAcknowledge",
          value: `${issueRecordId}`,
        }).primary()
      ),
      // Blocks.Divider(),
      Blocks.Context({
        blockId: "context-id",
      }).elements(
        Md.quote("Your replies will not be posted if not Acknowledged.")
      )
    )
    .buildToJSON();
};
