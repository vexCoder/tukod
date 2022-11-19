import expose from "./expose";

expose("data", (bind, invoker, send, listener) => {
  // bind "data:updateCounter" key to a invoker type (from client to main asynchronously)
  bind("updateCounter", invoker);
  // bind "data:counter" key to a listener type (from main to client)
  bind("counter", listener);
  // bind "data:getCounter" key to a send type (from client to main synchronously)
  bind("setCounter", send);
});
