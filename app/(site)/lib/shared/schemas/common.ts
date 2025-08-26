import { z, ZodBoolean, ZodNumber, ZodObject, ZodRawShape, ZodTypeAny } from "zod";

export const PaginationSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(10),
});

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

export function wrapSchema<K extends string, T extends ZodTypeAny>(
  key: K,
  schema: T
): ZodObject<{ [P in K]: T }> {
  return z.object({ [key]: schema } as ZodRawShape) as ZodObject<{ [P in K]: T }>;
}
