import {
  AddressSchema,
  HomeOrderSchema,
  OrderSchema,
  PaymentSchema,
  PickupOrderSchema,
  TableOrderSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "./Product";
import { CustomerWithPhoneSchema } from "./Customer";

export const OrderWithProductsSchema = OrderSchema.extend({
  products: z.array(z.lazy(() => ProductInOrderWithOptionsSchema)),
});

export const OrderWithProductsAndPaymentsSchema = OrderWithProductsSchema.extend({
  payments: z.array(PaymentSchema),
});

export const TableOrderInOrderSchema = OrderWithProductsAndPaymentsSchema.extend({
  table_order: TableOrderSchema.nullable(),
});

export const HomeOrderInOrderSchema = OrderWithProductsAndPaymentsSchema.extend({
  home_order: HomeOrderSchema.extend({
    customer: z.lazy(() => CustomerWithPhoneSchema),
    address: AddressSchema,
  }).nullable(),
});

export const PickupOrderInOrderSchema = OrderWithProductsAndPaymentsSchema.extend({
  pickup_order: PickupOrderSchema.extend({
    customer: z.lazy(() => CustomerWithPhoneSchema).nullable(),
  }).nullable(),
});

export const TableOrderWithOrderSchema = TableOrderSchema.extend({
  order: OrderWithProductsSchema,
});

export const HomeOrderWithOrderSchema = HomeOrderSchema.extend({
  order: OrderWithProductsSchema,
});

export const PickupOrderWithOrderSchema = PickupOrderSchema.extend({
  order: OrderWithProductsSchema,
});

export const OrderWithPaymentsAndTotalsSchema = OrderWithProductsAndPaymentsSchema.extend({
  totalCash: z.number().int(),
  totalCard: z.number().int(),
  totalVouch: z.number().int(),
  totalCredit: z.number().int(),
})
  .merge(TableOrderInOrderSchema)
  .merge(HomeOrderInOrderSchema)
  .merge(PickupOrderInOrderSchema);

export const AnyOrderSchema = z.union([
  TableOrderInOrderSchema,
  HomeOrderInOrderSchema,
  PickupOrderInOrderSchema,
]);

export type OrderWithPayments = z.infer<typeof OrderWithPaymentsAndTotalsSchema>;
export type TableOrder = z.infer<typeof TableOrderInOrderSchema>;
export type HomeOrder = z.infer<typeof HomeOrderInOrderSchema>;
export type PickupOrder = z.infer<typeof PickupOrderInOrderSchema>;
export type AnyOrder = z.infer<typeof AnyOrderSchema>;
