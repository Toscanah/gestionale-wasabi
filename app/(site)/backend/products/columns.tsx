import { ColumnDef } from "@tanstack/react-table";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import TableColumn from "../../components/table/TableColumn";

type ProductAndCategory = Omit<ProductWithInfo, "category"> & {
  category: string;
};

const columns: ColumnDef<ProductAndCategory>[] = [
  TableColumn({
    accessorKey: "code",
    header: "Codice",
  }),

  TableColumn({
    accessorKey: "desc",
    header: "Descrizione",
  }),

  TableColumn({
    accessorKey: "site_price",
    header: "In loco",
    cellContent: (row) => {
      return "€ " + row.original.site_price;
    },
  }),

  TableColumn({
    accessorKey: "home_price",
    header: "Asporto",
    cellContent: (row) => {
      return "€ " + row.original.home_price;
    },
  }),

  TableColumn({
    accessorKey: "category.category",
    header: "Categoria",
  }),

  TableColumn({
    accessorKey: "rice",
    header: "Riso",
  }),
];

export default columns;
