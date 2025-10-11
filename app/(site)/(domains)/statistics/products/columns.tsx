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
    header: "Altro",
    action: (row, meta) => (
      <div className="flex items-center gap-2">
        {row.original.stats.options.length > 0 && <TopOptions product={row.original} />}
        <TopCustomers
          product={{ id: row.original.id, name: row.original.desc }}
          filters={(meta as ProductStatsTableMeta).filters}
        />
      </div>
    ),
    skeleton: (
      <div className="flex items-center gap-2">
        <Button variant="outline">Skeleton</Button>
      </div>
    ),
  }),
];

export default columns;
