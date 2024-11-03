import { Br, Cut, Line, Text, TextSize } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import TimeSection from "../common/TimeSection";
import ProductsListSection from "../common/ProductsListSection";
import { OrderType } from "@prisma/client";

export default function KitchenReceipt<T extends AnyOrder>(order: T) {
  const size: { width: TextSize; height: TextSize } = { width: 2, height: 2 };

  const tableOrder = (order as TableOrder).table_order ?? false;
  const homeOrder = (order as HomeOrder).home_order ?? false;
  const pickupOrder = (order as PickupOrder).pickup_order ?? false;

  return (
    <>
      {TimeSection()}

      <Line />
      {tableOrder && (
        <>
          <Text align="center" size={size}>
            TAVOLO
          </Text>
          <Text align="center" bold size={size}>
            {tableOrder.table}
          </Text>
        </>
      )}

      {pickupOrder && (
        <>
          <Text align="center" size={size}>
            ASPORTO
          </Text>
          <Text align="center" bold size={size}>
            {pickupOrder.name}
          </Text>
        </>
      )}

      {homeOrder && (
        <>
          <Text align="center" size={size}>
            DELIVERY
          </Text>
          <Text align="center" size={size}>
            {homeOrder.address.doorbell}
          </Text>
        </>
      )}

      <Br />
      {pickupOrder && (
        <Text align="center" bold size={size}>
          {pickupOrder.when}
        </Text>
      )}

      {homeOrder && (
        <Text align="center" size={size}>
          Orario {homeOrder.when}
        </Text>
      )}

      <Line />
      {ProductsListSection(order.products, order.type as OrderType, 0, "kitchen", false)}

      <Cut />
    </>
  );
}
