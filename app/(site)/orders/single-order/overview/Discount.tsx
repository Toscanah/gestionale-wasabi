import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@prisma/client";
import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { toastSuccess } from "@/app/(site)/util/toast";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";

export default function Discount() {
  const { updateGlobalState } = useWasabiContext();
  const { order, updateOrder } = useOrderContext();
  const [discount, setDiscount] = useState<number | undefined>(
    order.discount == 0 ? undefined : order.discount
  );

  const debouncedFetch = useCallback(
    debounce(
      (discount: number) =>
        fetchRequest<AnyOrder>("POST", "/api/orders/", "updateDiscount", {
          orderId: order.id,
          discount,
        }).then((updatedOrder) => {

          toastSuccess("Sconto aggiornato correttamente");
          updateOrder(updatedOrder);
          updateGlobalState(updatedOrder, "update");
        }),
      1000
    ),
    []
  );

  const handleDiscount = (discount: number) => {
    setDiscount(discount);
    debouncedFetch(discount);
  };

  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Input
        value={discount}
        onChange={(e) => handleDiscount(e.target.valueAsNumber)}
        className="text-xl h-12"
        placeholder="Sconto"
        type="number"
      />
    </div>
  );
}
