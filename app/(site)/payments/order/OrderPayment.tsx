import { Dispatch, SetStateAction } from "react";
import { AnyOrder } from "../../types/PrismaOrders";
import { Separator } from "@/components/ui/separator";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import applyDiscount from "../../util/functions/applyDiscount";
import { Icon } from "@phosphor-icons/react";
import PaymentSummary from "./sections/PaymentSummary";
import { Button } from "@/components/ui/button";
import { PaymentType } from "@prisma/client";
import { OrderPaymentProvider } from "../../context/OrderPaymentContext";
import PaymentMethodsSelection from "./sections/PaymentMethodsSelection";
import PaymentConfirmationAndTools from "./sections/PaymentConfirmationAndTools";

export type PaymentMethod = {
  type: PaymentType;
  label: string;
  icon: Icon;
};

interface OrderPaymentProps {
  order: AnyOrder;
  type: "full" | "partial";
  onOrderPaid: () => void;
  handleBackButton: () => void;
  setProducts?: Dispatch<SetStateAction<ProductInOrderType[]>>;
}

export default function OrderPayment({
  order,
  type,
  onOrderPaid,
  handleBackButton,
  setProducts,
}: OrderPaymentProps) {
  return (
    <OrderPaymentProvider
      order={order}
      type={type}
      onOrderPaid={onOrderPaid}
      setProducts={setProducts}
    >
      <div className="w-full h-full flex flex-col gap-6">
        <PaymentMethodsSelection />

        <div className="w-full text-4xl flex h-full gap-4">
          <PaymentSummary totalToPay={applyDiscount(order.total, order.discount)} />

          <Separator orientation="vertical" />

          <div className="flex flex-col w-[40%] gap-6 text-4xl items-center text-center h-full justify-center">
            <PaymentConfirmationAndTools order={order} />
          </div>
        </div>

        <Button onClick={handleBackButton} className="text-lg">
          Indietro
        </Button>
      </div>
    </OrderPaymentProvider>
  );
}
