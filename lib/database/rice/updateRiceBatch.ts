import prisma from "../prisma";
import { RiceContracts } from "@/lib/shared";

export default async function updateRiceBatch({
  batchId,
  field,
  value,
}: RiceContracts.UpdateBatch.Input): Promise<RiceContracts.UpdateBatch.Output> {
  if (!batchId) {
    throw new Error("Batch ID is required");
  }

  if (!value) {
    throw new Error("Value is required");
  }

  // TODO: fix field validation
  // const validFields: (keyof ValidFields)[] = Object.keys(
  //   {} as ValidFields
  // ) as (keyof ValidFields)[];

  // console.log(field, validFields, value);

  // if (!validFields.includes(field)) {
  //   throw new Error("Invalid field");
  // }

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
