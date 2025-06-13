import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import roundToTwo from "@/app/(site)/lib/formatting-parsing/roundToTwo";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { useRef, useState } from "react";

export default function PaymentConfirmation() {
  const { payOrder, resetPayment, orderTotal } = useOrderPaymentContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedPay = useRef(debounce(() => payOrder(), 500)).current;

  const handleConfirm = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    debouncedPay();
  };

  return (
    <div className="flex flex-col gap-6 text-4xl items-center text-center h-full justify-center w-[55%]">
      <h1>
        <span>
          Vuoi procedere con l'incasso di <b>€ {roundToTwo(orderTotal)}</b>?
        </span>
      </h1>
      <div className="w-full flex gap-6 items-center justify-center">
        <Button className="h-32 w-48 text-3xl" variant="destructive" onClick={resetPayment}>
          Cancella
        </Button>

        <Button
          onClick={handleConfirm}
          className={`h-32 w-48 bg-green-500 text-3xl text-black hover:bg-green-500/90 ${
            isSubmitting ? "pointer-events-none opacity-70" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "In corso..." : "Conferma"}
        </Button>
      </div>
    </div>
  );
}
