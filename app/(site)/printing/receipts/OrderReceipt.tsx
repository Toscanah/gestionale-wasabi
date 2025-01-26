import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "@/app/(site)/models";
import HeaderSection from "../common/HeaderSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import OrderInfoSection from "../common/OrderInfoSection";
import FooterSection from "../common/FooterSection";
import { OrderType, QuickPaymentOption } from "@prisma/client";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";
import padReceiptText from "../../functions/formatting-parsing/printing/padReceiptText";

export default function OrderReceipt<T extends AnyOrder>(
  order: T,
  quickPaymentOption: QuickPaymentOption,
  putInfo: boolean = true,
  forceCut: boolean = false
) {
  const tableOrder = (order as TableOrder).table_order;
  const homeOrder = (order as HomeOrder).home_order;
  const pickupOrder = (order as PickupOrder).pickup_order;

  const bigSize = getReceiptSize(2, 2);

  return (
    <>
      {HeaderSection()}

      {tableOrder && (
        <>
          <Br />

          <Text align="right" size={bigSize}>
            TAVOLO {sanitazeReceiptText(tableOrder.table)}
          </Text>
          <Br />
        </>
      )}

      {pickupOrder && (
        <>
          <Br />
          {/* <Row
            left={
              <Text align="center" size={bigSize}>
                {sanitazeReceiptText(pickupOrder.name)}
              </Text>
            }
            right={
              <Text align="center" size={bigSize}>
                {pickupOrder.when == "immediate" ? "PRIMA POSSIBILE" : pickupOrder.when}
              </Text>
            }
          /> */}

          <Text align="right">{sanitazeReceiptText(pickupOrder.name)}</Text>
          <Text align="right" size={bigSize}>
            {pickupOrder.when == "immediate" ? "PRIMA POSSIBILE" : pickupOrder.when}
          </Text>
          <Br />
        </>
      )}

      <Line />
      <Br />

      {ProductsListSection(order.products, order.type, order.discount, "customer")}
      <Line />

      {homeOrder && putInfo && (
        <>
          {OrderInfoSection({ order: order as HomeOrder, quickPaymentOption })}
          <Line />
        </>
      )}

      {FooterSection(order.id)}
      {(forceCut || order.type !== OrderType.HOME) && <Cut />}
    </>
  );
}
