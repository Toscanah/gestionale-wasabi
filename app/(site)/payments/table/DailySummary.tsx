import { OrderWithPayments } from "../../types/OrderWithPayments";

export default function DailySummary({ orders }: { orders: OrderWithPayments[] }) {
  const totalCash = orders.reduce((sum, order) => sum + order.totalCash, 0);
  const totalCard = orders.reduce((sum, order) => sum + order.totalCard, 0);
  const totalVouch = orders.reduce((sum, order) => sum + order.totalVouch, 0);
  const totalCredit = orders.reduce((sum, order) => sum + order.totalCredit, 0);
  const totalOrders = orders.length;

  return (
    <div className="mt-auto flex justify-between *:text-xl">
      <div className="flex flex-col gap-2">
        <span>Totale ordini: {totalOrders}</span>
        <span>Totale contanti: € {totalCash.toFixed(2)}</span>
        <span>Totale carta: € {totalCard.toFixed(2)}</span>
        <span>Totale buoni pasto: € {totalVouch.toFixed(2)}</span>
        <span>Totale credito: €{totalCredit.toFixed(2)}</span>
      </div>
      <div className="mt-auto">
        <span>
          Totale giornaliero: ${(totalCash + totalCard + totalVouch + totalCredit).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
