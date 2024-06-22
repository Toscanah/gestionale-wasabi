import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowsDownUp } from "@phosphor-icons/react";

import { ProductsInOrderType } from "../../types/ProductsInOrderType";
import { Input } from "@/components/ui/input";

type CreateColumnParams = {
  accessorKey: keyof ProductsInOrderType | string; // Allow string for nested properties
  headerLabel: string;
  cellContent: (row: Row<ProductsInOrderType>) => React.ReactNode; // Optional cell renderer
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
    cell: ({ row }) => {
      return cellContent(row);
    },
  };
}

export default function getColumns(
  handleFieldChange: (
    key: string,
    value: any,
    id: number,
    rowIndex: number
  ) => void,
  products: ProductsInOrderType[]
): ColumnDef<ProductsInOrderType>[] {
  return [
    createColumn({
      accessorKey: "code",
      headerLabel: "Codice",
      cellContent: (row) => {
        const value = products[row.index].product.code;

        return (
          <Input
            className="h-16 text-4xl uppercase"
            defaultValue={value}
            autoFocus={row.original.id == -1}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleFieldChange(
                  "code",
                  e.target.value.toString(),
                  row.original.id,
                  row.index
                );
              }
            }}
          />
        );
      },
    }),

    createColumn({
      accessorKey: "quantity",
      headerLabel: "Quantità",
      cellContent: (row) => {
        const value =
          products[row.index].quantity == 0
            ? undefined
            : products[row.index].quantity;

        return (
          <Input
            className="h-16 text-4xl"
            defaultValue={value}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleFieldChange(
                  "quantity",
                  e.target.value,
                  row.original.id,
                  row.index
                );
              }
            }}
          />
        );
      },
    }),

    createColumn({
      accessorKey: "desc",
      headerLabel: "Descrizione",
      cellContent: (row) => {
        return (
          <div className="flex items-center justify-start overflow-hidden text-ellipsis max-h-20 w-full text-xl">
            {row.original.product.desc}
          </div>
        );
      },
    }),

    createColumn({
      accessorKey: "price",
      headerLabel: "Unità",
      cellContent: (row) => {
        return (
          <div className="text-4xl">
            {row.original.product.price == 0
              ? ""
              : "€ " + row.original.product.price * 54}
          </div>
        );
      },
    }),

    createColumn({
      accessorKey: "total",
      headerLabel: "Totale",
      cellContent: (row) => {
        return (
          <div className="text-4xl">
            {row.original.total == 0 ? "" : "€ " + row.original.total * 456}
          </div>
        );
      },
    }),
  ];
}
