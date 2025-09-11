import {
  AddressSchema,
  CustomerSchema,
  CustomerStatsSchema,
  EngagementSchema,
  PhoneSchema,
  ProductInOrderSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";
import {
  BaseOrderSchema,
  HomeOrderWithOrderSchema,
  MinimalOrderSchema,
  PickupOrderWithOrderSchema,
} from "./order";
import { EngagementWithDetailsSchema } from "./engagement";
import { RFMCustomerSegmentSchema } from "./rfm";
import { getCustomersStats, getOrdersStats } from "@prisma/client/sql";
import { RFMCustomerSegment } from "../types/rfm";
import { GetCustomersStatsSchema } from "../schemas/customer";

export const CustomerWithAddressesAndOrdersSchema = CustomerSchema.extend({
  addresses: z.array(AddressSchema),
  home_orders: z.array(HomeOrderWithOrderSchema),
  pickup_orders: z.array(PickupOrderWithOrderSchema),
  phone: PhoneSchema,
});

export const CustomerWithEngagementSchema = CustomerWithAddressesAndOrdersSchema.extend({
  engagements: z.array(EngagementWithDetailsSchema),
});

export const CustomerWithPhoneSchema = CustomerSchema.extend({
  phone: PhoneSchema,
});

export const CustomerWithPhoneAndEngagementSchema = CustomerWithPhoneSchema.extend({
  engagements: z.array(EngagementWithDetailsSchema),
});

export const CustomerWithAddressesSchema = CustomerWithPhoneSchema.extend({
  addresses: z.array(AddressSchema),
});

export const CustomerStatsOnlySchema = GetCustomersStatsSchema.omit({
  recency: true,
  frequency: true,
  monetary: true,
}).extend({
  rfm: RFMCustomerSegmentSchema,
});

export type CustomerStats = z.infer<typeof CustomerStatsOnlySchema>;

export const CustomerWithStatsSchema = CustomerWithEngagementSchema.extend({
  stats: CustomerStatsOnlySchema.omit({ customerId: true }),
});

export const MinimalCustomerSchema = CustomerSchema.extend({
  home_orders: z.array(
    HomeOrderWithOrderSchema.pick({
      id: true,
      order: true,
    }).extend({
      order: MinimalOrderSchema,
    })
  ),
  pickup_orders: z.array(
    PickupOrderWithOrderSchema.pick({
      id: true,
      order: true,
    }).extend({
      order: MinimalOrderSchema,
    })
  ),
}).pick({
  id: true,
  home_orders: true,
  pickup_orders: true,
});

export type MinimalCustomer = z.infer<typeof MinimalCustomerSchema>;
export type CustomerWithPhone = z.infer<typeof CustomerWithPhoneSchema>;
export type CustomerWithPhoneAndEngagement = z.infer<typeof CustomerWithPhoneAndEngagementSchema>;
export type CustomerWithAddresses = z.infer<typeof CustomerWithAddressesSchema>;
export type CustomerWithDetails = z.infer<typeof CustomerWithEngagementSchema>;
export type CustomerWithStats = z.infer<typeof CustomerWithStatsSchema>;
