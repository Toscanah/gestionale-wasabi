import { AddressSchema, CustomerSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, NoContentSchema, ToggleDeleteObjectSchema, wrapSchema } from "./common";
import { SchemaInputs } from "../types/SchemaInputs";

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

export const GetCustomersWithStatsSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const UpdateCustomerOrderNotesSchema = z.object({
  orderId: z.number(),
  notes: z.string(),
});

export const CUSTOMER_SCHEMAS = {
  getCustomerByPhone: GetCustomerByPhoneSchema,
  getCustomerWithDetails: GetCustomerWithDetailsSchema,
  getCustomersWithDetails: NoContentSchema,
  getCustomersByDoorbell: GetCustomersByDoorbellSchema,
  updateCustomerFromAdmin: UpdateCustomerFromAdminSchema,
  updateCustomerFromOrder: UpdateCustomerFromOrderSchema,
  updateCustomerOrderNotes: UpdateCustomerOrderNotesSchema,
  createCustomer: CreateCustomerSchema,
  toggleCustomer: ToggleDeleteObjectSchema,
  updateCustomerAddresses: UpdateCustomerAddressesSchema,
  deleteCustomerById: ToggleDeleteObjectSchema,
  getCustomersWithStats: GetCustomersWithStatsSchema,
  getCustomersWithMarketing: NoContentSchema,
};

export type CustomerSchemaInputs = SchemaInputs<typeof CUSTOMER_SCHEMAS>;
