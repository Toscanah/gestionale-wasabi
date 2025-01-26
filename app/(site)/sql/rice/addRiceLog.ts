import prisma from "../db";

export default async function addRiceLog(riceBatchId: number | null, manualValue: number | null) {
  return await prisma.riceBatchLog.create({
    data: {
      rice_batch_id: riceBatchId,
      value: manualValue,
    },
  });
}
