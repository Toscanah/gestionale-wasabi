import { Dispatch, useState, SetStateAction } from "react";
import { PlannedPayment } from "@prisma/client";
import PaymentStatusSelection from "../PaymentStatusSelection";
import OldOrders from "../OldOrders";
import When from "../When";
import Engagement from "../Engagement";
import Discount from "../Discount";
import Rice from "../Rice";
import Total from "../Total";
import CustomerLookup from "../CustomerLookup";
import NormalActions from "../NormalActions";
import { PickupOrder } from "@/app/(site)/lib/shared";
import { PayingAction } from "../../OrderTable";

interface PickupOrderLayoutProps {
  order: PickupOrder;
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function PickupOrderLayout({ order, setAction }: PickupOrderLayoutProps) {
  const [paymentStatus, setPaymentStatus] = useState({
    prepaid: order.pickup_order?.prepaid || false,
    plannedPayment: order.pickup_order?.planned_payment || PlannedPayment.UNKNOWN,
  });

  return (
    <>
      <PaymentStatusSelection paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} />
      <OldOrders />

      <div className="w-full flex gap-6 items-center">
        <When />
        <Engagement />
        <Discount />
      </div>

      <Rice />
      <Total />
      <CustomerLookup />

      <div className="mt-auto flex flex-col gap-6">
        <NormalActions setAction={setAction} plannedPayment={paymentStatus.plannedPayment} />
      </div>
    </>
  );
}
