import {
  AddressSchema,
  CustomerSchema,
  EngagementSchema,
  PhoneSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";
import { HomeOrderWithOrderSchema, PickupOrderWithOrderSchema } from "./Order";

export const CustomerWithAddressesAndOrdersSchema = CustomerSchema.extend({
  addresses: z.array(AddressSchema),
  home_orders: z.array(HomeOrderWithOrderSchema),
  pickup_orders: z.array(PickupOrderWithOrderSchema),
  phone: PhoneSchema,
});

export const CustomerWithEngagementSchema = CustomerWithAddressesAndOrdersSchema.extend({
  engagement: z.array(EngagementSchema),
});

export const CustomerWithPhoneSchema = CustomerSchema.extend({
  phone: PhoneSchema,
});

export const CustomerWithAddressesSchema = CustomerWithPhoneSchema.extend({
  addresses: z.array(AddressSchema),
});

export type CustomerWithPhone = z.infer<typeof CustomerWithPhoneSchema>;
export type CustomerWithDetails = z.infer<typeof CustomerWithEngagementSchema>;
export type CustomerWithAddresses = z.infer<typeof CustomerWithAddressesSchema>;
