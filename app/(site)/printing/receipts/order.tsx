import { Br, Cut, Line, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import header from "../common/header";
import products from "../common/products";
import orderInfo from "../common/orderInfo";
import footer from "../common/footer";
import { OrderType } from "../../types/OrderType";
import { Notes } from "../../orders/single-order/overview/QuickNotes";

export default function OrderReceipt<T extends AnyOrder>(order: T, payment?: Notes) {
  console.log(order);

  const tableOrder = (order as TableOrder).table_order;
  const homeOrder = (order as HomeOrder).home_order;
  const pickupOrder = (order as PickupOrder).pickup_order;

  return (
    <>
      {header()}

      {tableOrder && <Text align="center">Tavolo {tableOrder.table}</Text>}
      {pickupOrder && (
        <>
          <Text align="center">{pickupOrder.name}</Text>
          <Text align="center">{pickupOrder.when}</Text>
        </>
      )}

      <Line />

      {products(order.products, order.discount)}

      <Line />

      {homeOrder && orderInfo<T>(order, payment)}

      <Line />
      {footer(order.id)}

      <Br />
    </>
  );
}
