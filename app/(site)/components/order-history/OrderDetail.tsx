import { Checkbox } from "@/components/ui/checkbox";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import roundToTwo from "../../lib/utils/global/number/roundToTwo";
import joinItemsWithComma from "../../lib/utils/global/string/joinItemsWithComma";

interface OrderDetailProps {
  sortedProducts: ProductInOrder[];
  type: string;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  onCheckboxChange: (product: ProductInOrder) => void;
  selectedProducts: ProductInOrder[];
}

export default function OrderDetail({
  sortedProducts,
  type,
  onCreate,
  onCheckboxChange,
  selectedProducts,
}: OrderDetailProps) {
  return sortedProducts.length > 0 ? (
    <ul className="list-disc list-inside">
      {sortedProducts.map((product) => (
        <li key={product.id} className="text-xl flex justify-between items-center">
          <span className="flex items-center gap-2 ">
            {onCreate && (
              <Checkbox
                checked={selectedProducts.some((p) => p.id === product.id)}
                onCheckedChange={() => onCheckboxChange(product)}
              />
            )}
            {product.quantity} x <b>{product.product.desc}</b>
            {product.options.length > 0 && <span>({joinItemsWithComma(product, "options")})</span>}
          </span>
          <span className="font-semibold">
            {`€ ${roundToTwo(product.quantity * product.frozen_price)}`}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-xl">Nessun prodotto in questo ordine</p>
  );
}
