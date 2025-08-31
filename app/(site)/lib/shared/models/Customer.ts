import {
  AddressSchema,
  CustomerSchema,
  EngagementSchema,
  PhoneSchema,
} from "@/prisma/generated/zod";
import { z } from "zod";
import { HomeOrderWithOrderSchema, PickupOrderWithOrderSchema } from "./order";
import { EngagementWithDetailsSchema } from "./engagement";
import { RFMCustomerSegmentSchema } from "./rfm";

export const CustomerWithAddressesAndOrdersSchema = CustomerSchema.extend({
  addresses: z.array(AddressSchema),
  home_orders: z.array(HomeOrderWithOrderSchema),
  pickup_orders: z.array(PickupOrderWithOrderSchema),
  phone: PhoneSchema,
});

export const CustomerWithEngagementSchema = CustomerWithAddressesAndOrdersSchema.extend({
  engagements: z.array(EngagementWithDetailsSchema),
})
  .omit({ rfm: true })
  .extend({ rfm: RFMCustomerSegmentSchema });

export const CustomerWithPhoneSchema = CustomerSchema.extend({
  phone: PhoneSchema,
});

export const CustomerWithPhoneAndEngagementSchema = CustomerWithPhoneSchema.extend({
  engagements: z.array(EngagementWithDetailsSchema),
});

export const CustomerWithAddressesSchema = CustomerWithPhoneSchema.extend({
  addresses: z.array(AddressSchema),
});

export const CustomerWithStatsSchema = CustomerWithEngagementSchema.extend({
  averageOrdersWeek: z.number(),
  averageOrdersMonth: z.number(),
  averageOrdersYear: z.number(),
  averageSpending: z.number(),
  lastOrder: z.date().optional(),
  firstOrder: z.date().optional(),
  totalSpending: z.number(),
  rfm: RFMCustomerSegmentSchema,
});

export type CustomerWithPhone = z.infer<typeof CustomerWithPhoneSchema>;
export type CustomerWithPhoneAndEngagement = z.infer<typeof CustomerWithPhoneAndEngagementSchema>;
export type CustomerWithDetails = z.infer<typeof CustomerWithEngagementSchema>;
export type CustomerWithAddresses = z.infer<typeof CustomerWithAddressesSchema>;
export type CustomerWithStats = z.infer<typeof CustomerWithStatsSchema>;
