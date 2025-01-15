import prisma from "./db";

export default async function dummy() {
  let totalDeleted = 0;

  // Delete a batch of records
  const every = await prisma.order.findMany({});

  for (const record of every) {
    await prisma.order.delete({ where: { id: record.id } });
    totalDeleted++;
    console.log(`Deleted productInOrder ${record.id}`);
    console.log(`Total deleted: ${totalDeleted}`);
  }

  return totalDeleted;
}
