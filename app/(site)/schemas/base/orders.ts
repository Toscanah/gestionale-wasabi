import {
  AddressSchema,
  CustomerSchema,
  OrderSchema,
  PaymentSchema,
  PhoneSchema,
  TableOrderSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";
import { ProductWithRelationsSchema } from "./products";

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


export type TableOrder = z.infer<typeof TableOrderWithRelationsSchema>;
export type HomeOrder = z.infer<typeof HomeOrderWithRelationsSchema>;
export type PickupOrder = z.infer<typeof PickupOrderWithRelationsSchema>;
export type AnyOrder = TableOrder | HomeOrder | PickupOrder;

