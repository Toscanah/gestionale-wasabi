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

export const ImagePayloadSchema = CommonPayloadSchema.extend({
  imageUrl: z.string(),
});

export type ImagePayload = z.infer<typeof ImagePayloadSchema>;

export const MessagePayloadSchema = CommonPayloadSchema.extend({
  message: z.string(),
});

export type MessagePayload = z.infer<typeof MessagePayloadSchema>;

export const EngagementPayloadSchema = z.union([
  QrPayloadSchema,
  ImagePayloadSchema,
  MessagePayloadSchema,
]);

export type EngagementPayload = z.infer<typeof EngagementPayloadSchema>;
