import { EngagementLedgerStatus, EngagementType } from "@prisma/client";
import { z } from "zod";
import { ParsedEngagementTemplateSchema } from "../models/engagement";
import { wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";
import { ApiContract } from "../types/api-contract";

export const TemplatePayloadDraftSchema = ParsedEngagementTemplateSchema.omit({
  id: true,
  created_at: true,
}).extend({
  selectedImage: z.instanceof(File).optional().nullable(),
});

export type TemplatePayloadDraft = z.infer<typeof TemplatePayloadDraftSchema>;

export const CreateEngagementTemplateSchema = z.object({
  label: z.string().optional(),
  type: z.nativeEnum(EngagementType),
  redeemable: z.boolean(),
  payload: z.record(z.any()),
});

//
// Update Schema — based on existing Prisma shape
//
export const UpdateEngagementTemplateSchema = TemplatePayloadDraftSchema.extend({
  id: z.number(),
}).omit({
  type: true,
});

//
// Create Engagement instance from template
//
export const CreateEngagementSchema = z.object({
  templateId: z.number(),
  customerId: z.number().optional(),
  orderId: z.number().optional(),
});

//
// Get Engagements by customer ID
//
export const GetEngagementsByCustomerSchema = wrapSchema("customerId", z.number());

//

export const DeleteTemplateByIdSchema = wrapSchema("templateId", z.number());

export const DeleteEngagementByIdSchema = wrapSchema("engagementId", z.number());

export const ToggleEngagementByIdSchema = wrapSchema("engagementId", z.number());

//

export const GetEngagementsLedgersByCustomerSchema = z.object({
  customerId: z.number(),
});

export const IssueLedgers = wrapSchema("orderId", z.number());

export const UpdateLedgerStatus = z.object({
  ledgerId: z.number(),
  status: z.nativeEnum(EngagementLedgerStatus),
});

// Schema Registry
//
export const ENGAGEMENT_REQUESTS = {
  createEngagement: CreateEngagementSchema,
  getEngagementsByCustomer: GetEngagementsByCustomerSchema,
  getEngagementTemplates: NoContentRequestSchema,
  createEngagementTemplate: CreateEngagementTemplateSchema,
  updateEngagementTemplate: UpdateEngagementTemplateSchema,
  deleteTemplateById: DeleteTemplateByIdSchema,
  deleteEngagementById: DeleteEngagementByIdSchema,
  toggleEngagementById: ToggleEngagementByIdSchema,
  getEngagementsLedgersByCustomer: GetEngagementsLedgersByCustomerSchema,
  issueLedgers: IssueLedgers,
  updateLedgerStatus: UpdateLedgerStatus,
};

export type EngagementContract = ApiContract<typeof ENGAGEMENT_REQUESTS>;
