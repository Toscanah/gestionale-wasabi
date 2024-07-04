import { ColumnDef, Table } from "@tanstack/react-table";
import { TypeOfOrder, TypesOfOrder } from "../types/TypesOfOrder";
import { format } from "date-fns";
import { OrderType } from "../types/OrderType";
import { it } from "date-fns/locale";

type CreateColumnParams = {
  accessorKey: string;
  headerLabel?: string;
  cellContent?: (row: OrderType, table?: Table<OrderType>) => React.ReactNode;
};

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((value, key) => value && value[key], obj);
}

function createColumn({
  accessorKey,
  headerLabel,
  cellContent,
}: CreateColumnParams): ColumnDef<OrderType> {
  return {
    accessorKey,
    header: headerLabel,
    cell: ({ row, table }) =>
      cellContent
        ? cellContent(row.original, table)
        : String(getNestedValue(row.original, accessorKey)),
  };
}

export default function getColumns(type: TypesOfOrder): ColumnDef<OrderType>[] {
  const columns: ColumnDef<OrderType>[] = [
    // createColumn({
    //   accessorKey: "#",
    //   cellContent: (row, table) => {
    //     if (table) {
    //       const index =
    //         table
    //           .getSortedRowModel()
    //           ?.flatRows?.findIndex(
    //             (flatRow) => flatRow.id === String(row.id)
    //           ) || 0;
    //       return index + 2;
    //     } else {
    //       return "";
    //     }
    //   },
    // }),

    createColumn({
      accessorKey: "created_at",
      headerLabel: "Ora",
      cellContent: (row) => {
        return format(new Date(row.created_at), "HH:mm", { locale: it });
      },
    }),

    createColumn({
      /**
       * problema: quando una persona crea l'ordine per asporto (prende il cibo e se ne va)
       * l'ordine è effettivamente collegato ad un cliente, oppure l'ordine è semplicemente un ordine e basta
       * cliente collegato si o no?
       */
      accessorKey: type === TypesOfOrder.TABLE ? "table.name" : "customer.surname",
      headerLabel: type === TypesOfOrder.TABLE ? "Tavolo" : "Cliente",
    }),
  ];

  switch (type) {
    case TypesOfOrder.TO_HOME: {
      columns.push(
        createColumn({
          accessorKey: "address.street",
          headerLabel: "Indirizzo",
          cellContent: (row) => {
            return row.address?.street + " " + row.address?.civic;
          },
        })
      );
      break;
    }
    case TypesOfOrder.PICK_UP:
      columns.push(
        createColumn({
          accessorKey: "when",
          headerLabel: "Quando",
        })
      );
  }

  columns.push(
    createColumn({
      accessorKey: "total",
      headerLabel: "Totale",
      cellContent: (row) => {
        return "€ " + row.total;
      },
    })
  );

  return columns;
}
