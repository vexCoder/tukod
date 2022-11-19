import { Handles } from "./api";

export type HandlesNamespace = keyof Handles;

export type HandlesKeys<T extends HandlesNamespace> = keyof Handles[T];

export type ExtendWindow = {
  [K in keyof Handles]: {
    [K2 in HandlesKeys<K>]: Handles[K][K2];
  };
};
