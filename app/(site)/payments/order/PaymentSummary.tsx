import { Separator } from "@/components/ui/separator";
import { Payment } from "../../components/hooks/useOrderPayment";
import getPaymentName from "../../util/functions/getPaymentName";
import { PaymentMethod } from "./OrderPayment";
import formatAmount from "../../util/functions/formatAmount";

export default function PaymentSummary({
  payment,
  paymentMethods,
  totalToPay,
}: {
  payment: Payment;
  paymentMethods: PaymentMethod[];
  totalToPay: number;
}) {
  const paidPayments = paymentMethods.filter(({ type }) => {
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
          {paidPayments.map(({ type }) => (
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
