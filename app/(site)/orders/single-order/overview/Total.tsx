import { useOrderContext } from "@/app/(site)/context/OrderContext";
import applyDiscount from "@/app/(site)/functions/order-management/applyDiscount";
import roundToTwo from "@/app/(site)/functions/formatting-parsing/roundToTwo";

export default function Total() {
  const { order } = useOrderContext();

  return (
    <div className="w-full flex flex-col overflow-hidden border-foreground justify-center">
      <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 flex flex-col justify-center">
        TOTALE
      </div>
      <div className="w-full text-center text-2xl h-12 font-bold border-x border-b rounded-b-lg flex flex-col justify-center">
        € {roundToTwo(applyDiscount(order.total, order.discount))}
      </div>
    </div>
  );
}
