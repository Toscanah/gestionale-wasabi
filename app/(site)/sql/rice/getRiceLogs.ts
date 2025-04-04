import prisma from "../db";

export default async function getRiceLogs() {
  return await prisma.riceLog.findMany({
    include: {
      rice_batch: true,
    }
  })
}