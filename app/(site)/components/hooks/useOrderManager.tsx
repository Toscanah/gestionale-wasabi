import { Dispatch, SetStateAction } from "react";
import { AnyOrder, HomeOrder, PickupOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "../../types/OrderType";
import { useProductManager } from "./useProductManager";
import { useWasabiContext } from "../../context/WasabiContext";

export function useOrderManager(
  order: AnyOrder,
  setOrder?: Dispatch<SetStateAction<AnyOrder | undefined>>
) {
  const { onOrdersUpdate } = useWasabiContext();

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

  const cancelOrder = () => {
    fetchRequest("POST", "/api/orders/", "cancelOrder", { orderId: order.id }).then(() =>
      onOrdersUpdate(order.type as OrderType)
    );
  };

  const calculateTotal = (products: ProductInOrderType[]) => {
    return products.reduce((acc, product) => {
      const productPrice =
        order.type === OrderType.TO_HOME ? product.product.home_price : product.product.site_price;
      return acc + product.quantity * productPrice;
    }, 0);
  };

  return { updateOrder, cancelOrder };
}
