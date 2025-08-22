import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns"; // Ensure date-fns is installed
import DialogWrapper from "../../../components/ui/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import { CustomerWithStats } from "../../../lib/shared/types/CustomerWithStats";
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
    header: "RFM",
    value: (row) => roundToTwo(row.original.rfm.score.finalScore),
    accessor: (customer) => customer.rfm.score.finalScore,
  }),

  ValueColumn({
    header: "Rank",
    value: (row, meta) => {
      const { ranks, theme } = meta as CustomerStatsTableMeta;

      const colorArray =
        theme === "dark" ? ["#00FF00", "#FFFF00", "#FF0000"] : ["#009688", "#FF9800", "#795548"];

      const sorted = [...ranks].sort((a, b) => b.priority - a.priority);

      const currentRank = row.original.rfm.rank;
      const index = sorted.findIndex((r) => r.rank === currentRank);

      if (index === -1) return "-";

      const scale = chroma.scale(colorArray).colors(sorted.length);
      const color = scale[index];

      return <span style={{ color, fontWeight: 600 }}>{currentRank}</span>;
    },
    accessor: (customer) => customer.rfm.rank,
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
        <DialogWrapper
          size="medium"
          title="Storico ordini"
          trigger={
            <Button type="button" variant={"outline"}>
              Vedi ordini precedenti
            </Button>
          }
        >
          <OrderHistory customer={customer} />
        </DialogWrapper>
      );
    },
  }),
];

export default columns;
