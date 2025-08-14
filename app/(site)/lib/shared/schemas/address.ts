import { AddressSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common";
import { SchemaInputs } from "../types/SchemaInputs";

export const CreateAddressInputSchema = createInputSchema(AddressSchema);

export const UpdateAddressInputSchema = updateInputSchema(AddressSchema);

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

export type AddressSchemaInputs = SchemaInputs<typeof ADDRESS_SCHEMAS>;