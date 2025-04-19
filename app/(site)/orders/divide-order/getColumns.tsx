import { ColumnDef } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";
import TableColumn from "../../components/table/TableColumn";
import { ProductInOrder } from "@shared"
;
import { OrderType } from "@prisma/client";
import { getProductPrice } from "../../lib/product-management/getProductPrice";
import joinItemsWithComma from "../../lib/formatting-parsing/joinItemsWithComma";

export default function getColumns(type: OrderType): ColumnDef<ProductInOrder>[] {
  return [
    TableColumn<ProductInOrder>({
      accessorKey: "product.code",
      header: "Codice",
    }),

    TableColumn<ProductInOrder>({
      accessorKey: "quantity",
      header: "Quantità",
    }),

    TableColumn<ProductInOrder>({
      header: "Descrizione",
      cellContent: (row) => (
        <div className="flex items-center justify-start overflow-hidden text-ellipsis w-full text-2xl">
          {row.original.product?.desc}
        </div>
      ),
    }),

    TableColumn({
      joinOptions: {
        key: "options",
        wrapper: ({ children }) => (
          <div className="space-y-2 max-h-20 overflow-auto">{children}</div>
        ),
      },
    }),

    TableColumn<ProductInOrder>({
      header: "Unità",
      cellContent: (row) => (
        <>
          {row.original.product?.home_price == 0 && row.original.product.site_price == 0
            ? ""
            : `€ ${getProductPrice(row.original, type)}`}
        </>
      ),
    }),

    // TableColumn<ProductInOrder>({
    //   accessorKey: "total",
    //   header: "Totale",
    //   cellContent: (row) => (row.original.total == 0 ? "" : `€ ${row.original.total}`),
    // }),

    // TableColumn<ProductInOrder>({
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
