import { EngagementSchema, EngagementTemplateSchema } from "@/prisma/generated/zod";
import { z } from "zod";

const CommonPayloadSchema = z.object({
  textAbove: z.string().optional(),
  textBelow: z.string().optional(),
});

export type CommonPayload = z.infer<typeof CommonPayloadSchema>;

export const QrPayloadSchema = CommonPayloadSchema.extend({
  url: z.string(),
});

export type QrPayload = z.infer<typeof QrPayloadSchema>;

export const DraftImagePayloadSchema = CommonPayloadSchema.extend({
  imageFile: z.instanceof(File).nullable(),
});

export type DraftImagePayload = z.infer<typeof DraftImagePayloadSchema>;

export const FinalImagePayloadSchema = CommonPayloadSchema.extend({
  imageUrl: z.string(),
});

export type FinalImagePayload = z.infer<typeof FinalImagePayloadSchema>;

export const MessagePayloadSchema = CommonPayloadSchema.extend({
  message: z.string(),
});

export type MessagePayload = z.infer<typeof MessagePayloadSchema>;

export const DraftEngagementTemplatePayloadSchema = z.union([
  QrPayloadSchema,
  DraftImagePayloadSchema,
  MessagePayloadSchema,
]);

export type DraftEngagementTemplatePayload = z.infer<typeof DraftEngagementTemplatePayloadSchema>;

export const FinalEngagementPayloadSchema = z.union([
  QrPayloadSchema,
  FinalImagePayloadSchema,
  MessagePayloadSchema,
]);
export type FinalEngagementPayload = z.infer<typeof FinalEngagementPayloadSchema>;

export const EngagementWithDetailsSchema = EngagementSchema.extend({
  template: EngagementTemplateSchema.extend({
    payload: z.any(),
  }),
});

export type EngagementWithDetails = z.infer<typeof EngagementWithDetailsSchema>;
