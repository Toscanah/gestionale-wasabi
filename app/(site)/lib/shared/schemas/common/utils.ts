import { z, ZodBoolean, ZodDefault, ZodNumber, ZodObject, ZodRawShape, ZodType } from "zod";

export function createInputSchema<
  T extends ZodObject<{ id: ZodNumber; active: ZodBoolean | ZodDefault<ZodBoolean> } & ZodRawShape>,
>(base: T): ZodObject<Omit<T["shape"], "id" | "active">> {
  return base.omit({ id: true, active: true }) as any;
}

export function updateInputSchema<T extends ZodObject<{ active: ZodBoolean | ZodDefault<ZodBoolean> } & ZodRawShape>>(
  base: T
): ZodObject<Omit<T["shape"], "active">> {
  return base.omit({ active: true }) as any;
}

export function wrapSchema<K extends string, T extends ZodType>(
  key: K,
  schema: T
): ZodObject<{ [P in K]: T }> {
  return z.object({ [key]: schema } as ZodRawShape) as ZodObject<{ [P in K]: T }>;
}
