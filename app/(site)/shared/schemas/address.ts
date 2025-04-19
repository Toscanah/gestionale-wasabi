import { AddressSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common";

export const CreateAddressInputSchema = createInputSchema(AddressSchema);

export type CreateAddressInput = z.infer<typeof CreateAddressInputSchema>;

export const UpdateAddressInputSchema = updateInputSchema(AddressSchema);

export type UpdateAddressInput = z.infer<typeof UpdateAddressInputSchema>;

export const CreateAddressSchema = wrapSchema("address", CreateAddressInputSchema);

export const UpdateAddressSchema = wrapSchema("address", UpdateAddressInputSchema);

export const GetAddressesByCustomerSchema = wrapSchema("customerId", z.number());

export const GetLastAddressOfCustomerSchema = wrapSchema("phone", z.string());

export const ADDRESS_SCHEMAS = {
  createAddress: CreateAddressSchema,
  updateAddress: UpdateAddressSchema,
  getAddressesByCustomer: GetAddressesByCustomerSchema,
  getLastAddressOfCustomer: GetLastAddressOfCustomerSchema,
};
