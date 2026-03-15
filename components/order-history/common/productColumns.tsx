import { ColumnDef } from "@tanstack/react-table";
import { ActionColumn, FieldColumn, JoinColumn, ValueColumn } from "../../table/TableColumns";
import { ProductInOrder } from "@/lib/shared";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderDetailTableMeta } from "../detail/OrderDetail";
import { EnDash } from "@/components/ui/shared/misc/Placeholders";

export default function productColumns(selectable = false): ColumnDef<ProductInOrder>[] {
  const columns: ColumnDef<ProductInOrder>[] = [
    FieldColumn({
      header: "Quantità",
      key: "quantity",
    }),

    FieldColumn({
      header: "Codice",
      key: "product.code",
    }),

    FieldColumn({
      header: "Descrizione",
      key: "product.desc",
    }),

    ValueColumn({
      header: "Variazione",
      value: (row) => row.original.variation || <EnDash />,
      accessor: (row) => row.variation || "",
    }),

    JoinColumn({
      header: "Opzioni",
      options: { key: "options" },
    }),

    // ValueColumn({
    //   header: "Opzioni",
    //   value: (row) =>
    //     row.original.options.length > 0 ? (
    //       <span>({joinItemsWithComma(row.original, "options")})</span>
    //     ) : null,
    //   accessor: (row) => row.options.join(", "),
    // }),
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
      }),
    );
  }

  return columns;
}
