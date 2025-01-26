import { RiceBatch } from "@/prisma/generated/zod";
import prisma from "../db";

export default async function addRiceBatch(batch: Omit<RiceBatch, "id">) {
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
