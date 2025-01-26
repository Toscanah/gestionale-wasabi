import prisma from "../db";

export default async function deleteRiceBatch(batchId: number) {
  return prisma.riceBatch.delete({
    where: { id: batchId },
  });
}
