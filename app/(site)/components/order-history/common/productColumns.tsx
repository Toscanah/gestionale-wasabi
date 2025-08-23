import { ColumnDef } from "@tanstack/react-table";
import { CustomerOrdersStats } from "../../../hooks/order/history/useHistoryStats";
import { ActionColumn, FieldColumn, IndexColumn, ValueColumn } from "../../table/TableColumns";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import joinItemsWithComma from "@/app/(site)/lib/utils/global/string/joinItemsWithComma";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderDetailTableMeta } from "../detail/OrderDetail";

export default function productColumns(selectable = false): ColumnDef<ProductInOrder>[] {
  const columns: ColumnDef<ProductInOrder>[] = [
    FieldColumn({
      header: "Quantità",
      key: "quantity",
    }),

    FieldColumn({
      header: "Descrizione",
      key: "product.desc",
    }),

    FieldColumn({
      header: "Variazione",
      key: "variation",
    }),

    ValueColumn({
      header: "Opzioni",
      value: (row) =>
        row.original.options.length > 0 ? (
          <span>({joinItemsWithComma(row.original, "options")})</span>
        ) : null,
      accessor: (row) => row.options.join(", "),
    }),
  ];

  if (selectable) {
    columns.splice(
      0,
      0,
      ActionColumn({
        header: "Seleziona",
        action: (row, meta) => {
          const { selectedProducts, onCheckboxChange } = meta as OrderDetailTableMeta;
          return (
            <div className="flex items-center justify-center h-full">
              <Checkbox
                checked={selectedProducts.some((p) => p.id === row.original.id)}
                onCheckedChange={() => onCheckboxChange(row.original)}
              />
            </div>
          );
        },
      })
    );
  }

  return columns;
}
