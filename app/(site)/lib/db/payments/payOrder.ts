import {
  EngagementLedgerStatus,
  OrderStatus,
  PaymentScope,
  ProductInOrderStatus,
} from "@prisma/client";
import roundToTwo from "../../utils/global/number/roundToTwo";
import prisma from "../db";
import getOrderById from "../orders/getOrderById";
import { AnyOrder, PaymentContract } from "@/app/(site)/lib/shared";
import { randomUUID } from "crypto";

export default async function payOrder({
  payments,
  productsToPay,
}: PaymentContract["Requests"]["PayOrder"]): Promise<AnyOrder> {
  if (payments.length === 0) {
    throw new Error("No payments passed");
  }

  const filteredProducts = productsToPay.filter((ptp) => ptp.id !== -1);
  const orderId = payments[0].order_id;

  const containsRoman = payments.some((p) => p.scope === PaymentScope.ROMAN);
  const paymentGroupCode = containsRoman ? randomUUID() : null;

  await prisma.$transaction(async (tx) => {
    // 1. Create payments
    await tx.payment.createMany({
      data: payments.map((payment) => ({
        amount: Number(roundToTwo(payment.amount)),
        type: payment.type,
        order_id: payment.order_id,
        scope: payment.scope,
        ...(paymentGroupCode ? { payment_group_code: paymentGroupCode } : {}),
      })),
    });

    // 2. Increment paid_quantity for each product
    await Promise.all(
      filteredProducts.map((productToPay) =>
        tx.productInOrder.update({
          where: { id: productToPay.id },
          data: {
            paid_quantity: { increment: productToPay.quantity },
          },
        })
      )
    );

    // 4. Check if all "IN_ORDER" products are fully paid
    const allProducts = await tx.productInOrder.findMany({
      where: {
        order_id: orderId,
        status: ProductInOrderStatus.IN_ORDER,
      },
      select: {
        quantity: true,
        paid_quantity: true,
      },
    });

    const allPaid = allProducts.every((p) => (p.paid_quantity ?? 0) >= p.quantity);

    // 5. Update order status and engagements if needed
    if (allPaid) {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
      });

      const engagements = await tx.engagement.findMany({
        where: { order_id: orderId },
        select: { ledgers: true, id: true },
      });

      console.log(engagements)

      const reEnableIds = engagements
        .filter((e) => e.ledgers.every((l) => l.status !== EngagementLedgerStatus.ISSUED))
        .map((e) => e.id);

        console.log(reEnableIds)

      if (reEnableIds.length > 0) {
        await tx.engagement.updateMany({
          where: { id: { in: reEnableIds } },
          data: { enabled: true },
        });
      }
    }

    // 6. Reset receipt printed flag
    await tx.order.update({
      where: { id: orderId },
      data: { is_receipt_printed: false },
    });
  });

  // Return updated order
  return await getOrderById({ orderId });
}
