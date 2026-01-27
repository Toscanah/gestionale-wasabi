import { RiceContracts } from "@/lib/shared";
import prisma from "../prisma";

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
