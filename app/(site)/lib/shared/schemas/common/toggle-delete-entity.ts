import { z } from "zod";

export const ToggleDeleteEntityRequestSchema = z
  .object({
    id: z.number(),
  })
  .strict();

export const ToggleEntityResponseSchema = z
  .object({
    id: z.number(),
    active: z.boolean(),
  })
  .strict();

export type ToggleEntityResponse = z.infer<typeof ToggleEntityResponseSchema>;

export const DeleteEntityResponseSchema = z
  .object({
    id: z.number(),
  })
  .strict();
