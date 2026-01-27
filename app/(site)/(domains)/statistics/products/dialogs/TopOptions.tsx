import Table from "@/components/table/Table";
import { FieldColumn, IndexColumn, ValueColumn } from "@/components/table/TableColumns";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import useSkeletonTable from "@/hooks/table/useSkeletonTable";
import useTable from "@/hooks/table/useTable";
import { ProductWithStats } from "@/lib/shared";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface TopOptionsProps {
  product: ProductWithStats;
}

const columns: ColumnDef<ProductWithStats["stats"]["options"][number]>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Posizione",
    value: (row) => row.index + 1, // ← relative position in the ranking
    accessor: (option) => option.count,
    sortingFn: (a, b) => b.original.count - a.original.count,
  }),

  FieldColumn({
    key: "option",
    header: "Opzione",
  }),

  FieldColumn({
    key: "count",
    header: "Quantitativo",
  }),
];

export default function TopOptions({ product }: TopOptionsProps) {
  const tableData = product.stats.options.sort((a, b) => b.count - a.count);

  const table = useTable({
    data: tableData,
    columns,
  });

  return (
    <WasabiDialog
      size="medium"
      trigger={
        <Button disabled={tableData.length === 0} variant="outline" className="w-full">
          {tableData.length === 0 ? "Nessuna opzione trovata" : "Vedi opzioni più usate"}
        </Button>
      }
      title="Opzioni più utilizzate"
      putSeparator
      desc={`Le opzioni più utilizzate per il prodotto [${product.desc.trim()}]`}
    >
      <Table table={table} maxRows={10} scrollAdjustment={1} tableClassName="max-h-[410px]" />
    </WasabiDialog>
  );
}
