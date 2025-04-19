import { AddressSchema, CustomerSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, NoContentSchema, ToggleDeleteObjectSchema, wrapSchema } from "./common";

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

export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;

export const CreateCustomerSchema = wrapSchema("customer", CreateCustomerInputSchema);

export const UpdateAddressesOfCustomerSchema = z.object({
  addresses: z.array(AddressSchema),
  customerId: z.number(),
});

export const GetCustomersWithStatsSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const CUSTOMER_SCHEMAS = {
  getCustomerByPhone: GetCustomerByPhoneSchema,
  getCustomerWithDetails: GetCustomerWithDetailsSchema,
  getCustomersWithDetails: NoContentSchema,
  getCustomersByDoorbell: GetCustomersByDoorbellSchema,
  updateCustomerFromAdmin: UpdateCustomerFromAdminSchema,
  updateCustomerFromOrder: UpdateCustomerFromOrderSchema,
  createCustomer: CreateCustomerSchema,
  toggleCustomer: ToggleDeleteObjectSchema,
  updateAddressesOfCustomer: UpdateAddressesOfCustomerSchema,
  deleteCustomerById: ToggleDeleteObjectSchema,
  getCustomersWithStats: GetCustomersWithStatsSchema,
  getCustomersWithMarketing: NoContentSchema,
};
