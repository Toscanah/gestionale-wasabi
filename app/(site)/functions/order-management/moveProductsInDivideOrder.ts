import { Dispatch, SetStateAction } from "react";
import { ProductInOrder } from "../../models";
import { getProductPrice } from "../product-management/getProductPrice";
import { OrderType } from "@prisma/client";

export default function moveProductsInDivideOrder(
  product: ProductInOrder,
  source: ProductInOrder[],
  setSource: Dispatch<SetStateAction<ProductInOrder[]>>,
  target: ProductInOrder[],
  setTarget: Dispatch<SetStateAction<ProductInOrder[]>>,
  orderType: OrderType
) {
  const sourceCopy = source.map((p) => ({ ...p }));
  const targetCopy = target.map((p) => ({ ...p }));

  const sourceProduct = sourceCopy.find((p) => p.id === product.id);
  if (sourceProduct) {
    if (sourceProduct.quantity > 1) {
      sourceProduct.quantity -= 1;
    } else {
      const index = sourceCopy.findIndex((p) => p.id === product.id);
      sourceCopy.splice(index, 1);
    }
    sourceProduct.total = sourceProduct.quantity * getProductPrice(sourceProduct, orderType);
  }

  const targetProduct = targetCopy.find((p) => p.id === product.id);
  if (targetProduct) {
    targetProduct.quantity += 1;
    targetProduct.total = targetProduct.quantity * getProductPrice(targetProduct, orderType);
  } else {
    targetCopy.push({ ...product, quantity: 1, total: getProductPrice(product, orderType) });
  }

  setSource(sourceCopy);
  setTarget(targetCopy);
}
