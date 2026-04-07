import z from "zod";
import { CustomerDiscountSchema, CustomerDiscountTypeSchema, CustomerDiscountValueSchema } from "../models";

export type CustomerDiscountType = z.infer<typeof CustomerDiscountTypeSchema>;

export type CustomerDiscountValue = z.infer<typeof CustomerDiscountValueSchema>;

export type CustomerDiscount = z.infer<typeof CustomerDiscountSchema>;