import { PaymentType } from "@prisma/client";
import { PaymentMethod } from "../OrderPayment";
import { Coins, CreditCard, ForkKnife, Money } from "@phosphor-icons/react";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import roundToTwo from "@/app/(site)/lib/formatting-parsing/roundToTwo";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const paymentMethods: PaymentMethod[] = [
  { type: PaymentType.VOUCH, label: "Buoni pasto 饭票", icon: ForkKnife },
  { type: PaymentType.CASH, label: "Contanti 现金", icon: Money },
  { type: PaymentType.CARD, label: "Carta 卡", icon: CreditCard },
  // { type: PaymentType.CREDIT, label: "Credito", icon: Coins },
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
    setActiveTool,
  } = useOrderPaymentContext();

  const handlePaymentClick = (type: PaymentType) => {
    if (activeTool === "table") {
      const totalAmount = paymentCalculations.reduce((sum, row) => sum + row.total, 0);

      handlePaymentChange(type, totalAmount);
      setTypedAmount(roundToTwo(payment.remainingAmount - totalAmount).toString());
      setPaymentCalculations([{ amount: 0, quantity: 0, total: 0 }]);

      if (totalAmount > 0) {
        setActiveTool("manual");
      }
    } else {
      handlePaymentChange(type, Number(typedAmount));
      setTypedAmount(roundToTwo(payment.remainingAmount - Number(typedAmount)).toString());
    }
  };

  return (
    <div className="w-full flex justify-between flex-col gap-6 h-2/5">
      <div className="flex justify-between gap-2">
        {paymentMethods.map(({ type, label, icon: Icon }) => (
          <div key={type} className="space-y-2 flex-1 flex flex-col items-center">
            <Label className="text-2xl w-full text-center">{label}</Label>

            <div className="w-full">
              <div
                onClick={() => handlePaymentClick(type)}
                className={cn(
                  "h-40 rounded-md flex border-t border-x",
                  "rounded-bl-none rounded-br-none items-center",
                  "justify-center hover:cursor-pointer",
                  "flex flex-col "
                )}
              >
                <Icon size={140} />
              </div>

              <span className="border rounded-b-lg w-full flex p-2 justify-center items-center text-xl">
                € {roundToTwo(payment.paymentAmounts[type])}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
