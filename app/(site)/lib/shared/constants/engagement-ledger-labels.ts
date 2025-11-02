import { EngagementLedgerStatus } from "@prisma/client";

export const ENG_LEDGER_LABELS: Record<EngagementLedgerStatus, string> = {
  [EngagementLedgerStatus.ISSUED]: "Emesso",
  [EngagementLedgerStatus.REDEEMED]: "Utilizzato",
  [EngagementLedgerStatus.VOID]: "Annullato",
};

export const ENG_LEDGER_COLORS: Record<EngagementLedgerStatus, string> = {
  [EngagementLedgerStatus.ISSUED]:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700",
  [EngagementLedgerStatus.REDEEMED]:
    "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900 dark:text-sky-200 dark:border-sky-700",
  [EngagementLedgerStatus.VOID]:
    "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900 dark:text-rose-200 dark:border-rose-700",
};
