import { Br, Cut, Line, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "@/app/(site)/lib/shared";
import HeaderSection from "../common/HeaderSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import OrderInfoSection from "../common/info/OrderInfoSection";
import FooterSection from "../common/FooterSection";
import { OrderType, PlannedPayment } from "@prisma/client";
import sanitazeReceiptText from "../../../lib/utils/domains/printing/sanitazeReceiptText";
import { BIG_PRINT } from "../constants";
import SingleEngagement from "../common/SingleEngagement";
import { Fragment } from "react";

export interface OrderReceiptProps {
  order: AnyOrder;
  plannedPayment: PlannedPayment;
  putInfo?: boolean;
  forceCut?: boolean;
}

export default function OrderReceipt<T extends AnyOrder>({
  order,
  plannedPayment,
  putInfo = true,
  forceCut = false,
}: OrderReceiptProps) {
  const tableOrder = (order as TableOrder).table_order;
  const homeOrder = (order as HomeOrder).home_order;
  const pickupOrder = (order as PickupOrder).pickup_order;

  const { products, type, discount, engagements } = order;

  const unredemableEngagements = engagements.filter((e) => !e.template.redeemable);

  console.log(pickupOrder, putInfo)

    return (
    <>
      {HeaderSection({ orderDate: new Date(order.created_at) })}

      {tableOrder && (
        <>
          <Br />

          <Text align="right" size={BIG_PRINT}>
            TAVOLO {sanitazeReceiptText(tableOrder.table)}
          </Text>
          <Br />
        </>
      )}

      {pickupOrder && (
        <>
          <Br />

          <Text align="right">{sanitazeReceiptText(pickupOrder.name)}</Text>
          <Text align="right" size={BIG_PRINT}>
            {pickupOrder.when == "immediate" ? "PRIMA POSSIBILE" : pickupOrder.when}
          </Text>

          <Br />
        </>
      )}

      <Line />
      <Br />

      {ProductsListSection({ products, orderType: type, discount, recipient: "customer" })}
      <Line />

      {(homeOrder || pickupOrder) && putInfo && (
        <>
          {OrderInfoSection({ order, plannedPayment, options: { putWhen: false } })}
          <Line />
        </>
      )}

      {unredemableEngagements.length > 0 &&
        unredemableEngagements.map((e, i) => (
          <Fragment key={i}>{SingleEngagement({ engagement: e })}</Fragment>
        ))}

      {FooterSection({ orderId: order.id })}
      {(forceCut || order.type !== OrderType.HOME) && <Cut />}
    </>
  );
}
