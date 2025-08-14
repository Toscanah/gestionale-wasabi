import { Cut, Line } from "react-thermal-printer";
import { HomeOrder } from "@/app/(site)/lib/shared";
import OrderInfoSection from "../common/info/OrderInfoSection";
import TimeSection from "../common/TimeSection";
import TotalSection from "../common/TotalSection";
import { PlannedPayment } from "@prisma/client";

export interface RiderReceiptProps {
  order: HomeOrder;
  plannedPayment: PlannedPayment;
}

export default function RiderReceipt({ order, plannedPayment }: RiderReceiptProps) {
  const { products, discount, type } = order;
  
  return (
    <>
      <Cut />

      {TimeSection({})}
      <Line />

      {OrderInfoSection({ order, plannedPayment, options: { putExtraItems: false } })}
      <Line />

      {TotalSection({ products, discount, orderType: type })}
      <Cut />
    </>
  );
}
