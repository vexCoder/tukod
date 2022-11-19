/* eslint-disable @typescript-eslint/no-explicit-any */

type AllowedParams = string | number | boolean | null | undefined | object;

export type Invoker<P extends AllowedParams[], R = void> = (
  ...args: P
) => Promise<R>;

export type Send<P extends AllowedParams[]> = (...args: P) => void;

export type Listener<P extends AllowedParams[]> = (
  callback: (...args: P) => Promise<void>
) => void;

export type HandleInvoker<P extends any[], R = void> = (
  evt: import("electron").IpcMainInvokeEvent,
  ...args: P
) => R;

export type InferInvokerParams<T> = T extends Invoker<infer P, any> ? P : any[];
export type InferSendParams<T> = T extends Send<infer P> ? P : any[];
export type InferListenerParams<T> = T extends Listener<infer P> ? P : any[];
