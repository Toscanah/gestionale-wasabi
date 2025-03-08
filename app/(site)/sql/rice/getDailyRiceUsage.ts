import prisma from "../db";
import { setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";

export default async function getDailyRiceUsage(): Promise<number> {
  const today = new Date();

  // Force explicit start and end times
  const startOfToday = setMilliseconds(setSeconds(setMinutes(setHours(today, 0), 0), 0), 0); // 00:00:00.000
  const endOfToday = setMilliseconds(setSeconds(setMinutes(setHours(today, 23), 59), 59), 999); // 23:59:59.999

  console.log("🕒 Debugging Date Range:");
  console.log("Start of Day:", startOfToday);
  console.log("End of Day:", endOfToday);

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
  let riceQuantityTotal = 0;

  console.log("🔹 Rice Usage Calculation Details:");

  productOrders.forEach((pio) => {
    const riceUsed = (pio.product?.rice ?? 0) * pio.quantity;
    manualTotalRice += riceUsed;
    riceQuantityTotal += pio.rice_quantity ?? 0; // Assuming `rice_quantity` exists in `ProductInOrder`

    console.log(
      `Product ${pio.product.desc}: ${pio.product?.rice ?? 0}g per unit × ${
        pio.quantity
      } units = ${riceUsed}g`
    );
  });

  console.log(`\n✅ Total Rice (Manual Calculation): ${manualTotalRice}g`);
  console.log(`✅ Total Rice (rice_quantity sum): ${riceQuantityTotal}g`);
  console.log("-------------------------------------------------\n");

  return manualTotalRice;
}
