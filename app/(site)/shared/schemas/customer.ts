import { AddressSchema, CustomerSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { NoContentSchema } from "./Schemas";

export const GetCustomerByPhoneSchema = z.object({ phone: z.string() });

export const GetCustomerWithDetailsSchema = z.object({ customerId: z.number() });

export const GetCustomersWithDetailsSchema = NoContentSchema;

export const GetCustomersByDoorbellSchema = z.object({ doorbell: z.string() });

export const UpdateCustomerFromAdminSchema = z.object({
  customer: CustomerSchema.extend({ phone: z.string() }),
});

export const UpdateCustomerFromOrderSchema = z.object({
  customer: CustomerSchema,
});

export const CreateCustomerInputSchema = CustomerSchema.omit({
  id: true,
  phone_id: true,
  active: true,
}).extend({
  phone: z.string(),
  name: z.string().nullable(), // ✅ Allows both null & undefined
  surname: z.string().nullable(),
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;

export const CreateCustomerSchema = z.object({
  customer: CreateCustomerInputSchema,
});

export const ToggleCustomerSchema = z.object({ id: z.number() });

export const UpdateAddressesOfCustomerSchema = z.object({
  addresses: z.array(AddressSchema),
  customerId: z.number(),
});

export const DeleteCustomerByIdSchema = z.object({
  id: z.number(),
});

export const GetCustomersWithStatsSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const GetCustomersWithMarketingSchema = NoContentSchema;

export const CUSTOMER_SCHEMAS = {
  getCustomerByPhone: GetCustomerByPhoneSchema,
  getCustomerWithDetails: GetCustomerWithDetailsSchema,
  getCustomersWithDetails: GetCustomersWithDetailsSchema,
  getCustomersByDoorbell: GetCustomersByDoorbellSchema,
  updateCustomerFromAdmin: UpdateCustomerFromAdminSchema,
  updateCustomerFromOrder: UpdateCustomerFromOrderSchema,
  createCustomer: CreateCustomerSchema,
  toggleCustomer: ToggleCustomerSchema,
  updateAddressesOfCustomer: UpdateAddressesOfCustomerSchema,
  deleteCustomerById: DeleteCustomerByIdSchema,
  getCustomersWithStats: GetCustomersWithStatsSchema,
  getCustomersWithMarketing: GetCustomersWithMarketingSchema,
};
