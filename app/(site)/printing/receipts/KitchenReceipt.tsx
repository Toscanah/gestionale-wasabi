import { Br, Cut, Line, Row, Text, TextSize } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import TimeSection from "../common/TimeSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import { KitchenType, OrderType } from "@prisma/client";
import getReceiptSize from "../../util/functions/getReceiptSize";

const calculateAdjustedTime = (originalTime: string) => {
  const timeParts = originalTime.split(":");
  
  if (timeParts.length !== 2 || isNaN(Number(timeParts[0])) || isNaN(Number(timeParts[1]))) {
    return "Orario non valido";
  }

  const offset = parseInt(localStorage.getItem("kitchenOffset") ?? "0", 10);
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(timeParts[0]), Number(timeParts[1]));

  date.setMinutes(date.getMinutes() - offset);

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function KitchenReceipt<T extends AnyOrder>(order: T) {
  const bigSize = getReceiptSize(2, 2);
  const smallSize = getReceiptSize(1, 1);

  const tableOrder = (order as TableOrder)?.table_order ?? false;
  const homeOrder = (order as HomeOrder)?.home_order ?? false;
  const pickupOrder = (order as PickupOrder)?.pickup_order ?? false;

  const hotProducts = order.products.filter(
    (product) =>
      product.product.kitchen === KitchenType.HOT ||
      product.product.kitchen === KitchenType.HOT_AND_COLD
  );

  const coldProducts = order.products.filter(
    (product) =>
      product.product.kitchen === KitchenType.COLD ||
      product.product.kitchen === KitchenType.HOT_AND_COLD
  );

  const otherProducts = order.products.filter(
    (product) => product.product.kitchen === KitchenType.OTHER
  );

  type ReceiptTitle = "Cucina fredda" | "Cucina calda" | "Altro";

  const renderReceiptSection = (title: ReceiptTitle, products: typeof order.products) => (
    <>
      <Text align="center" bold size={bigSize}>
        {title.toUpperCase()}
      </Text>
      <Br />

      {TimeSection()}

      <Line />
      {tableOrder && (
        <Row
          left={
            <Text bold size={smallSize}>
              TAVOLO
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {tableOrder.table.toLocaleUpperCase()}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={
            <Text bold size={smallSize}>
              ASPORTO
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {pickupOrder.name.toLocaleUpperCase()}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={
            <Text bold size={smallSize}>
              DELIVERY
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {homeOrder.address.doorbell.toLocaleUpperCase()}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={
            <Text bold size={smallSize}>
              Orario
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {pickupOrder.when == "immediate"
                ? "Prima possibile"
                : calculateAdjustedTime(pickupOrder.when ?? "")}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={
            <Text bold size={smallSize}>
              Orario
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {homeOrder.when == "immediate"
                ? "Prima possibile"
                : calculateAdjustedTime(homeOrder.when ?? "")}
            </Text>
          }
        />
      )}

      <Line />
      <Br />
      {ProductsListSection(products, order.type as OrderType, 0, "kitchen")}

      <Cut />
    </>
  );

  return (
    <>
      {coldProducts.length > 0 && renderReceiptSection("Cucina fredda", coldProducts)}
      {hotProducts.length > 0 && renderReceiptSection("Cucina calda", hotProducts)}
      {otherProducts.length > 0 && renderReceiptSection("Altro", otherProducts)}
    </>
  );
}
