import { OrderWithPayments } from "@shared"
;
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";

export default function DailySummary({ orders }: { orders: OrderWithPayments[] }) {
  const totalOrders = orders.length;
  const totals = orders.reduce(
    (acc, order) => {
      acc.totalCash += order.totalCash;
      acc.totalCard += order.totalCard;
      acc.totalVouch += order.totalVouch;
      acc.totalCredit += order.totalCredit;
      return acc;
    },
    { totalCash: 0, totalCard: 0, totalVouch: 0, totalCredit: 0 }
  );

  const totalDaily = roundToTwo(
    totals.totalCash + totals.totalCard + totals.totalVouch + totals.totalCredit
  );

  return (
    <table className="w-72 text-xl">
      <tbody>
        <tr>
          <td className="text-left">Totale ordini:</td>
          <td className="text-right">{totalOrders}</td>
        </tr>
        <tr>
          <td className="text-left">Totale contanti:</td>
          <td className="text-right">€{roundToTwo(totals.totalCash)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale carta:</td>
          <td className="text-right">€{roundToTwo(totals.totalCard)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale buoni pasto:</td>
          <td className="text-right">€{roundToTwo(totals.totalVouch)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale credito:</td>
          <td className="text-right">€{roundToTwo(totals.totalCredit)}</td>
        </tr>
        <tr>
          <td className="font-bold text-left">Totale giornaliero:</td>
          <td className="font-bold text-right">€{totalDaily}</td>
        </tr>
      </tbody>
    </table>
  );
}
