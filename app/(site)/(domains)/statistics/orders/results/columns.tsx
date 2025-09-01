import { ColumnDef } from "@tanstack/react-table";
import { ResultRecord } from "./SectionResults";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";
import roundToTwo from "@/app/(site)/lib/utils/global/number/roundToTwo";

export default function columns(): ColumnDef<ResultRecord>[] {
  return [
    FieldColumn({
      header: "Tipo ordine",
      key: "title",
    }),

    FieldColumn({
      header: "Ordini",
      key: "orders",
    }),

    ValueColumn({
      header: "Ordini/giorno",
      value: (row) => row.original.ordersPerDay,
      accessor: (stats) => stats.ordersPerDay,
    }),

    FieldColumn({
      header: "% Ordini",
      key: "ordersPct",
    }),

    ValueColumn({
      header: "Incasso",
      value: (row) => `€ ${row.original.revenue}`,
      accessor: (stats) => stats.revenue,
    }),

    ValueColumn({
      header: "Incasso/giorno",
      value: (row) => `€ ${row.original.revenuePerDay}`,
      accessor: (stats) => stats.revenuePerDay,
    }),

    FieldColumn({
      header: "% Incasso",
      key: "revenuePct",
    }),

    ValueColumn({
      header: "Scontrino medio",
      value: (row) => `€ ${row.original.avgPerOrder}`,
      accessor: (stats) => stats.avgPerOrder,
    }),

    FieldColumn({
      header: "Prodotti",
      key: "products",
    }),

    ValueColumn({
      header: "Prodotti/giorno",
      value: (row) => row.original.productsPerDay,
      accessor: (stats) => stats.productsPerDay,
    }),

    FieldColumn({
      header: "Zuppe",
      key: "soups",
    }),

    FieldColumn({
      header: "Porzioni riso",
      key: "rices",
    }),

    FieldColumn({
      header: "Insalate",
      key: "salads",
    }),

    ValueColumn({
      header: "Riso cucinato",
      value: (row) => row.original.riceMass,
      accessor: (stats) => stats.riceMass,
    }),
  ];
}
