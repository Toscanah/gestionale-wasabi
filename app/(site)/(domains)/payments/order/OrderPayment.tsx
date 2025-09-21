import { AnyOrder } from "@/app/(site)/lib/shared";
import { Separator } from "@/components/ui/separator";
import getDiscountedTotal from "../../../lib/services/order-management/getDiscountedTotal";
import { Icon } from "@phosphor-icons/react";
import PaymentSummary from "./sections/PaymentSummary";
import { Button } from "@/components/ui/button";
import { PaymentScope, PaymentType } from "@prisma/client";
import { OrderPaymentProvider } from "../../../context/OrderPaymentContext";
import PaymentMethodsSelection from "./sections/PaymentMethodsSelection";
import PaymentConfirmationAndTools from "./sections/PaymentConfirmationAndTools";
import { useOrderContext } from "../../../context/OrderContext";
import { useEffect } from "react";
import ResetPayment from "./ResetPayment";
import { Payment } from "@/prisma/generated/schemas";

export type PaymentMethod = {
  type: PaymentType;
  label: string;
  icon: Icon;
};

export interface OrderPaymentProps {
  scope: PaymentScope;
  stage: "FINAL" | "PARTIAL";
  onOrderPaid: (updatePayments: Payment[]) => void;
  onBackButton: () => void;
  partialOrder?: AnyOrder;
  manualTotalAmount?: number;
}

export default function OrderPayment({
  stage,
  scope,
  onOrderPaid,
  onBackButton,
  partialOrder,
  manualTotalAmount,
}: OrderPaymentProps) {
  return (
    <OrderPaymentProvider
      scope={scope}
      stage={stage}
      onOrderPaid={onOrderPaid}
      partialOrder={partialOrder}
      manualTotalAmount={manualTotalAmount}
    >
      <div className="w-full h-full flex flex-col gap-6">
        <PaymentMethodsSelection />

        <div className="w-full text-4xl flex h-full gap-4">
          <PaymentSummary />

          <Separator orientation="vertical" />

          <div className="flex flex-col w-[28%] gap-6 text-4xl items-center text-center h-full justify-center">
            <PaymentConfirmationAndTools />
          </div>
        </div>

        <Button onClick={onBackButton} className="text-lg">
          Indietro
        </Button>
      </div>
    </OrderPaymentProvider>
  );
}
