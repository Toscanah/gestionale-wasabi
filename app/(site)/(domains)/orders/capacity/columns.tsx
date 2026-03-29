import { FieldColumn, ValueColumn } from "@/components/table/TableColumns";
import { ORDER_TYPE_COLORS, ORDER_TYPE_LABELS } from "@/lib/shared";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/table-core";
import { cn } from "@/lib/utils";
import { CapacityBlock } from "@/lib/services/order-management/capacity";
import WasabiPopover from "@/components/ui/shared/wasabi/WasabiPopover";
import { Button } from "@/components/ui/button";
import { getCapacityColorClass } from "@/lib/services/order-management/capacity/getCapacityForCustomerTime";

export const getColumns = (maxCapacity: number): ColumnDef<CapacityBlock>[] => {
  return [
    ValueColumn<CapacityBlock>({
      header: "Orario",
      accessor: (row) => row.label,
      value: (row) => <span className="font-mono">{row.original.label}</span>,
      sortable: false,
    }),

    FieldColumn<CapacityBlock>({
      header: <Badge>{ORDER_TYPE_LABELS.TABLE}</Badge>,
      key: "tableCount",
      sortable: false,
    }),

    FieldColumn<CapacityBlock>({
      header: <Badge>{ORDER_TYPE_LABELS.PICKUP}</Badge>,
      key: "pickupCount",
      sortable: false,
    }),

    FieldColumn<CapacityBlock>({
      header: <Badge>{ORDER_TYPE_LABELS.HOME}</Badge>,
      key: "homeCount",
      sortable: false,
    }),

    ValueColumn<CapacityBlock>({
      header: "Conteggio",
      sortable: false,
      accessor: (row) => row.total,
      value: (row) => (
        <Badge className={cn("font-bold", getCapacityColorClass(row.original.total, maxCapacity))}>
          {row.original.total}
        </Badge>
      ),
    }),

    ValueColumn<CapacityBlock>({
      header: "Dettagli",
      sortable: false,
      accessor: (row) => row.total,
      value: (row) => (
        <WasabiPopover
          trigger={
            <Button variant="outline" size="sm" disabled={row.original.total === 0}>
              {row.original.total > 0 ? "Visualizza" : "Nessun ordine"}
            </Button>
          }
        >
          <div className="flex flex-col gap-2 text-sm">
            <div>
              <div className="font-semibold text-base mb-1">{ORDER_TYPE_LABELS.PICKUP}</div>
              <ul className="list-disc list-inside text-muted-foreground ml-1">
                <li>Immediati: {row.original.pickupImmediateCount}</li>
                <li>Programmati: {row.original.pickupScheduledCount}</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-base mb-1">{ORDER_TYPE_LABELS.HOME}</div>
              <ul className="list-disc list-inside text-muted-foreground ml-1">
                <li>Immediati: {row.original.homeImmediateCount}</li>
                <li>Programmati: {row.original.homeScheduledCount}</li>
              </ul>
            </div>
          </div>
        </WasabiPopover>
      ),
    }),
  ];
};
