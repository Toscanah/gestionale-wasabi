import { RiceContracts } from "../../shared";
import prisma from "../db";

export default async function getRiceLogs(
  input: RiceContracts.GetLogs.Input
): Promise<RiceContracts.GetLogs.Output> {
  return await prisma.riceLog.findMany({
    include: {
      rice_batch: true,
    },
  });
}
