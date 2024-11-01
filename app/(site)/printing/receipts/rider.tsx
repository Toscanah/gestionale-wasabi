import { Br, Cut, Line } from "react-thermal-printer";
import { Notes } from "../../orders/single-order/overview/QuickNotes";
import { AnyOrder } from "../../types/PrismaOrders";
import orderInfo from "../common/orderInfo";
import time from "../common/time";
import total from "../common/total";

export default function rider<T extends AnyOrder>(order: T, payment: Notes) {
  return (
    <>
      <Cut />

      {time()}
      <Line />

      {orderInfo(order, payment)}
      <Line />

      {total(order.products)}
      <Cut />
    </>
  );
}
