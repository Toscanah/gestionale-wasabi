import { EngagementLedgerStatus, EngagementType } from "@prisma/client";
import { z } from "zod";
import {
  EngagementLedgerWithDetailsSchema,
  EngagementWithDetailsSchema,
  ParsedEngagementTemplateSchema,
} from "../models/Engagement";
import { wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";
import {
  EngagementLedgerSchema,
  EngagementSchema,
  EngagementTemplateSchema,
} from "@/prisma/generated/schemas";

export namespace EngagementContracts {
  export namespace Common {
    export const Template = EngagementTemplateSchema;
    export type Template = z.infer<typeof Template>;

    export const WithDetails = EngagementWithDetailsSchema;
    export type WithDetails = z.infer<typeof WithDetails>;

    export const ParsedTemplate = ParsedEngagementTemplateSchema;
    export type ParsedTemplate = z.infer<typeof ParsedTemplate>;
  }

  export const TemplatePayloadDraft = Common.ParsedTemplate.omit({
    id: true,
    created_at: true,
  }).extend({
    selectedImage: z.instanceof(File).optional().nullable(),
  });
  export type TemplatePayloadDraft = z.infer<typeof TemplatePayloadDraft>;

  export namespace CreateTemplate {
    export const Input = z.object({
      label: z.string().optional(),
      type: z.enum(EngagementType),
      redeemable: z.boolean(),
      payload: Common.ParsedTemplate.shape.payload,
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.ParsedTemplate;
    export type Output = Common.ParsedTemplate;
  }

  export namespace UpdateTemplate {
    export const Input = TemplatePayloadDraft.extend({
      id: z.number(),
    }).omit({ type: true });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.ParsedTemplate
    export type Output = Common.ParsedTemplate;
  }

  export namespace DeleteTemplateById {
    export const Input = wrapSchema("templateId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Template;
    export type Output = Common.Template;
  }

  export namespace Create {
    export const Input = z.object({
      templateId: z.number(),
      customerId: z.number().optional(),
      orderId: z.number().optional(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithDetails.nullable();
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetByCustomer {
    export const Input = wrapSchema("customerId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.WithDetails);
    export type Output = z.infer<typeof Output>;
  }

  export namespace DeleteEngagementById {
    export const Input = wrapSchema("engagementId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      id: z.number(),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace ToggleById {
    export const Input = wrapSchema("engagementId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      id: z.number(),
      enabled: z.boolean(),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetLedgersByCustomer {
    export const Input = z.object({
      customerId: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(EngagementLedgerWithDetailsSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace IssueLedgers {
    export const Input = wrapSchema("orderId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(
      EngagementSchema.pick({ id: true }).extend({
        template: EngagementTemplateSchema.pick({ id: true, redeemable: true }),
      })
    );
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateLedgerStatus {
    export const Input = z.object({
      ledgerId: z.number(),
      orderId: z.number(),
      status: z.enum(EngagementLedgerStatus),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = EngagementLedgerSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetTemplates {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.ParsedTemplate);
    export type Output = z.infer<typeof Output>;
  }
}
