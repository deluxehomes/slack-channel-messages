import { issueModal } from "../../interface/issue-interface.js";

// export interface SlackEventMiddlewareArgs<EventType extends string = string> {
//     payload: EventFromType<EventType>;
//     event: this['payload'];
//     message: EventType extends 'message' ? this['payload'] : undefined;
//     body: EnvelopedEvent<this['payload']>;
//     say: WhenEventHasChannelContext<this['payload'], SayFn>;
//     ack?: undefined;
// }

export const appMentionEvent = async ({
  event,
  client,
  body,
  payload,
  message,
}) => {
  console.log("event", event);

  console.log("body", body);
  console.log("payload", payload);

  console.log("message", message);

  // await client.views.open({
  //   trigger_id: body.trigger_id,
  //   view: issueModal(body),
  // });
};
