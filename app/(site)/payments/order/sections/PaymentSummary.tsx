import { Separator } from "@/components/ui/separator";
import getPaymentName from "../../../functions/order-management/getPaymentName";
import roundToTwo from "../../../functions/formatting-parsing/roundToTwo";
import { useOrderPaymentContext } from "@/app/(site)/context/OrderPaymentContext";
import { PaymentType } from "@prisma/client";
import applyDiscount from "@/app/(site)/functions/order-management/applyDiscount";

export default function PaymentSummary() {
  const { payment, order } = useOrderPaymentContext();
  const totalToPay = applyDiscount(order.total, order.discount);

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
                <td className="text-right">{roundToTwo(payment.paymentAmounts[type])}</td>
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
            <td className="text-right">€ {roundToTwo(payment.paidAmount)}</td>
          </tr>
          <tr>
            <td className="text-left">Rimanente (resto):</td>
            <td className="text-right">€ {roundToTwo(payment.remainingAmount)}</td>
          </tr>
        </tbody>
      </table>

      <Separator className="w-full" orientation="horizontal" />

      {/* Table for Total to Pay */}
      <table className="w-full text-3xl border-collapse">
        <tbody>
          <tr>
            <td className="text-left font-bold">Totale da Pagare:</td>
            <td className="text-right font-bold">€ {roundToTwo(totalToPay)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
