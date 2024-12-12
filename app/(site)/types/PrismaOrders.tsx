import {
  AddressSchema,
  CategorySchema,
  CustomerSchema,
  OptionSchema,
  OrderSchema,
  PaymentSchema,
  PhoneSchema,
  ProductSchema,
  TableOrderSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";

export const ProductWithRelationsSchema = ProductSchema.extend({
  category: CategorySchema.extend({
    options: z.array(OptionSchema),
  }),
  options: z.array(OptionSchema),
});

export const OrderWithRelationsSchema = OrderSchema.extend({
  payments: z.array(PaymentSchema),
  products: z.array(
    ProductWithRelationsSchema.extend({
      product: ProductWithRelationsSchema,
    })
  ),
});

export const TableOrderWithRelationsSchema = OrderWithRelationsSchema.extend({
  table_order: TableOrderSchema,
});

export const HomeOrderWithRelationsSchema = OrderWithRelationsSchema.extend({
  home_order: z.object({
    customer: CustomerSchema.extend({
      phone: PhoneSchema,
    }),
    address: AddressSchema,
  }),
});

export const PickupOrderWithRelationsSchema = OrderWithRelationsSchema.extend({
  pickup_order: z.object({
    customer: CustomerSchema.extend({
      phone: PhoneSchema,
    }),
  }),
});

export type TableOrder = z.infer<typeof TableOrderSchema>;
export type HomeOrder = z.infer<typeof HomeOrderSchema>;
export type PickupOrder = z.infer<typeof PickupOrderSchema>;
export type AnyOrder = TableOrder | HomeOrder | PickupOrder;
