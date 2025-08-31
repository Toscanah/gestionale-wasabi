import { z } from "zod";

export const ToggleDeleteEntityRequestSchema = z.object({
  id: z.number(),
});