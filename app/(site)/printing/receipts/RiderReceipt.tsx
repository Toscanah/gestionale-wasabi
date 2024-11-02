import { Br, Cut, Line } from "react-thermal-printer";
import { QuickPaymentOption } from "../../orders/single-order/overview/QuickPaymentOptions";
import { AnyOrder } from "../../types/PrismaOrders";
import OrderInfoSection from "../common/OrderInfoSection";
import TimeSection from "../common/TimeSection";
import TotalSection from "../common/TotalSection";

export default function RiderReceipt(order: AnyOrder, quickPaymentOption: QuickPaymentOption) {
  return (
    <>
      <Cut />

      {TimeSection()}

      <Line />
      {OrderInfoSection(order, quickPaymentOption)}

      <Line />
      {TotalSection(order.products)}

      <Cut />
    </>
  );
}
