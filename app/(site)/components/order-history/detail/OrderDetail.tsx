import { Checkbox } from "@/components/ui/checkbox";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import joinItemsWithComma from "../../../lib/utils/global/string/joinItemsWithComma";
import ProductLine from "../common/ProductLine";
import getTable from "../../../lib/utils/global/getTable";
import productColumns from "../common/productColumns";
import Table from "../../table/Table";

interface OrderDetailProps {
  sortedProducts: ProductInOrder[];
  type: string;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  onCheckboxChange: (product: ProductInOrder) => void;
  selectedProducts: ProductInOrder[];
}

export type OrderDetailTableMeta = {
  selectedProducts: ProductInOrder[];
  onCheckboxChange: (product: ProductInOrder) => void;
};

export default function OrderDetail({
  sortedProducts,
  type,
  onCreate,
  onCheckboxChange,
  selectedProducts,
}: OrderDetailProps) {
  console.log(!!onCreate);

  const table = getTable({
    columns: productColumns(!!onCreate),
    data: sortedProducts,
    meta: { selectedProducts, onCheckboxChange } as OrderDetailTableMeta,
  });

  return sortedProducts.length > 0 ? (
    <Table
      table={table}
      cellClassName={(index) => (index == 0 && onCreate ? "p-0" : "")}
      rowClassName={(row) => {
        const isSelected = selectedProducts.some((p) => p.id === row.original.id);
        return isSelected ? "bg-muted " : "";
      }}
    />
  ) : (
    <p className="text-xl">Nessun prodotto in questo ordine</p>
  );
}
