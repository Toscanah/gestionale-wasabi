import { Br, Cut, Line } from "react-thermal-printer";
import { Notes } from "../../orders/single-order/overview/QuickNotes";
import { AnyOrder } from "../../types/PrismaOrders";
import orderInfo from "../common/orderInfo";
import time from "../common/time";
import total from "../common/total";

export default function riderDelivery<T extends AnyOrder>(order: T, payment: Notes) {
  return (
    <>
      {time()}
      <Line />
      <Br/>

      {orderInfo(order, payment)}
      <Line />
      <Br/>
      
      {total(order.products)}
      <Cut />
    </>
  );
}
