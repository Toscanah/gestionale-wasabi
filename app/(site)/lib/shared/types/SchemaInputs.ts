import { z } from "zod";

/**
 * Converts an object of Zod schemas into an object of inferred input types.
 * Example: { updateUser: UserSchema } -> { UpdateUserInput: z.infer<typeof UserSchema> }
 */
export type SchemaInputs<T extends Record<string, z.ZodType<any, any, any>>> = {
  [K in keyof T as `${Capitalize<string & K>}Input`]: z.infer<T[K]>;
};
