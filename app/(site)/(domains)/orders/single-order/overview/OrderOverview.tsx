import { Dispatch, SetStateAction, useState } from "react";
import { PayingAction } from "../OrderTable";
import { OrderType, PlannedPayment } from "@prisma/client";
import Discount from "./Discount";
import When from "./When";
import OldOrders from "./OldOrders";
import Rice from "./Rice";
import Total from "./Total";
import NormalActions from "./NormalActions";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import TableUpdate from "./TableUpdate";
import PaymentStatusSelection from "./PaymentStatusSelection";
import { HomeOrder, PickupOrder } from "@/app/(site)/lib/shared";
import Engagement from "./Engagement";

interface OrderOverviewProps {
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export type PaymentStatus = {
  prepaid: boolean;
  plannedPayment: PlannedPayment;
};

export default function OrderOverview({ setAction }: OrderOverviewProps) {
  const { order } = useOrderContext();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    prepaid:
      order.type === OrderType.HOME
        ? (order as HomeOrder).home_order?.prepaid || false
        : order.type === OrderType.PICKUP
        ? (order as PickupOrder).pickup_order?.prepaid || false
        : false,
    plannedPayment:
      order.type === OrderType.HOME
        ? (order as HomeOrder).home_order?.planned_payment || PlannedPayment.UNKNOWN
        : PlannedPayment.UNKNOWN,
  });

  return (
    <div className="w-[28%] flex flex-col gap-6 h-full">
      {order.type !== OrderType.TABLE && (
        <>
          <PaymentStatusSelection
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
          />
          <OldOrders />
        </>
      )}

      <div className="w-full flex gap-6 items-center">
        {order.type !== OrderType.TABLE && (
          <>
            <When />
            {/* <ShiftSelection /> */}
          </>
        )}

        <Engagement />
        <Discount />
      </div>

      {order.type == OrderType.TABLE && <TableUpdate />}
      {/* {order.type != OrderType.TABLE && <ETA />} */}

      <Rice />
      <Total />

      <div className="mt-auto flex flex-col gap-6">
        <NormalActions setAction={setAction} plannedPayment={paymentStatus.plannedPayment} />
      </div>
    </div>
  );
}
