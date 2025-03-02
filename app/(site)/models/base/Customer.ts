import { AddressSchema, CustomerSchema, PhoneSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import {
  HomeOrderWithOrderSchema,
  MarketingOnCustomerWithMarketingSchema,
  PickupOrderWithOrderSchema,
} from "./..";

export const CustomerWithAddressesAndOrdersSchema = CustomerSchema.extend({
  addresses: z.array(AddressSchema),
  home_orders: z.array(HomeOrderWithOrderSchema),
  pickup_orders: z.array(PickupOrderWithOrderSchema),
  phone: PhoneSchema,
});

export const CustomerWithMarketing = CustomerWithAddressesAndOrdersSchema.extend({
  marketings: z.array(MarketingOnCustomerWithMarketingSchema),
});

export const CustomerWithPhoneSchema = CustomerSchema.extend({
  phone: PhoneSchema,
});

export const CustomerWithAddressesSchema = CustomerWithPhoneSchema.extend({
  addresses: z.array(AddressSchema),
});

export type CustomerWithPhone = z.infer<typeof CustomerWithPhoneSchema>;
export type CustomerWithDetails = z.infer<typeof CustomerWithAddressesAndOrdersSchema>;
export type CustomerWithAddresses = z.infer<typeof CustomerWithAddressesSchema>;
export type CustomerWithMarketing = z.infer<typeof CustomerWithMarketing>;
