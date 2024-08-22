import { Payment, PaymentType } from "@prisma/client";
import prisma from "../db";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";

export default async function payOrder(
  payments: Payment[],
  type: "full" | "partial",
  productsToPay: ProductInOrderType[]
) {
  const orderId = payments[0].order_id;

  const createdPayments = await Promise.all(
    payments.map((payment) =>
      prisma.payment.create({
        data: {
          amount: payment.amount,
          type: payment.type as PaymentType,
          order_id: payment.order_id,
        },
      })
    )
  );

  // Fetch the order and associated products
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: true,
    },
  });

  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }

  // Handle the payments depending on whether it's full or partial
  for (const productToPay of productsToPay) {
    const productInOrder = order.products.find((p) => p.id === productToPay.id);
    if (productInOrder) {
      // Update the paidQuantity and check if it's fully paid
      const newPaidQuantity = productInOrder.paidQuantity + productToPay.quantity;
      const isPaidFully = newPaidQuantity >= productInOrder.quantity;

      await prisma.productInOrder.update({
        where: { id: productInOrder.id },
        data: {
          paidQuantity: newPaidQuantity,
          isPaidFully: isPaidFully,
        },
      });
    }
  }

  const allProductsPaid = await prisma.productInOrder.findMany({
    where: {
      order_id: orderId,
      isPaidFully: false,
    },
  });

  if (allProductsPaid.length === 0) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paid: true },
    });
  }

  return createdPayments;
}
