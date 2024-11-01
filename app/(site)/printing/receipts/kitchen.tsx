import { Br, Cut, Line, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import time from "../common/time";
import products from "../common/products";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import aggregateProducts from "../../util/functions/aggregateProducts";

export default function kitchen<T extends AnyOrder>(order: T) {
  const tableOrder = (order as TableOrder).table_order;
  const homeOrder = (order as HomeOrder).home_order;
  const pickupOrder = (order as PickupOrder).pickup_order;

  return (
    <>
      {time()}

      <Line />

      {tableOrder && (
        <>
          <Text align="center" size={{ width: 2, height: 2 }}>
            TAVOLO
          </Text>
          <Text align="center" bold size={{ width: 2, height: 2 }}>
            {tableOrder.table}
          </Text>
        </>
      )}
      {pickupOrder && (
        <>
          <Text align="center" size={{ width: 2, height: 2 }}>
            ASPORTO
          </Text>
          <Text align="center" bold size={{ width: 2, height: 2 }}>
            {pickupOrder.name}
          </Text>
        </>
      )}
      {homeOrder && (
        <>
          <Text align="center" size={{ width: 2, height: 2 }}>
            DELIVERY
          </Text>
          <Text align="center" size={{ width: 2, height: 2 }}>
            {homeOrder.address.doorbell}
          </Text>
        </>
      )}

      <Br />

      {pickupOrder && (
        <Text align="center" bold size={{ width: 2, height: 2 }}>
          {pickupOrder.when}
        </Text>
      )}
      {homeOrder && (
        <Text align="center" size={{ width: 2, height: 2 }}>
          Orario {homeOrder.when}
        </Text>
      )}

      <Line />

      {products(aggregateProducts(order.products), "kitchen", false)}
      <Cut />
    </>
  );
}
