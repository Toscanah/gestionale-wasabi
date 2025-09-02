import { ColumnDef } from "@tanstack/react-table";
import { ResultRecord } from "./SectionResults";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";

const generalStatsColumns: ColumnDef<ResultRecord>[] = [
  FieldColumn({
    header: "Tipo ordine",
    key: "title",
  }),

  FieldColumn({
    header: "Ordini",
    key: "orders",
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

  FieldColumn({
    header: "% Incasso",
    key: "revenuePct",
  }),

  FieldColumn({
    header: "Prodotti",
    key: "products",
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

export default generalStatsColumns;
