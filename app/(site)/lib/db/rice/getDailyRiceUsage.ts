import prisma from "../db";
import { setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";
import getRiceLogs from "./getRiceLogs";

export default async function getDailyRiceUsage(): Promise<number> {
  const today = new Date();

  // Force explicit start and end times
  const startOfToday = setMilliseconds(setSeconds(setMinutes(setHours(today, 0), 0), 0), 0); // 00:00:00.000
  const endOfToday = setMilliseconds(setSeconds(setMinutes(setHours(today, 23), 59), 59), 999); // 23:59:59.999

  // Fetch all relevant product orders along with product details
  const productOrders = await prisma.productInOrder.findMany({
    where: {
      state: {
        in: ["IN_ORDER", "DELETED_COOKED"], // Only exclude UNCOOKED
      },
      order: {
        created_at: {
          gte: startOfToday, // Start at 00:00:00
          lte: endOfToday, // End at 23:59:59
        },
      },
    },
    include: {
      product: {
        select: {
          rice: true, // Fetch rice amount per product
          desc: true,
        },
      },
    },
  });

  let manualTotalRice = 0;
  productOrders.forEach((pio) => (manualTotalRice += (pio.product?.rice ?? 0) * pio.quantity));

  return manualTotalRice;
}
