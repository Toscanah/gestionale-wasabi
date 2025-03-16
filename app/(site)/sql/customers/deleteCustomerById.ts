import prisma from "../db";

export default async function deleteCustomerById(id: number) {
  return await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id },
      select: { phone_id: true, id: true },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const orders = await tx.order.findMany({
      where: {
        OR: [{ home_order: { customer_id: id } }, { pickup_order: { customer_id: id } }],
      },
      select: { id: true },
    });

    if (orders.length > 0) {
      const orderIds = orders.map((order) => order.id);

      await tx.optionInProductOrder.deleteMany({
        where: { product_in_order: { order_id: { in: orderIds } } },
      });

      await tx.productInOrder.deleteMany({
        where: { order_id: { in: orderIds } },
      });

      await tx.payment.deleteMany({
        where: { order_id: { in: orderIds } },
      });

      await tx.order.deleteMany({
        where: { id: { in: orderIds } },
      });
    }

    await tx.homeOrder.deleteMany({ where: { customer_id: id } });
    await tx.pickupOrder.deleteMany({ where: { customer_id: id } });
    await tx.address.deleteMany({ where: { customer_id: id } });

    // const marketings = await tx.marketingOnCustomer.findMany({
    //   where: { customer_id: id },
    // });

    // if (marketings.length > 0) {
    //   await tx.marketingOnCustomer.deleteMany({
    //     where: { customer_id: id },
    //   });
    // }

    const deletedCustomer = await tx.customer.delete({
      where: { id: customer.id },
    });

    await tx.phone.delete({ where: { id: customer.phone_id } });

    return deletedCustomer ? true : false;
  });
}
