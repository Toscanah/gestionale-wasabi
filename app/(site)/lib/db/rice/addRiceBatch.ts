import { RiceContracts } from "../../shared";
import prisma from "../db";

export default async function addRiceBatch({
  batch,
}: RiceContracts.AddBatch.Input): Promise<RiceContracts.AddBatch.Output> {
  const existingBatch = await prisma.riceBatch.findFirst({
    where: {
      amount: batch.amount,
      label: batch.label,
    },
  });

  return existingBatch
    ? existingBatch
    : await prisma.riceBatch.create({
        data: {
          ...batch,
        },
      });
}
