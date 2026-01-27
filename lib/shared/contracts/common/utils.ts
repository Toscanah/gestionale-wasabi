import { z, ZodBoolean, ZodDefault, ZodNumber, ZodObject, ZodRawShape, ZodType } from "zod";

/**
 * Creates a new Zod schema by omitting the `id` and `active` fields from the given base schema.
 *
 * @template T - A ZodObject schema with at least `id` (ZodNumber) and `active` (ZodBoolean or ZodDefault<ZodBoolean>) fields.
 * @param base - The base ZodObject schema to omit fields from.
 * @returns A new ZodObject schema with the `id` and `active` fields omitted.
 */
export function createInputSchema<
  T extends ZodObject<{ id: ZodNumber; active: ZodBoolean | ZodDefault<ZodBoolean> } & ZodRawShape>,
>(base: T): ZodObject<Omit<T["shape"], "id" | "active">> {
  return base.omit({ id: true, active: true }) as ZodObject<Omit<T["shape"], "id" | "active">>;
}

export function updateInputSchema<
  T extends ZodObject<{ active: ZodBoolean | ZodDefault<ZodBoolean> } & ZodRawShape>,
>(base: T): ZodObject<Omit<T["shape"], "active">> {
  return base.omit({ active: true }) as ZodObject<Omit<T["shape"], "active">>;
}

/**
 * @deprecated Questa funzione è un esempio di "overengineering".
 * Si consiglia di utilizzare direttamente la composizione degli schemi, che è più semplice e chiara.
 */
export function wrapSchema<K extends string, T extends ZodType>(
  key: K,
  schema: T
): ZodObject<{ [P in K]: T }> {
  return z.object({ [key]: schema } as ZodRawShape) as ZodObject<{ [P in K]: T }>;
}
