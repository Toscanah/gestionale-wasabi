import { OrderContracts } from "../../shared";
import prisma from "../db";
import { updateOrderShift } from "./updateOrderShift";

export default async function updateOrdersShift(
  input: OrderContracts.UpdateOrdersShift.Input
): Promise<OrderContracts.UpdateOrdersShift.Output> {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
    },
  });

  return await Promise.all(
    orders.map(async (o, i) => {
      console.log(`Updating order id: ${o.id}. ${i + 1}/${orders.length}`);
      return {
        orderId: o.id,
        updatedShift: await updateOrderShift({ orderId: o.id }),
      };
    })
  );
}
