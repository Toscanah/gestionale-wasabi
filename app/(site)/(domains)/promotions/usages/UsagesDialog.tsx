import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { promotionsAPI } from "@/lib/server/api";
import { useState } from "react";
import { IndexColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import useTable from "@/app/(site)/hooks/table/useTable";
import {
  ComprehensivePromotionUsage,
  PromotionGuards,
  PromotionUsageWithOrder,
  PromotionWithUsages,
} from "@/app/(site)/lib/shared";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import Table from "@/app/(site)/components/table/Table";

const usagesColumns: ColumnDef<ComprehensivePromotionUsage>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Data utilizzo",
    value: (row) => new Date(row.original.created_at).toLocaleDateString(),
    accessor: (usage) => usage.created_at,
  }),

  ValueColumn({
    header: "Ammontare usato",
    value: (row) => row.original.amount.toFixed(2) + " €",
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Ammontare rimanente",
    value: (row, meta) => {
      const promotion = row.original.promotion;

      if (PromotionGuards.isPercentageDiscount(promotion as any)) {
        return "N/A";
      }

      const fixedAmount = Number(promotion.fixed_amount);

      const usageTs = new Date(row.original.created_at).getTime();

      // Use promotion.usages directly
      const usages = promotion.usages ?? [];

      // Consider only usages of the same promotion before or equal to this timestamp
      const usedUntil = usages
        .filter((u) => new Date(u.created_at).getTime() <= usageTs)
        .reduce((sum, u) => sum + (u.amount ?? 0), 0);

      const remaining = Math.max(0, fixedAmount - usedUntil);
      return `${remaining.toFixed(2)} €`;
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Totale usato (cumulativo)",
    value: (row) => {
      const promotion = row.original.promotion;
      const usageTs = new Date(row.original.created_at).getTime();
      const usages = promotion.usages ?? [];

      const usedUntil = usages
        .filter((u) => new Date(u.created_at).getTime() <= usageTs)
        .reduce((sum, u) => sum + (u.amount ?? 0), 0);

      return `${usedUntil.toFixed(2)} €`;
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Percentuale usata",
    value: (row) => {
      const promotion = row.original.promotion;
      const fixedAmount = Number(promotion.fixed_amount);
      if (fixedAmount <= 0) return "N/A";

      const usageTs = new Date(row.original.created_at).getTime();
      const usages = promotion.usages ?? [];

      const usedUntil = usages
        .filter((u) => new Date(u.created_at).getTime() <= usageTs)
        .reduce((sum, u) => sum + (u.amount ?? 0), 0);

      const percentageUsed = (usedUntil / fixedAmount) * 100;
      return `${percentageUsed.toFixed(1)} %`;
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Percentuale rimanente",
    value: (row, meta) => {
      const promotion = row.original.promotion;
      const fixedAmount = Number(promotion.fixed_amount);
      if (fixedAmount <= 0) return "N/A";

      const usageTs = new Date(row.original.created_at).getTime();
      const usages = promotion.usages ?? [];

      const usedUntil = usages
        .filter((u) => new Date(u.created_at).getTime() <= usageTs)
        .reduce((sum, u) => sum + (u.amount ?? 0), 0);

      const remainingPct = ((fixedAmount - usedUntil) / fixedAmount) * 100;
      return `${remainingPct.toFixed(1)} %`;
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Intervallo dall'uso precedente",
    value: (row) => {
      const usageTs = new Date(row.original.created_at).getTime();
      const promotion = row.original.promotion;
      const usages = promotion.usages ?? [];

      const sorted = [...usages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const index = sorted.findIndex((u) => u.id === row.original.id);
      if (index <= 0) return "Primo utilizzo";

      const prevUsage = sorted[index - 1];
      const diffDays = (usageTs - new Date(prevUsage.created_at).getTime()) / (1000 * 60 * 60 * 24);

      return `+${diffDays.toFixed(1)} giorni`;
    },
    accessor: (usage) => usage.created_at,
  }),
];

interface UsagesDialogProps {
  promotion: PromotionWithUsages;
}

export default function UsagesDialog({ promotion }: UsagesDialogProps) {
  const [open, setOpen] = useState(false);
  const isEmpty = promotion.usages.length === 0;

  const { data: usagesWithOrder = [], isLoading } = promotionsAPI.getUsagesByPromotion.useQuery(
    { promotionId: promotion.id },
    { enabled: !isEmpty && open }
  );

  const { tableData, tableColumns } = useSkeletonTable({
    columns: usagesColumns,
    data: usagesWithOrder,
    pageSize: 10,
    isLoading,
  });

  const table = useTable({
    columns: tableColumns,
    data: tableData.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
  });

  return (
    <WasabiDialog
      size="large"
      title={`Utilizzi della promozione "${promotion.code}"`}
      putSeparator
      putUpperBorder
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button disabled={isEmpty} variant={"outline"} className="w-full">
          {isEmpty ? "Nessun utilizzo" : `Vedi ${promotion.usages.length} utilizzi`}
        </Button>
      }
    >
      <Table table={table} />
    </WasabiDialog>
  );
}
