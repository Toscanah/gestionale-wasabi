import prisma from "./db";
import deleteEverything from "./deleteEverything";

function getRandomDate(startDate: Date, endDate: Date): Date {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  // Random timestamp between start and end date
  const randomTimestamp =
    Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;

  return new Date(randomTimestamp);
}

export default async function dummy() {
  await deleteEverything();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const totalOrders = 16000; // Number of orders
  const totalRecords = 1000000; // Total ProductInOrder records
  const batchSize = 50000; // Number of records per batch

  const orders = Array.from({ length: totalOrders }, (_, i) => ({
    state: "PAID",
    type: "TABLE",
    created_at: new Date("2020-01-01T00:00:00Z"), // Use a fixed date
    updated_at: new Date("2020-01-01T00:00:00Z"),
    discount: 0,
    total: 0,
    is_receipt_printed: false,
    suborder_of: null,
  }));

  // await prisma.order.create({
  //   data: {
  //     state: "PAID",
  //     type: "TABLE",
  //     created_at: new Date(),
  //     discount: 0,
  //     updated_at: new Date(),
  //     total: 0,
  //     is_receipt_printed: false,
  //     suborder_of: null,
  //   },
  // });

  await prisma.order.createMany({ data: orders as any });
  console.log("Orders created");

  // Step 2: Fetch created order IDs
  const orderIds = await prisma.order.findMany({ select: { id: true } });
  const orderIdList = orderIds.map((order) => order.id);

  // Step 3: Create 1 million ProductInOrder records with random order IDs
  const data = Array.from({ length: batchSize }, () => ({
    order_id: orderIdList[Math.floor(Math.random() * orderIdList.length)], // Random order ID
    product_id: 31, // Fixed product ID
    quantity: 1, // Fixed quantity
    rice_quantity: 100, // Fixed rice quantity
  }));

  for (let i = 0; i < totalRecords / batchSize; i++) {
    await prisma.productInOrder.createMany({ data });
    console.log(`Batch ${i + 1} inserted`);
  }

  console.log("Dummy data generation completed.");
  return null;
}
