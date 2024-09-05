import { Dispatch, SetStateAction } from "react";
import { AnyOrder, HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "../../types/OrderType";
import { useProductManager } from "./useProductManager";
import { useWasabiContext } from "../../context/WasabiContext";
import { update } from "lodash";

export function useOrderManager(
  order: AnyOrder,
  setOrder?: Dispatch<SetStateAction<AnyOrder | undefined>>
) {
  const { onOrdersUpdate } = useWasabiContext();

  const copyFromOrder = (orderToCopy: HomeOrder | PickupOrder) => {
    fetchRequest<ProductInOrderType[]>("POST", "/api/orders/", "copyFromOrder", {
      sourceOrder: orderToCopy,
      order: order,
    }).then((newProducts) => {
      if (newProducts) {
        updateProductsList({ newProducts });
      }
    });
  };

  const updateOrder = (updatedProducts: ProductInOrderType[]) => {
    onOrdersUpdate(order.type as OrderType);
    setOrder?.((prevOrder) => {
      if (!prevOrder) return prevOrder;

      return {
        ...prevOrder,
        products: updatedProducts,
        total: calculateTotal(updatedProducts),
      };
    });
  };

  const { updateProductsList } = useProductManager(order, updateOrder);

  const calculateTotal = (products: ProductInOrderType[]) => {
    return products.reduce((acc, product) => {
      const productPrice =
        order.type === OrderType.TO_HOME ? product.product.home_price : product.product.site_price;
      return acc + product.quantity * productPrice;
    }, 0);
  };

  return { copyFromOrder, updateOrder };
}
