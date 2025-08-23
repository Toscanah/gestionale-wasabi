import { ColumnDef } from "@tanstack/react-table";
import { CustomerOrdersStats } from "../../hooks/order/history/useHistoryStats";
import { ValueColumn } from "../table/TableColumns";
import roundToTwo from "../../lib/utils/global/number/roundToTwo";

const formatCountLabel = (quantity: number) => `${quantity} ${quantity > 1 ? "volte" : "volta"}`;

const statsColumns: ColumnDef<CustomerOrdersStats>[] = [
  ValueColumn({
    header: "Spesa totale",
    value: (row) => `€ ${roundToTwo(row.original.totalSpent)}`,
    accessor: (original) => original.totalSpent,
  }),

  ValueColumn({
    header: "Costo medio ordine",
    value: (row) => `€ ${roundToTwo(row.original.avgCost)}`,
    accessor: (original) => original.avgCost,
  }),

  ValueColumn({
    header: "Giorni della settimana più comuni",
    value: (row) => {
      const days = row.original.mostCommonDaysOfWeek
        .slice(0, 3)
        .map(({ day, count }, index) => `${index + 1}. ${day} (${formatCountLabel(count)})`)
        .join(" | ");
      return days || "Nessun giorno comune";
    },
    accessor: (original) => original.mostCommonDaysOfWeek.toString(),
  }),

  ValueColumn({
    header: "Orario tipico",
    value: (row) => {
      const times = [
        row.original.typicalTime.lunch && `Pranzo: ${row.original.typicalTime.lunch}`,
        row.original.typicalTime.dinner && `Cena: ${row.original.typicalTime.dinner}`,
        row.original.typicalTime.other && `Altro: ${row.original.typicalTime.other}`,
      ]
        .filter(Boolean)
        .join(" | ");
      return times || "Nessun orario tipico";
    },
    accessor: (original) => original.typicalTime.toString(),
  }),

  ValueColumn({
    header: "Prodotto più acquistato",
    value: (row) => {
      const product = row.original.mostBoughtProduct;
      return product
        ? `${product.desc} (${formatCountLabel(product.quantity)})`
        : "Nessun prodotto";
    },
    accessor: (original) => original.mostBoughtProduct?.desc,
  }),

  ValueColumn({
    header: "Prodotto meno acquistato",
    value: (row) => {
      const product = row.original.leastBoughtProduct;
      return product
        ? `${product.desc} (${formatCountLabel(product.quantity)})`
        : "Nessun prodotto";
    },
    accessor: (original) => original.leastBoughtProduct?.desc,
  }),
];

export default statsColumns;