import {
  AddressSchema,
  HomeOrderSchema,
  MetaMessageLogSchema,
  OrderSchema,
  PaymentSchema,
  PickupOrderSchema,
  TableOrderSchema,
} from "@/prisma/generated/schemas";
import { z } from "zod";
import { MinimalProductInOrderSchema, ProductInOrderWithOptionsSchema } from "./Product";
import { CustomerWithPhoneAndEngagementSchema } from "./Customer";
import { OrderType } from "@prisma/client";
import { EngagementWithDetailsSchema } from "./Engagement";

/** ---------- Shared “base” enrichments (no relations yet) ---------- */

export const OrderWithProducts = OrderSchema.extend({
  products: z.array(z.lazy(() => ProductInOrderWithOptionsSchema)),
});

export const OrderWithPaymentsSchema = OrderSchema.extend({
  payments: z.array(PaymentSchema),
});

export const OrderWithEngagementsSchema = OrderSchema.extend({
  engagements: z.array(EngagementWithDetailsSchema),
});

/** Full base (no per-type relation yet) */
export const FullOrderSchema = OrderWithProducts.extend(
  OrderWithEngagementsSchema.pick({
    engagements: true,
  }).shape
).extend(OrderWithPaymentsSchema.pick({ payments: true }).shape);

export const OrderFullPaymentContextSchema = OrderWithProducts.extend(
  OrderWithPaymentsSchema.pick({
    payments: true,
  }).shape
);

/** ---------- Per-type “InOrder” shapes (discriminants) ---------- */
/** Each branch sets the literal `type` and carries the right relation. */

export const TableOrderInOrderSchema = FullOrderSchema.extend({
  type: z.literal(OrderType.TABLE),
  table_order: TableOrderSchema, // present & validated
});

export const HomeOrderInOrderSchema = FullOrderSchema.extend({
  type: z.literal(OrderType.HOME),
  home_order: HomeOrderSchema.extend({
    customer: z.lazy(() => CustomerWithPhoneAndEngagementSchema),
    address: AddressSchema,
    messages: z.array(MetaMessageLogSchema),
  }),
});

export const PickupOrderInOrderSchema = FullOrderSchema.extend({
  type: z.literal(OrderType.PICKUP),
  pickup_order: PickupOrderSchema.extend({
    customer: z.lazy(() => CustomerWithPhoneAndEngagementSchema).nullable(),
  }),
});

export const TableOrderWithOrderSchema = TableOrderSchema.extend({
  order: FullOrderSchema.omit({
    payments: true,
  }),
});

export const HomeOrderWithOrderSchema = HomeOrderSchema.extend({
  order: FullOrderSchema.omit({
    payments: true,
  }),
});

export const PickupOrderWithOrderSchema = PickupOrderSchema.extend({
  order: FullOrderSchema.omit({
    payments: true,
  }),
});

/** ---------- The discriminated union (new name) ---------- */
/** This replaces the old `OrderByTypeSchema`. */
export const OrderByTypeSchema = z.discriminatedUnion("type", [
  TableOrderInOrderSchema,
  HomeOrderInOrderSchema,
  PickupOrderInOrderSchema,
]);

/** ---------- Complementary shapes you already use ---------- */

export const OrderWithSummedPayments = z
  .object({
    summedCash: z.number(),
    summedCard: z.number(),
    summedVouch: z.number(),
  })
  .and(OrderByTypeSchema);

export const LiteOrderSchema = OrderWithProducts.pick({
  id: true,
  created_at: true,
  type: true,
  discount: true,
}).extend({
  products: z.array(MinimalProductInOrderSchema),
});

export const ShiftEvaluableOrderSchema = OrderWithProducts.pick({
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
export type OrderWithProducts = z.infer<typeof OrderWithProducts>;
export type LiteOrder = z.infer<typeof LiteOrderSchema>;
export type OrderFullPaymentContext = z.infer<typeof OrderFullPaymentContextSchema>;
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
export type OrderWithSummedPayments = z.infer<typeof OrderWithSummedPayments>;
export type OrderByType = z.infer<typeof OrderByTypeSchema>;
