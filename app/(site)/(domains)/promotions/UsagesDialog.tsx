import { Button } from "@/components/ui/button";
import WasabiDialog from "../../components/ui/wasabi/WasabiDialog";
import { PromotionUsageWithOrder, PromotionWithUsages } from "../../lib/shared";
import { ColumnDef } from "@tanstack/react-table";
import { IndexColumn } from "../../components/table/TableColumns";
import useSkeletonTable from "../../hooks/table/useSkeletonTable";
import { promotionsAPI } from "@/lib/server/api";
import useTable from "../../hooks/table/useTable";
import Table from "../../components/table/Table";

const usagesColumns: ColumnDef<PromotionUsageWithOrder>[] = [IndexColumn({})];

interface UsagesDialogProps {
  promotion: PromotionWithUsages;
}

export default function UsagesDialog({ promotion }: UsagesDialogProps) {
  const isEmpty = promotion.usages.length === 0;

  const { data: usagesWithOrder = [], isLoading } = promotionsAPI.getUsagesByPromotion.useQuery(
    { promotionId: promotion.id },
    { enabled: !isEmpty }
  );

  const { tableData, tableColumns } = useSkeletonTable({
    columns: usagesColumns,
    data: usagesWithOrder,
    pageSize: 10,
    isLoading,
  });

  const table = useTable({
    columns: tableColumns,
    data: tableData,
  });

  return (
    <WasabiDialog
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
