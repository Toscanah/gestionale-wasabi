import prisma from "../db";

export default async function getRiceBatches() {
  return await prisma.riceBatch.findMany({});
}
