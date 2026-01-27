import { CustomerContracts } from "@/lib/shared";
import prisma from "../prisma";
import { getOrderById } from "../orders/getOrderById";
import { OrderGuards } from "@/lib/shared/types/order-guards";

export default async function updateCustomerOrderNotes({
  orderId,
  notes,
}: CustomerContracts.UpdateOrderNotes.Input): Promise<CustomerContracts.UpdateOrderNotes.Output> {
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

  const order = await getOrderById({ orderId });

  if (OrderGuards.isHome(order) || OrderGuards.isPickup(order)) {
    return order;
  }

  throw new Error("Expected HOME or PICKUP order but got TABLE");
}
