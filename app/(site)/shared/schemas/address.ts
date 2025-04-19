import { AddressSchema } from "@/prisma/generated/zod";
import { z } from "zod";

export const CreateAddressInputSchema = AddressSchema.omit({
  id: true,
  active: true,
});

export type CreateAddressInput = z.infer<typeof CreateAddressInputSchema>;

export const UpdateAddressInputSchema = AddressSchema.omit({
  active: true,
});

export type UpdateAddressInput = z.infer<typeof UpdateAddressInputSchema>;

export const CreateAddressSchema = z.object({
  address: CreateAddressInputSchema,
});

export const UpdateAddressSchema = z.object({
  address: UpdateAddressInputSchema,
});

export const GetAddressesByCustomerSchema = z.object({
  customerId: z.number(),
});

export const GetLastAddressOfCustomerSchema = z.object({
  phone: z.string(),
});

export const ADDRESS_SCHEMAS = {
  createAddress: CreateAddressSchema,
  updateAddress: UpdateAddressSchema,
  getAddressesByCustomer: GetAddressesByCustomerSchema,
  getLastAddressOfCustomer: GetLastAddressOfCustomerSchema,
};
