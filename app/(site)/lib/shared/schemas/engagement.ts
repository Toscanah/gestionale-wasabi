import { EngagementType } from "@prisma/client";
import { z } from "zod";
import {
  QrPayloadSchema,
  MessagePayloadSchema,
  ImagePayloadSchema,
  ParsedEngagementTemplateSchema,
} from "../models/Engagement";
import { NoContentSchema, wrapSchema } from "./common";

export const TemplatePayloadDraftSchema = ParsedEngagementTemplateSchema.omit({
  id: true,
  created_at: true,
}).extend({
  selectedImage: z.instanceof(File).optional().nullable(),
});

export type TemplatePayloadDraft = z.infer<typeof TemplatePayloadDraftSchema>;

export const createEngagementTemplateSchema = z.object({
  label: z.string().optional(),
  type: z.nativeEnum(EngagementType),
  payload: z.record(z.any()),
});

export type CreateEngagementTemplate = z.infer<typeof createEngagementTemplateSchema>;

//
// Update Schema — based on existing Prisma shape
//
export const updateEngagementTemplateSchema = TemplatePayloadDraftSchema.extend({
  id: z.number(),
}).omit({
  type: true,
});

export type UpdateEngagementTemplate = z.infer<typeof updateEngagementTemplateSchema>;

//
// Create Engagement instance from template
//
export const createEngagementSchema = z.object({
  templateId: z.number(),
  customerId: z.number().optional(),
  orderId: z.number().optional(),
});

export type CreateEngagement = z.infer<typeof createEngagementSchema>;

//
// Get Engagements by customer ID
//
export const GetEngagementsByCustomerSchema = wrapSchema("customerId", z.number());
export type GetEngagementsByCustomer = z.infer<typeof GetEngagementsByCustomerSchema>;

//

export const deleteTemplateByIdSchema = wrapSchema("templateId", z.number());
export type DeleteTemplateById = z.infer<typeof deleteTemplateByIdSchema>;

export const deleteEngagementByIdSchema = wrapSchema("engagementId", z.number());
export type DeleteEngagementById = z.infer<typeof deleteEngagementByIdSchema>;

export const toggleEngagementByIdSchema = wrapSchema("engagementId", z.number());

export type ToggleEngagementById = z.infer<typeof toggleEngagementByIdSchema>;
//
// Schema Registry
//
export const ENGAGEMENT_SCHEMAS = {
  createEngagement: createEngagementSchema,
  getEngagementsByCustomer: GetEngagementsByCustomerSchema,
  getEngagementTemplates: NoContentSchema,
  createEngagementTemplate: createEngagementTemplateSchema,
  updateEngagementTemplate: updateEngagementTemplateSchema,
  deleteTemplateById: deleteTemplateByIdSchema,
  deleteEngagementById: deleteEngagementByIdSchema,
  toggleEngagementById: toggleEngagementByIdSchema,
};
