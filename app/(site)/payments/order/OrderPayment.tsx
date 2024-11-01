import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnyOrder } from "../../types/PrismaOrders";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import applyDiscount from "../../util/functions/applyDiscount";
import Calculator from "./util/Calculator";
import { Coins, CreditCard, ForkKnife, Icon, Money } from "@phosphor-icons/react";
import useOrderPayment from "../../components/hooks/useOrderPayment";
import PaymentSummary from "./PaymentSummary";
import { Button } from "@/components/ui/button";
import formatAmount from "../../util/functions/formatAmount";

export enum TYPE_OF_PAYMENT {
  CASH = "cash",
  CARD = "card",
  VOUCH = "vouch",
  CREDIT = "credit",
}

export type PaymentMethod = {
  type: TYPE_OF_PAYMENT;
  label: string;
  icon: Icon;
};

const paymentMethods: PaymentMethod[] = [
  { type: TYPE_OF_PAYMENT.CASH, label: "Contanti", icon: Money },
  { type: TYPE_OF_PAYMENT.CARD, label: "Carta", icon: CreditCard },
  { type: TYPE_OF_PAYMENT.VOUCH, label: "Buoni pasto", icon: ForkKnife },
  { type: TYPE_OF_PAYMENT.CREDIT, label: "Credito", icon: Coins },
];

export default function OrderPayment({
  handleBackButton,
  handleOrderPaid,
  order,
  type,
  setProducts,
}: {
  handleBackButton: () => void;
  handleOrderPaid: () => void;
  order: AnyOrder;
  type: "full" | "partial";
  setProducts?: Dispatch<SetStateAction<ProductInOrderType[]>>;
}) {
  const { payment, handlePaymentChange, payOrder } = useOrderPayment(
    order,
    type,
    handleOrderPaid,
    setProducts
  );

  const [typedAmount, setTypedAmount] = useState<string>(formatAmount(payment.remainingAmount));

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex justify-between flex-col gap-6">
        <div className="flex justify-between gap-2">
          {paymentMethods.map(({ type, label, icon: Icon }) => (
            <div key={type} className="space-y-2 flex-1">
              <Label className="text-2xl">{label}</Label>

              <div>
                <div
                  onClick={() => {
                    handlePaymentChange(type, Number(typedAmount));
                    setTypedAmount(formatAmount(payment.remainingAmount - Number(typedAmount)));
                  }}
                  className={cn(
                    "h-64 rounded-md flex border-t border-x",
                    "rounded-bl-none rounded-br-none items-center",
                    "justify-center hover:cursor-pointer",
                    "flex flex-col"
                  )}
                >
                  <Icon size={140} />
                </div>

                <span className="border rounded-b-lg w-full flex p-2 justify-center items-center text-xl">
                  € {formatAmount(payment.paymentAmounts[type])}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full text-4xl flex h-full gap-4">
        <PaymentSummary
          totalToPay={applyDiscount(order.total, order.discount)}
          payment={payment}
          paymentMethods={paymentMethods}
        />

        <Separator orientation="vertical" />

        <div className="flex flex-col gap-6 text-4xl items-center text-center h-full justify-center">
          {payment.remainingAmount > 0 ? (
            <Calculator typedAmount={typedAmount} 
            handleBackButton={handleBackButton}
            setTypedAmount={setTypedAmount} />
          ) : (
            <div className="flex flex-col gap-6 text-4xl items-center text-center h-full justify-center">
              <h1>
                <span>
                  Vuoi procedere con l'incasso di <b>€ {order.total}</b>?
                </span>
              </h1>
              <div className="w-full flex gap-6 items-center justify-center">
                <Button
                  className="w-1/3 h-32 text-3xl"
                  variant={"destructive"}
                  onClick={() => handleBackButton()}
                >
                  Cancella
                </Button>
                <Button
                  onClick={() => payOrder()}
                  className="w-1/3 h-32 bg-green-500 text-3xl text-black hover:bg-green-500/90"
                >
                  Conferma
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleBackButton} className="text-lg">Indietro</Button>
    </div>
  );
}
