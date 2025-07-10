import { Br, Cut, Line, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "@/app/(site)/lib/shared";
import HeaderSection from "../common/HeaderSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import OrderInfoSection from "../common/OrderInfoSection";
import FooterSection from "../common/FooterSection";
import { OrderType, QuickPaymentOption } from "@prisma/client";
import getReceiptSize from "../../lib/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../lib/formatting-parsing/printing/sanitazeReceiptText";
import ExtraItemsSection from "../common/ExtraItemsSection";
import padReceiptText from "../../lib/formatting-parsing/printing/padReceiptText";
import EngagementSection from "../common/EngagementSection";

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

  const activeEngagements = order.engagements.filter((e) => e.enabled);

  return (
    <>
      {HeaderSection({ orderDate: new Date(order.created_at) })}

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
              <Text size={smallSize} bold inline>
                Note ordine:{" "}
              </Text>
              <Text size={smallSize}>
                {padReceiptText(sanitazeReceiptText(pickupOrder.notes), 40)}
              </Text>
            </>
          )}
          {ExtraItemsSection({ order })}
          <Br />
        </>
      )}

      {activeEngagements.length > 0 && EngagementSection({ activeEngagements })}

      {FooterSection(order.id)}
      {(forceCut || order.type !== OrderType.HOME) && <Cut />}
    </>
  );
}
