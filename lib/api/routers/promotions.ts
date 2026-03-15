import getAllPromotions from "@/lib/database/promotions/getAllPromotions";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { PromotionContracts } from "@/lib/shared";
import countPromotionsByType from "@/lib/database/promotions/countPromotionsByType";
import getUsagesByPromotion from "@/lib/database/promotions/getUsagesByPromotion";
import createNewPromotion from "@/lib/database/promotions/createNewPromotion";
import getPromotionByCode from "@/lib/database/promotions/getPromotionByCode";
import applyPromotionToOrder from "@/lib/database/promotions/applyPromotionToOrder";
import removePromotionFromOrder from "@/lib/database/promotions/removePromotionFromOrder";
import deletePromotionById from "@/lib/database/promotions/deletePromotionById";
import { rebalanceOrderPromotions } from "@/lib/database/promotions/rebalanceOrderPromotions";

export const promotionsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(PromotionContracts.GetAll.Input)
    .output(PromotionContracts.GetAll.Output)
    .query(({ input }) => getAllPromotions(input)),

  countsByType: publicProcedure
    .input(PromotionContracts.CountsByType.Input)
    .output(PromotionContracts.CountsByType.Output)
    .query(({ input }) => countPromotionsByType(input)),

  deleteById: publicProcedure
    .input(PromotionContracts.DeleteById.Input)
    .output(PromotionContracts.DeleteById.Output)
    .mutation(({ input }) => deletePromotionById(input)),

  getUsagesByPromotion: publicProcedure
    .input(PromotionContracts.GetUsagesByPromotion.Input)
    .output(PromotionContracts.GetUsagesByPromotion.Output)
    .query(({ input }) => getUsagesByPromotion(input)),

  create: publicProcedure
    .input(PromotionContracts.Create.Input)
    .output(PromotionContracts.Create.Output)
    .mutation(({ input }) => createNewPromotion(input)),

  applyToOrder: publicProcedure
    .input(PromotionContracts.ApplyToOrder.Input)
    .output(PromotionContracts.ApplyToOrder.Output)
    .mutation(({ input }) => applyPromotionToOrder(input)),

  getByCode: publicProcedure
    .input(PromotionContracts.GetByCode.Input)
    .output(PromotionContracts.GetByCode.Output)
    .query(({ input }) => getPromotionByCode(input)),

  removeFromOrder: publicProcedure
    .input(PromotionContracts.RemoveFromOrder.Input)
    .output(PromotionContracts.RemoveFromOrder.Output)
    .mutation(async ({ input }) => removePromotionFromOrder(input)),

  rebalanceOrderPromotions: publicProcedure
    .input(PromotionContracts.RebalanceOrderPromotions.Input)
    .output(PromotionContracts.RebalanceOrderPromotions.Output)
    .mutation(({ input }) => rebalanceOrderPromotions(input)),
});
