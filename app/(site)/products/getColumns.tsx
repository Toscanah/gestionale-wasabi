import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../util/TableColumn";
import { ProductWithInfo } from "../types/ProductWithInfo";

export default function getColumns(): ColumnDef<ProductWithInfo>[] {
  return [
    TableColumn({
      accessorKey: "code",
      headerLabel: "Codice",
    }),

    TableColumn({
      accessorKey: "name",
      headerLabel: "Nome",
    }),

    TableColumn({
      accessorKey: "desc",
      headerLabel: "Descrizione",
    }),

    TableColumn({
      accessorKey: "home_price",
      headerLabel: "Prezzo asporto",
    }),

    TableColumn({
      accessorKey: "site_price",
      headerLabel: "Prezzo in loco",
    }),

    TableColumn({
      accessorKey: "category.category",
      headerLabel: "Categoria",
    }),

    TableColumn({
      accessorKey: "rice",
      headerLabel: "Riso",
    }),
  ];
}
