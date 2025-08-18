import { ColumnDef } from "@tanstack/react-table";
import { ResultRecord } from "./SectionResults";
import { FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";

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

    ValueColumn({
      header: "Scontrino medio",
      value: (row) => `€ ${row.original.avg}`,
      accessor: (stats) => stats.avg,
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
      value: (row) => formatRice(row.original.riceMass),
      accessor: (stats) => formatRice(stats.riceMass),
    }),
  ];
}
