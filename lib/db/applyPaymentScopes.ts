import prisma from "./prisma";
import { PaymentScope } from "@/prisma/generated/client/enums";

function groupByRoundedAmount(amounts: number[], epsilon = 0.01): Map<number, number[]> {
  const clusters = new Map<number, number[]>();

  for (let i = 0; i < amounts.length; i++) {
    const amount = amounts[i];
    const matchKey = [...clusters.keys()].find((key) => Math.abs(key - amount) <= epsilon);

    if (matchKey !== undefined) {
      clusters.get(matchKey)!.push(i); // store index
    } else {
      clusters.set(amount, [i]);
    }
  }

  return clusters;
}

export default async function applyPaymentScopes(): Promise<void> {
  const allPayments = await prisma.payment.findMany({
    select: {
      id: true,
      order_id: true,
      amount: true,
    },
    orderBy: {
      order_id: "asc",
    },
  });

  const groupedByOrder = new Map<number, { id: number; amount: number }[]>();

  for (const payment of allPayments) {
    if (!groupedByOrder.has(payment.order_id)) {
      groupedByOrder.set(payment.order_id, []);
    }
    groupedByOrder.get(payment.order_id)!.push({ id: payment.id, amount: payment.amount });
  }

  let updatedCount = 0;
  let i = 0;

  for (const [orderId, payments] of groupedByOrder.entries()) {
    const amounts = payments.map((p) => p.amount);
    i++;

    console.log("Checking order: ", orderId, " out of ", i)

    if (payments.length === 1) {
      // Single payment → FULL
      await prisma.payment.update({
        where: { id: payments[0].id },
        data: { scope: "FULL" },
      });
      updatedCount++;
      continue;
    }

    const clusters = groupByRoundedAmount(amounts, 0.01);
    const clusterEntries = [...clusters.entries()];

    if (clusterEntries.length === 1) {
      // All equal → ROMAN
      const indices = clusterEntries[0][1];
      for (const i of indices) {
        await prisma.payment.update({
          where: { id: payments[i].id },
          data: { scope: "ROMAN" },
        });
        updatedCount++;
      }
    } else if (clusterEntries.length === 2) {
      // Maybe: equal + 1 odd
      const sortedBySize = clusterEntries.sort((a, b) => b[1].length - a[1].length);
      const [mainGroup, outlier] = sortedBySize;

      if (mainGroup[1].length >= 2 && outlier[1].length === 1) {
        // Typical Roman + one extra (e.g. rounding mismatch)
        for (const i of mainGroup[1]) {
          await prisma.payment.update({
            where: { id: payments[i].id },
            data: { scope: "ROMAN" },
          });
          updatedCount++;
        }
        for (const i of outlier[1]) {
          await prisma.payment.update({
            where: { id: payments[i].id },
            data: { scope: "FULL" },
          });
          updatedCount++;
        }
      } else {
        // Can't interpret clearly → UNKNOWN
        for (const p of payments) {
          await prisma.payment.update({
            where: { id: p.id },
            data: { scope: "UNKNOWN" },
          });
          updatedCount++;
        }
      }
    } else {
      // Arbitrary amounts or multiple groupings
      const allClusterSizes = clusterEntries.map(([, indices]) => indices.length);

      const isAllDifferent = allClusterSizes.every((count) => count === 1);

      if (isAllDifferent) {
        // Fully split → PARTIAL
        for (const p of payments) {
          await prisma.payment.update({
            where: { id: p.id },
            data: { scope: "PARTIAL" },
          });
          updatedCount++;
        }
      } else {
        // Not clearly interpretable → UNKNOWN
        for (const p of payments) {
          await prisma.payment.update({
            where: { id: p.id },
            data: { scope: "UNKNOWN" },
          });
          updatedCount++;
        }
      }
    }
  }

  console.log(`✅ Updated ${updatedCount} payment scopes.`);
}
