import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../../models";
import TableColumn from "../../components/table/TableColumn";
import { ProductWithStats } from "../../types/ProductWithStats";
import formatRice from "../../functions/formatting-parsing/formatRice";

const columns: ColumnDef<ProductWithStats>[] = [
  TableColumn({
    accessorKey: "code",
    header: "Codice",
  }),

  TableColumn({
    accessorKey: "desc",
    header: "Descrizione",
  }),

  TableColumn({
    accessorKey: "quantity",
    header: "Quantitativo",
  }),

  TableColumn({
    accessorKey: "total",
    header: "Totale",
    cellContent: (row) => "€ " + row.original.total,
  }),

  TableColumn({
    accessorKey: "rice",
    header: "Totale riso",
    cellContent: (row) => formatRice(row.original.quantity * row.original.rice),
  }),
];

export default columns;
