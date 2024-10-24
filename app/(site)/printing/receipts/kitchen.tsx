import { Br, Line, Text } from "react-thermal-printer";
import { AnyOrder } from "../../types/PrismaOrders";
import time from "../common/time";
import products from "../common/products";
import { ProductInOrderType } from "../../types/ProductInOrderType";

function aggregateProducts(products: ProductInOrderType[]): ProductInOrderType[] {
  const aggregated = {} as any;

  products.forEach((product) => {
    const optionsString = product.options
      .map(({ option }) => option.option_name.charAt(0).toUpperCase() + option.option_name.slice(1))
      .join(", ");
    const key = `${product.product.code} ${product.product.desc} ${optionsString}`;

    if (aggregated[key]) {
      aggregated[key].quantity += product.quantity;
    } else {
      aggregated[key] = {
        ...product,
        quantity: product.quantity,
      };
    }
  });

  return Object.values(aggregated);
}

export default function kitchen<T extends AnyOrder>(order: T) {
  const isTableOrder = "table_order" in order;
  const isHomeOrder = "home_order" in order;
  const isPickupOrder = "pickup_order" in order;

  return (
    <>
      {time()}
      {isTableOrder && <Text align="center">Tavolo {order.table_order?.table}</Text>}
      {isPickupOrder && <Text align="center">Asporto {order.pickup_order?.name}</Text>}
      {isHomeOrder && <Text align="center">Delivery {order.home_order?.address.doorbell}</Text>}

      {isPickupOrder && <Text align="center">Orario {order.pickup_order?.when}</Text>}
      {isHomeOrder && <Text align="center">Orario {order.home_order?.when}</Text>}

      <Line />
      <Br />

      {products(aggregateProducts(order.products), "kitchen")}
    </>
  );
}
