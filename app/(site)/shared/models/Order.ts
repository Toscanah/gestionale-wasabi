import {
  AddressSchema,
  EngagementSchema,
  HomeOrderSchema,
  OrderSchema,
  PaymentSchema,
  PickupOrderSchema,
  TableOrderSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "./Product";
import { CustomerWithPhoneSchema, CustomerWithPhoneAndEngagementSchema } from "./Customer";
import { EngagementWithDetailsSchema } from "./Engagement";

export const BaseOrderSchema = OrderSchema.extend({
  products: z.array(z.lazy(() => ProductInOrderWithOptionsSchema)),
  engagements: z.array(EngagementWithDetailsSchema),
});

export const OrderWithPaymentsSchema = BaseOrderSchema.extend({
  payments: z.array(PaymentSchema),
});

export const TableOrderInOrderSchema = OrderWithPaymentsSchema.extend({
  table_order: TableOrderSchema.nullable(),
});

export const HomeOrderInOrderSchema = OrderWithPaymentsSchema.extend({
  home_order: HomeOrderSchema.extend({
    customer: z.lazy(() => CustomerWithPhoneAndEngagementSchema),
    address: AddressSchema,
  }).nullable(),
});

export const PickupOrderInOrderSchema = OrderWithPaymentsSchema.extend({
  pickup_order: PickupOrderSchema.extend({
    customer: z.lazy(() => CustomerWithPhoneAndEngagementSchema).nullable(),
  }).nullable(),
});

export const TableOrderWithOrderSchema = TableOrderSchema.extend({
  order: BaseOrderSchema,
});

export const HomeOrderWithOrderSchema = HomeOrderSchema.extend({
  order: BaseOrderSchema,
});

export const PickupOrderWithOrderSchema = PickupOrderSchema.extend({
  order: BaseOrderSchema,
});

export const OrderWithPaymentsAndTotalsSchema = BaseOrderSchema.extend({
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
