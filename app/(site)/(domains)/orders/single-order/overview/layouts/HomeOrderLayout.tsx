import { Dispatch, SetStateAction, useState } from "react";
import { PlannedPayment } from "@prisma/client";
import PaymentStatusSelection from "../PaymentStatusSelection";
import OldOrders from "../OldOrders";
import When from "../When";
import Engagement from "../Engagement";
import Rice from "../Rice";
import Total from "../Total";
import CustomerLookup from "../CustomerLookup";
import NormalActions from "../NormalActions";
import { HomeOrder } from "@/app/(site)/lib/shared";
import { PayingAction } from "../../OrderTable";
import DiscountsDialog from "../discount/DiscountsDialog";

interface HomeOrderLayoutProps {
  order: HomeOrder;
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function HomeOrderLayout({ order, setAction }: HomeOrderLayoutProps) {
  const [paymentStatus, setPaymentStatus] = useState({
    prepaid: order.home_order?.prepaid || false,
    plannedPayment: order.home_order?.planned_payment || PlannedPayment.UNKNOWN,
  });

  return (
    <>
      <PaymentStatusSelection paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} />
      <OldOrders />

      <div className="w-full flex gap-6 items-center">
        <When />
        <Engagement />
        <DiscountsDialog />
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
