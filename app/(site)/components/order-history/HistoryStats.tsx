import { AccordionContent } from "@/components/ui/accordion";
import { OrderStats } from "./OrderHistory";

interface HistoryStatsProps {
  stats: OrderStats;
}

export default function HistoryStats({ stats }: HistoryStatsProps) {
  return (
    <AccordionContent className="space-y-4">
      <table className="table-auto w-full text-left">
        <tbody>
          <tr>
            <td className="text-lg ">Prodotto più acquistato</td>
            <td className="text-lg ">
              {stats.mostBoughtProduct
                ? `${stats.mostBoughtProduct.desc} (${stats.mostBoughtProduct.quantity} volte)`
                : "Nessun prodotto"}
            </td>
          </tr>
          <tr>
            <td className="text-lg">Prodotto meno acquistato</td>
            <td className="text-lg ">
              {stats.leastBoughtProduct
                ? `${stats.leastBoughtProduct.desc} (${stats.leastBoughtProduct.quantity} volte)`
                : "Nessun prodotto"}
            </td>
          </tr>
          <tr>
            <td className="text-lg ">Frequenza ordini alla settimana</td>
            <td className="text-lg ">{stats.avgOrdersPerWeek.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="text-lg ">Frequenza ordini al mese</td>
            <td className="text-lg ">{stats.avgOrdersPerMonth.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="text-lg">Frequenza ordini all'anno</td>
            <td className="text-lg">{stats.avgOrdersPerYear.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="text-lg ">Costo medio ordine</td>
            <td className="text-lg ">€ {stats.avgOrderCost.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </AccordionContent>
  );
}
