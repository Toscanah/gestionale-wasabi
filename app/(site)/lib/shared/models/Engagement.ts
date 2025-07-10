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

export const ImagePayloadSchema = CommonPayloadSchema.extend({
  imageUrl: z.string(),
});

export type ImagePayload = z.infer<typeof ImagePayloadSchema>;

export const MessagePayloadSchema = CommonPayloadSchema.extend({
  message: z.string(),
});

export type MessagePayload = z.infer<typeof MessagePayloadSchema>;

export const ParsedEngagementPayloadSchema = z.union([
  QrPayloadSchema,
  ImagePayloadSchema,
  MessagePayloadSchema,
]);

export type ParsedEngagementPayload = z.infer<typeof ParsedEngagementPayloadSchema>;

export const EngagementWithDetailsSchema = EngagementSchema.extend({
  template: EngagementTemplateSchema.omit({ payload: true }).extend({
    payload: z.any()
  }),
});

export type EngagementWithDetails = z.infer<typeof EngagementWithDetailsSchema>;

export const ParsedEngagementTemplateSchema = EngagementTemplateSchema.omit({
  payload: true,
}).extend({
  payload: ParsedEngagementPayloadSchema,
});

export type ParsedEngagementTemplate = z.infer<typeof ParsedEngagementTemplateSchema>;
