import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { CustomerWithDetails } from "../../models";
import { format } from "date-fns"; // Ensure date-fns is installed
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import ScoreDialog from "./ScoreDialog";

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
      return [name, surname].filter(Boolean).join(" ") || ""; // Graceful fallback
    },
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Campanelli",
    cellContent: (row) => {
      const { addresses } = row.original;
      if (!addresses || addresses.length === 0) return "N/A";
      return (
        <div className="max-w-36">
          {addresses
            .map((address) => {
              const doorbell = address?.doorbell || "N/A";
              return doorbell.charAt(0).toUpperCase() + doorbell.slice(1);
            })
            .join(", ")}
        </div>
      );
    },
  }),

  TableColumn({
    accessorKey: "orders_per_week",
    header: "A settimana",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      const weeks = new Set(
        orders.map((order) => format(new Date(order.order.created_at), "yyyy-ww"))
      );
      return weeks.size || 0;
    },
  }),

  TableColumn({
    accessorKey: "orders_per_month",
    header: "Al mese",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      const months = new Set(
        orders.map((order) => format(new Date(order.order.created_at), "yyyy-MM"))
      );
      return months.size || 0;
    },
  }),

  TableColumn({
    accessorKey: "orders_per_year",
    header: "All'anno",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      const years = new Set(
        orders.map((order) => format(new Date(order.order.created_at), "yyyy"))
      );
      return years.size || 0;
    },
  }),

  TableColumn({
    accessorKey: "average_spending",
    header: "Spesa media",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      if (orders.length === 0) return "N/A";
      const totalSpent = orders.reduce((sum, order) => sum + (order.order.total || 0), 0);
      return (totalSpent / orders.length).toFixed(2);
    },
  }),

  TableColumn({
    accessorKey: "last_order_date",
    header: "Ultimo ordine",
    cellContent: (row) => {
      const orders = [...row.original.home_orders, ...row.original.pickup_orders];
      if (orders.length === 0) return "N/A";
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
      return totalSpent.toFixed(2);
    },
  }),

  TableColumn({
    accessorKey: "score",
    header: "Punteggio",
  }),

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
