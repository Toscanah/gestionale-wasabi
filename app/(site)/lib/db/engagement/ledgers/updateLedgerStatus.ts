import { EngagementContracts } from "../../../shared";
import prisma from "../../prisma";
import { EngagementLedgerStatus, Prisma } from "@prisma/client";

export default async function updateLedgerStatus({
  ledgerId,
  status,
  orderId,
}: EngagementContracts.UpdateLedgerStatus.Input): Promise<EngagementContracts.UpdateLedgerStatus.Output> {
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
  let data: Prisma.EngagementLedgerUpdateInput = { status };

  switch (status) {
    case EngagementLedgerStatus.REDEEMED:
      data = {
        ...data,
        redeemed_on_order: {
          connect: { id: orderId },
        },
        voided_on_order: {
          disconnect: true,
        },
        redeemed_at: ledger.redeemed_at ?? now, // only set if null
        voided_at: null, // clear if switching from void
      };
      break;

    case EngagementLedgerStatus.VOID:
      data = {
        ...data,
        voided_at: ledger.voided_at ?? now, // only set if null
        redeemed_at: null, // clear if switching from redeemed
        redeemed_on_order: {
          disconnect: true,
        },
      };
      break;

    case EngagementLedgerStatus.ISSUED:
      data = {
        ...data,
        // going back to issued clears both timestamps
        issued_at: now,
        redeemed_at: null,
        voided_at: null,
        redeemed_on_order: {
          disconnect: true,
        },
        voided_on_order: {
          disconnect: true,
        },
      };
      break;
  }

  return await prisma.engagementLedger.update({
    where: { id: ledgerId },
    data,
  });
}
