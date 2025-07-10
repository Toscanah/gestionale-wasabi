import { AnyOrder, ProductInOrder } from "@/app/(site)/lib/shared"
;
import { ExtraItems } from "../../../orders/single-order/overview/ExtraItems";

const computeItemsByKey = (key: ExtraItems, products: ProductInOrder[]) =>
  products
    .filter((p) => p.id !== -1)
    .reduce((sum, p) => sum + (p.product[key] || 0) * p.quantity, 0);

export default function calculateExtraItems(order: AnyOrder) {
  const soupsFromProducts = computeItemsByKey("soups", order.products);
  const saladsFromProducts = computeItemsByKey("salads", order.products);
  const ricesFromProducts = computeItemsByKey("rices", order.products);

  const soupsFromOrder = order.soups ?? 0;
  const saladsFromOrder = order.salads ?? 0;
  const ricesFromOrder = order.rices ?? 0;

  const soupsFinal = order.soups !== null ? order.soups : soupsFromProducts;
  const saladsFinal = order.salads !== null ? order.salads : saladsFromProducts;
  const ricesFinal = order.rices !== null ? order.rices : ricesFromProducts;

  return {
    soupsFromProducts,
    saladsFromProducts,
    ricesFromProducts,
    /** */
    soupsFromOrder,
    saladsFromOrder,
    ricesFromOrder,
    /** */
    soupsFinal,
    saladsFinal,
    ricesFinal,
  };
}
