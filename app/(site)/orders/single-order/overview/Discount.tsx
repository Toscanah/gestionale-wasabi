import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@prisma/client";
import { AnyOrder } from "@/app/(site)/models";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import { useOrderContext } from "@/app/(site)/context/OrderContext";

export default function Discount() {
  const { order, updateOrder } = useOrderContext();
  const [discount, setDiscount] = useState<number | undefined>(
    order.discount == 0 ? undefined : order.discount
  );

  const debouncedFetch = useCallback(
    debounce(
      (discount: number) =>
        fetchRequest<AnyOrder>("POST", "/api/orders/", "updateDiscount", {
          orderId: order.id,
          discount: discount,
        }).then((updatedOrder) => {
          toastSuccess("Sconto aggiornato correttamente");
          updateOrder({ discount: updatedOrder.discount, is_receipt_printed: false });
        }),
      1000
    ),
    []
  );

  const handleDiscount = (discount: number) => {
    let correctDiscount = isNaN(discount) ? undefined : discount;
    setDiscount(correctDiscount);
    debouncedFetch(correctDiscount ?? 0);
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
