import { z } from "zod";

type InferDTOs<T extends Record<string, z.ZodType<any, any, any>>> = {
  [K in keyof T as Capitalize<string & K>]: z.infer<T[K]>;
};

export type ApiContract<
  Req extends Record<string, z.ZodType>,
  Res extends Record<string, z.ZodType> = {}
> = {
  Requests: InferDTOs<Req>;
  Responses: keyof Res extends never ? undefined : InferDTOs<Res>;
};
