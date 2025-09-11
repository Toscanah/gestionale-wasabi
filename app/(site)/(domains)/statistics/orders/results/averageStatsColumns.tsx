import { ColumnDef } from "@tanstack/react-table";
import { AverageResultRecord } from "./SectionResults";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import roundToTwo from "@/app/(site)/lib/utils/global/number/roundToTwo";

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
    value: (row) => `€ ${row.original.revenuePerDay}`,
    accessor: (stats) => stats.revenuePerDay,
  }),

  ValueColumn({
    header: "Ordini/giorno",
    value: (row) => roundToTwo(row.original.ordersPerDay),
    accessor: (stats) => stats.ordersPerDay,
  }),

  ValueColumn({
    header: "Prodotti/giorno",
    value: (row) => roundToTwo(row.original.productsPerDay),
    accessor: (stats) => stats.productsPerDay,
  }),

  ValueColumn({
    header: "Zuppe/giorno",
    value: (row) => roundToTwo(row.original.soupsPerDay),
    accessor: (stats) => stats.soupsPerDay,
  }),

  ValueColumn({
    header: "Risi/giorno",
    value: (row) => roundToTwo(row.original.ricesPerDay),
    accessor: (stats) => stats.ricesPerDay,
  }),

  ValueColumn({
    header: "Insalate/giorno",
    value: (row) => roundToTwo(row.original.saladsPerDay),
    accessor: (stats) => stats.saladsPerDay,
  }),

  ValueColumn({
    header: "Riso cucinato/giorno",
    value: (row) => roundToTwo(row.original.ricePerDay),
    accessor: (stats) => stats.ricePerDay,
  }),
];

export default averageStatsColumns;
