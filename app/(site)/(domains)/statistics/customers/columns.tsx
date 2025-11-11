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
import { CUSTOMER_ORIGIN_LABELS, CustomerWithStats } from "@/app/(site)/lib/shared";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Warning } from "@phosphor-icons/react";
import { differenceInCalendarDays, format } from "date-fns";
import { DARK_SCALE_3, LIGHT_SCALE_3 } from "@/app/(site)/lib/shared/constants/colors";
import { Separator } from "@/components/ui/separator";
import { EnDash } from "@/app/(site)/components/ui/misc/Placeholders";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";

const QuickTooltip = ({ title, label }: { title: string; label: string }) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger className="flex gap-2 items-center hover:cursor-default">
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

  ValueColumn({
    header: "Origine",
    value: (row) => CUSTOMER_ORIGIN_LABELS[row.original.origin],
    accessor: (customer) => customer.origin,
    sortable: false,
  }),

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
    value: (row, meta) => {
      const rfmScore = roundToTwo(row.original.stats.rfm.score.finalScore);
      const rfm = row.original.stats.rfm.score;
      const cfg = (meta as CustomerStatsTableMeta).rfmRules;

      const recencyW = cfg.recency.weight;
      const frequencyW = cfg.frequency.weight;
      const monetaryW = cfg.monetary.weight;

      const rPart = roundToTwo(rfm.recency * recencyW);
      const fPart = roundToTwo(rfm.frequency * frequencyW);
      const mPart = roundToTwo(rfm.monetary * monetaryW);

      return (
        <WasabiDialog
          title={"Dettagli RFM per " + row.original.phone.phone}
          putSeparator
          putUpperBorder
          size="small"
          trigger={<Button variant="outline">{rfmScore}</Button>}
        >
          <div className="flex flex-col gap-2">
            <span>
              R - Recenza: <span className="font-mono">{roundToTwo(rfm.recency)}</span>
            </span>
            <span>
              F - Frequenza: <span className="font-mono">{roundToTwo(rfm.frequency)}</span>
            </span>
            <span>
              M - Monetario: <span className="font-mono">{roundToTwo(rfm.monetary)}</span>
            </span>

            <Separator />

            <div className="flex flex-col gap-1">
              <span className="font-semibold">Calcolo punteggio finale:</span>
              <span className="font-mono text-sm">{`= (${roundToTwo(rfm.recency)} × ${recencyW}) + (${roundToTwo(rfm.frequency)} × ${frequencyW}) + (${roundToTwo(rfm.monetary)} × ${monetaryW})`}</span>
              <span className="font-mono text-sm">{`= ${rPart} + ${fPart} + ${mPart}`}</span>
              <span className="font-mono text-sm">{`= ${rfmScore}`}</span>
            </div>
          </div>
        </WasabiDialog>
      );
    },
    accessor: (customer) => customer.stats.rfm.score.finalScore,
    sortable: false,
  }),

  ValueColumn({
    header: <QuickTooltip title="Rank" label="Il rank RFM" />,
    sortable: false,
    value: (row, meta) => {
      const { ranks, theme } = meta as CustomerStatsTableMeta;

      const colorArray = theme === "dark" ? DARK_SCALE_3 : LIGHT_SCALE_3;

      const sorted = [...ranks].sort((a, b) => b.priority - a.priority);

      const currentRank = row.original.stats?.rfm.rank;
      const index = sorted.findIndex(
        (r) => r.rank.trim().toLowerCase() === currentRank?.trim().toLowerCase()
      );

      if (index === -1) return <EnDash />;

      const scale = chroma.scale(colorArray).colors(sorted.length);
      const color = scale[index];

      return <span style={{ color, fontWeight: 600 }}>{currentRank}</span>;
    },
    accessor: (customer) => customer.stats.rfm.rank ?? "",
  }),

  ValueColumn({
    header: "Primo ordine",
    value: (row) => {
      if (row.original.stats.firstOrderAt) {
        const firstOrderDate = row.original.stats.firstOrderAt;

        const formattedDate = format(firstOrderDate, "dd-MM-yyyy");
        const daysSince = differenceInCalendarDays(new Date(), firstOrderDate);

        return (
          <>
            <span>
              {formattedDate}{" "}
              <span className="text-muted-foreground">
                ({daysSince === 0 ? "oggi" : `${daysSince} giorni fa`})
              </span>
            </span>
          </>
        );
      }

      return <EnDash />;
    },
    accessor: (customer) => customer.stats.firstOrderAt,
    sortable: false,
  }),

  ValueColumn({
    header: "Ultimo ordine",
    value: (row) => {
      if (row.original.stats.lastOrderAt) {
        const lastOrderDate = row.original.stats.lastOrderAt;
        const formattedDate = format(lastOrderDate, "dd-MM-yyyy");
        const daysSince = differenceInCalendarDays(new Date(), lastOrderDate);

        return (
          <>
            <span>
              {formattedDate}{" "}
              <span className="text-muted-foreground">
                ({daysSince === 0 ? "oggi" : `${daysSince} giorni fa`})
              </span>
            </span>
          </>
        );
      }

      return <EnDash />;
    },
    accessor: (customer) => customer.stats.lastOrderAt,
    sortable: false,
  }),

  ValueColumn({
    header: "Spesa media",
    value: (row) => toEuro(row.original.stats.averageOrder ?? 0),
    accessor: (customer) => customer.stats.averageOrder,
    sortable: false,
  }),

  ValueColumn({
    header: "Spesa totale",
    value: (row) => toEuro(row.original.stats.totalSpent ?? 0),
    accessor: (customer) => customer.stats.totalSpent,
    sortable: false,
  }),

  ValueColumn({
    header: "Num. ordini",
    value: (row) => row.original.stats.totalOrders,
    accessor: (customer) => customer.stats.totalOrders,
    sortable: false,
  }),

  ActionColumn({
    header: "Storico",
    action: (row) => {
      const customer = row.original;

      return (
        <WasabiDialog
          size="mediumPlus"
          title="Storico cliente"
          putUpperBorder
          trigger={
            <Button type="button" variant={"outline"} className="w-full">
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
