import { Br, Cut, Line, Row, Text, TextSize } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "../../types/PrismaOrders";
import TimeSection from "../common/TimeSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import { KitchenType, OrderType } from "@prisma/client";

interface KitchenReceiptProps<T> {
  order: T;
}

export default function KitchenReceipt<T extends AnyOrder>(order: T) {
  const size: { width: TextSize; height: TextSize } = { width: 2, height: 2 };

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

  const renderReceiptSection = (title: string, products: typeof order.products) => (
    <>
      <Text align="center" bold size={size}>
        {title.toUpperCase()}
      </Text>
      <Br />

      {TimeSection()}

      <Line />
      {tableOrder && (
        <Row
          left={
            <Text bold size={size}>
              TAVOLO
            </Text>
          }
          right={
            <Text bold size={size}>
              {tableOrder.table}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={
            <Text bold size={size}>
              ASPORTO
            </Text>
          }
          right={
            <Text bold size={size}>
              {pickupOrder.name}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={
            <Text bold size={size}>
              DELIVERY
            </Text>
          }
          right={
            <Text bold size={size}>
              {homeOrder.address.doorbell}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={
            <Text bold size={size}>
              Orario
            </Text>
          }
          right={
            <Text bold size={size}>
              {pickupOrder.when}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={<Text size={size}>Orario</Text>}
          right={
            <Text size={size}>
              {homeOrder.when === "immediate" ? "Prima possibile" : homeOrder.when}
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
