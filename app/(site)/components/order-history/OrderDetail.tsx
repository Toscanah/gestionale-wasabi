import { Checkbox } from "@/components/ui/checkbox";
import { ProductInOrder } from "@/app/(site)/models";
import { getProductPrice } from "../../util/functions/getProductPrice";
import { OrderType } from "@prisma/client";
import formatAmount from "../../util/functions/formatAmount";

interface OrderDetailProps {
  sortedProducts: ProductInOrder[];
  type: string;
  onCreate?: (newProducts: ProductInOrder[]) => void;
  onCheckboxChange: (product: ProductInOrder) => void;
}

export default function OrderDetail({
  sortedProducts,
  type,
  onCreate,
  onCheckboxChange,
}: OrderDetailProps) {
  return sortedProducts.length > 0 ? (
    <ul className="list-disc list-inside">
      {sortedProducts.map((product) => (
        <li key={product.id} className="text-xl flex justify-between items-center">
          <span className="flex items-center gap-2 ">
            {onCreate && (
              <Checkbox
                defaultChecked={true}
                onCheckedChange={() => onCheckboxChange(product)}
              />
            )}
            {product.quantity} x <b>{product.product.desc}</b>
            {product.options.length > 0 && (
              <span>
                {" "}
                ({product.options.map((option) => option.option.option_name).join(", ")})
              </span>
            )}
          </span>
          <span className="font-semibold">
            {`€ ${formatAmount(
              product.quantity *
                getProductPrice(product, type === "Domicilio" ? OrderType.HOME : OrderType.TABLE)
            )}`}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-xl">Nessun prodotto in questo ordine</p>
  );
}
