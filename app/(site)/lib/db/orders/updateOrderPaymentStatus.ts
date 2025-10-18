import { OrderType } from "@prisma/client";
import prisma from "../db";
import { OrderContracts } from "../../shared";
import { getOrderById } from "./getOrderById";

export default async function updateOrderPaymentStatus({
  prepaid,
  orderId,
  plannedPayment,
}: OrderContracts.UpdatePaymentStatus.Input): Promise<OrderContracts.UpdatePaymentStatus.Output> {
  // Always reset printed flag first
  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  // Get order type
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { type: true },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Update corresponding sub-order table
  if (order.type === OrderType.HOME) {
    await prisma.homeOrder.update({
      where: { id: orderId },
      data: { planned_payment: plannedPayment, prepaid },
    });
  } else if (order.type === OrderType.PICKUP) {
    await prisma.pickupOrder.update({
      where: { id: orderId },
      data: { planned_payment: plannedPayment, prepaid },
    });
  } else {
    // For TABLE orders, there might be nothing to update
    throw new Error(`Order type ${order.type} does not support payment status update`);
  }

  // Return the updated order
  return await getOrderById({ orderId, variant: "onlyInOrder" });
}
