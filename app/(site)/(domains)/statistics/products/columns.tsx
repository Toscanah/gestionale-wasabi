import { ColumnDef } from "@tanstack/react-table";
import { ProductWithStats } from "../../../lib/shared/types/product-with-stats";
import formatRice from "../../../lib/utils/domains/rice/formatRice";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import WasabiDialog from "../../../components/ui/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
import TopOptions from "./dialogs/TopOptions";
import TopCustomers from "./dialogs/TopCustomers";
import { ActionColumn, FieldColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";

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
    accessor: (product) => product.total,
  }),

  ValueColumn({
    header: "Totale riso",
    value: (row) =>
      row.original.rice > 0 ? formatRice(row.original.quantity * row.original.rice) : "",
    accessor: (product) => (product.rice > 0 ? formatRice(product.quantity * product.rice) : 0),
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
