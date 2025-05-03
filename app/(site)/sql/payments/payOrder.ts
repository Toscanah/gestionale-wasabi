import prisma from "../db";
import getOrderById from "../orders/getOrderById";
import { AnyOrder, ProductInOrder } from "@shared";
import { Payment } from "@/prisma/generated/zod";

export default async function payOrder({
  payments,
  productsToPay,
}: {
  payments: Payment[];
  productsToPay: ProductInOrder[];
}): Promise<AnyOrder> {
  if (payments.length == 0) {
    throw new Error("No payments passed");
  }

  const orderId = payments[0].order_id;

  // Prepare payment data for insertion
  const paymentData = payments.map((payment) => ({
    amount: payment.amount,
    type: payment.type,
    order_id: payment.order_id,
  }));

  // Create payments in bulk
  await prisma.payment.createMany({
    data: paymentData,
  });

  // Retrieve the order along with associated products
  const order = await getOrderById({ orderId });

  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }

  // Update paid quantity and is_paid_fully for each product
  const productUpdates = productsToPay
    .map((productToPay) => {
      const productInOrder = order.products.find((p) => p.id === productToPay.id);
      if (!productInOrder) return null;

      const newPaidQuantity = productInOrder.paid_quantity + productToPay.quantity;
      return {
        id: productInOrder.id,
        data: {
          paid_quantity: newPaidQuantity,
          is_paid_fully: newPaidQuantity >= productInOrder.quantity,
        },
      };
    })
    .filter(Boolean);

  // Execute updates for each product in parallel
  await Promise.all(
    productUpdates.map(({ id, data }: any) =>
      prisma.productInOrder.update({
        where: { id },
        data,
      })
    )
  );

  // Check if there are any unpaid products that are still "IN_ORDER"
  const unpaidInOrderProductsCount = await prisma.productInOrder.count({
    where: {
      order_id: orderId,
      is_paid_fully: false,
      state: "IN_ORDER", // Only count unpaid products with state "IN_ORDER"
    },
  });

  // If no unpaid products with "IN_ORDER" status remain, mark the order as "PAID"
  if (unpaidInOrderProductsCount === 0) {
    await prisma.order.update({
      where: { id: orderId },
      data: { state: "PAID" },
    });

    if (order.engagement.length > 0) {
      // Update the state of engagements associated with the order to "USED"
      await prisma.engagement.updateMany({
        where: { order_id: orderId },
        data: { state: "USED" },
      });
    }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  return await getOrderById({ orderId });
}
