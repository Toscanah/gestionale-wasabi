import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import toEuro from "@/app/(site)/lib/utils/global/string/toEuro";

export default function Total() {
  const { order } = useOrderContext();

  const hasManualDiscount = order.discount !== 0;
  const hasPromotions = order.promotion_usages.length > 0;

  // Build dynamic labels
  const labels = [];
  if (hasManualDiscount) labels.push("sconto");
  if (hasPromotions) labels.push("promo");

  // Compute totals
  const totalWithDiscounts = getOrderTotal({ order, applyDiscounts: true });
  const totalWithoutDiscounts = getOrderTotal({ order, applyDiscounts: false });

  // Combined euro discount
  const totalDiscountEuro = totalWithoutDiscounts - totalWithDiscounts;

  return (
    <div className="w-full flex flex-col overflow-hidden border-foreground justify-center">
      <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 flex flex-col justify-center">
        TOTALE
      </div>

      <div className="w-full h-12 font-bold border-x border-b rounded-b-lg grid grid-cols-3 items-center">
        {/* LEFT: combined discounts in € */}
        <span className="text-lg text-muted-foreground text-center">
          {totalDiscountEuro > 0 && `-${toEuro(totalDiscountEuro)}`}
        </span>

        {/* CENTER: final total */}
        <span className="text-2xl text-center">{toEuro(totalWithDiscounts)}</span>

        {/* RIGHT: labels */}
        <span className="text-lg text-muted-foreground text-center">
          {labels.length > 0 && `(${labels.join(" + ")})`}
        </span>
      </div>
    </div>
  );
}
