import { ColumnDef } from "@tanstack/react-table";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import TableColumn from "../../components/table/TableColumn";
import { KitchenType } from "@prisma/client";

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
    accessorKey: "kitchen",
    header: "Tipo di cucina",
    cellContent: (row) => {
      let kitchen = "Nessuna";

      if (row.original.kitchen == KitchenType.COLD) {
        kitchen = "Fredda";
      } else if (row.original.kitchen == KitchenType.HOT) {
        kitchen = "Calda";
      } else if (row.original.kitchen == KitchenType.HOT_AND_COLD) {
        kitchen = "Calda + fredda";
      } else if (row.original.kitchen == KitchenType.OTHER) {
        kitchen = "Altro";
      }

      return kitchen;
    },
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
    accessorKey: "rice",
    header: "Riso (g)",
  }),

  TableColumn({
    accessorKey: "category.category",
    header: "Categoria",
  }),
];

export default columns;
