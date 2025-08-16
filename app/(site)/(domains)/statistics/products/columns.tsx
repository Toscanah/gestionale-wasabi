import { ColumnDef } from "@tanstack/react-table";
import { ProductWithStats } from "../../../lib/shared/types/ProductWithStats";
import formatRice from "../../../lib/formatting-parsing/formatRice";
import roundToTwo from "../../../lib/formatting-parsing/roundToTwo";
import DialogWrapper from "../../../components/ui/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import TopOptions from "./dialogs/TopOptions";
import TopCustomers from "./dialogs/TopCustomers";
import { ActionColumn, FieldColumn, ValueColumn } from "@/app/(site)/components/table/tableColumns";

const columns: ColumnDef<ProductWithStats>[] = [
  FieldColumn({
    key: "code",
    header: "Codice",
  }),

  FieldColumn({
    key: "desc",
    header: "Descrizione",
  }),

  FieldColumn({
    key: "quantity",
    header: "Quantitativo",
  }),

  ValueColumn({
    header: "Totale",
    value: (row) => "€ " + roundToTwo(row.original.total),
    accessor: (stats) => stats.total,
  }),

  ValueColumn({
    header: "Totale riso",
    value: (row) => formatRice(row.original.quantity * row.original.rice),
    accessor: (stats) => formatRice(stats.quantity * stats.rice),
  }),

  ActionColumn({
    header: "Altro",
    action: (row) => (
      <div className="flex items-center gap-2">
        {(row.original.category?.options || []).length > 0 && <TopOptions product={row.original} />}
        <TopCustomers product={{ id: row.original.id, name: row.original.desc }} />
      </div>
    ),
  }),
];

export default columns;
