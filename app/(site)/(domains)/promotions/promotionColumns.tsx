import { Button } from "@/components/ui/button";
import {
  ActionColumn,
  FieldColumn,
  IndexColumn,
  ValueColumn,
} from "../../components/table/TableColumns";
import { PromotionByType, PromotionGuards } from "../../lib/shared";
import { ColumnDef } from "@tanstack/react-table";
import { PROMOTION_COLORS, PROMOTION_TYPE_LABELS } from "../../lib/shared/constants/promotion-labels";
import { Badge } from "@/components/ui/badge";
import capitalizeFirstLetter from "../../lib/utils/global/string/capitalizeFirstLetter";
import UsagesDialog from "./UsagesDialog";

const promotionColumns: ColumnDef<PromotionByType>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Tipo",
    accessor: (promotion) => promotion.type,
    value: (row) => {
      const type = row.original.type;
      return <Badge className={PROMOTION_COLORS[type]}>{PROMOTION_TYPE_LABELS[type]}</Badge>;
    },
    skeleton: (
      <Badge className="bg-muted text-muted-foreground border-muted">Sconto percentuale</Badge>
    ),
  }),

  FieldColumn({
    key: "label",
    header: "Etichetta",
  }),
  FieldColumn({
    key: "code",
    header: "Codice",
  }),

  ValueColumn({
    header: "Data creazione",
    value: (row) => {
      const date = new Date(row.original.created_at);
      const weekday = date.toLocaleDateString("it-IT", { weekday: "long" });
      const formattedDate = date.toLocaleDateString("it-IT");
      const formattedTime = date.toLocaleTimeString("it-IT");
      return `${capitalizeFirstLetter(weekday)} ${formattedDate} alle ${formattedTime}`;
    },
    accessor: (promotion) => promotion.created_at,
  }),

  ValueColumn({
    header: "Data scadenza",
    value: (row) => {
      if (row.original.never_expires) {
        return "Nessuna scadenza";
      }

      if (!row.original.expires_at) {
        return "N/A";
      }

      const date = new Date(row.original.expires_at);
      const weekday = date.toLocaleDateString("it-IT", { weekday: "long" });
      const formattedDate = date.toLocaleDateString("it-IT");
      const formattedTime = date.toLocaleTimeString("it-IT");
      return `${capitalizeFirstLetter(weekday)} ${formattedDate} alle ${formattedTime}`;
    },
    accessor: (promotion) => promotion.expires_at,
  }),

  ValueColumn({
    header: "Sconto",
    value: (row) => {
      if (PromotionGuards.isPercentageDiscount(row.original)) {
        return `${row.original.percentage_value}%`;
      }
      if (
        PromotionGuards.isFixedDiscount(row.original) ||
        PromotionGuards.isGiftCard(row.original)
      ) {
        return `€ ${row.original.fixed_amount}`;
      }
      return "N/A";
    },
    accessor: (promotion) => {
      if (PromotionGuards.isPercentageDiscount(promotion)) {
        return promotion.percentage_value;
      }
      if (PromotionGuards.isFixedDiscount(promotion)) {
        return promotion.fixed_amount;
      }
      return null;
    },
  }),

  ActionColumn({
    header: "Utilizzi",
    action: (row) => <UsagesDialog promotion={row.original} />, 
    skeleton: (
      <Button disabled variant={"outline"} className="w-full">
        Skeleton utilizzi
      </Button>
    ),
  }),
];

export default promotionColumns;
