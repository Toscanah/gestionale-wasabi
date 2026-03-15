import { PaymentContracts } from "@/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import payOrder from "@/lib/database/payments/payOrder";
import getRomanPaymentsByOrder from "@/lib/database/payments/getRomanPaymentsByOrder";
import getPaymentsSummary from "@/lib/database/payments/getPaymentsSummary";

export const paymentsRouter = createTRPCRouter({
  payOrder: publicProcedure
    .input(PaymentContracts.PayOrder.Input)
    .output(PaymentContracts.PayOrder.Output)
    .mutation(({ input }) => payOrder(input)),

  getRomanPaymentsByOrder: publicProcedure
    .input(PaymentContracts.GetRomanPaymentsByOrder.Input)
    .output(PaymentContracts.GetRomanPaymentsByOrder.Output)
    .query(({ input }) => getRomanPaymentsByOrder(input)),

  getSummary: publicProcedure
    .input(PaymentContracts.GetSummary.Input)
    .output(PaymentContracts.GetSummary.Output)
    .query(({ input }) => getPaymentsSummary(input)),
});
