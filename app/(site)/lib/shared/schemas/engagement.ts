import { EngagementLedgerStatus, EngagementType } from "@prisma/client";
import { z } from "zod";
import { ParsedEngagementTemplateSchema } from "../models/engagement";
import { wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";

export namespace EngagementContracts {
  // Shared schemas
  export const TemplatePayloadDraft = ParsedEngagementTemplateSchema.omit({
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
      payload: z.record(z.any(), z.any()),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateTemplate {
    export const Input = TemplatePayloadDraft.extend({
      id: z.number(),
    }).omit({ type: true });
    export type Input = z.infer<typeof Input>;
  }

  export namespace DeleteTemplate {
    export const Input = wrapSchema("templateId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace Create {
    export const Input = z.object({
      templateId: z.number(),
      customerId: z.number().optional(),
      orderId: z.number().optional(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetByCustomer {
    export const Input = wrapSchema("customerId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace DeleteById {
    export const Input = wrapSchema("engagementId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace ToggleById {
    export const Input = wrapSchema("engagementId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetLedgersByCustomer {
    export const Input = z.object({
      customerId: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace IssueLedgers {
    export const Input = wrapSchema("orderId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateLedgerStatus {
    export const Input = z.object({
      ledgerId: z.number(),
      status: z.nativeEnum(EngagementLedgerStatus),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetTemplates {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }
}
