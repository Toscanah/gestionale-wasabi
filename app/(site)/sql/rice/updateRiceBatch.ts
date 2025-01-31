import { RiceBatch } from "@prisma/client";
import prisma from "../db";

export default async function updateRiceBatch(
  batchId: number,
  field: keyof Omit<RiceBatch, "id">,
  value: any
) {
  if (!batchId) {
    throw new Error("Batch ID is required");
  }

  if (!["amount", "label"].includes(field)) {
    throw new Error("Invalid field");
  }

  if (!value) {
    throw new Error("Value is required");
  }

  let parsedValue: number | string;

  if (field == "label") {
    parsedValue = String(value);
  } else {
    parsedValue = Number(value);
  }

  return await prisma.riceBatch.update({
    where: { id: batchId },
    data: { [field]: parsedValue },
  });
}
