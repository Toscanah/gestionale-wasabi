import { OrderType } from "@prisma/client";
import z from "zod";

export const OrderTypesFilterSchema = z.object({
  orderTypes: z.array(z.enum(OrderType)),
});

export type OrderTypesFilter = z.infer<typeof OrderTypesFilterSchema>;
