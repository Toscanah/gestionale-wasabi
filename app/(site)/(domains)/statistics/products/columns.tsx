import { ColumnDef } from "@tanstack/react-table";
import formatRice from "../../../lib/utils/domains/rice/formatRice";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import TopOptions from "./dialogs/TopOptions";
import TopCustomers from "./dialogs/TopCustomers";
import {
  ActionColumn,
  FieldColumn,
  IndexColumn,
  ValueColumn,
} from "@/app/(site)/components/table/TableColumns";
import { ProductWithStats } from "@/app/(site)/lib/shared";
import { ProductStatsTableMeta } from "./page";
import React from "react";
import { Button } from "@/components/ui/button";

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
    value: (row) => "€ " + roundToTwo(row.original.stats.revenue),
    accessor: (product) => product.stats.revenue,
  }),

  ValueColumn({
    header: "Totale riso",
    sortable: false,
    value: (row) => formatRice(row.original.stats.totalRice),
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
