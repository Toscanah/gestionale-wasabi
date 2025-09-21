import { EngagementLedgerStatus } from "@prisma/client";

const LEDGER_LABELS: Record<EngagementLedgerStatus, string> = {
  [EngagementLedgerStatus.ISSUED]: "Emesso",
  [EngagementLedgerStatus.REDEEMED]: "Utilizzato",
  [EngagementLedgerStatus.VOID]: "Annullato",
};

export default LEDGER_LABELS;