import { PaymentContracts } from "@/app/(site)/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import payOrder from "@/app/(site)/lib/db/payments/payOrder";
import getRomanPaymentsByOrder from "@/app/(site)/lib/db/payments/getRomanPaymentsByOrder";
import getPaymentsSummary from "@/app/(site)/lib/db/payments/getPaymentsSummary";

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
