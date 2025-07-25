import { Dispatch, SetStateAction, useState } from "react";
import { PayingAction } from "../OrderTable";
import { OrderType, QuickPaymentOption } from "@prisma/client";
import Discount from "./Discount";
import When from "./When";
import OldOrders from "./OldOrders";
import Rice from "./Rice";
import Total from "./Total";
import NormalActions from "./NormalActions";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import TableUpdate from "./TableUpdate";
import QuickPaymentOptions from "./QuickPaymentOptions";
import { HomeOrder } from "@/app/(site)/lib/shared";
import Engagement from "./Engagement";

interface OrderOverviewProps {
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function OrderOverview({ setAction }: OrderOverviewProps) {
  const { order } = useOrderContext();
  const [quickPaymentOption, setQuickPaymentOption] = useState<QuickPaymentOption>(
    order.type === OrderType.HOME
      ? (order as HomeOrder).home_order?.payment || QuickPaymentOption.UNKNOWN
      : QuickPaymentOption.UNKNOWN
  );

  return (
    <div className="w-[28%] flex flex-col gap-6 h-full">
      {order.type == OrderType.HOME && (
        <QuickPaymentOptions
          quickPaymentOption={quickPaymentOption}
          setQuickPaymentOption={setQuickPaymentOption}
        />
      )}

      {order.type !== OrderType.TABLE && <OldOrders />}

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
        <NormalActions setAction={setAction} quickPaymentOption={quickPaymentOption} />
      </div>
    </div>
  );
}
