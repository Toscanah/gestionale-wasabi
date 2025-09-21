import { ColumnDef } from "@tanstack/react-table";
import formatRice from "../../../lib/utils/domains/rice/formatRice";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import WasabiDialog from "../../../components/ui/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
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

const columns: ColumnDef<ProductWithStats>[] = [
  IndexColumn({}),

  FieldColumn({
    key: "code",
    header: "Codice",
  }),

  FieldColumn({
    key: "desc",
    header: "Descrizione",
  }),

  FieldColumn({
    key: "stats.unitsSold",
    header: "Quantitativo",
  }),

  ValueColumn({
    header: "Totale",
    value: (row) => "€ " + roundToTwo(row.original.stats.revenue),
    accessor: (product) => product.stats.revenue,
  }),

  ValueColumn({
    header: "Totale riso",
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
  }),
];

export default columns;
