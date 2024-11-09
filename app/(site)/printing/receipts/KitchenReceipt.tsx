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
    (product) => product.product.category?.kitchen === KitchenType.HOT
  );
  const coldProducts = order.products.filter(
    (product) => product.product.category?.kitchen === KitchenType.COLD
  );

  const renderReceiptSection = (title: string, products: typeof order.products) => (
    <>
      <Text align="center" bold size={size}>
        {title}
      </Text>
      <Br />

      {TimeSection()}

      <Line />
      {tableOrder && (
        <Text align="center" bold size={size}>
          TAVOLO {tableOrder.table}
        </Text>
      )}

      {pickupOrder && (
        <Text align="center" bold size={size}>
          ASPORTO {pickupOrder.name}
        </Text>
      )}

      {homeOrder && (
        <Text align="center" bold size={size}>
          DELIVERY {homeOrder.address.doorbell}
        </Text>
      )}

      {pickupOrder && (
        <Text align="center" bold size={size}>
          {pickupOrder.when}
        </Text>
      )}

      {homeOrder && (
        <Text align="center" size={size}>
          Orario {homeOrder.when == "immediate" ? "Prima possibile" : homeOrder.when}
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
