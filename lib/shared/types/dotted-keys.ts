export type DottedKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: NonNullable<T[K]> extends (infer U)[]
    ? `${Prefix}${K}` // stop recursion at arrays
    : NonNullable<T[K]> extends object
      ? `${Prefix}${K}` | DottedKeys<NonNullable<T[K]>, `${Prefix}${K}.`>
      : `${Prefix}${K}`;
}[keyof T & string];
