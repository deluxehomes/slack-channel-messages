export const actionFileUpload = async ({
  action,
  ack,
  respond,
  say,
  payload,
  body,
  client,
}) => {
  await ack();

  // console.log("file-upload action", action);

  // console.log("file-upload payload", payload);

  // console.log("file-upload body", body);

  // this is just to acknowledge the action when selecting a channel
  // DO NOT DELETE THIS
};
