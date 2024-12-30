import { Rice } from "@prisma/client";
import prisma from "../db";
import { endOfDay, startOfDay } from "date-fns";
import getTotalRice from "./getTotalRice";

export default async function getRemainingRice(): Promise<Rice | null> {
  const rice = await getTotalRice();

  const today = new Date();

  // Start measuring time
  const startTime = performance.now();

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

  // End measuring time
  const endTime = performance.now();
  console.log(`La query del riso ci ha messo ${(endTime - startTime).toFixed(2)} millisecondi.`);

  const totalUsedRice = usedRice._sum.rice_quantity ?? 0;

  return rice
    ? { ...rice, amount: rice.amount - totalUsedRice }
    : { id: 1, amount: 0, threshold: 0 };
}
