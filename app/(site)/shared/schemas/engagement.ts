import { EngagementType } from "@prisma/client";
import { z } from "zod";
import {
  QrPayloadSchema,
  MessagePayloadSchema,
  FinalImagePayloadSchema,
  DraftEngagementTemplatePayloadSchema,
  FinalEngagementPayloadSchema,
  DraftImagePayloadSchema,
} from "../models/Engagement";
import { NoContentSchema, wrapSchema } from "./common";
import { EngagementTemplateSchema } from "@/prisma/generated/zod";

const commonCreateEngagementTemplate = [
  z.object({
    label: z.string().optional(),
    type: z.literal(EngagementType.QR_CODE),
    payload: QrPayloadSchema,
  }),
  z.object({
    label: z.string().optional(),
    type: z.literal(EngagementType.MESSAGE),
    payload: MessagePayloadSchema,
  }),
];

export const draftCreateEngagementTemplateSchema = z.discriminatedUnion("type", [
  z.object({
    label: z.string().optional(),
    type: z.literal(EngagementType.IMAGE),
    payload: DraftImagePayloadSchema,
  }),
  ...commonCreateEngagementTemplate,
]);

export type DraftCreateEngagementTemplate = z.infer<typeof draftCreateEngagementTemplateSchema>;

export const finalCreateEngagementTemplateSchema = z.discriminatedUnion("type", [
  z.object({
    label: z.string().optional(),
    type: z.literal(EngagementType.IMAGE),
    payload: FinalImagePayloadSchema,
  }),
  ...commonCreateEngagementTemplate,
]);

export type FinalCreateEngagementTemplate = z.infer<typeof finalCreateEngagementTemplateSchema>;

export const createEngagementSchema = z.object({
  templateId: z.number(),
  customerId: z.number().optional(),
  orderId: z.number().optional(),
});

export type CreateEngagement = z.infer<typeof createEngagementSchema>;

export const GetEngagementsByCustomerSchema = wrapSchema("customerId", z.number());

export type GetEngagementsByCustomer = z.infer<typeof GetEngagementsByCustomerSchema>;

export const draftUpdateEngagementTemplateSchema = EngagementTemplateSchema.omit({
  created_at: true,
  type: true,
  payload: true,
}).extend({
  payload: DraftEngagementTemplatePayloadSchema,
});

export type DraftUpdateEngagementTemplate = z.infer<typeof draftUpdateEngagementTemplateSchema>;

export const finalUpdateEngagementTemplateSchema = EngagementTemplateSchema.omit({
  created_at: true,
  type: true,
  payload: true,
}).extend({
  payload: FinalEngagementPayloadSchema,
});

export type FinalUpdateEngagementTemplate = z.infer<typeof finalUpdateEngagementTemplateSchema>;

export const ENGAGEMENT_SCHEMAS = {
  createEngagement: createEngagementSchema,
  getEngagementsByCustomer: GetEngagementsByCustomerSchema,
  getEngagementTemplates: NoContentSchema,
  createEngagementTemplate: finalCreateEngagementTemplateSchema,
  updateEngagementTemplate: finalUpdateEngagementTemplateSchema,
};
