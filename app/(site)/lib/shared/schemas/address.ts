import { AddressSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import { ApiContract } from "../types/api-contract";

export const CreateAddressInputSchema = createInputSchema(AddressSchema);

export const UpdateAddressInputSchema = updateInputSchema(AddressSchema);

export const CreateAddressSchema = wrapSchema("address", CreateAddressInputSchema);

export const UpdateAddressSchema = wrapSchema("address", UpdateAddressInputSchema);

export const GetAddressesByCustomerSchema = wrapSchema("customerId", z.number());

export const GetLastAddressOfCustomerSchema = wrapSchema("phone", z.string());

export const ADDRESS_REQUESTS = {
  createAddress: CreateAddressSchema,
  updateAddress: UpdateAddressSchema,
  getAddressesByCustomer: GetAddressesByCustomerSchema,
  getLastAddressOfCustomer: GetLastAddressOfCustomerSchema,
};

export type AddressContract = ApiContract<typeof ADDRESS_REQUESTS>;