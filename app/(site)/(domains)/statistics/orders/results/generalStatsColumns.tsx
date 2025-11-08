import { ColumnDef } from "@tanstack/react-table";
import { GeneralResultRecord } from "./SectionResults";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import roundToTwo from "@/app/(site)/lib/utils/global/number/roundToTwo";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";

const generalStatsColumns: ColumnDef<GeneralResultRecord>[] = [
  FieldColumn({
    header: "Tipo di ordine",
    key: "title",
    sortable: false,
  }),

  ValueColumn({
    header: "Ordini",
    value: (row) => roundToTwo(row.original.orders),
    accessor: (stats) => stats.orders,
  }),

  FieldColumn({
    header: "% Ordini",
    key: "ordersPct",
  }),

  ValueColumn({
    header: "Incasso",
    value: (row) => `€ ${roundToTwo(row.original.revenue)}`,
    accessor: (stats) => stats.revenue,
  }),

  FieldColumn({
    header: "% Incasso",
    key: "revenuePct",
  }),

  ValueColumn({
    header: "Prodotti",
    value: (row) => roundToTwo(row.original.products),
    accessor: (stats) => stats.products,
  }),

  ValueColumn({
    header: "Zuppe",
    value: (row) => roundToTwo(row.original.soups),
    accessor: (stats) => stats.soups,
  }),

  ValueColumn({
    header: "Porzioni riso",
    value: (row) => roundToTwo(row.original.rices),
    accessor: (stats) => stats.rices,
  }),

  ValueColumn({
    header: "Insalate",
    value: (row) => roundToTwo(row.original.salads),
    accessor: (stats) => stats.salads,
  }),

  ValueColumn({
    header: "Riso cucinato",
    value: (row) => formatRice(row.original.rice),
    accessor: (stats) => stats.rice,
    meta: {
      exportValue: (row) => formatRice(row.rice),
    },
  }),
];

export default generalStatsColumns;
