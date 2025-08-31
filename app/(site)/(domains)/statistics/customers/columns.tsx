import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns"; // Ensure date-fns is installed
import WasabiDialog from "../../../components/ui/dialog/WasabiDialog";
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

const QuickTooltip = ({ title, label }: { title: string; label: string }) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger className="flex gap-2 items-center">
      <Warning color={"yellow"} className="h-4 w-4" />
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
    key: "phone.phone",
    header: "Telefono",
  }),

  FullNameColumn({}),

  JoinColumn({
    header: "Campanelli",
    options: {
      key: "doorbells",
      wrapper: ({ children }) => <div className="max-w-36">{children}</div>,
    },
  }),

  // FieldColumn({
  //   key: "averageOrdersWeek",
  //   header: "Media a settimana",
  // }),

  // FieldColumn({
  //   key: "averageOrdersMonth",
  //   header: "Media al mese",
  // }),

  // FieldColumn({
  //   key: "averageOrdersYear",
  //   header: "Media all'anno",
  // }),

  ValueColumn({
    header: <QuickTooltip title="RFM" label="L'indice RFM" />,
    value: (row) => roundToTwo(row.original.rfm.score.finalScore),
    accessor: (customer) => customer.rfm.score.finalScore,
  }),

  ValueColumn({
    header: <QuickTooltip title="Rank" label="Il rank RFM" />,
    value: (row, meta) => {
      const { ranks, theme } = meta as CustomerStatsTableMeta;

      const colorArray =
        theme === "dark" ? ["#00FF00", "#FFFF00", "#FF0000"] : ["#009688", "#FF9800", "#795548"];

      const sorted = [...ranks].sort((a, b) => b.priority - a.priority);

      const currentRank = row.original.rfm.rank;
      const index = sorted.findIndex(
        (r) => r.rank.trim().toLowerCase() === currentRank.trim().toLowerCase()
      );

      if (index === -1) return "-";

      const scale = chroma.scale(colorArray).colors(sorted.length);
      const color = scale[index];

      return <span style={{ color, fontWeight: 600 }}>{currentRank}</span>;
    },
    accessor: (customer) => JSON.stringify(customer.rfm),
    sortingFn: (rowA, rowB, columnId) => {
      const meta =
        (rowA.getAllCells().at(0)?.getContext().table.options.meta as CustomerStatsTableMeta) ?? {};

      const ranks = meta.ranks ?? [];
      // build lookup map (rank → priority)
      const map = new Map(ranks.map((r) => [r.rank, r.priority]));

      // values from the rows
      const aRank = rowA.getValue<string>(columnId);
      const bRank = rowB.getValue<string>(columnId);

      // priorities (fallback to -Infinity if not found)
      const aP = map.get(aRank) ?? -Infinity;
      const bP = map.get(bRank) ?? -Infinity;

      // higher priority first
      return bP - aP;
    },
  }),

  ValueColumn({
    header: "Ultimo ordine",
    value: (row) => (row.original.lastOrder ? format(row.original.lastOrder, "dd-MM-yyyy") : ""),
    accessor: (customer) => customer.lastOrder,
  }),

  FieldColumn({
    key: "averageSpending",
    header: "Spesa media",
  }),

  FieldColumn({
    key: "totalSpending",
    header: "Spesa totale",
  }),

  // TableColumn({
  //   accessorKey: "score",
  //   header: "Punteggio",
  // }),

  // TableColumn({
  //   accessorKey: "customer_score",
  //   header: "Punteggio",
  //   cellContent: (row) => <ScoreDialog customer={row.original} />,
  // }),

  ActionColumn({
    header: "Storico ordini",
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
];

export default columns;
