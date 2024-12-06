import { ProductInOrderType } from "../../../types/ProductInOrderType";
import { Dispatch, SetStateAction, useState } from "react";
import { AnyOrder, HomeOrder } from "../../../types/PrismaOrders";
import { PayingAction } from "../OrderTable";
import { OrderType } from "@prisma/client";
import QuickPaymentOptions, { QuickPaymentOption } from "./QuickPaymentOptions";
import Discount from "./Discount";
import Time from "./Time";
import OldOrders from "./OldOrders";
import Rice from "./Rice";
import Total from "./Total";
import NormalActions from "./NormalActions";

interface OrderOverviewProps {
  order: AnyOrder;
  setAction: Dispatch<SetStateAction<PayingAction>>;
  addProducts: (newProducts: ProductInOrderType[]) => void;
  updateUnprintedProducts: () => Promise<ProductInOrderType[]>;
}

export default function OrderOverview({
  order,
  setAction,
  addProducts,
  updateUnprintedProducts,
}: OrderOverviewProps) {
  const [quickPaymentOption, setQuickPaymentOption] = useState<QuickPaymentOption>("none");

  return (
    <div className="w-[25%] flex flex-col gap-6 h-full">
      {order.type !== OrderType.TABLE && (
        <QuickPaymentOptions
          order={order as HomeOrder}
          quickPaymentOption={quickPaymentOption}
          setQuickPaymentOption={setQuickPaymentOption}
        />
      )}

      {order.type !== OrderType.TABLE && <OldOrders addProducts={addProducts} order={order} />}

      <div className="flex gap-6 items-center">
        {order.type !== OrderType.TABLE && <Time order={order} />}
        <Discount order={order} />
      </div>

      <div className="mt-auto flex flex-col gap-6">
        <Rice order={order} />

        <Total orderTotal={order.total} discount={order.discount} />

        <NormalActions
          order={order}
          setAction={setAction}
          updateUnprintedProducts={updateUnprintedProducts}
          quickPaymentOption={quickPaymentOption}
        />
      </div>
    </div>
  );
}
