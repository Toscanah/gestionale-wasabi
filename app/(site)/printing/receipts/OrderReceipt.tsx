import { Br, Cut, Line, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "@/app/(site)/models";
import HeaderSection from "../common/HeaderSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import OrderInfoSection from "../common/OrderInfoSection";
import FooterSection from "../common/FooterSection";
import { OrderType, QuickPaymentOption } from "@prisma/client";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";
import ExtraItems from "../common/ExtraItems";
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
  const smallSize = getReceiptSize(1, 1);

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
          {OrderInfoSection({ order: order as HomeOrder, quickPaymentOption, when: false })}
          <Line />
        </>
      )}

      {pickupOrder && (
        <>
          <Br />
          {pickupOrder.notes && (
            <>
              <Text size={smallSize}>
                {padReceiptText(sanitazeReceiptText(pickupOrder.notes), 40)}
              </Text>
            </>
          )}
          {ExtraItems({ order })}
          <Br />
        </>
      )}

      {FooterSection(order.id)}
      {(forceCut || order.type !== OrderType.HOME) && <Cut />}
    </>
  );
}
