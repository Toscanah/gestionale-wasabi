import { UpdateOrderShiftSchema } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { updateOrderShift } from "@/app/(site)/lib/db/orders/updateOrderShift";

export const ordersRouter = createTRPCRouter({
  updateShift: publicProcedure
    .input(UpdateOrderShiftSchema)
    .mutation(({ input }) => updateOrderShift(input)),
});
