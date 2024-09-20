import { constructPostIssueMessage } from "../../helpers/message-constructor.js";
import {
  recordMessage,
  recordIssue,
  updateIssueMessageId,
} from "../../helpers/message-helper.js";

export const postIssueCommand = async ({
  ack,
  view,
  body,
  client,
  context,
}) => {
  await ack();

  // console.log("context", context);

  // console.log("body", body);

  const senderUserId = body.user.id;

  const providedValues = view.state.values;
  // console.log("providedValues", providedValues);

  const senderChannelId = view.private_metadata;
  // console.log("senderChannelId", senderChannelId);

  const channelIdToReceiver =
    providedValues.channelId.selectChannelId.selected_conversation;
  // console.log("channelIdToReceiver", channelIdToReceiver);

  const messageToReceiver = providedValues.description.description.value;
  // console.log("messageToReceiver", messageToReceiver);

  const fileUploads = providedValues.fileUploadId.actionFileUploadId.files;

  //need to record the issue so I can update later
  const issueRecord = await recordIssue();

  const jsonMessage = constructPostIssueMessage(
    messageToReceiver,
    channelIdToReceiver,
    issueRecord.id
  );

  const postedMessage = await client.chat.postMessage(JSON.parse(jsonMessage));
  // console.log("postedMessage", postedMessage);
  // console.log("blocks", postedMessage.message.blocks);
  const threadTs = postedMessage.ts;
  // console.log("threadTs", threadTs);

  if (fileUploads && fileUploads.length > 0) {
    // console.log("fileUploads.length", fileUploads.length);
    const permalinks = [];
    for (const file of fileUploads) {
      // console.log("url_private", file.permalink);
      permalinks.push(file.permalink);
    }

    const images = permalinks.map((permalink) => `<${permalink}| >`).join("");

    await client.chat.postMessage({
      channel: channelIdToReceiver,
      text: `${images}`,
      thread_ts: `${threadTs}`,
    });
  }

  const messageRecord = await recordMessage(
    postedMessage,
    senderUserId,
    senderChannelId,
    "ISSUE"
  );

  await updateIssueMessageId(issueRecord.id, messageRecord.id);
};
