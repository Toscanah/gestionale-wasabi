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
    header: "Categoria",
    value: (row) => (row.original.category == null ? "Nessuna" : row.original.category?.category),
    accessor: (product) => product.category?.category,
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

  FieldColumn({
    header: "Prezzo in loco (€)",
    key: "site_price",
  }),

  FieldColumn({
    header: "Prezzo da asporto (€)",
    key: "home_price",
  }),

  FieldColumn({
    key: "rice",
    header: "Riso (g)",
  }),
];

export default columns;
