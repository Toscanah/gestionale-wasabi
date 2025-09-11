import { z } from "zod";

export const SortDirectionSchema = z.enum(["asc", "desc"]);

export type SortDirection = z.infer<typeof SortDirectionSchema>;

export default function SortingSchema<T extends [string, ...string[]]>(...fields: T) {
  return z.object({
    field: z.enum(fields),
    direction: SortDirectionSchema,
  });
}
