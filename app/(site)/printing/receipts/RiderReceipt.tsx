import { Br, Cut, Line } from "react-thermal-printer";
import { QuickPaymentOption } from "../../orders/single-order/overview/QuickPaymentOptions";
import { AnyOrder, HomeOrder } from "@/app/(site)/models";
import OrderInfoSection from "../common/OrderInfoSection";
import TimeSection from "../common/TimeSection";
import TotalSection from "../common/TotalSection";

export default function RiderReceipt(order: HomeOrder, quickPaymentOption: QuickPaymentOption) {
  return (
    <>
      <Cut />

      {TimeSection()}

      <Line />
      {OrderInfoSection(order, quickPaymentOption)}

      <Line />
      {TotalSection(order.products, order.discount, true)}

      <Cut />
    </>
  );
}
