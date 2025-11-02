import { Prisma } from "@prisma/client";
import { PromotionContracts } from "../../shared";
import prisma from "../db";

export default async function getAllPromotions(
  input: PromotionContracts.GetAll.Input
): Promise<PromotionContracts.GetAll.Output> {
  const filters = input?.filters;
  const where: Prisma.PromotionWhereInput = {};

  if (filters?.periods?.length) {
    const dateConditions: Prisma.PromotionWhereInput[] = [];

    for (const f of filters.periods) {
      switch (f.type) {
        case "creation":
          dateConditions.push({
            created_at: { gte: f.from, lte: f.to },
          });
          break;

        case "usage":
          dateConditions.push({
            usages: { some: { created_at: { gte: f.from, lte: f.to } } },
          });
          break;

        case "expiration":
          dateConditions.push({
            expires_at: { gte: f.from, lte: f.to },
          });
          break;
      }
    }

    if (dateConditions.length > 0) {
      where.AND = dateConditions;
    }
  }

  const promotions = await prisma.promotion.findMany({
    where,
    include: {
      usages: true,
    },
    orderBy: { created_at: "asc" },
  });

  return promotions as PromotionContracts.GetAll.Output;
}
