import { AnyOrder } from "@/app/(site)/lib/shared";
import prisma from "../db";
import getOrderById from "../orders/getOrderById";

export default async function updateCustomerOrderNotes({
  orderId,
  notes,
}: {
  orderId: number;
  notes: string;
}): Promise<AnyOrder> {
  // Reset receipt print status
  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });
 
  // Get the customer_id from either homeOrder or pickupOrder
  const homeOrder = await prisma.homeOrder.findUnique({
    where: { id: orderId },
    select: { customer_id: true },
  });

  let customerId: number | undefined | null = homeOrder?.customer_id;

  if (!customerId) {
    const pickupOrder = await prisma.pickupOrder.findUnique({
      where: { id: orderId },
      select: { customer_id: true },
    });
    customerId = pickupOrder?.customer_id;
  }

  if (!customerId) {
    throw new Error("Customer not found for this order");
  }

  // Update the customer's permanent order notes
  await prisma.customer.update({
    where: { id: customerId },
    data: { order_notes: notes },
  });

  return await getOrderById({ orderId });
}
