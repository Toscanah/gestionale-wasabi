import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import { OrderType } from "@prisma/client";
import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { debounce } from "lodash";

export default function Discount({ order }: { order: AnyOrder }) {
  const { onOrdersUpdate } = useWasabiContext();
  const [discount, setDiscount] = useState<number>(order.discount);

  const debouncedFetch = useCallback(
    debounce((discount: number) => {
      fetchRequest("POST", "/api/orders/", "updateDiscount", { orderId: order.id, discount }).then(
        () => onOrdersUpdate(order.type as OrderType)
      );
    }, 1000),
    []
  );

  const handleDiscount = (discount: number) => {
    setDiscount(discount);
    debouncedFetch(discount);
  };

  return (
    <div className="flex gap-2 justify-between items-center">
      <span className="text-xl min-w-fit">Sconto (%)</span>
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
