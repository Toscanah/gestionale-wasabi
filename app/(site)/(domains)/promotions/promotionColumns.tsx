import { Button } from "@/components/ui/button";
import {
  ActionColumn,
  FieldColumn,
  IndexColumn,
  ValueColumn,
} from "../../components/table/TableColumns";
import { ColumnDef } from "@tanstack/react-table";
import {
  PROMOTION_COLORS,
  PROMOTION_TYPE_LABELS,
} from "../../lib/shared/constants/promotion-labels";
import { Badge } from "@/components/ui/badge";
import { PromotionByType, PromotionGuards } from "../../lib/shared";
import roundToTwo from "../../lib/utils/global/number/roundToTwo";
import UsagesDialog from "./usages/UsagesDialog";

function calcDiscountRaw(promotion: PromotionByType): number | null {
  if (PromotionGuards.isPercentageDiscount(promotion)) {
    return promotion.percentage_value ?? null;
  }
  if (PromotionGuards.isFixedDiscount(promotion) || PromotionGuards.isGiftCard(promotion)) {
    return Number(promotion.fixed_amount ?? 0);
  }
  return null;
}

function calcAvgUseRaw(promotion: PromotionByType): number | null {
  const usages = promotion.usages ?? [];
  if (usages.length === 0) return null;

  const totalUsed = usages.reduce((sum, u) => sum + (u.amount ?? 0), 0);
  return totalUsed / usages.length;
}

function calcAvgResidualRaw(promotion: PromotionByType): number | null {
  if (!PromotionGuards.isGiftCard(promotion)) return null;

  const fixedAmount = Number(promotion.fixed_amount ?? 0);
  const usages = promotion.usages ?? [];

  if (fixedAmount <= 0 || usages.length === 0) return null;

  const totalUsed = usages.reduce((sum, u) => sum + (u.amount ?? 0), 0);
  const remaining = Math.max(0, fixedAmount - totalUsed);
  return usages.length > 0 ? remaining / usages.length : null;
}

function calcAvgTimeBetweenUsagesRaw(promotion: PromotionByType): number | null {
  const usages = promotion.usages ?? [];
  if (usages.length < 2) return null;

  const sorted = [...usages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const totalDiffDays =
    sorted.slice(1).reduce((sum, u, i) => {
      const prev = sorted[i];
      return sum + (new Date(u.created_at).getTime() - new Date(prev.created_at).getTime());
    }, 0) /
    (1000 * 60 * 60 * 24);

  return totalDiffDays / (sorted.length - 1);
}

function calcDaysUntilExpirationRaw(promotion: PromotionByType): number | null {
  if (promotion.never_expires) return null;
  if (!promotion.expires_at) return null;

  const expiresTs = new Date(promotion.expires_at).getTime();
  const nowTs = Date.now();
  const diffDays = (expiresTs - nowTs) / (1000 * 60 * 60 * 24);

  return Math.max(0, Math.round(diffDays));
}

function calcUsageSpeedRaw(promotion: PromotionByType): number | null {
  const usages = promotion.usages ?? [];
  if (usages.length === 0) return null;

  const firstTs = Math.min(...usages.map((u) => new Date(u.created_at).getTime()));
  const lastTs = Math.max(...usages.map((u) => new Date(u.created_at).getTime()));
  const daysElapsed = Math.max(1, (lastTs - firstTs) / (1000 * 60 * 60 * 24));

  const totalUsed = usages.reduce((sum, u) => sum + (u.amount ?? 0), 0);
  return totalUsed / daysElapsed;
}

function calcProjectedDepletionDateRaw(promotion: PromotionByType): number | null {
  if (!PromotionGuards.isGiftCard(promotion)) return null;

  const fixedAmount = Number(promotion.fixed_amount ?? 0);
  const usages = promotion.usages ?? [];
  if (usages.length === 0 || fixedAmount <= 0) return null;

  const firstTs = Math.min(...usages.map((u) => new Date(u.created_at).getTime()));
  const lastTs = Math.max(...usages.map((u) => new Date(u.created_at).getTime()));
  const daysElapsed = Math.max(1, (lastTs - firstTs) / (1000 * 60 * 60 * 24));

  const totalUsed = usages.reduce((sum, u) => sum + (u.amount ?? 0), 0);
  const remaining = Math.max(0, fixedAmount - totalUsed);
  const burnRate = totalUsed / daysElapsed;

  if (burnRate <= 0) return null;

  const daysToDepletion = remaining / burnRate;
  const projectedDate = new Date(lastTs + daysToDepletion * 24 * 60 * 60 * 1000);

  return projectedDate.getTime();
}

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
      return date.toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    accessor: (promotion) => promotion.created_at,
  }),

  ValueColumn({
    header: "Data scadenza",
    value: (row) => {
      if (row.original.never_expires) return "Nessuna scadenza";
      if (!row.original.expires_at) return "N/A";

      const date = new Date(row.original.expires_at);
      return date.toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    accessor: (promotion) =>
      promotion.expires_at || (promotion.never_expires ? "Nessuna scadenza" : "N/A"),
  }),

  ValueColumn({
    header: "Sconto",
    value: (row) => {
      const promotion = row.original;
      if (PromotionGuards.isPercentageDiscount(promotion)) {
        return `${promotion.percentage_value?.toFixed(0) ?? 0}%`;
      }
      if (PromotionGuards.isFixedDiscount(promotion) || PromotionGuards.isGiftCard(promotion)) {
        return `€ ${roundToTwo(promotion.fixed_amount) ?? 0}`;
      }
      return "N/A";
    },
    accessor: (promotion) => calcDiscountRaw(promotion) ?? 0,
  }),

  ValueColumn({
    header: "Usaggio",
    value: (row) => {
      if (!PromotionGuards.isPercentageDiscount(row.original)) return "N/A";

      const isReusable = row.original.reusable;
      const maxUsages = row.original.max_usages;

      if (!isReusable) return "Singolo utilizzo";
      return maxUsages ? `Fino a ${maxUsages} utilizzi` : "Illimitato";
    },
    accessor: (promotion) => (promotion.reusable ? (promotion.max_usages ?? Infinity) : 0),
  }),

  ValueColumn({
    header: "Valore medio per utilizzo",
    value: (row) => {
      const avg = calcAvgUseRaw(row.original);
      return avg != null ? `${roundToTwo(avg)} €` : "-";
    },
    accessor: (promotion) => calcAvgUseRaw(promotion) ?? 0,
  }),

  ValueColumn({
    header: "Importo residuo medio stimato",
    value: (row) => {
      const avgResidual = calcAvgResidualRaw(row.original);
      return avgResidual != null ? `${roundToTwo(avgResidual)} €` : "N/A";
    },
    accessor: (promotion) => calcAvgResidualRaw(promotion) ?? 0,
  }),

  ValueColumn({
    header: "Intervallo medio tra usi",
    value: (row) => {
      const avgDays = calcAvgTimeBetweenUsagesRaw(row.original);
      return avgDays != null ? `${avgDays.toFixed(1)} giorni` : "-";
    },
    accessor: (promotion) => calcAvgTimeBetweenUsagesRaw(promotion) ?? 0,
  }),

  ValueColumn({
    header: "Giorni fino alla scadenza",
    value: (row) => {
      const diff = calcDaysUntilExpirationRaw(row.original);
      if (row.original.never_expires) return "Nessuna scadenza";
      if (diff == null) return "N/A";
      return `${diff} giorni`;
    },
    accessor: (promotion) => calcDaysUntilExpirationRaw(promotion) ?? 0,
  }),

  ValueColumn({
    header: "Velocità di utilizzo",
    value: (row) => {
      const speed = calcUsageSpeedRaw(row.original);
      return speed != null ? `${roundToTwo(speed)} €/giorno` : "-";
    },
    accessor: (promotion) => calcUsageSpeedRaw(promotion) ?? 0,
  }),

  ValueColumn({
    header: "Proiezione data esaurimento",
    value: (row) => {
      const depletionTs = calcProjectedDepletionDateRaw(row.original);
      return depletionTs != null ? new Date(depletionTs).toLocaleDateString("it-IT") : "-";
    },
    accessor: (promotion) => calcProjectedDepletionDateRaw(promotion) ?? null,
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
