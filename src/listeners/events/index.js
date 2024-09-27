import { appMentionEvent } from "./app-mention-event.js";
export const eventRegister = (app) => {
  app.event("app_mention", appMentionEvent);
};
