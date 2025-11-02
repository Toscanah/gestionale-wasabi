import getAllPromotions from "@/app/(site)/lib/db/promotions/getAllPromotions";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { PromotionContracts } from "@/app/(site)/lib/shared";
import countPromotionsByType from "@/app/(site)/lib/db/promotions/countPromotionsByType";
import getUsagesByPromotion from "@/app/(site)/lib/db/promotions/getUsagesByPromotion";
import createNewPromotion from "@/app/(site)/lib/db/promotions/createNewPromotion";

export const promotionsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(PromotionContracts.GetAll.Input)
    .output(PromotionContracts.GetAll.Output)
    .query(({ input }) => getAllPromotions(input)),

  countsByType: publicProcedure
    .input(PromotionContracts.CountsByType.Input)
    .output(PromotionContracts.CountsByType.Output)
    .query(({ input }) => countPromotionsByType(input)),

  getUsagesByPromotion: publicProcedure
    .input(PromotionContracts.GetUsagesByPromotion.Input)
    .output(PromotionContracts.GetUsagesByPromotion.Output)
    .query(({ input }) => getUsagesByPromotion(input)),

  create: publicProcedure
    .input(PromotionContracts.Create.Input)
    .output(PromotionContracts.Create.Output)
    .mutation(({ input }) => createNewPromotion(input)),

  // update: publicProcedure
  //   .input(PromotionContracts.Update.Input)
  //   .output(PromotionContracts.Update.Output)
  //   .mutation(({ input }) => updatePromotion(input)),
});
