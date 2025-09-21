import { AddressSchema, CustomerSchema, PhoneSchema } from "@/prisma/generated/schemas";
import { z } from "zod";
import { HomeOrderWithOrderSchema, LiteOrderSchema, PickupOrderWithOrderSchema } from "./order";
import { EngagementWithDetailsSchema } from "./engagement";
import { RFMCustomerSegmentSchema } from "./rfm";
import { GetCustomersStatsSchema } from "../schemas/results/getCustomersStats.schema";

export const CustomerWithPhoneSchema = CustomerSchema.extend({
  phone: PhoneSchema,
});

export const CustomerWithAddresses = CustomerWithPhoneSchema.extend({
  addresses: z.array(AddressSchema),
});

export const CustomerWithPhoneAndEngagementSchema = CustomerWithPhoneSchema.extend({
  engagements: z.array(EngagementWithDetailsSchema),
});

export const CustomerWithAddressesAndOrdersSchema = CustomerWithAddresses.extend({
  home_orders: z.array(HomeOrderWithOrderSchema),
  pickup_orders: z.array(PickupOrderWithOrderSchema),
});

export const ComprehensiveCustomerSchema = CustomerWithAddressesAndOrdersSchema.extend({
  engagements: z.array(EngagementWithDetailsSchema),
});

export const CustomerStatsOnlySchema = GetCustomersStatsSchema.omit({
  recency: true,
  frequency: true,
  monetary: true,
}).extend({
  rfm: RFMCustomerSegmentSchema,
});

export type CustomerStats = z.infer<typeof CustomerStatsOnlySchema>;

export const CustomerWithStatsSchema = ComprehensiveCustomerSchema.extend({
  stats: CustomerStatsOnlySchema.omit({ customerId: true }),
});

export const CustomerWithOrdersSchema = CustomerSchema.extend({
  home_orders: z.array(
    HomeOrderWithOrderSchema.pick({
      id: true,
      order: true,
    }).extend({
      order: LiteOrderSchema,
    })
  ),
  pickup_orders: z.array(
    PickupOrderWithOrderSchema.pick({
      id: true,
      order: true,
    }).extend({
      order: LiteOrderSchema,
    })
  ),
}).pick({
  id: true,
  home_orders: true,
  pickup_orders: true,
});

export type CustomerWithOrders = z.infer<typeof CustomerWithOrdersSchema>;
export type CustomerWithPhone = z.infer<typeof CustomerWithPhoneSchema>;
export type CustomerWithAddresses = z.infer<typeof CustomerWithAddresses>;
export type ComprehensiveCustomer = z.infer<typeof ComprehensiveCustomerSchema>;
export type CustomerWithStats = z.infer<typeof CustomerWithStatsSchema>;
