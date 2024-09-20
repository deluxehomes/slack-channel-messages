import { commandRegister } from "./commands/index.js";
import { viewRegister } from "./views/index.js";
import { actionRegister } from "./actions/index.js";

import { messageRegister } from "./messages/index.js";

export const registerListeners = (app) => {
  commandRegister(app);
  viewRegister(app);
  actionRegister(app);
  messageRegister(app);
};
