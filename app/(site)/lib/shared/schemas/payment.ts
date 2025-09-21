import { PaymentSchema } from "@/prisma/generated/schemas";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "../models/product";
import { AnyOrderSchema } from "../models/order";
import { PaymentType } from "@prisma/client";
import { OrderContracts } from "./order";
import { APIFiltersSchema, wrapFilters } from "./common/filters/filters";

export namespace PaymentContracts {
  export namespace GetSummary {
    export const Input = wrapFilters(
      APIFiltersSchema.pick({
        orderTypes: true,
        shift: true,
        period: true,
        query: true,
      })
    )
      .partial()
      .optional();

    export type Input = z.infer<typeof Input>;

    export const PaymentTotalSchema = z.object({
      label: z.string(),
      total: z.number(),
    });

    export const PaymentTotalsSchema = z.record(z.enum(PaymentType), PaymentTotalSchema);

    export const PaymentsSummaryDataSchema = z.object({
      totals: PaymentTotalsSchema,
      inPlaceAmount: z.number(),
      takeawayAmount: z.number(),
      tableOrdersAmount: z.number(),
      homeOrdersAmount: z.number(),
      pickupOrdersAmount: z.number(),
      tableOrdersCount: z.number(),
      homeOrdersCount: z.number(),
      pickupOrdersCount: z.number(),
      customersCount: z.number(),
      totalAmount: z.number(),
      rawTotalAmount: z.number(),
      centsDifference: z.number(),
    });

    export type PaymentsSummaryData = z.infer<typeof PaymentsSummaryDataSchema>;

    export const Output = PaymentsSummaryDataSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace PayOrder {
    export const Input = z.object({
      payments: z.array(
        PaymentSchema.omit({
          id: true,
          created_at: true,
          payment_group_code: true,
        })
      ),
      productsToPay: z.array(ProductInOrderWithOptionsSchema),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = AnyOrderSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetRomanPaymentsByOrder {
    export const Input = z.object({
      orderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      romanPayments: z.array(
        z.object({
          id: z.number(),
          amount: z.number(),
          payment_group_code: z.string().nullable(),
        })
      ),
    });
    export type Output = z.infer<typeof Output>;
  }
}
