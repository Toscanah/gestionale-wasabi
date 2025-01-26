import { AddressSchema, CustomerSchema, PhoneSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { HomeOrderWithOrderSchema, PickupOrderWithOrderSchema } from "./..";

export const CustomerWithAddressesAndOrdersSchema = CustomerSchema.extend({
  addresses: z.array(AddressSchema),
  home_orders: z.array(HomeOrderWithOrderSchema),
  pickup_orders: z.array(PickupOrderWithOrderSchema),
  phone: PhoneSchema.nullable(),
});

export const CustomerWithPhoneSchema = CustomerSchema.extend({
  phone: PhoneSchema.nullable(),
});

export const CustomerWithAddressesSchema = CustomerWithPhoneSchema.extend({
  addresses: z.array(AddressSchema),
});

export type CustomerWithDetails = z.infer<typeof CustomerWithAddressesAndOrdersSchema>;
export type CustomerWithAddresses = z.infer<typeof CustomerWithAddressesSchema>;
