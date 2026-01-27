import { RiceContracts } from "@/lib/shared";
import prisma from "../prisma";

export default async function getRiceLogs(
  input: RiceContracts.GetLogs.Input
): Promise<RiceContracts.GetLogs.Output> {
  return await prisma.riceLog.findMany({
    include: {
      rice_batch: true,
    },
  });
}
