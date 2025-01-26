import prisma from "../db";
import { endOfDay, startOfDay } from "date-fns";

export default async function getDailyRiceUsage(): Promise<number> {
  const today = new Date();
  const usedRice = await prisma.productInOrder.aggregate({
    _sum: {
      rice_quantity: true,
    },
    where: {
      state: {
        not: "DELETED_UNCOOKED",
      },
      order: {
        created_at: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    },
  });

  return usedRice._sum.rice_quantity ?? 0;
}
