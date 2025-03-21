import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import applyDiscount from "@/app/(site)/functions/order-management/applyDiscount";
import roundToTwo from "@/app/(site)/functions/formatting-parsing/roundToTwo";
import { Button } from "@/components/ui/button";

export default function PaymentConfirmation() {
  const { payOrder, resetPayment, order } = useOrderPaymentContext();

  return (
    <div className="flex flex-col gap-6 text-4xl items-center text-center h-full justify-center w-[55%]">
      <h1>
        <span>
          Vuoi procedere con l'incasso di{" "}
          <b>€ {roundToTwo(applyDiscount(order.total, order.discount))}</b>?
        </span>
      </h1>
      <div className="w-full flex gap-6 items-center justify-center">
        <Button className="h-32 w-48 text-3xl" variant={"destructive"} onClick={resetPayment}>
          Cancella
        </Button>

        <Button
          onClick={payOrder}
          className="h-32 w-48 bg-green-500 text-3xl text-black hover:bg-green-500/90"
        >
          Conferma
        </Button>
      </div>
    </div>
  );
}
