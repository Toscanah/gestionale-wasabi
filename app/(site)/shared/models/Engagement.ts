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

export const EngagementTemplatePayloadSchema = z.union([
  QrPayloadSchema,
  DraftImagePayloadSchema,
  MessagePayloadSchema,
]);

export type EngagementTemplatePayload = z.infer<typeof EngagementTemplatePayloadSchema>;
