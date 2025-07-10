import { RiceBatch } from "@prisma/client";
import prisma from "../db";

type ValidFields = Omit<RiceBatch, "id">;

export default async function updateRiceBatch({
  batchId,
  field,
  value,
}: {
  batchId: number;
  field: keyof ValidFields;
  value: any;
}) {
  if (!batchId) {
    throw new Error("Batch ID is required");
  }

  // TODO: fix field validation
  // const validFields: (keyof ValidFields)[] = Object.keys(
  //   {} as ValidFields
  // ) as (keyof ValidFields)[];

  // console.log(field, validFields, value);

  // if (!validFields.includes(field)) {
  //   throw new Error("Invalid field");
  // }

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
