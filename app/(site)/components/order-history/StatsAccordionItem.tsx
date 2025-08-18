import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import roundToTwo from "../../lib/utils/global/number/roundToTwo";
import { useState, useMemo } from "react";
import SelectWrapper from "../ui/select/SelectWrapper";
import useHistoryStats, { UseHistoryStatsParams } from "../../hooks/order/history/useHistoryStats";

type HistoryStatsProps = UseHistoryStatsParams;

const ITALIAN_MONTHS = [
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

// Small helper: format "1 volta" / "N volte"
const formatCountLabel = (quantity: number) => `${quantity} ${quantity > 1 ? "volte" : "volta"}`;

export default function StatsAccordionItem({ allOrders }: HistoryStatsProps) {
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState<string>("00");
  const [year, setYear] = useState<string>(currentYear.toString());

  const { stats } = useHistoryStats({ allOrders });

  const yearOptions = useMemo(() => {
    if (!stats.ordersCount.length) return [];

    const years = stats.ordersCount.map((d) => new Date(d).getFullYear());
    const minYear = Math.min(...years);

    return Array.from({ length: currentYear - minYear + 1 }, (_, i) => {
      const y = minYear + i;
      return { value: y.toString(), name: y.toString() };
    });
  }, [stats.ordersCount]);

  const filteredOrders = useMemo(() => {
    if (!stats.ordersCount.length) return [];

    if (!year) return stats.ordersCount; // only month set → all orders

    return stats.ordersCount.filter((dateStr) => {
      const date = new Date(dateStr);
      const orderMonth = String(date.getMonth() + 1).padStart(2, "0");
      const orderYear = String(date.getFullYear());

      if (month === "00") return orderYear === year;
      return orderYear === year && orderMonth === month;
    });
  }, [stats.ordersCount, month, year]);

  const statsRows = [
    {
      label: "Prodotto più acquistato",
      value: stats.mostBoughtProduct
        ? `${stats.mostBoughtProduct.desc} (${formatCountLabel(stats.mostBoughtProduct.quantity)})`
        : "Nessun prodotto",
    },
    {
      label: "Prodotto meno acquistato",
      value: stats.leastBoughtProduct
        ? `${stats.leastBoughtProduct.desc} (${formatCountLabel(
            stats.leastBoughtProduct.quantity
          )})`
        : "Nessun prodotto",
    },
    {
      label: "Costo medio ordine",
      value: `€ ${roundToTwo(stats.avgCost)}`,
    },
    {
      label: "Spesa totale",
      value: `€ ${roundToTwo(stats.totalSpent)}`,
    },
    {
      label: "Giorno della settimana più comune",
      value: stats.mostCommonDayOfWeek || "Nessun giorno comune",
    },
    {
      label: "Orario tipico",
      value:
        stats.typicalTime.lunch || stats.typicalTime.dinner || stats.typicalTime.other
          ? [
              stats.typicalTime.lunch && `Pranzo: ${stats.typicalTime.lunch}`,
              stats.typicalTime.dinner && `Cena: ${stats.typicalTime.dinner}`,
              stats.typicalTime.other && `Altro: ${stats.typicalTime.other}`,
            ]
              .filter(Boolean)
              .join(" | ")
          : "Nessun orario tipico",
    },
  ];

  return (
    <AccordionItem value="stats" key="stats">
      <AccordionTrigger className="text-2xl">Vedi statistiche</AccordionTrigger>

      <AccordionContent className="space-y-4">
        <table className="table-auto w-full text-left">
          <tbody>
            {statsRows.map(({ label, value }) => (
              <tr key={label}>
                <td className="text-lg">{label}</td>
                <td className="text-lg">{value}</td>
              </tr>
            ))}

            <tr>
              <td className="text-lg">Numero di ordini</td>
              <td className="text-lg flex gap-4 items-center">
                {filteredOrders.length > 0 ? filteredOrders.length : "Nessun ordine"}

                <SelectWrapper
                  className="h-10 w-36"
                  defaultValue={currentYear.toString()}
                  groups={[{ label: "Anno", items: yearOptions }]}
                  onValueChange={setYear}
                />

                <SelectWrapper
                  className="h-10 w-36"
                  defaultValue="00"
                  groups={[{ label: "Mese", items: ITALIAN_MONTHS }]}
                  onValueChange={setMonth}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionContent>
    </AccordionItem>
  );
}
