import { Dispatch, SetStateAction } from "react";
import { ProductInOrder } from "@/lib/shared";

export default function moveProductsInDivideOrder(
  product: ProductInOrder,
  source: ProductInOrder[],
  setSource: Dispatch<SetStateAction<ProductInOrder[]>>,
  target: ProductInOrder[],
  setTarget: Dispatch<SetStateAction<ProductInOrder[]>>
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
  }

  const targetProduct = targetCopy.find((p) => p.id === product.id);
  if (targetProduct) {
    targetProduct.quantity += 1;
  } else {
    targetCopy.push({ ...product, quantity: 1 });
  }

  setSource(sourceCopy);
  setTarget(targetCopy);
}
