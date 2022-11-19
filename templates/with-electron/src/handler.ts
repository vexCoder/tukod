/* eslint-disable @typescript-eslint/no-explicit-any */
import { HandlesNamespace, HandlesKeys } from "../types/preload";
import { Handles } from "../types/api";
import {
  ipcMain,
  IpcMainInvokeEvent,
  IpcMainEvent,
  BrowserWindow,
} from "electron";
import { InferListenerParams } from "../types/preload-utils.js";

type HandlerCallback<T, Type extends "invoke" | "send"> = T extends (
  ...args: infer P
) => infer R
  ? Type extends "invoke"
    ? (evt: IpcMainInvokeEvent, ...args: P) => R | Promise<R>
    : (evt: IpcMainEvent, ...args: P) => void
  : never;

class Handler {
  static registerInvokeHandle<
    Namespace extends HandlesNamespace,
    Key extends HandlesKeys<Namespace>
  >(
    namespace: Namespace,
    name: Key,
    handler: HandlerCallback<Handles[Namespace][Key], "invoke">
  ) {
    const handlerKey = `${namespace}:${name}`;
    if (typeof handler === "function")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ipcMain.handle(handlerKey, handler);
  }

  static registerSendHandle<
    Namespace extends HandlesNamespace,
    Key extends HandlesKeys<Namespace>
  >(
    namespace: Namespace,
    name: Key,
    handler: HandlerCallback<Handles[Namespace][Key], "send">
  ) {
    const handlerKey = `${namespace}:${name}`;
    if (typeof handler === "function")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ipcMain.on(handlerKey, handler);
  }

  static sendListenerEvent<
    Namespace extends HandlesNamespace,
    Key extends HandlesKeys<Namespace>
  >(
    browser: BrowserWindow,
    namespace: Namespace,
    name: Key,
    ...args: InferListenerParams<Handles[Namespace][Key]>
  ) {
    const handlerKey = `${namespace}:${name}`;
    browser.webContents.send(handlerKey, ...args);
  }
}

export default Handler;
