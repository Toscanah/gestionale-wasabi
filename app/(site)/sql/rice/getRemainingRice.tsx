import { Rice } from "@prisma/client";
import prisma from "../db";
import { endOfDay, startOfDay } from "date-fns";
import getTotalRice from "./getTotalRice";

export default async function getRemainingRice(): Promise<Rice | null> {
  const rice = await getTotalRice();

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

  const totalUsedRice = usedRice._sum.rice_quantity ?? 0;
  return rice
    ? { ...rice, amount: rice.amount - totalUsedRice }
    : { id: 1, amount: 0, threshold: 0 };
}
