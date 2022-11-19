/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from "electron";
import { Handles } from "../types/api.js";
import { HandlesKeys, HandlesNamespace } from "../types/preload";

type HandlerMaker<T extends HandlesNamespace> = <K extends HandlesKeys<T>>(
  key: K,
  invoke?: (key: K) => Handles[T][K]
) => void;

const expose = <T extends HandlesNamespace>(
  context: T,
  setter: (
    bind: HandlerMaker<T>,
    invoker: (key: string) => (...args: any[]) => any,
    send: (key: string) => (...args: any[]) => any,
    listener: (key: string) => (...args: any[]) => any
  ) => void
) => {
  type Keys = HandlesKeys<T>;
  const handlers = {};

  const invoker = (key: string) => {
    return async (...args: any[]) =>
      ipcRenderer.invoke(`${context}:${key}`, ...args);
  };

  const send = (key: string) => {
    return (...args: any[]) => ipcRenderer.send(`${context}:${key}`, ...args);
  };

  const listener = (key: string) => {
    return (callback: (evt: any, data: any) => void) =>
      ipcRenderer.on(`${context}:${key}`, callback);
  };

  const bind = <K extends Keys>(key: K, invoke?: (key: K) => Handles[T][K]) => {
    Object.assign(handlers, {
      [key]: invoke?.(key),
    });
  };

  setter(bind, invoker, send, listener);

  contextBridge.exposeInMainWorld(context, handlers);

  return handlers;
};

export default expose;
