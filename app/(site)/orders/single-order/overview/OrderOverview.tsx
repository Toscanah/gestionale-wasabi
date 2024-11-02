import { ProductInOrderType } from "../../../types/ProductInOrderType";
import { Dispatch, SetStateAction, useState } from "react";
import { AnyOrder, HomeOrder } from "../../../types/PrismaOrders";
import { Actions } from "../OrderTable";
import { OrderType } from "../../../types/OrderType";
import QuickPaymentOptions, { QuickPaymentOption } from "./QuickPaymentOptions";
import Discount from "./Discount";
import Time from "./Time";
import OldOrders from "./OldOrders";
import Rice from "./Rice";
import Total from "./Total";
import NormalActions from "./NormalActions";

export default function OrderOverview({
  order,
  setAction,
  addProducts,
}: {
  order: AnyOrder;
  setAction: Dispatch<SetStateAction<Actions>>;
  addProducts: (newProducts: ProductInOrderType[]) => void;
}) {
  const [quickPaymentOption, setQuickPaymentOption] = useState<QuickPaymentOption>("none");

  return (
    <div className="w-[25%] flex flex-col gap-6 h-full">
      {order.type !== OrderType.TABLE && order.type !== OrderType.PICK_UP && (
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
          quickPaymentOption={quickPaymentOption}
        />
      </div>
    </div>
  );
}
