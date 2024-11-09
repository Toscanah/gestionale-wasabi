import { Separator } from "@/components/ui/separator";
import getPaymentName from "../../../util/functions/getPaymentName";
import formatAmount from "../../../util/functions/formatAmount";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import { PaymentType } from "@prisma/client";

export default function PaymentSummary({ totalToPay }: { totalToPay: number }) {
  const { payment } = useOrderPaymentContext();

  const paidPayments = Object.values(PaymentType).filter((type) => {
    const amount = payment.paymentAmounts[type];
    return amount !== undefined && amount > 0;
  });

  return (
    <div className="flex flex-col gap-4 grow h-full">
      <div className="text-5xl">
        <b>RIEPILOGO:</b>
      </div>

      {paidPayments.length > 0 && (
        <ul className="list-disc list-inside">
          {Object.values(PaymentType).map((type) => (
            <li key={type} className="text-3xl">
              Euro pagati con {getPaymentName(type)}: € {formatAmount(payment.paymentAmounts[type])}
            </li>
          ))}
        </ul>
      )}

      <Separator className="w-full" orientation="horizontal" />

      <div className="text-3xl">Subtotale: € {formatAmount(payment.paidAmount)}</div>
      <div className="text-3xl">Rimanente (resto): € {formatAmount(payment.remainingAmount)}</div>

      <Separator className="w-full" orientation="horizontal" />

      <div className="text-3xl">Totale da pagare: € {formatAmount(totalToPay)}</div>
    </div>
  );
}
