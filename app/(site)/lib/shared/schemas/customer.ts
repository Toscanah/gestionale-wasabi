import { AddressSchema, CustomerSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import {
  createInputSchema,
  NoContentSchema,
  PaginationSchema,
  ToggleDeleteObjectSchema,
  wrapSchema,
} from "./common";
import { SchemaInputs } from "../types/SchemaInputs";
import { RFMConfigSchema, RFMRuleschema } from "../models/RFM";
import { Seal } from "@phosphor-icons/react";
import { CustomerWithEngagementSchema } from "../models/Customer";

export const GetCustomerByPhoneSchema = z.object({ phone: z.string() });

export const GetCustomerWithDetailsSchema = z.object({ customerId: z.number() });

export const GetCustomersByDoorbellSchema = z.object({ doorbell: z.string() });

export const UpdateCustomerFromAdminSchema = wrapSchema(
  "customer",
  CustomerSchema.extend({ phone: z.string() })
);

export const UpdateCustomerFromOrderSchema = wrapSchema("customer", CustomerSchema);

export const CreateCustomerInputSchema = createInputSchema(CustomerSchema)
  .omit({
    phone_id: true,
    rfm: true,
  })
  .extend({
    phone: z.string(),
    name: z.string().nullable(),
    surname: z.string().nullable(),
  });

export const CreateCustomerSchema = wrapSchema("customer", CreateCustomerInputSchema);

export const UpdateCustomerAddressesSchema = z.object({
  addresses: z.array(AddressSchema),
  customerId: z.number(),
});

export const UpdateCustomerOrderNotesSchema = z.object({
  orderId: z.number(),
  notes: z.string(),
});

export const GetCustomersWithDetailsSchema = PaginationSchema.partial().extend({
  filters: z
    .object({
      rank: z.string().optional(),
      search: z.string().optional(),
    })
    .optional(),
});

export const ComputeCustomersStatsSchema = PaginationSchema.extend({
  filters: z
    .object({
      from: z.coerce.date(),
      to: z.coerce.date(),
      rank: z.string(),
      search: z.string(),
    })
    .partial()
    .optional(),
  rfmConfig: RFMConfigSchema,
});

export const UpdateCustomersRFMSchema = z.object({
  rfmConfig: RFMConfigSchema,
  customers: z.array(CustomerWithEngagementSchema),
});

export const CUSTOMER_SCHEMAS = {
  getCustomerByPhone: GetCustomerByPhoneSchema,
  getCustomerWithDetails: GetCustomerWithDetailsSchema,
  getCustomersWithDetails: GetCustomersWithDetailsSchema,
  getCustomersByDoorbell: GetCustomersByDoorbellSchema,
  updateCustomerFromAdmin: UpdateCustomerFromAdminSchema,
  updateCustomerFromOrder: UpdateCustomerFromOrderSchema,
  updateCustomerOrderNotes: UpdateCustomerOrderNotesSchema,
  createCustomer: CreateCustomerSchema,
  toggleCustomer: ToggleDeleteObjectSchema,
  updateCustomerAddresses: UpdateCustomerAddressesSchema,
  deleteCustomerById: ToggleDeleteObjectSchema,
  computeCustomersStats: ComputeCustomersStatsSchema,
  getCustomersWithMarketing: NoContentSchema,
  updateCustomersRFM: UpdateCustomersRFMSchema,
};

export type CustomerSchemaInputs = SchemaInputs<typeof CUSTOMER_SCHEMAS>;
