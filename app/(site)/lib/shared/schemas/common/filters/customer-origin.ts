import { CustomerOrigin } from "@prisma/client";
import z from "zod";

export const CustomerOriginFilterSchema = z.object({
  customerOrigins: z.array(z.enum(CustomerOrigin)),
});

export type CustomerOriginFilter = z.infer<typeof CustomerOriginFilterSchema>;
