import { ColumnDef } from "@tanstack/react-table";
import { ResultRecord } from "./SectionResults";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";

const averageStatsColumns: ColumnDef<ResultRecord>[] = [
  FieldColumn({
    header: "Tipo ordine",
    key: "title",
  }),

  ValueColumn({
    header: "Scontrino medio",
    value: (row) => `€ ${row.original.avgPerOrder}`,
    accessor: (stats) => stats.avgPerOrder,
  }),

  ValueColumn({
    header: "Incasso/giorno",
    value: (row) => `€ ${row.original.revenuePerDay}`,
    accessor: (stats) => stats.revenuePerDay,
  }),
  
  FieldColumn({
    header: "Ordini/giorno",
    key: "ordersPerDay",
  }),

  FieldColumn({
    header: "Prodotti/giorno",
    key: "productsPerDay",
  }),

  FieldColumn({
    header: "Zuppe/giorno",
    key: "soupsPerDay",
  }),

  FieldColumn({
    header: "Risi/giorno",
    key: "ricesPerDay",
  }),

  FieldColumn({
    header: "Insalate/giorno",
    key: "saladsPerDay",
  }),

  FieldColumn({
    header: "Riso cucinato/giorno",
    key: "riceMassPerDay",
  }),
];

export default averageStatsColumns;
