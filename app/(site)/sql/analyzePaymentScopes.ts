import prisma from "./db";
import { PaymentScope } from "@prisma/client";

type PaymentReport = {
  orderId: number;
  paymentCount: number;
  inferredScope: PaymentScope;
  amounts: number[];
};

export default async function analyzePaymentScopes(): Promise<void> {
  const allPayments = await prisma.payment.findMany({
    select: {
      order_id: true,
      amount: true,
    },
  });

  const grouped = new Map<number, number[]>();

  for (const payment of allPayments) {
    if (!grouped.has(payment.order_id)) {
      grouped.set(payment.order_id, []);
    }
    grouped.get(payment.order_id)!.push(payment.amount);
  }

  const summaryMap = new Map<PaymentScope, PaymentReport[]>();
  let processed = 0;
  const total = grouped.size;

  for (const [orderId, amounts] of grouped.entries()) {
    processed++;
    if (processed % 100 === 0 || processed === total) {
      console.log(`🔄 Processing order ${processed} of ${total}...`);
    }

    const uniqueAmounts = [...new Set(amounts)];
    const countMap = new Map<number, number>();
    amounts.forEach((a) => countMap.set(a, (countMap.get(a) ?? 0) + 1));

    let inferredScope: PaymentScope;

    if (amounts.length === 1) {
      inferredScope = "FULL";
    } else if (uniqueAmounts.length === 1) {
      inferredScope = "ROMAN";
    } else {
      const maxSameAmountCount = Math.max(...countMap.values());
      const majorityAmount = [...countMap.entries()].find(
        ([, count]) => count === maxSameAmountCount
      )?.[0];

      const remainder = amounts.filter((a) => a !== majorityAmount);

      if (maxSameAmountCount >= 2) {
        if (remainder.length === 1) {
          inferredScope = "ROMAN";
        } else if (remainder.length > 1) {
          inferredScope = "UNKNOWN";
        } else {
          inferredScope = "ROMAN";
        }
      } else {
        inferredScope = "PARTIAL";
      }
    }

    const report: PaymentReport = {
      orderId,
      paymentCount: amounts.length,
      inferredScope,
      amounts,
    };

    if (!summaryMap.has(inferredScope)) {
      summaryMap.set(inferredScope, []);
    }
    summaryMap.get(inferredScope)!.push(report);
  }

  console.log("\n📊 Payment Scope Inference Summary");
  console.log("====================================\n");

  const scopes: PaymentScope[] = ["ROMAN", "FULL", "PARTIAL", "UNKNOWN"];
  for (const scope of scopes) {
    const reports = summaryMap.get(scope) ?? [];
    console.log(
      `🔸 ${scope}: ${reports.length} orders` +
        (reports.length > 0
          ? ` (e.g. order IDs: ${reports
              .slice(0, 5)
              .map((r) => r.orderId)
              .join(", ")}${reports.length > 5 ? ", ..." : ""})`
          : "")
    );
  }

  console.log("\n✅ Analysis complete.");
}


/**
 * for (const [orderId, amounts] of grouped.entries()) {
  processed++;
  if (processed % 100 === 0 || processed === total) {
    console.log(`🔄 Processing order ${processed} of ${total} (ID ${orderId})`);
  }

  const countMap = new Map<number, number>();
  amounts.forEach((a) => countMap.set(a, (countMap.get(a) ?? 0) + 1));

  const maxSameAmountCount = Math.max(...countMap.values());
  const majorityAmount = [...countMap.entries()].find(
    ([, count]) => count === maxSameAmountCount
  )?.[0];

  const payments = await prisma.payment.findMany({
    where: { order_id: orderId },
    select: { id: true, amount: true },
  });

  const paymentsToUpdate: { id: string; scope: PaymentScope }[] = [];

  // CASE 1: only one payment → FULL
  if (amounts.length === 1) {
    paymentsToUpdate.push({ id: payments[0].id, scope: "FULL" });
  }

  // CASE 2: all equal → ROMAN
  else if (new Set(amounts).size === 1) {
    for (const p of payments) {
      paymentsToUpdate.push({ id: p.id, scope: "ROMAN" });
    }
  }

  // CASE 3: arbitrary values
  else {
    const majorityPayments = payments.filter(p => p.amount === majorityAmount);
    const remainder = payments.filter(p => p.amount !== majorityAmount);

    if (majorityPayments.length >= 2 && remainder.length === 1) {
      // Majority gets ROMAN, the odd one → FULL
      for (const p of majorityPayments) {
        paymentsToUpdate.push({ id: p.id, scope: "ROMAN" });
      }
      paymentsToUpdate.push({ id: remainder[0].id, scope: "FULL" });
    } else if (majorityPayments.length >= 2 && remainder.length > 1) {
      // Too mixed → all UNKNOWN
      for (const p of payments) {
        paymentsToUpdate.push({ id: p.id, scope: "UNKNOWN" });
      }
    } else {
      // All different → PARTIAL
      for (const p of payments) {
        paymentsToUpdate.push({ id: p.id, scope: "PARTIAL" });
      }
    }
  }

  // ✅ Apply updates
  for (const p of paymentsToUpdate) {
    await prisma.payment.update({
      where: { id: p.id },
      data: { scope: p.scope },
    });
  }
}

 * 
 * 
 */