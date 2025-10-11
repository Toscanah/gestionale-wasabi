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
import {
  CUSTOMER_ORIGIN_LABELS,
  HomeOrder,
  OrderGuards,
  PickupOrder,
} from "@/app/(site)/lib/shared";
import Engagement from "./Engagement";
import calculateRfmRank from "@/app/(site)/lib/services/rfm/calculateRfmRank";
import calculateRfmScore from "@/app/(site)/lib/services/rfm/calculateRfmScore";
import useRfmRules from "@/app/(site)/hooks/rfm/useRfmRules";
import useRfmRanks from "@/app/(site)/hooks/rfm/useRfmRanks";
import extractCustomerOrders from "@/app/(site)/lib/services/customer-management/extractCustomerOrders";
import CustomerLookup from "./CustomerLookup";

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
    prepaid: OrderGuards.isHome(order)
      ? order.home_order?.prepaid || false
      : OrderGuards.isPickup(order)
        ? order.pickup_order?.prepaid || false
        : false,
    plannedPayment: OrderGuards.isHome(order)
      ? order.home_order?.planned_payment || PlannedPayment.UNKNOWN
      : PlannedPayment.UNKNOWN,
  });

  return (
    <div className="w-[28%] flex flex-col gap-6 h-full">
      {!OrderGuards.isTable(order) && (
        <>
          <PaymentStatusSelection
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
          />
          <OldOrders />
        </>
      )}

      <div className="w-full flex gap-6 items-center">
        {!OrderGuards.isTable(order) && (
          <>
            <When />
            {/* <ShiftSelection /> */}
          </>
        )}

        <Engagement />
        <Discount />
      </div>

      {OrderGuards.isTable(order) && <TableUpdate />}
      {/* {order.type != OrderType.TABLE && <ETA />} */}

      <Rice />
      <Total />

      {OrderGuards.isHome(order) || (OrderGuards.isPickup(order) && <CustomerLookup />)}

      <div className="mt-auto flex flex-col gap-6">
        <NormalActions setAction={setAction} plannedPayment={paymentStatus.plannedPayment} />
      </div>
    </div>
  );
}
