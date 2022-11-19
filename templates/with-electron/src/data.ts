import type { Application } from "./app.js";
import Handler from "./handler.js";

export const registerDataHandlers = (app: Application) => {
  const data = { counter: 0 };

  Handler.registerSendHandle("data", "setCounter", (_evt, num) => {
    data.counter = num;
    Handler.sendListenerEvent(app.win, "data", "onCounterChange", data.counter);
  });

  Handler.registerInvokeHandle("data", "updateCounter", async (_evt, num) => {
    await new Promise<void>(function (resolve) {
      setTimeout(resolve, 1000);
    });

    data.counter = num;

    Handler.sendListenerEvent(app.win, "data", "onCounterChange", data.counter);
  });
};
