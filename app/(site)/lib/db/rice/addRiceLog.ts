import { RiceLogType } from "@prisma/client";
import prisma from "../db";
import { RiceContracts } from "../../shared";

export default async function addRiceLog({
  riceBatchId,
  manualValue,
  type,
}: RiceContracts.AddLog.Input): Promise<RiceContracts.AddLog.Output> {
  return await prisma.riceLog.create({
    data: {
      rice_batch_id: riceBatchId,
      manual_value: manualValue,
      type: type
        ? type
        : riceBatchId
          ? RiceLogType.BATCH
          : manualValue
            ? RiceLogType.MANUAL
            : RiceLogType.RESET,
    },
  });
}
