import { RiceContracts } from "@/lib/shared";
import prisma from "../prisma";

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
