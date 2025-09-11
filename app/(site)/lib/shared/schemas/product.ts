import { z } from "zod";
import { OrderSchema, ProductSchema } from "@/prisma/generated/zod";
import { ProductInOrderWithOptionsSchema } from "../models/product";
import { ShiftFilterValue } from "../enums/shift";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { PeriodRequestSchema } from "./common/period";

// -----------------
// Product contracts
// -----------------
export namespace ProductContracts {
  export namespace GetAll {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace GetWithStats {
    export const Input = z.object({
      filters: z.object({
        period: PeriodRequestSchema,
        shift: z.nativeEnum(ShiftFilterValue).optional(),
        categoryIds: z.array(z.number()).optional(),
      }),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace Create {
    export const Input = wrapSchema(
      "product",
      createInputSchema(ProductSchema).partial({
        category_id: true,
        rice: true,
      })
    );
    export type Input = z.infer<typeof Input>;
  }

  export namespace Update {
    export const Input = wrapSchema(
      "product",
      updateInputSchema(ProductSchema).partial({
        category_id: true,
      })
    );
    export type Input = z.infer<typeof Input>;
  }

  export namespace AddToOrder {
    export const Input = z.object({
      order: OrderSchema,
      productCode: z.string(),
      quantity: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateInOrder {
    export const Input = z.object({
      orderId: z.number(),
      key: z.string(),
      value: z.any(),
      productInOrder: ProductInOrderWithOptionsSchema,
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace AddMultipleToOrder {
    export const Input = z.object({
      orderId: z.number(),
      products: z.array(ProductInOrderWithOptionsSchema),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateOptionsInOrder {
    export const Input = z.object({
      productInOrderId: z.number(),
      optionId: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdateVariationInOrder {
    export const Input = z.object({
      variation: z.string(),
      productInOrderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;
  }

  export namespace UpdatePrinted {
    export const Input = wrapSchema("orderId", z.number());
    export type Input = z.infer<typeof Input>;
  }

  export namespace DeleteFromOrder {
    export const Input = z.object({
      productIds: z.array(z.number()),
      orderId: z.number(),
      cooked: z.boolean().default(false),
    });
    export type Input = z.infer<typeof Input>;
  }
}
