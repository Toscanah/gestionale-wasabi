import { Br, Line, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import HeaderSection from "../common/HeaderSection";
import ProductsListSection from "../common/ProductsListSection";
import OrderInfoSection from "../common/OrderInfoSection";
import FooterSection from "../common/FooterSection";
import { OrderType } from "../../types/OrderType";
import { QuickPaymentOption } from "../../orders/single-order/overview/QuickPaymentOptions";

export default function OrderReceipt<T extends AnyOrder>(
  order: T,
  quickPaymentOption: QuickPaymentOption
) {
  const tableOrder = (order as TableOrder).table_order;
  const homeOrder = (order as HomeOrder).home_order;
  const pickupOrder = (order as PickupOrder).pickup_order;

  return (
    <>
      {HeaderSection()}

      {tableOrder && <Text align="center">Tavolo {tableOrder.table}</Text>}
      {pickupOrder && (
        <>
          <Text align="center">{pickupOrder.name}</Text>
          <Text align="center">{pickupOrder.when}</Text>
        </>
      )}
      <Line />

      {ProductsListSection(order.products, order.type as OrderType, order.discount)}
      <Line />

      {homeOrder && OrderInfoSection(order, quickPaymentOption)}
      <Line />

      {FooterSection(order.id)}
      <Br />
    </>
  );
}
