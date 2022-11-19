import { Invoker, Listener, Send } from "./preload-utils";

export interface Handles {
  data: {
    updateCounter: Invoker<[num: number]>;
    onCounterChange: Listener<[num: number]>;
    setCounter: Send<[num: number]>;
  };
}
