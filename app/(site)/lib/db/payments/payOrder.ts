import { PaymentScope } from "@prisma/client";
import roundToTwo from "../../formatting-parsing/roundToTwo";
import prisma from "../db";
import getOrderById from "../orders/getOrderById";
import { AnyOrder, PayOrderInput } from "@/app/(site)/lib/shared";
import { randomUUID } from "crypto";

export default async function payOrder({
  payments,
  productsToPay,
}: PayOrderInput): Promise<AnyOrder> {
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
        state: "IN_ORDER",
      },
      select: {
        quantity: true,
        paid_quantity: true,
      },
    });

    const allPaid = allProducts.every((p) => (p.paid_quantity ?? 0) >= p.quantity);

    // 5. Update order state and engagements if needed
    if (allPaid) {
      await tx.order.update({
        where: { id: orderId },
        data: { state: "PAID" },
      });

      await tx.engagement.updateMany({
        where: { order_id: orderId },
        data: { enabled: true },
      });
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
