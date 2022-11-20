declare namespace Utils {
  export type ExtractFlagType<T> = T extends string
    ? "string"
    : T extends boolean
    ? "boolean"
    : T extends number
    ? "number"
    : never;

    export type FlagOptions<T extends Record<string, any>> = {
    [K in keyof T]: {
      type: ExtractFlagType<T[K]>;
      default?: T[K];
      isRequired?: boolean;
    };
  };

  export type CLI<T> = import('meow').Result<FlagOptions<T>>
}
