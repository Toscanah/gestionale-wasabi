import { RiceBatch } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function addRiceBatch({
  batch,
}: {
  batch: Omit<RiceBatch, "id">;
}): Promise<RiceBatch> {
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
