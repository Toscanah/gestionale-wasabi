import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "@/app/(site)/models";
import TimeSection from "../common/TimeSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import { KitchenType, OrderType } from "@prisma/client";
import getReceiptSize from "../../functions/formatting-parsing/printing/getReceiptSize";
import sanitazeReceiptText from "../../functions/formatting-parsing/printing/sanitazeReceiptText";
import { GlobalSettings } from "../../types/Settings";

const calculateAdjustedTime = (originalTime: string) => {
  const timeParts = originalTime.split(":");

  if (timeParts.length !== 2 || isNaN(Number(timeParts[0])) || isNaN(Number(timeParts[1]))) {
    return "Orario non valido";
  }

  const settings = localStorage.getItem("settings");
  let offset: number = 0;

  if (settings) {
    const parsedSettings: GlobalSettings = JSON.parse(settings);
    offset = parsedSettings.kitchenOffset;
  }

  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number(timeParts[0]),
    Number(timeParts[1])
  );

  date.setMinutes(date.getMinutes() - offset);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MAX_LABEL = 16;

type ReceiptTitle = "SUSHI" | "CUCINA" | "ALTRO";

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

  const renderReceiptSection = (title: ReceiptTitle, products: typeof order.products) => (
    <>
      {TimeSection({})}

      <Line />
      {tableOrder && (
        <Row
          left={
            <Text bold size={bigSize}>
              TAVOLO
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {sanitazeReceiptText(tableOrder.table.slice(0, MAX_LABEL))}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={""}
          right={
            <Text bold size={bigSize}>
              {sanitazeReceiptText(pickupOrder.name.slice(0, MAX_LABEL))}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={""}
          right={
            <Text bold size={bigSize}>
              {sanitazeReceiptText(homeOrder.address.doorbell.slice(0, MAX_LABEL))}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={
            <Text bold size={bigSize}>
              ASPORTO
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {pickupOrder.when == "immediate" ? "SUBITO" : pickupOrder.when}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={
            <Text bold size={bigSize}>
              DELIVERY
            </Text>
          }
          right={
            <Text bold size={bigSize}>
              {homeOrder.when == "immediate"
                ? "SUBITO"
                : calculateAdjustedTime(homeOrder.when ?? "")}
            </Text>
          }
        />
      )}

      <Line />
      <Br />
      {ProductsListSection(products, order.type as OrderType, 0, "kitchen")}
      <Br />

      <Text align="center" bold size={smallSize}>
        {title.toUpperCase()}
      </Text>

      <Cut />
    </>
  );

  return (
    <>
      {coldProducts.length > 0 && renderReceiptSection("SUSHI", coldProducts)}
      {hotProducts.length > 0 && renderReceiptSection("CUCINA", hotProducts)}
      {otherProducts.length > 0 && renderReceiptSection("ALTRO", otherProducts)}
    </>
  );
}
