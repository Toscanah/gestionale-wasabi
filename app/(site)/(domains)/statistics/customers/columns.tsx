import { ColumnDef } from "@tanstack/react-table";
import WasabiDialog from "../../../components/ui/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
import OrderHistory from "../../../components/order-history/OrderHistory";
import {
  ActionColumn,
  FieldColumn,
  JoinColumn,
  ValueColumn,
} from "@/app/(site)/components/table/TableColumns";
import FullNameColumn from "@/app/(site)/components/table/common/FullNameColumn";
import roundToTwo from "@/app/(site)/lib/utils/global/number/roundToTwo";
import { CustomerStatsTableMeta } from "./page";
import chroma from "chroma-js";
import { CustomerWithStats } from "@/app/(site)/lib/shared";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Warning } from "@phosphor-icons/react";
import { differenceInCalendarDays, format } from "date-fns";

const QuickTooltip = ({ title, label }: { title: string; label: string }) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger className="flex gap-2 items-center">
      <Warning color={"#d97706"} className="h-4 w-4" />
      {title}
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p className="w-60 whitespace-normal break-words">
        {label} è calcolato sull'intera storia degli ordini del cliente e non è influenzato dai
        filtri per data.
      </p>
    </TooltipContent>
  </Tooltip>
);

const columns: ColumnDef<CustomerWithStats>[] = [
  FieldColumn({
    header: "Telefono",
    key: "phone.phone",
    sortable: false,
  }),

  FullNameColumn({ sortable: false }),

  JoinColumn({
    header: "Campanelli",
    options: {
      key: "doorbells",
      wrapper: ({ children }) => <div className="max-w-36">{children}</div>,
    },
    sortable: false,
  }),

  ValueColumn({
    header: <QuickTooltip title="RFM" label="L'indice RFM" />,
    value: (row) => roundToTwo(row.original.stats.rfm.score.finalScore),
    accessor: (customer) => customer.stats.rfm.score.finalScore,
    sortable: false,
  }),

  ValueColumn({
    header: <QuickTooltip title="Rank" label="Il rank RFM" />,
    sortable: false,
    value: (row, meta) => {
      const { ranks, theme } = meta as CustomerStatsTableMeta;

      const colorArray =
        theme === "dark" ? ["#00FF00", "#FFFF00", "#FF0000"] : ["#009688", "#FF9800", "#795548"];

      const sorted = [...ranks].sort((a, b) => b.priority - a.priority);

      const currentRank = row.original.stats?.rfm.rank;
      const index = sorted.findIndex(
        (r) => r.rank.trim().toLowerCase() === currentRank?.trim().toLowerCase()
      );

      if (index === -1) return "-";

      const scale = chroma.scale(colorArray).colors(sorted.length);
      const color = scale[index];

      return <span style={{ color, fontWeight: 600 }}>{currentRank}</span>;
    },
    accessor: (customer) => customer.stats.rfm.rank ?? "",
  }),

  ValueColumn({
    header: "Ultimo ordine",
    value: (row) => {
      if (row.original.stats.last_order_at) {
        const lastOrderDate = row.original.stats.last_order_at;
        const formattedDate = format(lastOrderDate, "dd-MM-yyyy");
        const daysSince = differenceInCalendarDays(new Date(), lastOrderDate);

        return (
          <>
            <span>
              {formattedDate} <span className="text-muted-foreground">({daysSince} giorni fa)</span>
            </span>
          </>
        );
      }

      return "";
    },
    accessor: (customer) => customer.stats.last_order_at,
    sortable: false,
  }),

  ValueColumn({
    header: "Primo ordine",
    value: (row) =>
      row.original.stats.firstOrderAt
        ? format(row.original.stats.first_order_at, "dd-MM-yyyy")
        : "",
    accessor: (customer) => customer.stats.first_order_at,
    sortable: false,
  }),

  ValueColumn({
    header: "Spesa media (€)",
    value: (row) => "€ " + roundToTwo(row.original.stats.average_order),
    accessor: (customer) => customer.stats.average_order,
    sortable: false,
  }),

  ValueColumn({
    header: "Spesa totale (€)",
    value: (row) => "€ " + roundToTwo(row.original.stats.total_spent),
    accessor: (customer) => customer.stats.total_spent,
    sortable: false,
  }),

  ValueColumn({
    header: "Numero ordini",
    value: (row) => row.original.stats.totalOrders,
    accessor: (customer) => customer.stats.totalOrders,
    sortable: false,
  }),

  ActionColumn({
    header: "Altro",
    action: (row) => {
      const customer = row.original;

      return (
        <WasabiDialog
          size="mediumPlus"
          title="Storico cliente"
          putUpperBorder
          trigger={
            <Button type="button" variant={"outline"}>
              Vedi ordini precedenti
            </Button>
          }
        >
          <OrderHistory customer={customer} />
        </WasabiDialog>
      );
    },
  }),

  // ActionColumn({
  //   header: "Altro",
  //   action: (row) => {
  //     const customer = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="outline">Open</Button>
  //         </DropdownMenuTrigger>

  //         <DropdownMenuContent align="start">
  //           <WasabiDialog

  //             size="mediumPlus"
  //             title="Storico cliente"
  //             putUpperBorder
  //             trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Vedi ordini precedenti</DropdownMenuItem>}
  //           >
  //             <OrderHistory customer={customer} />
  //           </WasabiDialog>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // }),
];

export default columns;
