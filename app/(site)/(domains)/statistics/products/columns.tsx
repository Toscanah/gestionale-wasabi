import { ColumnDef } from "@tanstack/react-table";
import formatRice from "../../../../../lib/shared/utils/domains/rice/formatRice";
import roundToTwo from "../../../../../lib/shared/utils/global/number/roundToTwo";
import TopOptions from "./dialogs/TopOptions";
import TopCustomers from "./dialogs/TopCustomers";
import {
  ActionColumn,
  FieldColumn,
  IndexColumn,
  ValueColumn,
} from "@/components/table/TableColumns";
import { ProductWithStats } from "@/lib/shared";
import { ProductStatsTableMeta } from "./page";
import React from "react";
import { Button } from "@/components/ui/button";
import { NA } from "@/components/shared/misc/Placeholders";
import toEuro from "@/lib/shared/utils/global/string/toEuro";

const columns: ColumnDef<ProductWithStats>[] = [
  IndexColumn({}),

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

  FieldColumn({
    key: "stats.unitsSold",
    header: "Quantitativo",
    sortable: false,
  }),

  ValueColumn({
    header: "Totale",
    sortable: false,
    value: (row) => toEuro(row.original.stats.revenue),
    accessor: (product) => product.stats.revenue,
  }),

  ValueColumn({
    header: "Totale riso",
    sortable: false,
    value: (row) => (row.original.rice != 0 ? formatRice(row.original.stats.totalRice) : <NA />),
    accessor: (product) => product.stats.totalRice,
  }),

  ActionColumn({
    header: "Opzioni",
    action: (row) => <TopOptions product={row.original} />,
    skeleton: <Button variant="outline">Skeleton</Button>,
  }),

  ActionColumn({
    header: "Clienti migliori",
    action: (row, meta) => (
      <TopCustomers
        product={{
          id: row.original.id,
          name: row.original.desc,
          hasTopCustomers: row.original.stats.hasTopCustomers ?? false,
        }}
        filters={(meta as ProductStatsTableMeta).filters}
      />
    ),
    skeleton: <Button variant="outline">Skeleton</Button>,
  }),
];

export default columns;
