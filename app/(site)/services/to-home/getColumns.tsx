import { Button } from "@/components/ui/button";
import { OrderType } from "../../types/OrderType";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { addDays, format, subDays, subHours } from "date-fns";
import { it } from "date-fns/locale";
import { ProductsInOrderType } from "../../types/ProductsInOrderType";

type CreateColumnParams = {
  accessorKey: keyof OrderType | string; // Allow string for nested properties
  headerLabel: string;
  cellContent?: (row: any) => React.ReactNode; // Optional cell renderer
};

function getProperty(obj: any, path: string): any {
  return path
    .split(".")
    .reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
}

function createColumn({
  accessorKey,
  headerLabel,
  cellContent,
}: CreateColumnParams): ColumnDef<OrderType> {
  return {
    accessorKey,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {headerLabel}
        <ArrowsDownUp className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      cellContent
        ? cellContent(row.original)
        : getProperty(row.original, accessorKey.toString())?.toString(),
  };
}

export default function getColumns(): ColumnDef<OrderType>[] {
  return [
    createColumn({
      accessorKey: "created_at",
      headerLabel: "Ora",
      cellContent: (original) => {
        const date = new Date(original.created_at ?? new Date());

        return (
          <div className="flex items-center gap-x-2">
            {format(subHours(date, 2), "HH:mm", { locale: it })}
          </div>
        );
      },
    }),

    // createColumn({
    //   accessorKey: "type",
    //   headerLabel: "Tipo",
    //   cellContent: (original) => {
    //     switch (original.type) {
    //       case "TABLE":
    //         return "Tavolo";
    //       case "PICK_UP":
    //         return "Domicilio";
    //       case "TO_HOME":
    //         return "Domicilio";
    //       default:
    //         return "Boh";
    //     }
    //   },
    // }),

    createColumn({
      accessorKey: "address",
      headerLabel: "Indirizzo",
      cellContent: (original) => {
        return (
          <div className="flex items-center">
            {!original.table
              ? `${original.address?.street}, ${original.address?.civic}, 
        ${original.address?.cap}`
              : "-"}
          </div>
        );
      },
    }),

    createColumn({
      accessorKey: "customer",
      headerLabel: "Cliente",
      cellContent: (original) => {
        if (original.customer && original.table) {
          return (
            <div className="flex items-center">{`${original.table.name} (${original.customer.name} ${original.customer.surname})`}</div>
          );
        }
        return (
          <div className="flex items-center">
            {original.customer?.name ??
              original.table?.name ??
              "Error: No Customer or Table"}
          </div>
        );
      },
    }),

    createColumn({
      accessorKey: "total",
      headerLabel: "Totale",
      cellContent: (original: OrderType) => {
        console.log(original);
        return <div className="text-right">{"€ " + original.total}</div>;
      },
    }),
  ];
}
