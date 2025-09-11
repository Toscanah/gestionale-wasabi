import { OrderType, PlannedPayment, WorkingShift } from "@prisma/client";
import { z } from "zod";
import {
  AnyOrderSchema,
  OrderWithPaymentsAndTotalsSchema,
  ProductInOrderWithOptionsSchema,
} from "../models/_index";
import { NoContentRequestSchema } from "./common/no-content";
import { wrapSchema } from "./common/utils";
import { PaginationRequestSchema, PaginationResponseSchema } from "./common/pagination";
import { ShiftFilterValue } from "../enums/shift";
import { PeriodRequestSchema } from "./common/period";
import { TimeWindowRequestSchema } from "./common/time-window";
import { OrdersStats } from "./_index";

// -----------------
// Order contracts
// -----------------
export namespace OrderContracts {
  // ---- Getters ----
  export namespace GetById {
    export const Input = z.object({
      orderId: z.number(),
      variant: z.string().default("onlyPaid"),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetByType {
    export const Input = wrapSchema("type", z.nativeEnum(OrderType));
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetWithPayments {
    export const Input = z
      .object({
        filters: z.object({
          orderTypes: z.array(z.nativeEnum(OrderType)).optional(),
          shift: z.nativeEnum(ShiftFilterValue).optional(),
          period: PeriodRequestSchema,
          weekdays: z.array(z.number()).optional(),
          timeWindow: TimeWindowRequestSchema.optional(),
          query: z.string().optional(),
        }),
        summary: z.boolean().optional(),
      })
      .merge(PaginationRequestSchema.partial());
    export type Input = z.infer<typeof Input>;

    export const Output = z
      .object({
        orders: z.array(OrderWithPaymentsAndTotalsSchema),
      })
      .merge(PaginationResponseSchema);
    export type Output = z.infer<typeof Output>;
  }

  // ---- Create ----
  export namespace CreateTable {
    export const Input = z.object({
      table: z.string(),
      people: z.number(),
      resName: z.string().optional(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace CreatePickup {
    export const Input = z.object({
      name: z.string(),
      when: z.string(),
      phone: z.string(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace CreateHome {
    export const Input = z.object({
      customerId: z.number(),
      addressId: z.number(),
      contactPhone: z.string(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace CreateSub {
    export const Input = z.object({
      parentOrder: AnyOrderSchema,
      products: z.array(ProductInOrderWithOptionsSchema),
      isReceiptPrinted: z.boolean(),
    });
    export type Input = z.infer<typeof Input>;
  }

  // ---- Update ----
  export namespace UpdateDiscount {
    export const Input = z.object({
      orderId: z.number(),
      discount: z.number().optional(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdatePaymentStatus {
    export const Input = z.object({
      orderId: z.number(),
      prepaid: z.boolean(),
      plannedPayment: z.nativeEnum(PlannedPayment),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateTime {
    export const Input = z.object({
      orderId: z.number(),
      time: z.string(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdatePrintedFlag {
    export const Input = wrapSchema("orderId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateTable {
    export const Input = z.object({
      table: z.string(),
      orderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateExtraItems {
    export const Input = z.object({
      orderId: z.number(),
      items: z.enum(["salads", "soups", "rices"]),
      value: z.number().nullable(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateShift {
    export const Input = z.object({
      orderId: z.number(),
      shift: z.nativeEnum(WorkingShift),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateTablePpl {
    export const Input = z.object({
      orderId: z.number(),
      people: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  // ---- Bulk / Misc ----
  export namespace Cancel {
    export const Input = z.object({
      orderId: z.number(),
      cooked: z.boolean().optional().default(false),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace CancelInBulk {
    export const Input = z.object({
      orderIds: z.array(z.number()),
      productsCooked: z.boolean(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace JoinTable {
    export const Input = z.object({
      tableToJoin: z.string(),
      originalOrderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace DeleteEverything {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace FixShift {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateOrdersShift {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace ComputeStats {
    export const Input = z.object({
      filters: z.object({
        shift: z.enum(ShiftFilterValue).optional(),
        period: PeriodRequestSchema,
        weekdays: z.array(z.number()).optional(),
        timeWindow: TimeWindowRequestSchema.optional(),
      }),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = OrdersStats.Results;
    export type Output = z.infer<typeof Output>;
  }
}
