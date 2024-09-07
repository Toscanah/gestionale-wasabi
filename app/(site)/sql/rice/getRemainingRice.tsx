import { Rice } from "@prisma/client";
import prisma from "../db";
import { endOfDay, startOfDay } from "date-fns";

export default async function getRemainingRice(): Promise<Rice | null> {
  const rice = await prisma.rice.findUnique({
    where: {
      id: 1,
    },
  });

  const today = new Date();
  const usedRice = await prisma.productInOrder.aggregate({
    _sum: {
      riceQuantity: true,
    },
    where: {
      order: {
        created_at: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    },
  });

  const totalUsedRice = usedRice._sum.riceQuantity ?? 0;
  return rice
    ? { ...rice, amount: rice.amount - totalUsedRice }
    : { id: 1, amount: 0, threshold: 0 };
}
