import { ProductInOrderType } from "../../../types/ProductInOrderType";
import { Dispatch, SetStateAction, useState } from "react";
import { AnyOrder, HomeOrder } from "../../../types/PrismaOrders";
import { Actions } from "../OrderTable";
import { OrderType } from "../../../types/OrderType";
import QuickNotes, { Notes } from "./QuickNotes";
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
  const [note, setNote] = useState<Notes>("");

  return (
    <div className="w-[25%] flex flex-col gap-6 h-full">
      {order.type !== OrderType.TABLE && order.type !== OrderType.PICK_UP && (
        <QuickNotes order={order as HomeOrder} note={note} setNote={setNote} />
      )}

      {order.type !== OrderType.TABLE && (
        <>
          <OldOrders addProducts={addProducts} order={order} />
          <Time order={order} />
        </>
      )}

      <Discount order={order} />

      <div className="mt-auto flex flex-col gap-6">
        <Rice order={order} />

        <Total orderTotal={order.total} discount={order.discount} />

        <NormalActions order={order} setAction={setAction} />
      </div>
    </div>
  );
}
