import prisma from "../db";
import { endOfDay, startOfDay } from "date-fns";

export default async function getDailyRiceUsage(): Promise<number> {
  const today = new Date();

  // Fetch all relevant product orders along with product details
  const productOrders = await prisma.productInOrder.findMany({
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
    include: {
      product: {
        select: {
          rice: true, // Fetch rice amount per product
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
      `Product: ${pio.product?.rice ?? 0}g per unit × ${pio.quantity} units = ${riceUsed}g`
    );
  });

  console.log(`\n✅ Total Rice (Manual Calculation): ${manualTotalRice}g`);
  console.log(`✅ Total Rice (rice_quantity sum): ${riceQuantityTotal}g`);
  console.log("-------------------------------------------------\n");

  return manualTotalRice;
}
