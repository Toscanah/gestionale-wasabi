import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/app/(site)/lib/shared";
import { KitchenType } from "@prisma/client";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";
import { NA } from "@/app/(site)/components/ui/misc/Placeholders";

const columns: ColumnDef<Product>[] = [
  FieldColumn({
    key: "code",
    header: "Codice",
    sortable: false,
  }),

  FieldColumn({
    key: "desc",
    header: "Descrizione",
    sortable: false,
  }),

  ValueColumn({
    header: "Categoria",
    value: (row) => (row.original.category == null ? "Nessuna" : row.original.category?.category),
    accessor: (product) => product.category?.category,
    sortable: false,
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
    sortable: false,
  }),

  ValueColumn({
    header: "Prezzo in loco",
    value: (row) => toEuro(row.original.site_price),
    accessor: (product) => product.site_price,
    sortable: false,
  }),

  ValueColumn({
    header: "Prezzo da asporto",
    value: (row) => toEuro(row.original.home_price),
    accessor: (product) => product.home_price,
    sortable: false,
  }),

  ValueColumn({
    header: "Riso",
    value: (row) => (row.original.rice != 0 ? formatRice(row.original.rice) : <NA />),
    accessor: (product) => product.rice,
    sortable: false,
  }),
];

export default columns;
