import { z } from "zod";

const CommonPayloadSchema = z.object({
  testAbove: z.string().optional(),
  testBelow: z.string().optional(),
});

export const QrPayloadSchema = CommonPayloadSchema.extend({
  url: z.string(),
});

export const ImagePayloadSchema = CommonPayloadSchema.extend({
  imageUrl: z.string(),
});

export const EngagementPayloadSchema = z.union([
  QrPayloadSchema,
  ImagePayloadSchema,
]);
