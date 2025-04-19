import { z } from "zod";
;
import { CategorySchema, OptionSchema, PaymentSchema, ProductSchema } from "@/prisma/generated/zod";
import { ShiftFilter } from "../../components/filters/shift/ShiftFilterSelector";
import TimeScopeFilter from "../../components/filters/shift/TimeScope";
import { AnyOrderSchema, ProductInOrderWithOptionsSchema } from "../models";

export const CreateSubOrderSchema = z.object({
  parentOrder: AnyOrderSchema,
  products: z.array(ProductInOrderWithOptionsSchema),
  isReceiptPrinted: z.boolean(),
});

export const PayOrderSchema = z.object({
  payments: z.array(PaymentSchema.omit({ id: true, created_at: true })),
  productsToPay: z.array(ProductInOrderWithOptionsSchema),
});

export const UpdateOptionsOfCategorySchema = z.object({
  category: CategorySchema,
  options: z.array(OptionSchema),
});

export const NoContentSchema = z.object({});

export const CreateProductSchema = ProductSchema.omit({ id: true }).partial({
  category_id: true,
  rice: true,
});

export const UpdateProductSchema = ProductSchema.omit({ active: true }).partial({
  category_id: true,
});

export const CreateOptionSchema = OptionSchema.omit({ id: true });

export const UpdateOptionSChema = OptionSchema.omit({ active: true });

export const GetProductsWithStatsSchema = z.object({
  filters: z.object({
    time: z.object({
      timeScope: z.nativeEnum(TimeScopeFilter),
      from: z.date().optional(),
      to: z.date().optional(),
    }),
    shift: z.nativeEnum(ShiftFilter),
    categoryId: z.number().optional(),
  }),
});

export const SendMarketingToCustomersSchema = z.object({
  customerIds: z.array(z.number()),
  marketingId: z.number(),
});
