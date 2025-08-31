import { AddressSchema, CustomerSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { ApiContract } from "../types/api-contract";
import { RFMConfigSchema } from "../models/rfm";
import { CustomerWithEngagementSchema, CustomerWithStatsSchema } from "../models/customer";
import { createInputSchema, wrapSchema } from "./common/utils";
import { PaginationRequestSchema, PaginationResponseSchema } from "./common/pagination";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { NoContentRequestSchema } from "./common/no-content";
import { PeriodRequestSchema } from "./common/period";

export const GetCustomerByPhoneRequestSchema = z.object({ phone: z.string() });

export const GetCustomerWithDetailsRequestSchema = z.object({ customerId: z.number() });

export const GetCustomersByDoorbellRequestSchema = z.object({ doorbell: z.string() });

export const UpdateCustomerFromAdminRequestSchema = wrapSchema(
  "customer",
  CustomerSchema.extend({ phone: z.string() })
);

export const UpdateCustomerFromOrderRequestSchema = wrapSchema("customer", CustomerSchema);

export const CreateCustomerInputRequestSchema = createInputSchema(CustomerSchema)
  .omit({
    phone_id: true,
    rfm: true,
  })
  .extend({
    phone: z.string(),
    name: z.string().nullable(),
    surname: z.string().nullable(),
  });

export const CreateCustomerRequestSchema = wrapSchema("customer", CreateCustomerInputRequestSchema);

export const UpdateCustomerAddressesRequestSchema = z.object({
  addresses: z.array(AddressSchema),
  customerId: z.number(),
});

export const UpdateCustomerOrderNotesRequestSchema = z.object({
  orderId: z.number(),
  notes: z.string(),
});

export const GetCustomerDetailsRequestSchema = PaginationRequestSchema.partial().extend({
  filters: z
    .object({
      ranks: z.array(z.string()).optional(),
      search: z.string().optional(),
    })
    .optional(),
});

export const ComputeCustomersStatsRequestSchema = PaginationRequestSchema.extend({
  filters: z.object({
    period: PeriodRequestSchema,
    ranks: z.array(z.string()).optional(),
    query: z.string().optional(),
  }),
});

export const UpdateCustomersRFMRequestSchema = z.object({
  rfmConfig: RFMConfigSchema,
});

export const CUSTOMER_REQUESTS = {
  getCustomerByPhone: GetCustomerByPhoneRequestSchema,
  getCustomerWithDetails: GetCustomerWithDetailsRequestSchema,
  getCustomersWithDetails: GetCustomerDetailsRequestSchema,
  getCustomersByDoorbell: GetCustomersByDoorbellRequestSchema,
  updateCustomerFromAdmin: UpdateCustomerFromAdminRequestSchema,
  updateCustomerFromOrder: UpdateCustomerFromOrderRequestSchema,
  updateCustomerOrderNotes: UpdateCustomerOrderNotesRequestSchema,
  createCustomer: CreateCustomerRequestSchema,
  toggleCustomer: ToggleDeleteEntityRequestSchema,
  updateCustomerAddresses: UpdateCustomerAddressesRequestSchema,
  deleteCustomerById: ToggleDeleteEntityRequestSchema,
  computeCustomersStats: ComputeCustomersStatsRequestSchema,
  getCustomersWithMarketing: NoContentRequestSchema,
  updateCustomersRFM: UpdateCustomersRFMRequestSchema,
};

export const ComputeCustomerStatsResponseSchema = z
  .object({
    customers: z.array(CustomerWithStatsSchema),
  })
  .merge(PaginationResponseSchema);

export const CUSTOMER_RESPONSES = {
  computeCustomersStats: ComputeCustomerStatsResponseSchema,
};

export type CustomerContract = ApiContract<typeof CUSTOMER_REQUESTS, typeof CUSTOMER_RESPONSES>;
