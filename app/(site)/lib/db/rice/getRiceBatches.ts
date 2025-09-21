import { RiceContracts } from "../../shared";
import prisma from "../db";

export default async function getRiceBatches(
  input: RiceContracts.GetBatches.Input
): Promise<RiceContracts.GetBatches.Output> {
  return await prisma.riceBatch.findMany();
}
