import prisma from "../db";

export default async function deleteRiceBatch({ batchId }: { batchId: number }) {
  return prisma.riceBatch.delete({
    where: { id: batchId },
  });
}
