import { RiceLogType } from "@prisma/client";
import prisma from "../db";

export default async function addRiceLog({
  riceBatchId,
  manualValue,
  type,
}: {
  riceBatchId: number | null;
  manualValue: number | null;
  type: RiceLogType | null;
}) {
  return await prisma.riceLog.create({
    data: {
      rice_batch_id: riceBatchId,
      manual_value: manualValue,
      type: type ? type : riceBatchId ? "BATCH" : manualValue ? "MANUAL" : "RESET",
    },
  });
}
