import { ColumnDef } from "@tanstack/react-table";
import { ResultRecord } from "./SectionResults";
import TableColumn from "@/app/(site)/components/table/TableColumn";
import formatRice from "@/app/(site)/lib/formatting-parsing/formatRice";

export default function columns(): ColumnDef<ResultRecord>[] {
  return [
    TableColumn({
      header: "Tipo ordine",
      accessorKey: "title",
    }),
    TableColumn({
      header: "Ordini",
      accessorKey: "orders",
    }),
    TableColumn({
      header: "% Ordini",
      accessorKey: "ordersPct",
    }),
    TableColumn({
      header: "Incasso",
      cellContent: (row) => `€ ${row.original.revenue}`,
    }),
    TableColumn({
      header: "% Incasso",
      accessorKey: "revenuePct",
    }),
    TableColumn({
      header: "Scontrino medio",
      cellContent: (row) => `€ ${row.original.avg}`,
    }),
    TableColumn({
      header: "Prodotti",
      accessorKey: "products",
    }),
    TableColumn({
      header: "Zuppe",
      accessorKey: "soups",
    }),
    TableColumn({
      header: "Porzioni riso",
      accessorKey: "rices",
    }),
    TableColumn({
      header: "Insalate",
      accessorKey: "salads",
    }),
    TableColumn({
      header: "Riso cucinato",
      cellContent: (row) => formatRice(row.original.riceMass),
    }),
  ];
}
