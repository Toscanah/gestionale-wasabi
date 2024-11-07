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

  // Determine the type of order
  const tableOrder = (order as TableOrder)?.table_order ?? false;
  const homeOrder = (order as HomeOrder)?.home_order ?? false;
  const pickupOrder = (order as PickupOrder)?.pickup_order ?? false;

  // Separate products into hot and cold kitchens
  const hotProducts = order.products.filter(
    (product) => product.product.category?.kitchen === KitchenType.HOT
  );
  const coldProducts = order.products.filter(
    (product) => product.product.category?.kitchen === KitchenType.COLD
  );

  // Function to render receipt for each kitchen type
  const renderReceiptSection = (title: string, products: typeof order.products) => (
    <>
      <Text align="center" bold size={size}>
        {title}
      </Text>
      <Br />

      {TimeSection()}

      <Line />
      <Br />
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
          right={<Text size={size}>{homeOrder.address.doorbell}</Text>}
        />
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
      <Br />
      {ProductsListSection(products, order.type as OrderType, 0, "kitchen")}

      <Cut />
    </>
  );

  return (
    <>
      {coldProducts.length > 0 && renderReceiptSection("Cucina fredda", coldProducts)}
      {hotProducts.length > 0 && renderReceiptSection("Cucina calda", hotProducts)}
    </>
  );
}
