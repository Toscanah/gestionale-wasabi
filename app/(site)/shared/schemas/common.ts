import { z, ZodBoolean, ZodNumber, ZodObject, ZodRawShape, ZodTypeAny } from "zod";

export const ToggleDeleteObjectSchema = z.object({
  id: z.number(),
});

export type ToggleDeleteObject = z.infer<typeof ToggleDeleteObjectSchema>;

export const NoContentSchema = z.object({});

export type NoContent = z.infer<typeof NoContentSchema>;

export function createInputSchema<
  T extends ZodObject<{ id: ZodNumber; active: ZodBoolean } & ZodRawShape>
>(base: T): ZodObject<Omit<T["shape"], "id" | "active">> {
  return base.omit({ id: true, active: true }) as any;
}

export function updateInputSchema<T extends ZodObject<{ active: ZodBoolean } & ZodRawShape>>(
  base: T
): ZodObject<Omit<T["shape"], "active">> {
  return base.omit({ active: true }) as any;
}

export function wrapSchema<T extends ZodTypeAny>(key: string, schema: T) {
  return z.object({ [key]: schema });
}
