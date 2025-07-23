import { ToggleDeleteObject } from "../../shared/schemas/common";
import prisma from "../db";

export default async function deleteRiceBatch({ id }: ToggleDeleteObject) {
  return prisma.riceBatch.delete({
    where: { id },
  });
}
