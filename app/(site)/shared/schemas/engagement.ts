import { EngagementType } from "@prisma/client";
import { z } from "zod";
import { QrPayloadSchema, ImagePayloadSchema } from "../models/Engagement";

export const CreateEngagementSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(EngagementType.QR_CODE),
    customerId: z.number(),
    orderId: z.number().optional(),
    payload: QrPayloadSchema,
  }),
  z.object({
    type: z.literal(EngagementType.IMAGE),
    customerId: z.number(),
    orderId: z.number().optional(),
    payload: ImagePayloadSchema,
  }),
]);

export const FetchEngagementsByCustomerSchema = z.object({
  customerId: z.number(),
});

export const ENGAGEMENT_SCHEMAS = {
  createEngagement: CreateEngagementSchema,
  fetchEngagementsByCustomer: FetchEngagementsByCustomerSchema,
};