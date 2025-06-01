import { useOrderContext } from "@/app/(site)/context/OrderContext";
import getDiscountedTotal from "@/app/(site)/lib/order-management/getDiscountedTotal";
import roundToTwo from "@/app/(site)/lib/formatting-parsing/roundToTwo";
import { getOrderTotal } from "@/app/(site)/lib/order-management/getOrderTotal";

export default function Total() {
  const { order } = useOrderContext();

  return (
    <div className="w-full flex flex-col overflow-hidden border-foreground justify-center">
      <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 flex flex-col justify-center">
        TOTALE
      </div>
      <div className="w-full text-center text-2xl h-12 font-bold border-x border-b rounded-b-lg flex flex-col justify-center">
        € {roundToTwo(getOrderTotal({ order, applyDiscount: true }))}
      </div>
    </div>
  );
}
