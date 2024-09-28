// import { appMentionEvent } from "./app-mention-event.js";
import { reactionAddedEvent } from "./reaction-added-event.js";

import { reactionRemovedEvent } from "./reaction-remove-event.js";

export const eventRegister = (app) => {
  // app.event("app_mention", appMentionEvent);

  app.event("reaction_added", reactionAddedEvent);
  app.event("reaction_removed", reactionRemovedEvent);
};
