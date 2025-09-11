import { PaymentSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "../models/product";
import { NoContentRequestSchema } from "./common/no-content";

export namespace PaymentContracts {
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
  }

  export namespace GetOrdersWithPaymentsSplitted {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetRomanPaymentsByOrder {
    export const Input = z.object({
      orderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace AnalyzePaymentScopes {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }
}
