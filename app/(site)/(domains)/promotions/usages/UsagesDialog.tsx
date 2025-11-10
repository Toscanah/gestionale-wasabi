import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { promotionsAPI } from "@/lib/server/api";
import { useState } from "react";
import { ActionColumn, IndexColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import useTable from "@/app/(site)/hooks/table/useTable";
import {
  ComprehensivePromotionUsage,
  ORDER_TYPE_COLORS,
  ORDER_TYPE_LABELS,
  OrderGuards,
  PromotionGuards,
  PromotionUsageWithOrder,
  PromotionWithUsages,
  SHIFT_LABELS,
} from "@/app/(site)/lib/shared";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import Table from "@/app/(site)/components/table/Table";
import { Badge } from "@/components/ui/badge";
import WasabiPopover from "@/app/(site)/components/ui/wasabi/WasabiPopover";
import { Separator } from "@/components/ui/separator";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import capitalizeFirstLetter from "@/app/(site)/lib/utils/global/string/capitalizeFirstLetter";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { OrderStatus, WorkingShift } from "@prisma/client";
import { TrashIcon } from "@phosphor-icons/react";
import { trpc } from "@/lib/server/client";

function canDeleteUsage(usage: ComprehensivePromotionUsage): boolean {
  const order = usage.order;

  if (order.status === OrderStatus.PAID) return false;

  if (order.status === OrderStatus.ACTIVE && order.payments && order.payments.length > 0)
    return false;

  return true;
}

const usagesColumns: ColumnDef<ComprehensivePromotionUsage>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Ordine",
    value: (row) => {
      const order = row.original.order;
      const orderShift = order.shift;
      let specificInfo: React.ReactNode = null;

      if (OrderGuards.isTable(order)) {
        specificInfo = (
          <>
            <li>Nome: {order.table_order.res_name || "N/A"}</li>
            <li>Tavolo: {order.table_order.table}</li>
            <li>Persone: {order.table_order.people}</li>
          </>
        );
      } else if (OrderGuards.isHome(order)) {
        specificInfo = (
          <>
            <li>Telefono: {order.home_order.customer.phone.phone}</li>
            <li>
              Indirizzo: {order.home_order.address.street} {order.home_order.address.civic}
            </li>
          </>
        );
      } else if (OrderGuards.isPickup(order)) {
        specificInfo = (
          <>
            <li>Telefono: {order.pickup_order.customer?.phone.phone ?? "N/A"}</li>
            <li>Nome: {order.pickup_order.name}</li>
          </>
        );
      }

      return (
        <WasabiPopover trigger={<Button variant="outline">Dettagli ordine</Button>}>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex gap-2 items-center">
              <Badge className={ORDER_TYPE_COLORS[order.type]}>
                {ORDER_TYPE_LABELS[order.type]}
              </Badge>
              <span className="text-muted-foreground">
                {capitalizeFirstLetter(
                  new Date(order.created_at).toLocaleString("it-IT", {
                    weekday: "long",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )}
              </span>
            </div>
            <span>
              Totale senza sconti: {toEuro(getOrderTotal({ order, applyDiscounts: false }))}
            </span>

            <span>
              Turno:{" "}
              {orderShift == WorkingShift.DINNER
                ? "Cena"
                : orderShift == WorkingShift.LUNCH
                  ? "Pranzo"
                  : "Non specificato"}
            </span>
            <Separator />

            <ul className="text-xs space-y-1 list-disc list-inside">{specificInfo}</ul>
          </div>
        </WasabiPopover>
      );
    },
    accessor: (usage) => usage.order.type,
  }),

  ValueColumn({
    header: "Data utilizzo",
    value: (row) => new Date(row.original.created_at).toLocaleDateString(),
    accessor: (usage) => usage.created_at,
  }),

  ValueColumn({
    header: "Ammontare usato",
    value: (row) => row.original.amount.toFixed(2) + " €",
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Ammontare rimanente",
    value: (row) => {
      const promotion = row.original.promotion;

      // 🧩 Handle each promo type explicitly
      if (PromotionGuards.isPercentageDiscount(promotion)) {
        // % discounts don't have a fixed amount → no "remaining" concept
        return "N/A";
      }

      if (PromotionGuards.isFixedDiscount(promotion) || PromotionGuards.isGiftCard(promotion)) {
        const fixedAmount = promotion.fixed_amount;
        const usageTs = new Date(row.original.created_at).getTime();
        const usages = promotion.usages ?? [];

        const usedUntil = usages
          .filter((u) => new Date(u.created_at).getTime() <= usageTs)
          .reduce((sum, u) => sum + (u.amount ?? 0), 0);

        const remaining = Math.max(0, fixedAmount - usedUntil);
        return `${remaining.toFixed(2)} €`;
      }

      return "—";
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Totale usato (cumulativo)",
    value: (row) => {
      const promotion = row.original.promotion;
      const usageTs = new Date(row.original.created_at).getTime();
      const usages = promotion.usages ?? [];

      const usedUntil = usages
        .filter((u) => new Date(u.created_at).getTime() <= usageTs)
        .reduce((sum, u) => sum + (u.amount ?? 0), 0);

      return `${usedUntil.toFixed(2)} €`;
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Percentuale usata",
    value: (row) => {
      const promotion = row.original.promotion;

      if (PromotionGuards.isPercentageDiscount(promotion)) {
        return "N/A";
      }

      if (PromotionGuards.isFixedDiscount(promotion) || PromotionGuards.isGiftCard(promotion)) {
        const fixedAmount = promotion.fixed_amount;
        if (fixedAmount <= 0) return "N/A";

        const usageTs = new Date(row.original.created_at).getTime();
        const usages = promotion.usages ?? [];

        const usedUntil = usages
          .filter((u) => new Date(u.created_at).getTime() <= usageTs)
          .reduce((sum, u) => sum + (u.amount ?? 0), 0);

        const percentageUsed = (usedUntil / fixedAmount) * 100;
        return `${percentageUsed.toFixed(1)} %`;
      }

      // 🪝 fallback for unknown or future promo types
      return "—";
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Percentuale rimanente",
    value: (row) => {
      const promotion = row.original.promotion;

      if (PromotionGuards.isPercentageDiscount(promotion)) {
        // Percentage promos have no fixed balance
        return "N/A";
      }

      if (PromotionGuards.isFixedDiscount(promotion) || PromotionGuards.isGiftCard(promotion)) {
        const fixedAmount = promotion.fixed_amount;
        if (fixedAmount <= 0) return "N/A";

        const usageTs = new Date(row.original.created_at).getTime();
        const usages = promotion.usages ?? [];

        const usedUntil = usages
          .filter((u) => new Date(u.created_at).getTime() <= usageTs)
          .reduce((sum, u) => sum + (u.amount ?? 0), 0);

        const remainingPct = ((fixedAmount - usedUntil) / fixedAmount) * 100;
        return `${remainingPct.toFixed(1)} %`;
      }

      return "—";
    },
    accessor: (usage) => usage.amount,
  }),

  ValueColumn({
    header: "Intervallo dall'uso precedente",
    value: (row) => {
      const usageTs = new Date(row.original.created_at).getTime();
      const promotion = row.original.promotion;
      const usages = promotion.usages ?? [];

      const sorted = [...usages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const index = sorted.findIndex((u) => u.id === row.original.id);
      if (index <= 0) return "Primo utilizzo";

      const prevUsage = sorted[index - 1];
      const diffDays = (usageTs - new Date(prevUsage.created_at).getTime()) / (1000 * 60 * 60 * 24);

      return `+${diffDays.toFixed(1)} giorni`;
    },
    accessor: (usage) => usage.created_at,
  }),

  ActionColumn({
    header: "Azioni",
    action: (row, meta) => {
      const usage = row.original;
      const deletable = canDeleteUsage(usage);

      return (
        <WasabiDialog
          onDelete={() => (meta as PromotionTableMeta).deleteUsageById(usage.id)}
          variant="delete"
          trigger={
            <Button
              variant={"destructive"}
              className="w-full"
              disabled={!deletable}
              title={
                deletable
                  ? "Elimina utilizzo promozione"
                  : "Non puoi eliminare l’utilizzo di una promozione associata a un ordine pagato o già parzialmente pagato."
              }
            >
              <TrashIcon />
            </Button>
          }
          putSeparator
          title="Elimina utilizzo promozione"
        >
          <p className="text-lg">
            Stai per eliminare l’utilizzo della promozione{" "}
            <strong>{usage.promotion.label || usage.promotion.code}</strong>. Questa azione{" "}
            <strong>non può essere annullata</strong> ed è irreversibile.
          </p>
          <p className="text-lg">Sei sicuro di voler procedere?</p>
        </WasabiDialog>
      );
    },
    skeleton: (
      <Button disabled variant={"outline"} className="w-full">
        Skeleton azioni
      </Button>
    ),
  }),
];

interface UsagesDialogProps {
  promotion: PromotionWithUsages;
  invalidatePromotions: () => Promise<void>;
}

interface PromotionTableMeta {
  deleteUsageById: (usageId: number) => void;
}

export default function UsagesDialog({ promotion, invalidatePromotions }: UsagesDialogProps) {
  const [open, setOpen] = useState(false);
  const isEmpty = promotion.usages.length === 0;

  const { data: usagesWithOrder = [], isLoading } = promotionsAPI.getUsagesByPromotion.useQuery(
    { promotionId: promotion.id },
    { enabled: !isEmpty && open }
  );

  const { tableData, tableColumns } = useSkeletonTable({
    columns: usagesColumns,
    data: usagesWithOrder,
    pageSize: 10,
    isLoading,
  });

  const utils = trpc.useUtils();

  const removeFromOrderMutation = promotionsAPI.removeFromOrder.useMutation({
    onSuccess: async () => {
      await utils.promotions.getUsagesByPromotion.invalidate({ promotionId: promotion.id });
      await invalidatePromotions();
    },
  });

  const table = useTable({
    columns: tableColumns,
    data: tableData.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
    meta: {
      deleteUsageById: async (usageId: number) => {
        await removeFromOrderMutation.mutateAsync({ usageId });
      },
    } as PromotionTableMeta,
  });

  return (
    <WasabiDialog
      size="large"
      title={`Utilizzi della promozione "${promotion.code}"`}
      putSeparator
      putUpperBorder
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button disabled={isEmpty} variant={"outline"} className="w-full">
          {isEmpty ? "Nessun utilizzo" : `Vedi ${promotion.usages.length} utilizzi`}
        </Button>
      }
    >
      <Table table={table} />
    </WasabiDialog>
  );
}
