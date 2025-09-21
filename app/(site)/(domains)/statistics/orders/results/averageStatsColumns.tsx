import { ColumnDef } from "@tanstack/react-table";
import { AverageResultRecord } from "./SectionResults";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import roundToTwo from "@/app/(site)/lib/utils/global/number/roundToTwo";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";

const averageStatsColumns: ColumnDef<AverageResultRecord>[] = [
  FieldColumn({
    header: "Tipo ordine",
    key: "title",
  }),

  ValueColumn({
    header: "Scontrino medio",
    value: (row) => `€ ${roundToTwo(row.original.avgPerOrder)}`,
    accessor: (stats) => stats.avgPerOrder,
  }),

  ValueColumn({
    header: "Incasso/giorno",
    value: (row) => `€ ${roundToTwo(row.original.perDay.revenue)}`,
    accessor: (stats) => stats.perDay.revenue,
  }),

  ValueColumn({
    header: "Ordini/giorno",
    value: (row) => roundToTwo(row.original.perDay.orders),
    accessor: (stats) => stats.perDay.orders,
  }),

  ValueColumn({
    header: "Prodotti/giorno",
    value: (row) => roundToTwo(row.original.perDay.products),
    accessor: (stats) => stats.perDay.products,
  }),

  ValueColumn({
    header: "Zuppe/giorno",
    value: (row) => roundToTwo(row.original.perDay.soups),
    accessor: (stats) => stats.perDay.soups,
  }),

  ValueColumn({
    header: "Risi/giorno",
    value: (row) => roundToTwo(row.original.perDay.rices),
    accessor: (stats) => stats.perDay.rices,
  }),

  ValueColumn({
    header: "Insalate/giorno",
    value: (row) => roundToTwo(row.original.perDay.salads),
    accessor: (stats) => stats.perDay.salads,
  }),

  ValueColumn({
    header: "Riso cucinato/giorno",
    value: (row) => formatRice(row.original.perDay.rice),
    accessor: (stats) => stats.perDay.rice,
  }),
];

export default averageStatsColumns;
