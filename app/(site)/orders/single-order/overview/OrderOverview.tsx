import { Dispatch, SetStateAction, useState } from "react";
import { PayingAction } from "../OrderTable";
import { OrderType } from "@prisma/client";
import QuickPaymentOptions, { QuickPaymentOption } from "./QuickPaymentOptions";
import Discount from "./Discount";
import Time from "./Time";
import OldOrders from "./OldOrders";
import Rice from "./Rice";
import Total from "./Total";
import NormalActions from "./NormalActions";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import TableChange from "./TableChange";

interface OrderOverviewProps {
  setAction: Dispatch<SetStateAction<PayingAction>>;
  quickPaymentOption: QuickPaymentOption;
  setQuickPaymentOption: Dispatch<SetStateAction<QuickPaymentOption>>;
}

export default function OrderOverview({
  setAction,
  quickPaymentOption,
  setQuickPaymentOption,
}: OrderOverviewProps) {
  const { order } = useOrderContext();

  return (
    <div className="w-[25%] flex flex-col gap-6 h-full">
      {order.type == OrderType.HOME && (
        <QuickPaymentOptions
          quickPaymentOption={quickPaymentOption}
          setQuickPaymentOption={setQuickPaymentOption}
        />
      )}

      {order.type !== OrderType.TABLE && <OldOrders />}

      <div className="flex gap-6 items-center">
        {order.type !== OrderType.TABLE && <Time />}
        <Discount />
      </div>

      {order.type == OrderType.TABLE && <TableChange />}

      <div className="mt-auto flex flex-col gap-6">
        <Rice />
        <Total />
      </div>
    </div>
  );
}
