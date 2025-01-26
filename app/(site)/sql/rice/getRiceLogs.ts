import prisma from "../db";

export default async function getRiceLogs() {
  return await prisma.riceBatchLog.findMany({
    include: {
      rice_batch: true,
    }
  })
}