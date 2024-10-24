import { Br, Cut, Line, Text } from "react-thermal-printer";
import { AnyOrder } from "../../types/PrismaOrders";
import header from "../common/header";
import products from "../common/products";
import orderInfo from "../common/orderInfo";
import footer from "../common/footer";
import { OrderType } from "../../types/OrderType";
import { Notes } from "../../orders/single-order/overview/QuickNotes";

export default function order<T extends AnyOrder>(order: T, payment?: Notes) {
  const isTableOrder = "table_order" in order;
  const isHomeOrder = "home_order" in order;
  const isPickupOrder = "pickup_order" in order;

  return (
    <>
      {header()}

      {isTableOrder && <Text align="center">Tavolo {order.table_order?.table}</Text>}
      {isPickupOrder && (
        <>
          <Text align="center">{order.pickup_order?.name}</Text>
          <Text align="center">{order.pickup_order?.when}</Text>
        </>
      )}
      <Line />
      <Br />

      {products(order.products)}
      <Line />
      <Br />

      {isHomeOrder && orderInfo<T>(order, payment)}
      <Line />
      <Br />

      {footer(order.id)}

      <Cut />
    </>
  );
}
