import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/app/(site)/lib/shared";
import { KitchenType } from "@prisma/client";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";

const columns: ColumnDef<Product>[] = [
  FieldColumn({
    key: "code",
    header: "Codice",
  }),

  FieldColumn({
    key: "desc",
    header: "Descrizione",
  }),

  ValueColumn({
    header: "Tipo di cucina",
    value: (row) => {
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
    accessor: (product) => product.kitchen,
  }),

  ValueColumn({
    header: "In loco",
    value: (row) => {
      return "€ " + row.original.site_price;
    },
    accessor: (product) => product.site_price,
  }),

  ValueColumn({
    header: "Asporto",
    value: (row) => {
      return "€ " + row.original.home_price;
    },
    accessor: (product) => product.home_price,
  }),

  FieldColumn({
    key: "rice",
    header: "Riso (g)",
  }),

  ValueColumn({
    header: "Categoria",
    value: (row) =>
      row.original.category == null ? "Nessuna" : row.original.category?.category,
    accessor: (product) => product.category?.category,
  }),
];

export default columns;
