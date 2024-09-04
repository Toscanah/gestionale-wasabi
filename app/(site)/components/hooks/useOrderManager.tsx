import { Dispatch, SetStateAction } from "react";
import { AnyOrder, HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import createDummyProduct from "../../util/functions/createDummyProduct";
import { OrderType } from "../../types/OrderType";
import { useProductManager } from "./useProductManager";
import updateProduct from "../../sql/products/updateProduct";
import { useWasabiContext } from "../../context/WasabiContext";

export function useOrderManager(
  order: AnyOrder,
  setOrder?: Dispatch<SetStateAction<AnyOrder | undefined>>
) {
  const { onOrdersUpdate } = useWasabiContext();
  const { updateProductsList } = useProductManager(order);

  const copyFromOrder = (orderToCopy: HomeOrder | PickupOrder) => {
    fetchRequest<ProductInOrderType[]>("POST", "/api/products/", "copyFromOrder", orderToCopy).then(
      (newProducts) => {
        if (newProducts) {
          updateProductsList({ newProducts });
        }
      }
    );
  };

  const updateOrder = (updatedProducts: ProductInOrderType[]) => {
    setOrder?.((prevOrder) => {
      if (!prevOrder) return prevOrder;

      return {
        ...prevOrder,
        products: updatedProducts,
        total: calculateTotal(updatedProducts),
      };
    });

    onOrdersUpdate(order.type as OrderType);
  };

  const calculateTotal = (products: ProductInOrderType[]) => {
    return products.reduce((acc, product) => {
      const productPrice =
        order.type === OrderType.TO_HOME ? product.product.home_price : product.product.site_price;
      return acc + product.quantity * productPrice;
    }, 0);
  };

  return { copyFromOrder, updateOrder };
}
