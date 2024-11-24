import { OrderWithPayments } from "../../types/OrderWithPayments";

export default function DailySummary({ orders }: { orders: OrderWithPayments[] }) {
  const totalCash = orders.reduce((sum, order) => sum + order.totalCash, 0);
  const totalCard = orders.reduce((sum, order) => sum + order.totalCard, 0);
  const totalVouch = orders.reduce((sum, order) => sum + order.totalVouch, 0);
  const totalCredit = orders.reduce((sum, order) => sum + order.totalCredit, 0);
  const totalOrders = orders.length;
  const totalDaily = (totalCash + totalCard + totalVouch + totalCredit).toFixed(2);

  return (
    <table className="mt-auto w-72 text-xl">
      <tbody>
        <tr>
          <td className="text-left">Totale ordini:</td>
          <td className="text-right">{totalOrders}</td>
        </tr>
        <tr>
          <td className="text-left">Totale contanti:</td>
          <td className="text-right">€{totalCash.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale carta:</td>
          <td className="text-right">€{totalCard.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale buoni pasto:</td>
          <td className="text-right">€{totalVouch.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="text-left">Totale credito:</td>
          <td className="text-right">€{totalCredit.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="font-bold text-left">Totale giornaliero:</td>
          <td className="font-bold text-right">€{totalDaily}</td>
        </tr>
      </tbody>
    </table>
  );
}
