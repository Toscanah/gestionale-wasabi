import {
  AddressSchema,
  EngagementSchema,
  HomeOrderSchema,
  MetaMessageLogSchema,
  OrderSchema,
  PaymentSchema,
  PickupOrderSchema,
  TableOrderSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";
import { MinimalProductInOrderSchema, ProductInOrderWithOptionsSchema } from "./product";
import { CustomerWithPhoneSchema, CustomerWithPhoneAndEngagementSchema } from "./customer";
import { EngagementWithDetailsSchema } from "./engagement";
import { GetOrdersStatsSchema } from "../schemas/order";

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
    messages: z.array(MetaMessageLogSchema),
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

export const MinimalOrderSchema = BaseOrderSchema.pick({
  id: true,
  created_at: true,
  type: true,
  discount: true,
}).extend({
  products: z.array(MinimalProductInOrderSchema),
});

export const ShiftEvaluableOrderSchema = BaseOrderSchema.pick({
  id: true,
  created_at: true,
  type: true,
  shift: true,
})
  .partial({ shift: true })
  .extend({
    home_order: HomeOrderSchema.pick({ when: true }).nullable(),
    pickup_order: PickupOrderSchema.pick({ when: true }).nullable(),
  });


// --- Base and Minimal Order Types ---
export type BaseOrder = z.infer<typeof BaseOrderSchema>;
export type MinimalOrder = z.infer<typeof MinimalOrderSchema>;
export type ShiftEvaluableOrder = z.infer<typeof ShiftEvaluableOrderSchema>;

// --- Order Types with Specific Order Details ---
export type TableOrder = z.infer<typeof TableOrderInOrderSchema>;
export type HomeOrder = z.infer<typeof HomeOrderInOrderSchema>;
export type PickupOrder = z.infer<typeof PickupOrderInOrderSchema>;

// --- Order Types with Nested Order ---
export type TableOrderWithOrder = z.infer<typeof TableOrderWithOrderSchema>;
export type HomeOrderWithOrder = z.infer<typeof HomeOrderWithOrderSchema>;
export type PickupOrderWithOrder = z.infer<typeof PickupOrderWithOrderSchema>;

// --- Aggregated and Union Order Types ---
export type OrderWithPaymentsAndTotals = z.infer<typeof OrderWithPaymentsAndTotalsSchema>;
export type AnyOrder = z.infer<typeof AnyOrderSchema>;
// export type OrdersStatsArray = z.infer<typeof OrdersStatsArraySchema>;
