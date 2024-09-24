export const actionViewTask = async ({
  action,
  ack,
  respond,
  say,
  payload,
  body,
  client,
}) => {
  await ack();
  // this is just to acknowledge the action when selecting a channel
  // DO NOT DELETE THIS
};
