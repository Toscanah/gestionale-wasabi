import { ActionColumn, IndexColumn, ValueColumn } from "@/components/table/TableColumns";
import { EngagementLedgerWithDetails } from "@/lib/shared";
import { EngagementLedgerStatus } from "@/prisma/generated/client/enums";
import { ColumnDef } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EngagementHistoryTableMeta } from "./EngagementHistory";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowCounterClockwise, Check } from "@phosphor-icons/react";
import {
  ENG_LEDGER_COLORS,
  ENG_LEDGER_LABELS,
} from "@/lib/shared/constants/engagement-ledger-labels";

const columns: ColumnDef<EngagementLedgerWithDetails>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Nome",
    accessor: (ledger) => ledger.engagement.template.label,
    value: (row) => row.original.engagement.template.label,
  }),

  ValueColumn({
    header: "Data ultima modifica",
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
    header: "Stato",
    action: (row, meta) => {
      const [justUpdated, setJustUpdated] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const ledger = row.original;

      const isFromCurrentOrder =
        ledger.issued_on_order_id === (meta as EngagementHistoryTableMeta).orderId;

      return (
        <RadioGroup
          disabled={isLoading || isFromCurrentOrder}
          onValueChange={(newStatus) => {
            setIsLoading(true);
            (meta as EngagementHistoryTableMeta).updateLedgerStatus(
              ledger.id,
              newStatus as EngagementLedgerStatus
            );
            setIsLoading(false);
            setJustUpdated(true);
            setTimeout(() => setJustUpdated(false), 1000);
          }}
          defaultValue={ledger.status}
          className="w-full flex gap-8"
        >
          {Object.entries(ENG_LEDGER_LABELS).map(([value, label]) => {
            const isSelected = ledger.status === value;
            return (
              <div key={value} className="flex items-center space-x-2 transition">
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value}>
                  <Badge
                    className={cn(
                      "transition-colors px-3 py-1",
                      isSelected ? ENG_LEDGER_COLORS[value as EngagementLedgerStatus] : ""
                    )}
                  >
                    {label +
                      (isFromCurrentOrder && value === EngagementLedgerStatus.ISSUED
                        ? " (da questo ordine)"
                        : "")}
                  </Badge>
                </Label>
              </div>
            );
          })}

          <div className="flex items-center">
            <Check
              className={cn(
                "w-4 h-4 text-green-500 transition-opacity duration-700",
                justUpdated ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </RadioGroup>
      );
    },
  }),
];

export default columns;
