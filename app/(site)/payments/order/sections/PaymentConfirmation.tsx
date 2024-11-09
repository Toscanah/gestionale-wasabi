import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import { AnyOrder } from "@/app/(site)/types/PrismaOrders";
import applyDiscount from "@/app/(site)/util/functions/applyDiscount";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@prisma/client";

export default function PaymentConfirmation({ order }: { order: AnyOrder }) {
  const { payOrder, handlePaymentChange, setTypedAmount, resetPayment } = useOrderPaymentContext();

  return (
    <div className="flex flex-col gap-6 text-4xl items-center text-center h-full justify-center w-[40%]">
      <h1>
        <span>
          Vuoi procedere con l'incasso di <b>€ {order.total}</b>?
        </span>
      </h1>
      <div className="w-full flex gap-6 items-center justify-center">
        <Button
          className="w-1/3 h-32 text-3xl"
          variant={"destructive"}
          onClick={resetPayment}
        >
          Cancella
        </Button>

        <Button
          onClick={payOrder}
          className="w-1/3 h-32 bg-green-500 text-3xl text-black hover:bg-green-500/90"
        >
          Conferma
        </Button>
      </div>
    </div>
  );
}
