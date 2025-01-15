import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CustomerWithDetails } from "../../models";
import { format } from "date-fns"; // Ensure date-fns is installed
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import ScoreDialog from "./ScoreDialog";
import joinItemsWithComma from "../../functions/formatting-parsing/joinItemsWithComma";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";

const columns: ColumnDef<CustomerWithDetails>[] = [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Telefono",
  }),

  TableColumn({
    accessorKey: "name_surname",
    header: "Chi",
    cellContent: (row) => {
      const { name, surname } = row.original;
      return [name, surname].filter(Boolean).join(" ") || "";
    },
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Campanelli",
    cellContent: (row) => (
      <div className="max-w-36">{joinItemsWithComma(row.original, "doorbells")}</div>
    ),
  }),

  TableColumn({
    accessorKey: "orders_per_week",
    header: "Media a settimana",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      const orderDates = orders.map((order) => new Date(order.order.created_at));

      if (orderDates.length === 0) return 0;

      // Calculate the first and last order dates
      const { firstOrder, lastOrder } = orderDates.reduce(
        (acc, date) => {
          if (date < acc.firstOrder) acc.firstOrder = date;
          if (date > acc.lastOrder) acc.lastOrder = date;
          return acc;
        },
        { firstOrder: orderDates[0], lastOrder: orderDates[0] }
      );

      // Calculate the total number of weeks between the first and last order
      const totalWeeks = (lastOrder.getTime() - firstOrder.getTime()) / (1000 * 60 * 60 * 24 * 7);

      // Calculate the average
      return orders.length / totalWeeks;
    },
  }),

  TableColumn({
    accessorKey: "orders_per_month",
    header: "Media al mese",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      const orderDates = orders.map((order) => new Date(order.order.created_at));

      if (orderDates.length === 0) return 0;

      // Calculate the first and last order dates
      const { firstOrder, lastOrder } = orderDates.reduce(
        (acc, date) => {
          if (date < acc.firstOrder) acc.firstOrder = date;
          if (date > acc.lastOrder) acc.lastOrder = date;
          return acc;
        },
        { firstOrder: orderDates[0], lastOrder: orderDates[0] }
      );

      // Calculate the total number of months between the first and last order
      const totalMonths =
        (lastOrder.getFullYear() - firstOrder.getFullYear()) * 12 +
        (lastOrder.getMonth() - firstOrder.getMonth()) +
        1;

      // Calculate the average
      return (orders.length / totalMonths).toFixed(2);
    },
  }),

  TableColumn({
    accessorKey: "orders_per_year",
    header: "Media all'anno",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      const orderDates = orders.map((order) => new Date(order.order.created_at));

      if (orderDates.length === 0) return 0;

      // Calculate the first and last order dates
      const { firstOrder, lastOrder } = orderDates.reduce(
        (acc, date) => {
          if (date < acc.firstOrder) acc.firstOrder = date;
          if (date > acc.lastOrder) acc.lastOrder = date;
          return acc;
        },
        { firstOrder: orderDates[0], lastOrder: orderDates[0] }
      );

      // Calculate the total number of years between the first and last order
      const totalYears = lastOrder.getFullYear() - firstOrder.getFullYear() + 1;

      // Calculate the average
      return (orders.length / totalYears).toFixed(2);
    },
  }),

  TableColumn({
    accessorKey: "average_spending",
    header: "Spesa media",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      if (orders.length === 0) return "";
      const totalSpent = orders.reduce((sum, order) => sum + (order.order.total || 0), 0);
      return roundToTwo(totalSpent / orders.length);
    },
  }),

  TableColumn({
    accessorKey: "last_order_date",
    header: "Ultimo ordine",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      if (orders.length === 0) return "";
      const lastOrder = orders.reduce((latest, order) => {
        const orderDate = new Date(order.order.created_at);
        return orderDate > latest ? orderDate : latest;
      }, new Date(0));
      return format(lastOrder, "dd/MM/yyyy");
    },
  }),

  TableColumn({
    accessorKey: "total_spent",
    header: "Spesa totale",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      const totalSpent = orders.reduce((sum, order) => sum + (order.order.total || 0), 0);
      return roundToTwo(totalSpent);
    },
  }),

  // TableColumn({
  //   accessorKey: "score",
  //   header: "Punteggio",
  // }),

  TableColumn({
    accessorKey: "customer_score",
    header: "Punteggio",
    cellContent: (row) => <ScoreDialog customer={row.original} />,
  }),

  TableColumn({
    accessorKey: "marketing",
    header: "Marketing",
    cellContent: (row) => <Button>Azioni marketing</Button>,
  }),
];

export default columns;
