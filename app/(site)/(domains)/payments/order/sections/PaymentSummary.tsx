import { Separator } from "@/components/ui/separator";
import getPaymentName from "../../../../lib/services/order-management/getPaymentName";
import roundToTwo from "../../../../lib/formatting-parsing/roundToTwo";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import { PaymentType } from "@prisma/client";
import getDiscountedTotal from "@/app/(site)/lib/services/order-management/getDiscountedTotal";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import roundToCents from "@/app/(site)/lib/utils/roundToCents";

export default function PaymentSummary() {
  const { payment, orderTotal } = useOrderPaymentContext();

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
                <td className="text-right">{roundToCents(payment.paymentAmounts[type] ?? 0)}</td>
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
            <td className="text-right">€ {roundToCents(payment.paidAmount)}</td>
          </tr>
          <tr>
            <td className="text-left">Rimanente (resto):</td>
            <td className="text-right">€ {roundToCents(payment.remainingAmount)}</td>
          </tr>
        </tbody>
      </table>

      <Separator className="w-full" orientation="horizontal" />

      {/* Table for Total to Pay */}
      <table className="w-full text-3xl border-collapse">
        <tbody>
          <tr>
            <td className="text-left font-bold">Totale da Pagare:</td>
            <td className="text-right font-bold">€ {roundToCents(orderTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
