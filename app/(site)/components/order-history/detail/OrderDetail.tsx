import { ProductInOrder } from "@/app/(site)/lib/shared";
import useTable from "../../../hooks/table/useTable";
import productColumns from "../common/productColumns";
import Table from "../../table/Table";
import { TableMeta } from "@tanstack/react-table";

interface OrderDetailProps {
  sortedProducts: ProductInOrder[];
  onCreate?: (newProducts: ProductInOrder[]) => void;
  onCheckboxChange: (product: ProductInOrder) => void;
  selectedProducts: ProductInOrder[];
}

export type OrderDetailTableMeta = {
  selectedProducts: ProductInOrder[];
  onCheckboxChange: (product: ProductInOrder) => void;
} & TableMeta<any>;

export default function OrderDetail({
  sortedProducts,
  onCreate,
  onCheckboxChange,
  selectedProducts,
}: OrderDetailProps) {
  const table = useTable<(typeof sortedProducts)[number], OrderDetailTableMeta>({
    columns: productColumns(!!onCreate),
    data: sortedProducts,
    meta: { selectedProducts, onCheckboxChange },
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
