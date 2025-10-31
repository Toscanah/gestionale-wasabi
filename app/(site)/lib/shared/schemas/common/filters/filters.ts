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
import { extend } from "lodash";

export const APIFiltersSchema = ShiftFilterSchema.extend(OrderTypesFilterSchema.shape)
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

export type APIFilters = z.infer<typeof APIFiltersSchema>;

export function wrapAsFilters<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return z.object({ filters: schema.partial() });
}

export const PromotionFiltersSchema = wrapAsFilters(
  APIFiltersSchema.omit({ period: true })
    .extend(PromotionPeriodRequestSchema.shape)
    .pick({ periods: true, promotionTypes: true })
);

// TODO: plus many more ...
