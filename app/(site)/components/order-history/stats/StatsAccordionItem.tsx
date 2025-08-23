import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import { useState, useMemo } from "react";
import SelectWrapper from "../../ui/select/SelectWrapper";
import useHistoryStats, {
  UseHistoryStatsParams,
} from "../../../hooks/order/history/useHistoryStats";
import { Separator } from "@/components/ui/separator";
import AllProductsDialog from "./AllProductsDialog";

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

  const { stats } = useHistoryStats({ allOrders, year, month });

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
    if (!allOrders.length) return [];

    return allOrders.filter((wrapper) => {
      const date = new Date(wrapper.order.created_at);
      const orderMonth = String(date.getMonth() + 1).padStart(2, "0");
      const orderYear = String(date.getFullYear());

      if (month === "00") return orderYear === year;
      return orderYear === year && orderMonth === month;
    });
  }, [allOrders, month, year]);

  const statsRows = [
    {
      label: "Spesa totale",
      value: `€ ${roundToTwo(stats.totalSpent)}`,
    },
    {
      label: "Costo medio ordine",
      value: `€ ${roundToTwo(stats.avgCost)}`,
    },
    {
      label: "Giorni della settimana più comuni",
      value: stats.mostCommonDaysOfWeek.length
        ? stats.mostCommonDaysOfWeek
            .slice(0, 3) // top 3
            .map(
              ({ day, count }, index) =>
                `${index + 1}. ${day.slice(0, 3)} (${formatCountLabel(count)})`
            )
            .join(" | ")
        : "Nessun giorno comune",
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
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex gap-4 items-center w-full">
        <SelectWrapper
          className="h-10 w-full"
          defaultValue={currentYear.toString()}
          groups={[{ label: "Anno", items: yearOptions }]}
          onValueChange={setYear}
        />
        <SelectWrapper
          className="h-10 w-full"
          defaultValue="00"
          groups={[{ label: "Mese", items: ITALIAN_MONTHS }]}
          onValueChange={setMonth}
        />
      </div>

      <Separator />

      {/* Stats */}
      <table className="table-auto w-full text-left border-separate ">
        <tbody className="space-y-2">
          <tr key="amount" className="w-full flex gap-2">
            <td className="text-lg font-medium w-full">Numero di ordini</td>
            <td className="text-lg w-full">
              {filteredOrders.length > 0 ? filteredOrders.length : "Nessun ordine"}
            </td>
          </tr>
          {statsRows.map(({ label, value }) => (
            <tr key={label} className="w-full flex gap-2">
              <td className="text-lg font-medium w-full">{label}</td>
              <td className="text-lg w-full">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AllProductsDialog allProducts={allOrders.map((order) => order.order.products).flat()} />
    </div>
  );
}
