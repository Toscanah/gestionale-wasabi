import { EngagementType } from "@prisma/client";
import { z } from "zod";
import {
  QrPayloadSchema,
  MessagePayloadSchema,
  FinalImagePayloadSchema,
} from "../models/Engagement";
import { NoContentSchema, wrapSchema } from "./common";

export const createEngagementTemplateSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(EngagementType.QR_CODE),
    payload: QrPayloadSchema,
  }),
  z.object({
    type: z.literal(EngagementType.IMAGE),
    payload: FinalImagePayloadSchema,
  }),
  z.object({
    type: z.literal(EngagementType.MESSAGE),
    payload: MessagePayloadSchema,
  }),
]);

export type CreateEngagementTemplate = z.infer<typeof createEngagementTemplateSchema>;

export const createEngagementSchema = z.object({
  engagementTemplateId: z.number(),
  customerId: z.number().optional(),
  orderId: z.number().optional(),
});

export type CreateEngagement = z.infer<typeof createEngagementSchema>;

export const GetEngagementsByCustomerSchema = wrapSchema("customerId", z.number());

export type GetEngagementsByCustomer = z.infer<typeof GetEngagementsByCustomerSchema>;

export const ENGAGEMENT_SCHEMAS = {
  createEngagement: createEngagementSchema,
  getEngagementsByCustomer: GetEngagementsByCustomerSchema,
  getEngagementTemplates: NoContentSchema,
  createEngagementTemplate: createEngagementTemplateSchema,
};
