import { ColumnDef } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import TableColumn from "../../components/table/TableColumn";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "../../types/OrderType";
import { getProductPrice } from "../../util/functions/getProductPrice";

export default function getColumns(type: OrderType): ColumnDef<ProductInOrderType>[] {
  return [
    TableColumn<ProductInOrderType>({
      accessorKey: "product.code",
      header: "Codice",
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "quantity",
      header: "Quantità",
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "desc",
      header: "Descrizione",
      cellContent: (row) => (
        <div className="flex items-center justify-start overflow-hidden text-ellipsis w-full text-2xl">
          {row.original.product?.desc}
        </div>
      ),
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "options",
      header: "Opzioni",
      cellContent: (row) => {
        if (row.original.product_id == -1) {
          return <></>;
        }

        const avalOptions = row.original.product?.category?.options ?? [];
        const selectedOptions = row.original.options?.map((el) => el.option.id) ?? [];

        return (
          <div className="space-y-2 max-h-20 overflow-auto">
            {avalOptions &&
              avalOptions.map((option) => (
                <div key={option.option.id} className="flex items-center space-x-2">
                  <Checkbox
                    disabled
                    defaultChecked={selectedOptions.includes(option.option.id)}
                    id={`option-${option.option.id}`}
                  />
                  <Label
                    htmlFor={`option-${option.option.id}`}
                    className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.option.option_name}
                  </Label>
                </div>
              ))}
          </div>
        );
      },
    }),

    TableColumn<ProductInOrderType>({
      accessorKey: "price",
      header: "Unità",
      cellContent: (row) => (
        <>
          {row.original.product?.home_price == 0 && row.original.product.site_price == 0
            ? ""
            : `€ ${getProductPrice(row.original, type)}`}
        </>
      ),
    }),

    // TableColumn<ProductInOrderType>({
    //   accessorKey: "total",
    //   header: "Totale",
    //   cellContent: (row) => (row.original.total == 0 ? "" : `€ ${row.original.total}`),
    // }),

    // TableColumn<ProductInOrderType>({
    //   accessorKey: "select",
    //   header: "Seleziona",
    //   sortable: false,
    //   cellContent: (row) =>
    //     row.original.product_id !== -1 && (
    //       <div className="flex justify-center items-center">
    //         <Checkbox
    //           className="h-6 w-6"
    //           checked={row.getIsSelected()}
    //           onCheckedChange={(value) => row.toggleSelected(!!value)}
    //           aria-label="Select row"
    //         />
    //       </div>
    //     ),
    // }),
  ];
}
