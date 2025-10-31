import { z } from "zod";
import { OrderSchema, ProductSchema } from "@/prisma/generated/schemas";
import {
  Product,
  ProductInOrderWithOptionsSchema,
  ProductStats,
  ProductStatsOnlySchema,
  ProductWithCategorySchema,
} from "../models/Product";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import {
  ToggleDeleteEntityRequestSchema,
  ToggleEntityResponseSchema,
} from "./common/toggle-delete-entity";
import { OptionInProductOrderWithOptionSchema } from "../models/Option";
import SortingSchema from "./common/sorting";
import { DottedKeys } from "../types/DottedKeys";
import { APIFiltersSchema, wrapAsFilters } from "./common/filters/filters";
import { PaginationResponseSchema, PaginationSchema } from "./common/pagination";

export const PRODUCT_STATS_SORT_FIELDS = [
  "unitsSold",
  "revenue",
  "totalRice",
] as const satisfies DottedKeys<ProductStats>[];

export type ProductStatsSortField = (typeof PRODUCT_STATS_SORT_FIELDS)[number];

const ProductStatsSortingSchema = SortingSchema(...PRODUCT_STATS_SORT_FIELDS);

export const PRODUCT_SORT_FIELDS = [
  "category.category",
  "code",
  "desc",
  "home_price",
  "site_price",
  "kitchen",
  "rice",
] as const satisfies DottedKeys<Product>[];

export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number];

const ProductSortingSchema = SortingSchema(...PRODUCT_SORT_FIELDS);

export namespace ProductContracts {
  export namespace Common {
    export const WithCategory = ProductWithCategorySchema;
    export type WithCategory = z.infer<typeof WithCategory>;

    export const InOrder = ProductInOrderWithOptionsSchema;
    export type InOrder = z.infer<typeof InOrder>;
  }

  export namespace GetAll {
    export const Input = wrapAsFilters(
      APIFiltersSchema.pick({
        categoryIds: true,
        onlyActive: true,
        query: true,
      })
    )
      .extend(PaginationSchema.shape)
      .extend({
        sort: z.array(ProductSortingSchema),
      })
      .partial()
      .optional();
    export type Input = z.infer<typeof Input>;

    export const Output = z
      .object({
        products: z.array(Common.WithCategory),
      })
      .and(PaginationResponseSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace ComputeStats {
    export const Input = wrapAsFilters(
      APIFiltersSchema.pick({
        period: true,
        query: true,
        shift: true,
        categoryIds: true,
      })
    )
      .extend({
        sort: z.array(ProductStatsSortingSchema),
      })
      .partial()
      .optional();

    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      productsStats: z.array(ProductStatsOnlySchema),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace Create {
    export const Input = z.object({
      product: createInputSchema(ProductSchema),
    });

    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithCategory;
    export type Output = Common.WithCategory;
  }

  export namespace Update {
    export const Input = z.object({
      product: updateInputSchema(ProductSchema),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.WithCategory;
    export type Output = Common.WithCategory;
  }

  export namespace AddToOrder {
    export const Input = z.object({
      order: OrderSchema.pick({ id: true, type: true }),
      productCode: z.string(),
      quantity: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.InOrder;
    export type Output = Common.InOrder;
  }

  export namespace UpdateInOrder {
    export const Input = z.object({
      orderId: z.number(),
      key: z.enum(["quantity", "code"]),
      value: z.any(),
      productInOrder: Common.InOrder,
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      updatedProductInOrder: Common.InOrder,
      isDeleted: z.boolean().optional(),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace AddMultipleToOrder {
    export const Input = z.object({
      orderId: z.number(),
      products: z.array(Common.InOrder),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      addedProducts: z.array(Common.InOrder),
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace ToggleOptionInOrder {
    export const Input = z.object({
      productInOrderId: z.number(),
      optionId: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.object({
      deleted: z.boolean(),
      optionInProductOrder: OptionInProductOrderWithOptionSchema,
    });
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdateVariationInOrder {
    export const Input = z.object({
      variation: z.string(),
      productInOrderId: z.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = Common.InOrder;
    export type Output = Common.InOrder;
  }

  export namespace Toggle {
    export const Input = ToggleDeleteEntityRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = ToggleEntityResponseSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace UpdatePrinted {
    export const Input = wrapSchema("orderId", z.number());
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.InOrder);
    export type Output = z.infer<typeof Output>;
  }

  export namespace DeleteFromOrder {
    export const Input = z.object({
      productIds: z.array(z.number()),
      orderId: z.number(),
      cooked: z.boolean().default(false),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(Common.InOrder);
    export type Output = z.infer<typeof Output>;
  }
}
