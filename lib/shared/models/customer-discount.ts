import z from "zod";

export const CustomerDiscountTypeSchema = z.enum(["NONE", "FIXED", "PERCENTAGE"]);

export const CustomerDiscountValueSchema = z.number();

export const CustomerDiscountSchema = z.object({
  type: CustomerDiscountTypeSchema.default("NONE"),
  value: CustomerDiscountValueSchema.default(0),
});
