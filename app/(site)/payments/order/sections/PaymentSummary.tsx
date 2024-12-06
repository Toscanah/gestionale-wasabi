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
    <div className="flex flex-col gap-6 grow h-full">
      <div className="text-5xl">
        <b>RIEPILOGO</b>
      </div>

      {/* Table for Paid Payments */}
      {paidPayments.length > 0 && (
        <table className="w-full text-3xl border-collapse">
          <tbody>
            {paidPayments.map((type) => (
              <tr key={type}>
                <td>{getPaymentName(type)}</td>
                <td className="text-right">{formatAmount(payment.paymentAmounts[type])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {paidPayments.length > 0 && <Separator className="w-full" orientation="horizontal" />}

      {/* Table for Subtotal and Remaining */}
      <table className="w-full text-3xl border-collapse">
        <tbody>
          <tr>
            <td className="text-left">Subtotale:</td>
            <td className="text-right">€ {formatAmount(payment.paidAmount)}</td>
          </tr>
          <tr>
            <td className="text-left">Rimanente (resto):</td>
            <td className="text-right">€ {formatAmount(payment.remainingAmount)}</td>
          </tr>
        </tbody>
      </table>

      <Separator className="w-full" orientation="horizontal" />

      {/* Table for Total to Pay */}
      <table className="w-full text-3xl border-collapse">
        <tbody>
          <tr>
            <td className="text-left font-bold">Totale da Pagare:</td>
            <td className="text-right font-bold">€ {formatAmount(totalToPay)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
