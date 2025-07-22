import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../../components/table/TableColumn";
import { ProductWithStats } from "../../../lib/shared/types/ProductWithStats";
import formatRice from "../../../lib/formatting-parsing/formatRice";
import roundToTwo from "../../../lib/formatting-parsing/roundToTwo";
import DialogWrapper from "../../../components/ui/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import TopOptions from "./dialogs/TopOptions";
import TopCustomers from "./dialogs/TopCustomers";

const columns: ColumnDef<ProductWithStats>[] = [
  TableColumn({
    accessorKey: "code",
    header: "Codice",
  }),

  TableColumn({
    accessorKey: "desc",
    header: "Descrizione",
  }),

  TableColumn({
    accessorKey: "quantity",
    header: "Quantitativo",
  }),

  TableColumn({
    header: "Totale",
    cellContent: (row) => "€ " + roundToTwo(row.original.total),
  }),

  TableColumn({
    header: "Totale riso",
    cellContent: (row) => formatRice(row.original.quantity * row.original.rice),
  }),

  TableColumn({
    header: "Altro",
    sortable: false,
    cellContent: (row) => (
      <div className="flex items-center gap-2">
        {(row.original.category?.options || []).length > 0 && <TopOptions product={row.original} />}
        <TopCustomers product={{ id: row.original.id, name: row.original.desc }} />
      </div>
    ),
  }),
];

export default columns;
