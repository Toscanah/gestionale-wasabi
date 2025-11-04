import z from "zod";
import { PromotionFiltersSchema } from "./common/filters/filters";
import {
  FixedDiscountPromotionSchema,
  GiftCardPromotionSchema,
  PercentageDiscountPromotionSchema,
  PromotionByTypeSchema,
  PromotionUsageWithOrderSchema,
} from "../models/Promotion";
import { NoContentRequestSchema } from "./_index";
import { PromotionType } from "@prisma/client";
import { PromotionUsageSchema } from "@/prisma/generated/schemas";

export namespace PromotionContracts {
  export namespace Common {
    export const FixedDiscountPromotionCreateSchema = FixedDiscountPromotionSchema.omit({
      id: true,
      usages: true,
      created_at: true,
    });

    export const GiftCardPromotionCreateSchema = GiftCardPromotionSchema.omit({
      id: true,
      usages: true,
      created_at: true,
    });

    export const PercentageDiscountPromotionCreateSchema = PercentageDiscountPromotionSchema.omit({
      id: true,
      usages: true,
      created_at: true,
    });

    export const PromotionCreateSchema = z.discriminatedUnion("type", [
      FixedDiscountPromotionCreateSchema,
      GiftCardPromotionCreateSchema,
      PercentageDiscountPromotionCreateSchema,
    ]);
    export type PromotionCreateSchema = z.infer<typeof PromotionCreateSchema>;
  }
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

  export namespace Create {
    export const Input = z.object({
      promotion: Common.PromotionCreateSchema,
    });
    export type Input = z.infer<typeof Input>;

    export const Output = PromotionByTypeSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace ApplyPromotion {
    export const Input = z.object({
      orderId: z.coerce.number(),
      code: z.string(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = PromotionUsageSchema;
    export type Output = z.infer<typeof Output>;
  }

  export namespace GetByCode {
    export const Input = z.object({
      code: z.string(),
    });
    export type Input = z.infer<typeof Input>;

    export const Output = PromotionByTypeSchema.nullable();
    export type Output = z.infer<typeof Output>;
  }
}
