import prisma from "./db";

export default async function deleteTodayOrders() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todayOrders = await prisma.order.findMany({
    where: {
      created_at: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      table_order: true,
      home_order: true,
      pickup_order: true,
      payments: true,
      products: {
        include: {
          options: true,
        },
      },
    },
  });

  // Collect IDs to delete in proper order
  const optionInProductOrderIds = todayOrders.flatMap((order) =>
    order.products.flatMap((product) => product.options.map((opt) => opt.id))
  );
  const productInOrderIds = todayOrders.flatMap((order) =>
    order.products.map((product) => product.id)
  );
  const paymentIds = todayOrders.flatMap((order) => order.payments.map((payment) => payment.id));
  const homeOrderIds = todayOrders.flatMap((order) =>
    order.home_order ? order.home_order.id : []
  );
  const pickupOrderIds = todayOrders.flatMap((order) =>
    order.pickup_order ? order.pickup_order.id : []
  );
  const tableOrderIds = todayOrders.flatMap((order) =>
    order.table_order ? order.table_order.id : []
  );
  const orderIds = todayOrders.map((order) => order.id);

  // await prisma.optionInProductOrder.deleteMany();
  // await prisma.productInOrder.deleteMany();
  // await prisma.payment.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.homeOrder.deleteMany();
  // await prisma.pickupOrder.deleteMany();
  // await prisma.tableOrder.deleteMany();

  // Delete records in proper dependency order
  await prisma.optionInProductOrder.deleteMany({
    where: {
      id: { in: optionInProductOrderIds },
    },
  });

  await prisma.productInOrder.deleteMany({
    where: {
      id: { in: productInOrderIds },
    },
  });

  await prisma.payment.deleteMany({
    where: {
      id: { in: paymentIds },
    },
  });

  await prisma.homeOrder.deleteMany({
    where: {
      id: { in: homeOrderIds },
    },
  });

  await prisma.pickupOrder.deleteMany({
    where: {
      id: { in: pickupOrderIds },
    },
  });

  await prisma.tableOrder.deleteMany({
    where: {
      id: { in: tableOrderIds },
    },
  });

  await prisma.order.deleteMany({
    where: {
      id: { in: orderIds },
    },
  });

  return `Deleted all records related to today's orders (${orderIds.length} orders).`;
}
