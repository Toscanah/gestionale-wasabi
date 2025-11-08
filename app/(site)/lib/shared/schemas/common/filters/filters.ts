import z from "zod";
import { PeriodRequestSchema } from "./period";
import { CommonQueryFilterSchema } from "./query";
import { TimeWindowFilterSchema } from "./time-window";
import { WeekdaysFilterSchema } from "./weekdays";
import { OrderTypesFilterSchema } from "./order-types";
import { ShiftFilterSchema } from "./shift";
import { RanksFilterSchema } from "./ranks";
import { EngagementTypesFilterSchema } from "./engagement-types";
import { CategoriesFilterSchema } from "./categories";
import { CustomerOriginFilterSchema } from "./customer-origin";
import { OnlyActiveFilterSchema } from "./only-active";
import { PromotionPeriodRequestSchema } from "./promotion-periods";
import { PromotionTypesFilterSchema } from "./promotion-types";

export function wrapAsFilters<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return z.object({ filters: schema.partial() });
}

export const BaseAPIFiltersSchema = ShiftFilterSchema.extend(OrderTypesFilterSchema.shape)
  .extend(PeriodRequestSchema.shape)
  .extend(CommonQueryFilterSchema.shape)
  .extend(WeekdaysFilterSchema.shape)
  .extend(TimeWindowFilterSchema.shape)
  .extend(RanksFilterSchema.shape)
  .extend(EngagementTypesFilterSchema.shape)
  .extend(CategoriesFilterSchema.shape)
  .extend(CustomerOriginFilterSchema.shape)
  .extend(OnlyActiveFilterSchema.shape)
  .extend(PromotionTypesFilterSchema.shape);

export type BaseAPIFilters = z.infer<typeof BaseAPIFiltersSchema>;

export const OrderFiltersSchema = BaseAPIFiltersSchema.omit({
  query: true,
  onlyActive: true,
  customerOrigins: true,
  engagementTypes: true,
  categoryIds: true,
  ranks: true,
  promotionTypes: true,
});

export const OrderPaymentsFiltersSchema = BaseAPIFiltersSchema.omit({
  weekdays: true,
  timeWindow: true,
  ranks: true,
  categoryIds: true,
  customerOrigins: true,
  engagementTypes: true,
  onlyActive: true,
  promotionTypes: true,
});

export const CustomerFiltersSchema = BaseAPIFiltersSchema.pick({
  query: true,
  customerOrigins: true,
  engagementTypes: true,
}).extend({
  orders: z
    .object({
      shift: BaseAPIFiltersSchema.shape.shift.optional(),
      period: BaseAPIFiltersSchema.shape.period.optional(),
    })
    .optional(),
});

export const PaymentFiltersSchema = BaseAPIFiltersSchema.pick({
  query: true,
  orderTypes: true,
  shift: true,
  period: true,
});

export const CustomerStatsFiltersSchema = BaseAPIFiltersSchema.pick({
  query: true,
  customerOrigins: true,
  ranks: true,
  period: true,
});

export const ProductFiltersSchema = BaseAPIFiltersSchema.pick({
  query: true,
  categoryIds: true,
  onlyActive: true,
});

export const ProductStatsFiltersSchema = BaseAPIFiltersSchema.pick({
  period: true,
  query: true,
  shift: true,
  categoryIds: true,
});

export const PromotionFiltersSchema = BaseAPIFiltersSchema.omit({ period: true })
  .extend(PromotionPeriodRequestSchema.shape)
  .pick({ periods: true, promotionTypes: true });

export const APIFiltersSchema = z.object({
  order: z.object({
    base: OrderFiltersSchema,
    payments: OrderPaymentsFiltersSchema,
  }),
  customer: z.object({
    base: CustomerFiltersSchema,
    stats: CustomerStatsFiltersSchema,
  }),
  product: z.object({
    base: ProductFiltersSchema,
    stats: ProductStatsFiltersSchema,
  }),
  payment: PaymentFiltersSchema,
  promotion: PromotionFiltersSchema,
});

export type APIFilters = z.infer<typeof APIFiltersSchema>;

export const FlattenedAPIFiltersSchema = z.object({
  orderBase: OrderFiltersSchema,
  orderPayments: OrderPaymentsFiltersSchema,
  customerBase: CustomerFiltersSchema,
  customerStats: CustomerStatsFiltersSchema,
  productBase: ProductFiltersSchema,
  productStats: ProductStatsFiltersSchema,
  payment: PaymentFiltersSchema,
  promotion: PromotionFiltersSchema,
});

export type FlattenedAPIFilters = z.infer<typeof FlattenedAPIFiltersSchema>;
