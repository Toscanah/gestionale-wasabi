import z from "zod";
import { APIFiltersSchema, PromotionFiltersSchema, wrapAsFilters } from "./common/filters/filters";
import { PromotionByTypeSchema, PromotionUsageWithOrderSchema } from "../models/Promotion";
import { NoContentRequestSchema } from "./_index";
import { PromotionType } from "@prisma/client";

export namespace PromotionContracts {
  export namespace GetAll {
    export const Input = PromotionFiltersSchema.partial().optional();
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(PromotionByTypeSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace CountsByType {
    export const Input = NoContentRequestSchema;
    export type Input = z.infer<typeof Input>;

    export const Output = z.record(z.enum(PromotionType), z.number());
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetUsagesByPromotion {
    export const Input = z.object({
      promotionId: z.coerce.number(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = z.array(PromotionUsageWithOrderSchema);
    export type Output = z.infer<typeof Output>;
  }

  export namespace Create {}

  export namespace Update {}
}
