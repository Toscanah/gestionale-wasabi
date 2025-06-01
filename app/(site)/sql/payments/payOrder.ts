import prisma from "../db";
import getOrderById from "../orders/getOrderById";
import { AnyOrder, PayOrderInput } from "@shared";

export default async function payOrder({
  payments,
  productsToPay,
}: PayOrderInput): Promise<AnyOrder> {
  if (payments.length === 0) {
    throw new Error("No payments passed");
  }

  const filteredProducts = productsToPay.filter((ptp) => ptp.id !== -1);

  const orderId = payments[0].order_id;

  await prisma.$transaction(async (tx) => {
    // 1. Create payments
    await tx.payment.createMany({
      data: payments.map((payment) => ({
        amount: payment.amount,
        type: payment.type,
        order_id: payment.order_id,
      })),
    });

    // 2. Update products: use increment to prevent race conditions
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

    // 3. Mark fully paid products (done separately to avoid conditional logic inside loop)
    await Promise.all(
      filteredProducts.map(async (productToPay) => {
        const updated = await tx.productInOrder.findUnique({
          where: { id: productToPay.id },
          select: { quantity: true, paid_quantity: true },
        });

        if (updated && updated.paid_quantity >= updated.quantity) {
          await tx.productInOrder.update({
            where: { id: productToPay.id },
            data: { is_paid_fully: true },
          });
        }
      })
    );

    // 4. Check if all "IN_ORDER" products are fully paid
    const unpaidCount = await tx.productInOrder.count({
      where: {
        order_id: orderId,
        is_paid_fully: false,
        state: "IN_ORDER",
      },
    });

    // 5. Update order state and engagements if needed
    if (unpaidCount === 0) {
      await tx.order.update({
        where: { id: orderId },
        data: { state: "PAID" },
      });

      await tx.engagement.updateMany({
        where: { order_id: orderId },
        data: { state: "USED" },
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
