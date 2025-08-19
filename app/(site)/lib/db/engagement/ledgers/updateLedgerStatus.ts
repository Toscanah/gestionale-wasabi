import { EngagementSchemaInputs } from "../../../shared";
import prisma from "../../db";
import { EngagementLedgerStatus } from "@prisma/client";

export default async function updateLedgerStatus({
  ledgerId,
  status,
}: EngagementSchemaInputs["UpdateLedgerStatusInput"]) {
  const ledger = await prisma.engagementLedger.findUnique({
    where: { id: ledgerId },
    select: {
      status: true,
      redeemed_at: true,
      voided_at: true,
    },
  });

  if (!ledger) {
    throw new Error(`Ledger ${ledgerId} not found`);
  }

  const now = new Date();
  let data: any = { status };

  switch (status) {
    case EngagementLedgerStatus.REDEEMED:
      data = {
        ...data,
        redeemed_at: ledger.redeemed_at ?? now, // only set if null
        voided_at: null, // clear if switching from void
      };
      break;

    case EngagementLedgerStatus.VOID:
      data = {
        ...data,
        voided_at: ledger.voided_at ?? now, // only set if null
        redeemed_at: null, // clear if switching from redeemed
      };
      break;

    case EngagementLedgerStatus.ISSUED:
      data = {
        ...data,
        // going back to issued clears both timestamps
        issued_at: now,
        redeemed_at: null,
        voided_at: null,
      };
      break;
  }

  return await prisma.engagementLedger.update({
    where: { id: ledgerId },
    data,
  });
}
