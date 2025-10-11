import Table from "@/app/(site)/components/table/Table";
import { FieldColumn, IndexColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import useTable from "@/app/(site)/hooks/table/useTable";
import { ProductWithStats } from "@/app/(site)/lib/shared";
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
        <Button className="w-40" variant="outline">
          Vedi opzioni usate
        </Button>
      }
      title="Opzioni più utilizzate"
      putSeparator
    >
      <Table table={table} />
    </WasabiDialog>
  );
}
