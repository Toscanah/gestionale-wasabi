import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";
import { ordersAPI } from "@/lib/server/api";
import { Button } from "@/components/ui/button";
import OrderPromotionDialog from "../../../promotions/usages/OrderPromotionDialog";

export default function Discount() {
  const { order, updateOrder } = useOrderContext();
  const [discount, setDiscount] = useState<number | undefined>(
    order.discount === 0 ? undefined : order.discount
  );



  const handleDiscount = (value: number) => {
    const correctDiscount = isNaN(value) ? undefined : value;
    setDiscount(correctDiscount);
    debouncedUpdate(correctDiscount ?? 0);
  };

  useFocusOnClick(["discount"]);

  return <OrderPromotionDialog order={order} />;

  // return (
  //   <Input
  //     id="discount"
  //     defaultValue={discount}
  //     onChange={(e) => handleDiscount(e.target.valueAsNumber)}
  //     className="flex-1 !text-xl h-12 w-full px-4"
  //     placeholder="SCONTO"
  //     type="number"
  //   />
  // );
}
