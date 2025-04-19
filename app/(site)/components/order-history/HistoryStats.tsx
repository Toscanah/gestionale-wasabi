import { AccordionContent } from "@/components/ui/accordion";
import { OrderStats } from "./OrderHistory";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";

interface HistoryStatsProps {
  stats: OrderStats;
}

export default function HistoryStats({ stats }: HistoryStatsProps) {
  return (
    <AccordionContent className="space-y-4">
      <table className="table-auto w-full text-left">
        <tbody>
          <tr>
            <td className="text-lg">Prodotto più acquistato</td>
            <td className="text-lg">
              {stats.mostBoughtProduct
                ? `${stats.mostBoughtProduct.desc} (${stats.mostBoughtProduct.quantity} volte)`
                : "Nessun prodotto"}
            </td>
          </tr>
          <tr>
            <td className="text-lg">Prodotto meno acquistato</td>
            <td className="text-lg">
              {stats.leastBoughtProduct
                ? `${stats.leastBoughtProduct.desc} (${stats.leastBoughtProduct.quantity} volte)`
                : "Nessun prodotto"}
            </td>
          </tr>
          <tr>
            <td className="text-lg">Costo medio ordine</td>
            <td className="text-lg">€ {roundToTwo(stats.avgOrderCost)}</td>
          </tr>
          <tr>
            <td className="text-lg">Spesa totale</td>
            <td className="text-lg">€ {roundToTwo(stats.totalSpent)}</td>
          </tr>
        </tbody>
      </table>
    </AccordionContent>
  );
}
