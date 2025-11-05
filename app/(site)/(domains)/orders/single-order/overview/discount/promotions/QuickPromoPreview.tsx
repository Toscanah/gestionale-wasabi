import {
  PromotionByType,
  PromotionByTypeSchema,
  PromotionGuards,
  PromotionUsageWithPromotion,
  PromotionWithUsages,
} from "@/app/(site)/lib/shared";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";
import { Separator } from "@/components/ui/separator";
import { PromotionType } from "@prisma/client";

interface QuickPromoPreviewProps {
  usage: PromotionUsageWithPromotion;
}

export default function QuickPromoPreview({ usage }: QuickPromoPreviewProps) {
  const promo: PromotionByType = PromotionByTypeSchema.parse(usage.promotion);
  const totalUsed = promo.usages.reduce((sum, u) => sum + u.amount, 0);
  const initialAmount = !PromotionGuards.isPercentageDiscount(promo)
    ? (promo.fixed_amount ?? 0)
    : 0;
  const remainingBalance =
    promo.type === PromotionType.GIFT_CARD ? Math.max(initialAmount - totalUsed, 0) : undefined;

  const usedCount = promo.usages.length;
  const remainingUses = PromotionGuards.isPercentageDiscount(promo)
    ? promo.max_usages != null
      ? Math.max(promo.max_usages - usedCount, 0)
      : undefined
    : undefined;

  const formatDate = (value?: Date | string | null) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("it-IT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="text-sm">
      <ul className="text-xs text-muted-foreground space-y-0.5 list-none mb-1">
        <li>{`Data creazione: ${formatDate(promo.created_at)}`}</li>

        <li>
          {`Scadenza: ${promo.never_expires ? "nessuna" : promo.expires_at ? formatDate(promo.expires_at) : "non specificata"}`}
        </li>

        {promo.reusable && <li>Riutilizzabile su più ordini.</li>}
      </ul>

      {/* Type–specific details */}
      {PromotionGuards.isFixedDiscount(promo) && (
        <div>
          <p>
            Sconto fisso: <span className="font-mono">{toEuro(promo.fixed_amount ?? 0)}</span>
          </p>
        </div>
      )}

      {PromotionGuards.isPercentageDiscount(promo) && (
        <div>
          <p>
            Percentuale sconto: <span className="font-mono">{promo.percentage_value}%</span>
          </p>
          {promo.max_usages != null && (
            <p>
              Utilizzi:{" "}
              <span className="font-mono">
                {usedCount} / {promo.max_usages}
              </span>{" "}
              {remainingUses !== undefined && remainingUses <= 0 && (
                <span className="text-destructive font-medium">(esaurita)</span>
              )}
            </p>
          )}
        </div>
      )}

      {PromotionGuards.isGiftCard(promo) && (
        <div>
          <p>
            Valore iniziale: <span className="font-mono">{toEuro(initialAmount)}</span>
          </p>
          <p>
            Usato finora: <span className="font-mono">{toEuro(totalUsed)}</span>
          </p>
          <p>
            Saldo rimanente: <span className="font-mono">{toEuro(remainingBalance ?? 0)}</span>
          </p>
          <p>
            Usato in questo ordine: <span className="font-mono">{toEuro(usage.amount ?? 0)}</span>
          </p>
        </div>
      )}

      {/* General metadata */}
    </div>
  );
}
