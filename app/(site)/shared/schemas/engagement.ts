import { EngagementType } from "@prisma/client";
import { z } from "zod";
import { QrPayloadSchema, ImagePayloadSchema, MessagePayloadSchema } from "../models/Engagement";
import { wrapSchema } from "./common";

const commonCreateEngagementSchema = z.object({
  customerId: z.number().optional(),
  orderId: z.number().optional(),
});

export const createEngagementSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal(EngagementType.QR_CODE),
      payload: QrPayloadSchema,
    })
    .merge(commonCreateEngagementSchema),
  z
    .object({
      type: z.literal(EngagementType.IMAGE),
      payload: ImagePayloadSchema,
    })
    .merge(commonCreateEngagementSchema),
  z
    .object({
      type: z.literal(EngagementType.MESSAGE),
      payload: MessagePayloadSchema,
    })
    .merge(commonCreateEngagementSchema),
]);

export type CreateEngagement = z.infer<typeof createEngagementSchema>;

export const GetEngagementsByCustomerSchema = wrapSchema("customerId", z.number());

export type GetEngagementsByCustomer = z.infer<typeof GetEngagementsByCustomerSchema>;

export const ENGAGEMENT_SCHEMAS = {
  createEngagement: createEngagementSchema,
  getEngagementsByCustomer: GetEngagementsByCustomerSchema,
};
