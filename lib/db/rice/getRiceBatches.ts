import { RiceContracts } from "@/lib/shared";
import prisma from "../prisma";

export default async function getRiceBatches(
  input: RiceContracts.GetBatches.Input
): Promise<RiceContracts.GetBatches.Output> {
  return await prisma.riceBatch.findMany();
}
