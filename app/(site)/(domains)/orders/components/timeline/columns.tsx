import { FieldColumn, ValueColumn } from "@/components/table/TableColumns";
import { ORDER_TYPE_COLORS } from "@/lib/shared";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/table-core";
import { cn } from "@/lib/utils";
import { TimeBlock } from "@/lib/services/order-management/timeline";

function getColorClassForCount(count: number, maxCapacity: number): string {
  if (count === 0) return "text-muted-foreground";

  const percentage = (count / maxCapacity) * 100;
  if (percentage <= 70) return "bg-green-200 text-green-600 dark:text-green-400 font-bold";
  if (percentage <= 100) return "bg-yellow-200 text-yellow-600 dark:text-yellow-400 font-bold";

  return "bg-red-200 text-red-600 dark:text-red-400 font-bold";
}

export const getColumns = (maxCapacity: number): ColumnDef<TimeBlock>[] => {
  return [
    ValueColumn<TimeBlock>({
      header: "Orario",
      accessor: (row) => row.label,
      value: (row) => <span className="font-mono">{row.original.label}</span>,
      sortable: false,
    }),

    FieldColumn<TimeBlock>({
      header: <Badge className={ORDER_TYPE_COLORS.TABLE}>T</Badge>,
      key: "tableCount",
      sortable: false,
    }),

    FieldColumn<TimeBlock>({
      header: <Badge className={ORDER_TYPE_COLORS.PICKUP}>A</Badge>,
      key: "pickupCount",
      sortable: false,
    }),

    FieldColumn<TimeBlock>({
      header: <Badge className={ORDER_TYPE_COLORS.HOME}>D</Badge>,
      key: "homeCount",
      sortable: false,
    }),

    ValueColumn<TimeBlock>({
      header: "Tot",
      sortable: false,
      accessor: (row) => row.total,
      value: (row) => (
        <Badge className={cn("font-bold", getColorClassForCount(row.original.total, maxCapacity))}>
          {row.original.total}
        </Badge>
      ),
    }),
  ];
};
