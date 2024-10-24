import { Checkbox } from "@/components/ui/checkbox";
import { ProductInOrderType } from "../../types/ProductInOrderType";

export default function OrderDetail({
  onCreate,
  handleCheckboxChange,
  sortedProducts,
  type,
}: {
  onCreate?: (newProducts: ProductInOrderType[]) => void;
  handleCheckboxChange: (product: ProductInOrderType) => void;
  sortedProducts: ProductInOrderType[];
  type: string;
}) {
  return sortedProducts.length > 0 ? (
    <ul className="list-disc list-inside">
      {sortedProducts.map((product) => (
        <li key={product.id} className="text-xl flex justify-between items-center">
          <span className="flex items-center gap-2 ">
            {onCreate && (
              <Checkbox
                defaultChecked={true}
                onCheckedChange={() => handleCheckboxChange(product)}
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
            {type === "Domicilio"
              ? `€ ${(product.quantity * product.product.home_price).toFixed(2)}`
              : `€ ${(product.quantity * product.product.site_price).toFixed(2)}`}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-xl">Nessun prodotto in questo ordine</p>
  );
}
