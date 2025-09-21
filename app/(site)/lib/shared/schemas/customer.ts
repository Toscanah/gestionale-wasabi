import { AddressSchema, CustomerSchema } from "@/prisma/generated/schemas";
import { z } from "zod";
import { RFMConfigSchema } from "../models/rfm";
import {
  CustomerStatsOnlySchema,
  ComprehensiveCustomerSchema,
  CustomerWithPhoneSchema,
  CustomerStats,
} from "../models/customer";
import { createInputSchema, wrapSchema } from "./common/utils";
import { PaginationRequestSchema, PaginationResponseSchema } from "./common/pagination";
import {
  DeleteEntityResponseSchema,
  ToggleDeleteEntityRequestSchema,
  ToggleEntityResponseSchema,
} from "./common/toggle-delete-entity";
import { NoContentRequestSchema } from "./common/no-content";
import { PeriodRequestSchema } from "./common/period";
import SortingSchema from "./common/sorting";
import {
  AnyOrderSchema,
  HomeOrderInOrderSchema,
  PickupOrderInOrderSchema,
  TableOrderInOrderSchema,
} from "../models/order";
import { ShiftFilterValue } from "../enums/shift";
import { CommonQueryFilterSchema } from "./common/query";
import { DottedKeys } from "../types/dotted-keys";

export const CUSTOMER_STATS_SORT_FIELDS = [
  "rfm.rank",
  "rfm.score.finalScore",
  "totalOrders",
  "totalSpent",
  "lastOrderAt",
  "firstOrderAt",
  "averageOrder",
] as const satisfies DottedKeys<CustomerStats>[];

export type CustomerStatsSortField = (typeof CUSTOMER_STATS_SORT_FIELDS)[number];

const CustomerStatsSortingSchema = SortingSchema(...CUSTOMER_STATS_SORT_FIELDS);

export namespace CustomerContracts {
  export namespace Common {
    export const Entity = CustomerSchema;
    export type Entity = z.infer<typeof Entity>;

    export const WithEngagement = ComprehensiveCustomerSchema;
    export type WithEngagement = z.infer<typeof WithEngagement>;
  }

  export namespace GetByPhone {
    export const Input = wrapSchema("phone", z.string());
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity.nullable();
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetWithDetails {
    export const Input = z.object({ customerId: z.number() });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithEngagement;
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetAllWithDetails {
    export const Input = z
      .object({
        filters: z
          .object({
            orders: z
              .object({
                ...PeriodRequestSchema.shape,
                shift: z.enum(ShiftFilterValue),
              })
              .partial()
              .optional(),
            ...CommonQueryFilterSchema.shape,
          })
          .partial(),
        ...PaginationRequestSchema.shape,
      })
      .partial()
      .optional();

    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.WithEngagement);
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetByDoorbell {
    export const Input = z.object({ doorbell: z.string() });
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.WithEngagement);
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateFromAdmin {
    export const Input = wrapSchema("customer", CustomerWithPhoneSchema);
    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithEngagement;
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateFromOrder {
    export const Input = wrapSchema("customer", Common.Entity);
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity;
    export type Output = Common.Entity;
  }

  export namespace Create {
    export const Input = wrapSchema(
      "customer",
      createInputSchema(Common.Entity).omit({ phone_id: true }).extend({
        phone: z.string(),
        name: z.string().nullable(),
        surname: z.string().nullable(),
      })
    );
    export type Input = z.infer<typeof Input>;

    export const Output = Common.Entity;
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateAddresses {
    export const Input = z.object({
      addresses: z.array(AddressSchema),
      customerId: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithEngagement;
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateOrderNotes {
    export const Input = z.object({
      orderId: z.number(),
      notes: z.string(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = HomeOrderInOrderSchema.or(PickupOrderInOrderSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = ToggleEntityResponseSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace DeleteById {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = DeleteEntityResponseSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetWithMarketing {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace ComputeStats {
    export const Input = z
      .object({
        filters: z
          .object({
            ranks: z.array(z.string()),
            ...PeriodRequestSchema.shape,
            ...CommonQueryFilterSchema.shape,
          })
          .partial(),
        rfmConfig: RFMConfigSchema,
        sort: z.array(CustomerStatsSortingSchema),
        ...PaginationRequestSchema.shape,
      })
      .partial({ filters: true, sort: true, pagination: true });

    export type Input = z.infer<typeof Input>;

    export const Output = z
      .object({
        customersStats: z.array(CustomerStatsOnlySchema),
      })
      .and(PaginationResponseSchema);
    export type Output = z.infer<typeof Output>;
  }
}
