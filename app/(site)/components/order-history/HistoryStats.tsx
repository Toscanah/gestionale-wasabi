import { AccordionContent } from "@/components/ui/accordion";
import { OrderStats } from "./OrderHistory";
import roundToTwo from "../../lib/formatting-parsing/roundToTwo";
import { useState, useMemo } from "react";
import SelectWrapper from "../ui/select/SelectWrapper";

interface HistoryStatsProps {
  stats: OrderStats;
}

const mesiItaliani = [
  { value: "00", name: "Tutti i mesi" },
  { value: "01", name: "Gennaio" },
  { value: "02", name: "Febbraio" },
  { value: "03", name: "Marzo" },
  { value: "04", name: "Aprile" },
  { value: "05", name: "Maggio" },
  { value: "06", name: "Giugno" },
  { value: "07", name: "Luglio" },
  { value: "08", name: "Agosto" },
  { value: "09", name: "Settembre" },
  { value: "10", name: "Ottobre" },
  { value: "11", name: "Novembre" },
  { value: "12", name: "Dicembre" },
];

export default function HistoryStats({ stats }: HistoryStatsProps) {
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState<string>("00"); // "Tutti i mesi"
  const [year, setYear] = useState<string>(currentYear.toString());

  const yearOptions = useMemo(() => {
    if (!stats.ordersCount.length) return [];

    const years = stats.ordersCount.map((d) => new Date(d).getFullYear());
    const minYear = Math.min(...years);

    const result = [];
    for (let y = minYear; y <= currentYear; y++) {
      result.push({ value: y.toString(), name: y.toString() });
    }

    return result;
  }, [stats.ordersCount]);

  const filteredOrders = useMemo(() => {
    if (!stats.ordersCount.length) return [];

    // Se solo mese senza anno → ritorna dati completi
    if (!year) return stats.ordersCount;

    return stats.ordersCount.filter((dateStr) => {
      const date = new Date(dateStr);
      const orderMonth = String(date.getMonth() + 1).padStart(2, "0");
      const orderYear = String(date.getFullYear());

      // Se anno c’è ma mese è "00" (tutti i mesi)
      if (month === "00") return orderYear === year;

      // Se entrambi presenti e validi
      return orderYear === year && orderMonth === month;
    });
  }, [stats.ordersCount, month, year]);

  return (
    <AccordionContent className="space-y-4">
      <table className="table-auto w-full text-left">
        <tbody>
          <tr>
            <td className="text-lg">Prodotto più acquistato</td>
            <td className="text-lg">
              {stats.mostBoughtProduct
                ? `${stats.mostBoughtProduct.desc} (${stats.mostBoughtProduct.quantity} ${
                    stats.mostBoughtProduct.quantity > 1 ? "volte" : "volta"
                  })`
                : "Nessun prodotto"}
            </td>
          </tr>
          <tr>
            <td className="text-lg">Prodotto meno acquistato</td>
            <td className="text-lg">
              {stats.leastBoughtProduct
                ? `${stats.leastBoughtProduct.desc} (${stats.leastBoughtProduct.quantity} ${
                    stats.leastBoughtProduct.quantity > 1 ? "volte" : "volta"
                  })`
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
          <tr>
            <td className="text-lg">Numero di ordini</td>
            <td className="text-lg flex gap-4 items-center">
              {filteredOrders.length > 0 ? filteredOrders.length : "Nessun ordine"}

              <SelectWrapper
                className="h-12 w-36"
                defaultValue={currentYear.toString()}
                // placeholder="Anno"
                groups={[{ label: "Anno", items: yearOptions }]}
                onValueChange={(value) => setYear(value)}
              />

              <SelectWrapper
                className="h-12 w-36"
                defaultValue="00"
                // placeholder="Mese"
                groups={[{ label: "Mese", items: mesiItaliani }]}
                onValueChange={(value) => setMonth(value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </AccordionContent>
  );
}
