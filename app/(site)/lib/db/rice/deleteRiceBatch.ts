import { RiceContracts } from "../../shared";
import prisma from "../db";

export default async function deleteRiceBatch({
  id,
}: RiceContracts.DeleteBatch.Input): Promise<RiceContracts.DeleteBatch.Output> {
  return prisma.riceBatch.delete({
    where: { id },
    select: {
      id: true,
    },
  });
}
