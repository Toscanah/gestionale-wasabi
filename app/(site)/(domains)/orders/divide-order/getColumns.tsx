import { ColumnDef } from "@tanstack/react-table";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { OrderType } from "@prisma/client";
import { FieldColumn, JoinColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";

export default function getColumns(type: OrderType): ColumnDef<ProductInOrder>[] {
  return [
    FieldColumn<ProductInOrder>({
      key: "product.code",
      header: "Codice",
    }),

    FieldColumn<ProductInOrder>({
      key: "quantity",
      header: "Quantità",
    }),

    ValueColumn<ProductInOrder>({
      header: "Descrizione",
      value: (row) => (
        <div className="flex items-center justify-start overflow-hidden text-ellipsis w-full text-xl">
          {row.original.product?.desc}
        </div>
      ),
      accessor: (pio) => pio.product?.desc,
    }),

    JoinColumn({
      options: {
        key: "options",
        wrapper: ({ children }) => (
          <div className="space-y-2 max-h-20 overflow-auto">{children}</div>
        ),
      },
    }),

    ValueColumn<ProductInOrder>({
      header: "Unità",
      value: (row) => (
        <>
          {row.original.product?.home_price == 0 && row.original.product.site_price == 0
            ? ""
            : `€ ${row.original.frozen_price}`}
        </>
      ),
      accessor: (pio) => pio.frozen_price,
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
