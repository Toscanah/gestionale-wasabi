import { AnyOrder } from "@/app/(site)/lib/shared";
import generateDummyProduct from "../../lib/services/product-management/generateDummyProduct";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { toastSuccess } from "../../lib/utils/global/toast";
import { RecursivePartial } from "./useOrderManager";
import { ProductInOrderStatus } from "@prisma/client";
import useProductCrud from "./products/useProductCrud";
import useProductMods from "./products/useProductMods";
import useProductPrinting from "./products/useProductPrinting";
import useProductExtras from "./products/useProductExtras";

export type UpdateProductsListFunction = (params: {
  addedProducts?: ProductInOrder[];
  updatedProducts?: ProductInOrder[];
  deletedProducts?: ProductInOrder[];
  isDummyUpdate?: boolean;
  toast?: boolean;
  updateFlag?: boolean;
}) => void;

export function useProductsManager(
  order: AnyOrder,
  updateOrder: (order: RecursivePartial<AnyOrder>) => void
) {
  const updateProductsList: UpdateProductsListFunction = ({
    addedProducts = [],
    updatedProducts = [],
    deletedProducts = [],
    isDummyUpdate = false,
    toast = true,
    updateFlag = true,
  }) => {
    if (isDummyUpdate) return;

    const updatedProductsList = order.products
      .filter(
        (product) =>
          !deletedProducts.some((deleted) => deleted.id === product.id) &&
          product.status !== ProductInOrderStatus.DELETED_COOKED &&
          product.status !== ProductInOrderStatus.DELETED_UNCOOKED
      )
      .filter((product) => product.id !== -1)
      .map((product) => {
        const update = updatedProducts.find((p) => p.id === product.id);
        return update ? { ...product, ...update } : product;
      });

    const finalProducts = [...updatedProductsList, ...addedProducts, generateDummyProduct()];

    const extraUpdates = extras.computeAndUpdateExtras(finalProducts);

    updateOrder({
      products: finalProducts,
      ...extraUpdates,
      is_receipt_printed: updateFlag ? false : undefined,
    });

    if (toast) toastSuccess("Prodotti aggiornati correttamente");
  };

  const crud = useProductCrud({ order, updateProductsList });
  const mods = useProductMods({ order, updateProductsList });
  const printing = useProductPrinting({ order, updateProductsList });
  const extras = useProductExtras({ order });

  return {
    ...crud,
    ...mods,
    ...printing,
  };
}
