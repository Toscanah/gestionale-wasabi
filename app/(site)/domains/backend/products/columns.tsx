import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/app/(site)/lib/shared"
;
import TableColumn from "../../../components/table/TableColumn";
import { KitchenType } from "@prisma/client";

const columns: ColumnDef<Product>[] = [
  TableColumn({
    accessorKey: "code",
    header: "Codice",
  }),

  TableColumn({
    accessorKey: "desc",
    header: "Descrizione",
  }),

  TableColumn({
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
    header: "In loco",
    cellContent: (row) => {
      return "€ " + row.original.site_price;
    },
  }),

  TableColumn({
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
    header: "Categoria",
    cellContent: (row) =>
      row.original.category == null ? "Nessuna" : row.original.category?.category,
  }),
];

export default columns;
