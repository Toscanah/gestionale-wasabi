import { AddressSchema, CustomerSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { RFMConfigSchema } from "../models/rfm";
import { CustomerStatsOnlySchema } from "../models/customer";
import { createInputSchema, wrapSchema } from "./common/utils";
import { PaginationRequestSchema, PaginationResponseSchema } from "./common/pagination";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { NoContentRequestSchema } from "./common/no-content";
import { PeriodRequestSchema } from "./common/period";
import SortingSchema from "./common/sorting";
import { CommonQueryFilterSchema } from "./common/query";

export const CUSTOMER_STATS_SORT_FIELDS = [
  "rfm.rank",
  "rfm.score.finalScore",
  "total_orders",
  "total_spent",
  "last_order_at",
  "first_order_at",
] as const;

export type CustomerStatsSortField = (typeof CUSTOMER_STATS_SORT_FIELDS)[number];

const CustomerStatsSortingSchema = SortingSchema(...CUSTOMER_STATS_SORT_FIELDS);

export namespace CustomerContracts {
  export namespace GetByPhone {
    export const Input = z.object({ phone: z.string() });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetWithDetails {
    export const Input = z.object({ customerId: z.number() });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetAllWithDetails {
    export const Input = PaginationRequestSchema.partial().extend({
      filters: z
        .object({
          ranks: z.array(z.string()).optional(),
        })
        .merge(CommonQueryFilterSchema)
        .optional(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetByDoorbell {
    export const Input = z.object({ doorbell: z.string() });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateFromAdmin {
    export const Input = wrapSchema("customer", CustomerSchema.extend({ phone: z.string() }));
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateFromOrder {
    export const Input = wrapSchema("customer", CustomerSchema);
    export type Input = z.infer<typeof Input>;
  }

  export namespace Create {
    export const Input = wrapSchema(
      "customer",
      createInputSchema(CustomerSchema).omit({ phone_id: true }).extend({
        phone: z.string(),
        name: z.string().nullable(),
        surname: z.string().nullable(),
      })
    );
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateAddresses {
    export const Input = z.object({
      addresses: z.array(AddressSchema),
      customerId: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateOrderNotes {
    export const Input = z.object({
      orderId: z.number(),
      notes: z.string(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace DeleteById {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetWithMarketing {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  // ---- Stats ----

  export namespace ComputeStats {
    export const Input = PaginationRequestSchema.extend({
      filters: z
        .object({
          period: PeriodRequestSchema,
          ranks: z.array(z.string()).optional(),
        })
        .merge(CommonQueryFilterSchema)
        .optional(),
      sort: z.array(CustomerStatsSortingSchema).optional(),
      rfmConfig: RFMConfigSchema,
      persist: z.boolean().optional().default(false),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z
      .object({
        customersStats: z.array(CustomerStatsOnlySchema),
      })
      .merge(PaginationResponseSchema);
    export type Output = z.infer<typeof Output>;
  }
}
