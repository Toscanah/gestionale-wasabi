import { CustomerSchema } from "@/prisma/generated/zod";
import { z } from "zod";

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
