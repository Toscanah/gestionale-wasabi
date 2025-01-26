import prisma from "../db";

export default async function deleteCustomerById(id: number) {
  await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id },
      select: { phone_id: true },
    });

    if (!customer || !customer.phone_id) {
      throw new Error("Customer not found");
    }

    const orders = await tx.order.findMany({
      where: {
        OR: [{ home_order: { customer_id: id } }, { pickup_order: { customer_id: id } }],
      },
      select: { id: true },
    });
    const orderIds = orders.map((order) => order.id);

    await tx.optionInProductOrder.deleteMany({
      where: {
        product_in_order: { order_id: { in: orderIds } },
      },
    });

    await tx.productInOrder.deleteMany({
      where: {
        order_id: { in: orderIds },
      },
    });

    await tx.homeOrder.deleteMany({
      where: { customer_id: id },
    });

    await tx.pickupOrder.deleteMany({
      where: { customer_id: id },
    });

    await tx.payment.deleteMany({
      where: {
        order_id: {
          in: orderIds,
        },
      },
    });

    await tx.order.deleteMany({
      where: {
        id: { in: orderIds },
      },
    });

    await tx.address.deleteMany({
      where: { customer_id: id },
    });

    await tx.customer.updateMany({
      where: { id },
      data: { phone_id: null },
    });

    await tx.phone.deleteMany({
      where: {
        id: customer.phone_id,
      },
    });

    await tx.customer.delete({
      where: { id },
    });
  });
  
  return true;
}
