import { PaymentType } from "@prisma/client";
import { PaymentMethod } from "../OrderPayment";
import { Coins, CreditCard, ForkKnife, Money } from "@phosphor-icons/react";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import formatAmount from "@/app/(site)/util/functions/formatAmount";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const paymentMethods: PaymentMethod[] = [
  { type: PaymentType.CASH, label: "Contanti", icon: Money },
  { type: PaymentType.CARD, label: "Carta", icon: CreditCard },
  { type: PaymentType.VOUCH, label: "Buoni pasto", icon: ForkKnife },
  { type: PaymentType.CREDIT, label: "Credito", icon: Coins },
];

export default function PaymentMethodsSelection() {
  const {
    activeTool,
    handlePaymentChange,
    setTypedAmount,
    payment,
    paymentCalculations,
    setPaymentCalculations,
    typedAmount,
  } = useOrderPaymentContext();

  const handlePaymentClick = (type: PaymentType) => {
    if (activeTool === "table") {
      const totalAmount = paymentCalculations.reduce((sum, row) => sum + row.total, 0);

      handlePaymentChange(type, totalAmount);
      setTypedAmount(formatAmount(payment.remainingAmount - totalAmount));
      setPaymentCalculations([{ amount: 0, quantity: 0, total: 0 }]);
    } else {
      handlePaymentChange(type, Number(typedAmount));
      setTypedAmount(formatAmount(payment.remainingAmount - Number(typedAmount)));
    }
  };

  return (
    <div className="w-full flex justify-between flex-col gap-6 h-2/5">
      <div className="flex justify-between gap-2">
        {paymentMethods.map(({ type, label, icon: Icon }) => (
          <div key={type} className="space-y-2 flex-1">
            <Label className="text-2xl">{label}</Label>

            <div>
              <div
                onClick={() => handlePaymentClick(type)}
                className={cn(
                  "h-52 rounded-md flex border-t border-x",
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
  );
}
