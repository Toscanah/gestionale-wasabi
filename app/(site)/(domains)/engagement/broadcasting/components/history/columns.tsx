import { ActionColumn, IndexColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import { EngagementLedgerWithDetails } from "@/app/(site)/lib/shared";
import { EngagementLedgerStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EngagementHistoryTableMeta } from "./EngagementHistory";
import { Badge } from "@/components/ui/badge";

const LEDGER_LABELS: Record<EngagementLedgerStatus, string> = {
  [EngagementLedgerStatus.ISSUED]: "Emesso",
  [EngagementLedgerStatus.REDEEMED]: "Utilizzato",
  [EngagementLedgerStatus.VOID]: "Annullato",
};

const columns: ColumnDef<EngagementLedgerWithDetails>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Nome",
    accessor: (ledger) => ledger.engagement.template.label,
    value: (row) => row.original.engagement.template.label,
  }),

  ValueColumn({
    header: "Stato",
    accessor: (ledger) => LEDGER_LABELS[ledger.status],
    value: (row, meta) => {
      const ledger = row.original;
      const label = LEDGER_LABELS[ledger.status];

      // if this ledger was issued in the current order, mark it
      if (ledger.issued_on_order_id === (meta as EngagementHistoryTableMeta).orderId) {
        return `${label} (da questo ordine)`;
      }

      return label;
    },
  }),

  ValueColumn({
    header: "Data",
    value: (row) => {
      const ledger = row.original;

      switch (ledger.status) {
        case EngagementLedgerStatus.REDEEMED:
          return ledger.redeemed_at ? new Date(ledger.redeemed_at).toLocaleString() : "-";
        case EngagementLedgerStatus.VOID:
          return ledger.voided_at ? new Date(ledger.voided_at).toLocaleString() : "-";
        case EngagementLedgerStatus.ISSUED:
        default:
          return ledger.issued_at ? new Date(ledger.issued_at).toLocaleString() : "-";
      }
    },
    accessor: (ledger) => ledger.status,
  }),

  ActionColumn({
    header: "Modifica stato",
    action: (row, meta) => {
      const isFromCurrentOrder =
        row.original.issued_on_order_id === (meta as EngagementHistoryTableMeta).orderId;

      if (isFromCurrentOrder) {
        // disable actions completely
        return <Badge className="text-background ">Non modificabile</Badge>;
      }

      return (
        <RadioGroup
          onValueChange={(newStatus) =>
            (meta as EngagementHistoryTableMeta).updateLedgerStatus(
              row.original.id,
              newStatus as EngagementLedgerStatus
            )
          }
          defaultValue={row.original.status}
          className="w-full flex gap-8"
        >
          {Object.entries(LEDGER_LABELS).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    },
  }),
];

export default columns;
