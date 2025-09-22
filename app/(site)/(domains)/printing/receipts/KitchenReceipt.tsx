import { Br, Cut, Line, Row, Text } from "react-thermal-printer";
import { AnyOrder, HomeOrder, PickupOrder, TableOrder } from "@/app/(site)/lib/shared";
import TimeSection from "../common/TimeSection";
import ProductsListSection from "../common/products-list/ProductsListSection";
import { KitchenType } from "@prisma/client";
import sanitazeReceiptText from "../../../lib/utils/domains/printing/sanitazeReceiptText";
import { GlobalSettings } from "../../../lib/shared/types/Settings";
import { BIG_PRINT, SMALL_PRINT } from "../constants";
import {
  DEFAULT_WHEN_LABEL,
  DEFAULT_WHEN_VALUE,
} from "@/app/(site)/lib/shared/constants/default-when";
import formatWhenLabel from "@/app/(site)/lib/utils/domains/order/formatWhenLabel";

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

export interface KitchenReceiptProps {
  order: AnyOrder;
}

export default function KitchenReceipt({ order }: KitchenReceiptProps) {
  const tableOrder = (order as TableOrder).table_order ?? false;
  const homeOrder = (order as HomeOrder).home_order ?? false;
  const pickupOrder = (order as PickupOrder).pickup_order ?? false;

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

  const { type, discount } = order;

  const renderReceiptSection = (title: ReceiptTitle, products: typeof order.products) => (
    <>
      {TimeSection({})}

      <Line />
      {tableOrder && (
        <Row
          left={
            <Text bold size={BIG_PRINT}>
              TAVOLO
            </Text>
          }
          right={
            <Text bold size={BIG_PRINT}>
              {sanitazeReceiptText(tableOrder.table.slice(0, MAX_LABEL))}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={""}
          right={
            <Text bold size={BIG_PRINT}>
              {sanitazeReceiptText(pickupOrder.name.slice(0, MAX_LABEL))}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={""}
          right={
            <Text bold size={BIG_PRINT}>
              {sanitazeReceiptText(homeOrder.address.doorbell.slice(0, MAX_LABEL))}
            </Text>
          }
        />
      )}

      {pickupOrder && (
        <Row
          left={
            <Text bold size={BIG_PRINT}>
              ASPORTO
            </Text>
          }
          right={
            <Text bold size={BIG_PRINT}>
              {pickupOrder.when == "immediate" ? "SUBITO" : pickupOrder.when}
            </Text>
          }
        />
      )}

      {homeOrder && (
        <Row
          left={
            <Text bold size={BIG_PRINT}>
              DELIVERY
            </Text>
          }
          right={
            <Text bold size={BIG_PRINT}>
              {homeOrder.when == DEFAULT_WHEN_VALUE
                ? DEFAULT_WHEN_LABEL.toUpperCase()
                : calculateAdjustedTime(homeOrder.when ?? "")}
            </Text>
          }
        />
      )}

      <Line />
      <Br />
      {ProductsListSection({ products, orderType: type, discount, recipient: "kitchen" })}
      <Br />

      <Text align="center" bold size={SMALL_PRINT}>
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
