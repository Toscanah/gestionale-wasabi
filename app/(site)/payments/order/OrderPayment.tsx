import { AnyOrder } from "@/app/(site)/models";
import { Separator } from "@/components/ui/separator";
import applyDiscount from "../../util/functions/applyDiscount";
import { Icon } from "@phosphor-icons/react";
import PaymentSummary from "./sections/PaymentSummary";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@prisma/client";
import { OrderPaymentProvider } from "../../context/OrderPaymentContext";
import PaymentMethodsSelection from "./sections/PaymentMethodsSelection";
import PaymentConfirmationAndTools from "./sections/PaymentConfirmationAndTools";
import { useOrderContext } from "../../context/OrderContext";

export type PaymentMethod = {
  type: PaymentType;
  label: string;
  icon: Icon;
};

interface OrderPaymentProps {
  type: "full" | "partial";
  onOrderPaid: () => void;
  handleBackButton: () => void;
  order?: AnyOrder;
}

export default function OrderPayment({
  type,
  onOrderPaid,
  handleBackButton,
  order: propOrder,
}: OrderPaymentProps) {
  const { order: contextOrder } = useOrderContext();
  const order = propOrder || contextOrder;



  return (
    <OrderPaymentProvider type={type} onOrderPaid={onOrderPaid} order={order}>
      <div className="w-full h-full flex flex-col gap-6">
        <PaymentMethodsSelection />

        <div className="w-full text-4xl flex h-full gap-4">
          <PaymentSummary totalToPay={applyDiscount(order.total, order.discount)} />

          <Separator orientation="vertical" />

          <div className="flex flex-col w-[28%] gap-6 text-4xl items-center text-center h-full justify-center">
            <PaymentConfirmationAndTools />
          </div>
        </div>

        <Button onClick={handleBackButton} className="text-lg">
          Indietro
        </Button>
      </div>
    </OrderPaymentProvider>
  );
}
