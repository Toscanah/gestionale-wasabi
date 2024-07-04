import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowsDownUp } from "@phosphor-icons/react";

import { ProductsInOrderType } from "../../types/ProductsInOrderType";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

type CreateColumnParams = {
  accessorKey: keyof ProductsInOrderType | string;
  headerLabel: string;
  cellContent: (row: Row<ProductsInOrderType>, refs: any) => React.ReactNode;
};

function createColumn({
  accessorKey,
  headerLabel,
  cellContent,
}: CreateColumnParams): ColumnDef<ProductsInOrderType> {
  return {
    accessorKey,
    header: ({ column }) => (
      // <Button
      //   variant="secondary"
      //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      // >

      <>{headerLabel}</>
    ),

    //   <ArrowsDownUp className="ml-2 h-4 w-4" />
    // </Button>
    cell: ({ row, column }) => {
      return cellContent(row, column);
    },
  };
}

export default function getColumns(
  handleFieldChange: (key: string, value: any, index: number) => void,
): ColumnDef<ProductsInOrderType>[] {
  const columns = [
    createColumn({
      accessorKey: "code",
      headerLabel: "Codice",
      cellContent: (row) => {
        console.log(row.original)
        return (
          <Input
            ref={(ref) => setInputRef(ref, row.index, 0)}
            className="max-w-28 text-2xl"
            autoFocus={row.original.product_id == -1}
            defaultValue={row.original.product?.code ?? ""}
            disabled={row.original.id !== -1}
            onKeyDown={(e: any) => {
              handleFocus(e, row.index, 0);
              if (e.key === "Enter") {
                handleFieldChange("code", e.target.value, row.index);
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
        return (
          <Input
            ref={(ref) => setInputRef(ref, row.index, 1)}
            type="number"
            className="max-w-20 text-2xl"
            defaultValue={
              row.original.quantity == 0
                ? 1
                : (row.original.quantity as number)
            }
            onKeyDown={(e: any) => {
              handleFocus(e, row.index, 1);
              if (e.key === "Enter") {
                handleFieldChange("quantity", e.target.value, row.index);
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
          <div className="flex items-center justify-start overflow-hidden text-ellipsis w-full text-2xl">
            {row.original.product?.desc}
          </div>
        );
      },
    }),

    createColumn({
      accessorKey: "price",
      headerLabel: "Unità",
      cellContent: (row) => {
        return (
          <>
            {row.original.product?.price == 0
              ? ""
              : "€ " + row.original.product?.price}
          </>
        );
      },
    }),

    createColumn({
      accessorKey: "total",
      headerLabel: "Totale",
      cellContent: (row) => {
        return row.original.total == 0 ? "" : "€ " + row.original.total;
      },
    }),
  ];

  const inputRefs = useRef(new Map<string, HTMLInputElement | null>()).current;

  const handleFocus = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();

      if (colIndex === 1) {
        moveToInput(rowIndex + 1, 0); // vai alla riga dopo, all'inizio
      } else {
        moveToInput(rowIndex, colIndex + 1);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveToInput(rowIndex + 1, colIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveToInput(rowIndex - 1, colIndex);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (colIndex === 0) {
        moveToInput(rowIndex - 1, 1); // vai alla riga prima, alla fine
      } else {
        moveToInput(rowIndex, colIndex - 1);
      }
    }
  };

  const moveToInput = (rowIndex: number, colIndex: number) => {
    inputRefs.get(`${rowIndex}-${colIndex}`)?.focus();
  };

  const setInputRef = (ref: any, rowIndex: number, colIndex: number) => {
    if (ref) {
      inputRefs.set(`${rowIndex}-${colIndex}`, ref);
    }
  };

  return columns;
}
