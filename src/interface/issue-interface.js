import { Modal, Blocks, Elements } from "slack-block-builder";

export const issueModal = (body) => {
  const channelIdSender = body.channel_id;

  return Modal({
    title: "Post issue",
    submit: "Post",
    callbackId: "view-post-issue",
    privateMetaData: `${channelIdSender}`,
  })
    .blocks(
      Blocks.Actions({ blockId: "channelId" }).elements(
        Elements.ConversationSelect({
          placeholder: "Please select a channel",
        })
          .actionId("selectChannelId")
          .excludeBotUsers(true)
          .excludeExternalSharedChannels(true)
          .filter("private", "public")
      ),
      Blocks.Input({ label: "Title", blockId: "title" }).element(
        Elements.TextInput({ actionId: "title" }).multiline(false)
      ),
      Blocks.Input({ label: "Description", blockId: "description" }).element(
        Elements.TextInput({ actionId: "description" }).multiline(true)
      ),
      Blocks.Input({
        blockId: "fileUploadId",
        label: "Upload files",
        optional: true,
      }).element(
        Elements.FileInput({
          actionId: "actionFileUploadId",
          maxFiles: 5,
        })
      )
    )
    .buildToJSON();
};
