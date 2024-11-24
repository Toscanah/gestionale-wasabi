import { Br, Cut, Line, Row, Text, TextSize } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import TimeSection from "../common/TimeSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import { KitchenType, OrderType } from "@prisma/client";
import getReceiptSize from "../../util/functions/getReceiptSize";

export default function KitchenReceipt<T extends AnyOrder>(order: T) {
  const bigSize = getReceiptSize(2,2);
  const smallSize = getReceiptSize(1,1);

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

  const noneProducts = order.products.filter(
    (product) => product.product.kitchen === KitchenType.NONE
  );

  const calculateAdjustedTime = (originalTime: string) => {
    let offset: number = parseInt(localStorage.getItem("kitchenOffset") ?? "0");
    const date = new Date(originalTime);
    date.setMinutes(date.getMinutes() - offset);
    return date.toLocaleTimeString();
  };

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
            <Text bold size={smallSize}>
              {tableOrder.table}
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
            <Text bold size={smallSize}>
              {pickupOrder.name}
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
            <Text bold size={smallSize}>
              {homeOrder.address.doorbell}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={
            <Text bold size={bigSize}>
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
          left={<Text size={bigSize}>Orario</Text>}
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
      {noneProducts.length > 0 && renderReceiptSection("Altro", noneProducts)}
    </>
  );
}
