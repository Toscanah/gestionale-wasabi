import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithDetails, CustomerWithMarketing } from "../models";
import TableColumn from "../components/table/TableColumn";
import joinItemsWithComma from "../functions/formatting-parsing/joinItemsWithComma";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";

export default function columns(isRightTable: boolean): ColumnDef<CustomerWithMarketing>[] {
  const columns: ColumnDef<CustomerWithMarketing>[] = [
    TableColumn({
      accessorKey: "who",
      header: "Chi",
      cellContent: (row) => {
        const name = row.original.name?.trim();
        const surname = row.original.surname?.trim();

        if (name && surname) {
          return `${name} ${surname}`;
        } else if (name) {
          return name;
        } else if (surname) {
          return surname;
        } else {
          return "";
        }
      },
      sortable: false,
    }),

    TableColumn({
      accessorKey: "phone",
      header: "Telefono",
      cellContent: (row) => row.original.phone?.phone || "",
      sortable: false,
    }),

    TableColumn({
      accessorKey: "email",
      header: "Email",
      sortable: false,
    }),

    TableColumn({
      accessorKey: "addresses",
      header: "Indirizzi",
      cellContent: (row) => joinItemsWithComma(row.original, "addresses"),
      sortable: false,
    }),
  ];

  if (isRightTable) {
    columns.push(
      TableColumn({
        accessorKey: "marketing",
        header: "Conteggio",
        cellContent: (row) => row.original.marketings.length,
      }),
      TableColumn({
        accessorKey: "marketing",
        header: "Vecchie azioni",
        cellContent: (row) => (
          <DialogWrapper trigger={<Button>Vedi</Button>}>
            <div className="max-h-60 overflow-y-auto p-4">
              {row.original.marketings.length > 0 ? (
                row.original.marketings.map((marketing) => (
                  <div key={marketing.id} className="p-2 border-b">
                    <p className="font-bold">{marketing.marketing.label}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(marketing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nessuna azione precedente</p>
              )}
            </div>
          </DialogWrapper>
        ),
      })
    );
  }

  return columns;
}
