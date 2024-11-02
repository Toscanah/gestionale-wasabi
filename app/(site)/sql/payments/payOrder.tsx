import { Payment, PaymentType } from "@prisma/client";
import prisma from "../db";
import { ProductInOrderType } from "@/app/(site)/types/ProductInOrderType";

export default async function payOrder(payments: Payment[], productsToPay: ProductInOrderType[]) {
  const orderId = payments[0].order_id;

  const paymentData = payments.map((payment) => ({
    amount: payment.amount,
    type: payment.type as PaymentType,
    order_id: payment.order_id,
  }));
  
  const createdPayments = await prisma.payment.createMany({
    data: paymentData,
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { products: true },
  });

  if (!order) throw new Error(`Order with id ${orderId} not found`);

  const productUpdates = productsToPay
    .map((productToPay) => {
      const productInOrder = order.products.find((p) => p.id === productToPay.id);
      if (!productInOrder) return null;

      const newPaidQuantity = productInOrder.paidQuantity + productToPay.quantity;
      return {
        id: productInOrder.id,
        data: {
          paidQuantity: newPaidQuantity,
          isPaidFully: newPaidQuantity >= productInOrder.quantity,
        },
      };
    })
    .filter(Boolean);

  await Promise.all(
    productUpdates.map(({ id, data }: any) =>
      prisma.productInOrder.update({
        where: { id },
        data,
      })
    )
  );

  const unpaidProductsCount = await prisma.productInOrder.count({
    where: { order_id: orderId, isPaidFully: false },
  });

  if (unpaidProductsCount === 0) {
    await prisma.order.update({
      where: { id: orderId },
      data: { state: "PAID" },
    });
  }

  return createdPayments;
}
