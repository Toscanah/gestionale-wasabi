import { Button } from "@/components/ui/button";
import { OrderType } from "../../types/OrderType";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { addDays, format, subDays, subHours } from "date-fns";
import { it } from "date-fns/locale";
import { Product, ProductsOnOrder } from "@prisma/client";
import { ProductsInOrderType } from "../../types/ProductsInOrderType";

type CreateColumnParams = {
  accessorKey: keyof ProductsInOrderType | string; // Allow string for nested properties
  headerLabel: string;
  cellContent?: (row: ProductsInOrderType) => React.ReactNode; // Optional cell renderer
};

function createColumn({
  accessorKey,
  headerLabel,
  cellContent,
}: CreateColumnParams): ColumnDef<ProductsInOrderType> {
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
    cell: ({ row }) => (cellContent ? cellContent(row.original) : row.original),
  };
}

export default function getColumns(): ColumnDef<ProductsInOrderType>[] {
  return [
    createColumn({
      accessorKey: "code",
      headerLabel: "Codice",
      cellContent: (original) => {
        return <div className="text-left">{original.product.code}</div>;
      },
    }),

    createColumn({
      accessorKey: "quantity",
      headerLabel: "Quantità",
      cellContent: (original) => {
        return <div className="">{original.quantity}</div>;
      },
    }),

    createColumn({
      accessorKey: "desc",
      headerLabel: "Descrizione",
      cellContent: (original) => {
        return <div className="">{original.product.desc}</div>;
      },
    }),

    createColumn({
      accessorKey: "price",
      headerLabel: "Unità",
      cellContent: (original) => {
        return <div className="">{original.product.price}</div>;
      },
    }),

    createColumn({
      accessorKey: "pricce",
      headerLabel: "Unità",
      cellContent: (original) => {
        return <div className="">{original.product.price}</div>;
      },
    }),

    createColumn({
      accessorKey: "pricce",
      headerLabel: "Totale",
      cellContent: (original) => {
        return (
          <div className="">{original.product.price * original.quantity}</div>
        );
      },
    }),
  ];
}
