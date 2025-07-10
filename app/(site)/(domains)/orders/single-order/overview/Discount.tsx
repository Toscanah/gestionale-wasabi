import { AnyOrder } from "@/app/(site)/lib/shared";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { toastSuccess } from "@/app/(site)/lib/utils/toast";
import { useOrderContext } from "@/app/(site)/context/OrderContext";

export default function Discount() {
  const { order, updateOrder } = useOrderContext();
  const [discount, setDiscount] = useState<number | undefined>(
    order.discount == 0 ? undefined : order.discount
  );

  const debouncedFetch = useCallback(
    debounce(
      (discount: number) =>
        fetchRequest<AnyOrder>("PATCH", "/api/orders/", "updateOrderDiscount", {
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
    <Input
      value={discount}
      onChange={(e) => handleDiscount(e.target.valueAsNumber)}
      className="w-full text-xl h-12"
      placeholder="Sconto"
      type="number"
    />
  );
}
