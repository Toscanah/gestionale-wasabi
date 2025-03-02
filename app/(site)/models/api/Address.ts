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
