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
import { useEffect } from "react";

export type PaymentMethod = {
  type: PaymentType;
  label: string;
  icon: Icon;
};

interface OrderPaymentProps {
  type: "full" | "partial";
  onOrderPaid: () => void;
  handleBackButton: () => void;
  partialOrder?: AnyOrder;
}

export default function OrderPayment({
  type,
  onOrderPaid,
  handleBackButton,
  partialOrder,
}: OrderPaymentProps) {
  const { dialogOpen, createSubOrder, order: parentOrder } = useOrderContext();

  useEffect(() => {
    if (!dialogOpen && type == "partial" && partialOrder) {
      createSubOrder(parentOrder, partialOrder.products);
    }
  }, [dialogOpen]);

  return (
    <OrderPaymentProvider type={type} onOrderPaid={onOrderPaid} partialOrder={partialOrder}>
      <div className="w-full h-full flex flex-col gap-6">
        <PaymentMethodsSelection />

        <div className="w-full text-4xl flex h-full gap-4">
          <PaymentSummary />

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
