import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { ProductWithStats } from "../../types/ProductWithStats";
import formatRice from "../../functions/formatting-parsing/formatRice";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";

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
    cellContent: (row) =>
      (row.original.category?.options || []).length > 0 && (
        <DialogWrapper
          size="small"
          trigger={<Button variant="default">Vedi opzioni usate</Button>}
          title="Opzioni più utilizzate"
          putSeparator
        >
          <div className="space-y-2">
            {row.original.optionsRank.length > 0 ? (
              <ul className="list-decimal list-inside">
                {row.original.optionsRank.map((option, index) => (
                  <li key={index} className="text-lg">
                    <span>{option.option}</span> ({option.count} volte)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex w-full justify-center items-center text-lg text-gray-500">
                Nessuna opzione utilizzata per questo prodotto
              </p>
            )}
          </div>
        </DialogWrapper>
      ),
  }),
];

export default columns;
